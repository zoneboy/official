// netlify/functions/upload.js
// POST /api/upload — Admin-only file upload. Accepts base64-encoded bytes.
// Stores with a `public` access flag (default TRUE).
import crypto from "crypto";
import { getDB, corsHeaders, requireSameOrigin, json, err } from "./db.js";
import { verifyAuth } from "./auth-helper.js";

const MAX_SIZE_BYTES = 7 * 1024 * 1024; // 7MB, matches admin UI limit
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml",
]);
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
]);

// Generate a 32-byte (64 hex char) random ID. Not for security — the public
// flag is the real access control — but removes practical guessability.
function newId() {
  return crypto.randomBytes(32).toString("hex");
}

// ── Magic-number sniffing ──
// The client sends a content-type string we can't trust. Check the actual
// bytes. Return the detected type or null if unrecognized.
function sniffType(buf) {
  if (buf.length < 4) return null;
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return "image/png";
  // JPEG: FF D8 FF
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return "image/jpeg";
  // GIF: "GIF87a" or "GIF89a"
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return "image/gif";
  // WebP: "RIFF" ... "WEBP" at offset 8
  if (buf.length >= 12 && buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46
      && buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return "image/webp";
  // PDF: "%PDF-"
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46 && buf[4] === 0x2D) return "application/pdf";
  // SVG: starts with "<?xml" or "<svg" (lenient — SVG has no magic bytes)
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
    const { filename, content_type, data, public: isPublic = true } = JSON.parse(event.body);

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
    // Check the claimed type is allowed, and that the actual bytes match.
    // SVG gets a pass on magic bytes since it's XML, but we still check text content.
    const claimed = content_type.toLowerCase();
    const isAllowedImage = ALLOWED_IMAGE_TYPES.has(claimed);
    const isAllowedFile = ALLOWED_FILE_TYPES.has(claimed);
    if (!isAllowedImage && !isAllowedFile) {
      return err(`Unsupported content type: ${claimed}`, 400, event);
    }

    const sniffed = sniffType(buf);
    if (!sniffed) return err("Could not verify file type from contents", 400, event);
    if (sniffed !== claimed) {
      // Claimed type disagrees with the actual bytes — reject.
      console.warn(`upload: type mismatch — claimed ${claimed}, sniffed ${sniffed}`);
      return err("File contents do not match the declared type", 400, event);
    }

    // ── Store ──
    const id = newId();
    const publicFlag = Boolean(isPublic);
    const sql = getDB();

    await sql`
      INSERT INTO uploads (id, filename, content_type, data, public, uploaded_by, created_at)
      VALUES (${id}, ${filename}, ${claimed}, ${data}, ${publicFlag}, ${user.username}, NOW())
    `;

    return json({
      success: true,
      url: `/api/file/${id}`,
      id,
      public: publicFlag,
    }, 200, event);
  } catch (e) {
    console.error("upload:", e);
    return err("Upload failed", 500, event);
  }
};
