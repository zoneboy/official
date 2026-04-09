import { getDB, json, err, CORS } from "./db.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405);

  try {
    const { username, password } = JSON.parse(event.body);
    if (!username || !password) return err("Username and password required", 400);

    const sql = getDB();
    const rows = await sql`SELECT id,username FROM admin_users WHERE username=${username} AND password_hash=${password}`;
    if (rows.length === 0) return err("Invalid credentials", 401);

    const token = Buffer.from(`${username}:${password}`).toString("base64");
    return json({ success: true, token, user: rows[0].username });
  } catch (e) {
    console.error("cms-auth:", e);
    return err("Authentication failed");
  }
};
