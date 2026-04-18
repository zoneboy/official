// netlify/functions/file.js
// GET /api/file/:id — Serve uploaded files from Neon DB.
// Public files serve to anyone; private files require a valid admin JWT.
import { getDB, corsHeaders } from "./db.js";
import { verifyAuth } from "./auth-helper.js";

export const handler = async (event) => {
  const cors = corsHeaders(event);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: cors, body: "" };
  }
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers: cors, body: "Method Not Allowed" };
  }

  try {
    const pathParts = event.path.split("/");
    const id = pathParts[pathParts.length - 1];

    if (!id) {
      return { statusCode: 400, headers: cors, body: "File ID required" };
    }

    const sql = getDB();
    // Pull access flag in the same query so we don't leak existence to
    // unauthenticated callers via timing.
    const rows = await sql`SELECT content_type, data, filename, public FROM uploads WHERE id = ${id}`;

    if (rows.length === 0) {
      return { statusCode: 404, headers: cors, body: "File not found" };
    }

    const file = rows[0];

    // ── Access control ──
    // Private files require an authenticated admin. Returning 404 (not 403)
    // for unauthorized callers intentionally hides the file's existence.
    if (!file.public) {
      const user = await verifyAuth(event);
      if (!user) {
        return { statusCode: 404, headers: cors, body: "File not found" };
      }
    }

    // For public files, allow long cache. For private files, no cache so
    // revoking access (flipping public → TRUE then back) takes effect quickly,
    // and shared caches/CDNs don't hold a copy.
    const cacheControl = file.public
      ? "public, max-age=31536000, immutable"
      : "private, no-store, must-revalidate";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": file.content_type,
        "Cache-Control": cacheControl,
        "Content-Disposition": file.content_type === "application/pdf"
          ? `inline; filename="${file.filename}"`
          : "inline",
        ...cors,
      },
      body: file.data,
      isBase64Encoded: true,
    };
  } catch (e) {
    console.error("file:", e);
    return { statusCode: 500, headers: cors, body: "Server error" };
  }
};
