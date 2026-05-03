// netlify/functions/upload.js
// POST /api/upload — Admin-only file upload.
// Routes uploads to Cloudinary. Public files become standard Cloudinary URLs;
// private files become "authenticated" resources whose URLs are signed on
// demand via /api/file-sign.
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { corsHeaders, requireSameOrigin, json, err } from "./db.js";
import { verifyAuth } from "./auth-helper.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_SIZE_BYTES = 7 * 1024 * 1024; // 7 MB, matches admin UI limit
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
]);
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
]);

// Whitelist the folder names callers may target. Anything else falls back
// to ran/misc/. This stops a compromised admin token from writing to
// arbitrary paths in your Cloudinary account.
const ALLOWED_FOLDERS = new Set([
  "ran/galleries",
  "ran/events",
  "ran/articles",
  "ran/profiles",
  "ran/resources",
  "ran/misc",
]);

function newId() {
  return crypto.randomBytes(16).toString("hex"); // 32 hex chars
}

// ── Magic-number sniffing ──
// Trust nothing the client sends; verify the actual bytes match the claimed type.
function sniffType(buf) {
  if (buf.length < 4) return null;
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return "image/png";
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return "image/jpeg";
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return "image/gif";
  if (buf.length >= 12 && buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46
      && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return "image/webp";
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46 && buf[4] === 0x2D) return "application/pdf";
  // SVG has no magic bytes — match leading XML or <svg>
  const head = buf.slice(0, Math.min(buf.length, 512)).toString("utf8").trim().toLowerCase();
  if (head.startsWith("<?xml") || head.startsWith("<svg")) return "image/svg+xml";
  return null;
}

// Cloudinary uses different `resource_type` values for different file kinds.
// Images go to "image"; PDFs and SVGs go to "raw" so they aren't transformed.
function resourceTypeFor(claimedType) {
  if (claimedType === "application/pdf") return "raw";
  if (claimedType === "image/svg+xml") return "raw";
  return "image";
}

// Upload a buffer to Cloudinary. Returns the upload result object.
function uploadToCloudinary(buf, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buf);
  });
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders(event), body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405, event);

  const originCheck = requireSameOrigin(event);
  if (originCheck) return originCheck;

  const user = await verifyAuth(event);
  if (!user) return err("Unauthorized", 401, event);

  // Configuration sanity check — surfaces missing env vars before we waste effort.
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("upload: missing Cloudinary env vars");
    return err("Upload service not configured", 500, event);
  }

  try {
    const { filename, content_type, data, public: isPublic = true, folder } = JSON.parse(event.body);

    if (!data || typeof data !== "string") return err("File data required", 400, event);
    if (!content_type) return err("Content type required", 400, event);
    if (!filename || typeof filename !== "string") return err("Filename required", 400, event);
    if (filename.length > 255) return err("Filename too long", 400, event);

    // ── Decode & size-check ──
    let buf;
    try {
      buf = Buffer.from(data, "base64");
    } catch {
      return err("Invalid base64 data", 400, event);
    }
    if (buf.length === 0) return err("Empty file", 400, event);
    if (buf.length > MAX_SIZE_BYTES) return err(`File exceeds ${MAX_SIZE_BYTES / (1024 * 1024)}MB limit`, 400, event);

    // ── Type validation ──
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

    // ── Resolve upload destination ──
    const safeFolder = ALLOWED_FOLDERS.has(folder) ? folder : "ran/misc";
    const publicFlag = Boolean(isPublic);
    const id = newId();
    const publicId = `${safeFolder}/${id}`;

    // ── Upload to Cloudinary ──
    const uploadResult = await uploadToCloudinary(buf, {
      public_id: publicId,
      resource_type: resourceTypeFor(claimed),
      // "authenticated" type means the asset cannot be accessed without a
      // signed URL. "upload" is the default and produces public URLs.
      type: publicFlag ? "upload" : "authenticated",
      // Don't let Cloudinary autotag, autoderive, etc. — keeps things predictable.
      overwrite: false,
      use_filename: false,
      unique_filename: false,
      // Stash the original filename and uploader in metadata in case it's
      // needed for downloads or audits.
      context: `original_filename=${filename}|uploaded_by=${user.username}`,
    });

    // ── Build the value we store in your DB ──
    // Public files: store the Cloudinary URL as-is.
    // Private files: store a "cloudinary-private:" prefix so the frontend knows
    // to call /api/file-sign before rendering.
    let storedUrl;
    if (publicFlag) {
      storedUrl = uploadResult.secure_url;
    } else {
      // Encode resource_type so the signing endpoint knows how to build the URL
      // (raw vs image differ in the URL pattern).
      storedUrl = `cloudinary-private:${uploadResult.resource_type}:${uploadResult.public_id}`;
    }

    return json({
      success: true,
      url: storedUrl,
      public: publicFlag,
      // Useful for admin UI debugging — surfaces what got uploaded
      cloudinary: {
        public_id: uploadResult.public_id,
        resource_type: uploadResult.resource_type,
        bytes: uploadResult.bytes,
        format: uploadResult.format,
      },
    }, 200, event);
  } catch (e) {
    console.error("upload:", e);
    // Cloudinary errors have a useful `.message` and HTTP code on `.http_code`
    if (e && e.message) return err(`Upload failed: ${e.message}`, 500, event);
    return err("Upload failed", 500, event);
  }
};
