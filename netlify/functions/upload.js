// netlify/functions/upload.js
// POST /api/upload — Upload images and PDFs, store in Neon DB
import { getDB, json, err, CORS } from "./db.js";

async function verifyAuth(event) {
  const h = event.headers.authorization || event.headers.Authorization;
  if (!h || !h.startsWith("Bearer ")) return null;
  try {
    const decoded = Buffer.from(h.split(" ")[1], "base64").toString("utf-8");
    const parts = decoded.split(":");
    const username = parts[0];
    const timestamp = parseInt(parts[2]);
    if (Date.now() - timestamp > 8 * 60 * 60 * 1000) return null;
    const sql = getDB();
    const rows = await sql`SELECT id FROM admin_users WHERE username=${username}`;
    if (rows.length === 0) return null;
    return username;
  } catch { return null; }
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405);

  const user = await verifyAuth(event);
  if (!user) return err("Unauthorized", 401);

  try {
    const sql = getDB();
    const body = JSON.parse(event.body);
    const { filename, content_type, data } = body;

    if (!filename || !content_type || !data) {
      return err("Missing filename, content_type, or data", 400);
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml",
      "application/pdf"
    ];
    if (!allowedTypes.includes(content_type)) {
      return err("File type not allowed. Accepted: JPEG, PNG, GIF, WebP, SVG, PDF", 400);
    }

    // Validate size (base64 is ~33% larger than binary, so 10MB base64 ≈ 7.5MB file)
    const maxBase64Size = 10 * 1024 * 1024; // 10MB base64 string
    if (data.length > maxBase64Size) {
      return err("File too large. Maximum size is approximately 7MB.", 400);
    }

    // Generate unique ID
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
    const ext = filename.split(".").pop().toLowerCase();
    const storedName = `${id}.${ext}`;

    // Store in database
    await sql`
      INSERT INTO uploads (id, filename, stored_name, content_type, data, uploaded_by, created_at)
      VALUES (${id}, ${filename}, ${storedName}, ${content_type}, ${data}, ${user}, NOW())
    `;

    // Return the URL path that will serve this file
    const url = `/api/file/${id}`;

    return json({ success: true, id, url, filename: storedName });
  } catch (e) {
    console.error("upload:", e);
    return err(e.message || "Upload failed");
  }
};
