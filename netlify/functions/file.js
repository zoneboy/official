// netlify/functions/file.js
// GET /api/file/:id — Serve uploaded files from Neon DB.
import { getDB, corsHeaders } from "./db.js";

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
    const rows = await sql`SELECT content_type, data, filename FROM uploads WHERE id = ${id}`;

    if (rows.length === 0) {
      return { statusCode: 404, headers: cors, body: "File not found" };
    }

    const file = rows[0];

    return {
      statusCode: 200,
      headers: {
        "Content-Type": file.content_type,
        "Cache-Control": "public, max-age=31536000, immutable",
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
