import crypto from "crypto";
import { getDB, corsHeaders, requireSameOrigin, json, err } from "./db.js";
import { verifyAuth } from "./auth-helper.js";

const MAX_SIZE_BYTES = 7 * 1024 * 1024; // 7MB
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
]);
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
]);

function sniffType(buf) {
  if (buf.length < 4) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return "image/png";
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return "image/jpeg";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return "image/gif";
  if (buf.length >= 12 && buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46
      && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return "image/webp";
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46 && buf[4] === 0x2D) return "application/pdf";
  const head = buf.slice(0, Math.min(buf.length, 512)).toString("utf8").trim().toLowerCase();
  if (head.startsWith("<?xml") || head.startsWith("<svg")) return "image/svg+xml";
  return null;
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders(event), body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405, event);

  const originCheck = requireSameOrigin(event);
  if (originCheck) return originCheck;

  const user = await verifyAuth(event);
  if (!user) return err("Unauthorized", 401, event);

  try {
    const rawBody = event.isBase64Encoded 
      ? Buffer.from(event.body, "base64").toString("utf8") 
      : event.body;

    const { filename, content_type, data } = JSON.parse(rawBody);

    if (!data || typeof data !== "string") return err("File data required", 400, event);
    if (!content_type) return err("Content type required", 400, event);
    if (!filename || typeof filename !== "string") return err("Filename required", 400, event);

    let buf;
    try {
      buf = Buffer.from(data, "base64");
    } catch {
      return err("Invalid base64 data", 400, event);
    }
    
    if (buf.length === 0) return err("Empty file", 400, event);
    if (buf.length > MAX_SIZE_BYTES) return err(`File exceeds ${MAX_SIZE_BYTES / (1024 * 1024)}MB limit`, 400, event);

    const claimed = content_type.toLowerCase();
    const isAllowedImage = ALLOWED_IMAGE_TYPES.has(claimed);
    const isAllowedFile = ALLOWED_FILE_TYPES.has(claimed);
    
    if (!isAllowedImage && !isAllowedFile) {
      return err(`Unsupported content type: ${claimed}`, 400, event);
    }

    const sniffed = sniffType(buf);
    if (!sniffed) return err("Could not verify file type from contents", 400, event);
    if (sniffed !== claimed) {
      console.warn(`upload: type mismatch — claimed ${claimed}, sniffed ${sniffed}`);
      return err("File contents do not match the declared type", 400, event);
    }

    // ── Signed Cloudinary Integration ──
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      // If you are missing env vars, the server will throw a 500 error here.
      console.error("Missing Cloudinary Env Vars");
      return err("Cloudinary is not fully configured.", 500, event);
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = `timestamp=${timestamp}`;

    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex");

    const base64DataUri = `data:${claimed};base64,${data}`;
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    // Send as JSON instead of URLSearchParams to prevent Base64 corruption
    const uploadRes = await fetch(cloudinaryUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        file: base64DataUri,
        api_key: apiKey,
        timestamp: timestamp,
        signature: signature
      }),
    });

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      console.error("Cloudinary Error:", uploadData);
      throw new Error(uploadData.error?.message || "Cloudinary signed upload failed");
    }

    return json({
      success: true,
      url: uploadData.secure_url,
      id: uploadData.public_id,
      public: true, 
    }, 200, event);

  } catch (e) {
    // Expose the raw error directly to the browser for debugging
    console.error("UPLOAD FATAL ERROR:", e);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        error: "Debug Error: " + e.message, 
        stack: e.stack,
        name: e.name
      })
    };
  }
};
};