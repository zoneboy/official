// netlify/functions/auth-helper.js
// Shared JWT sign/verify logic + expiry helpers for all admin endpoints.

import jwt from "jsonwebtoken";
import { getDB } from "./db.js";

const TOKEN_TTL_SECONDS = 8 * 60 * 60; // 8 hours
const ISSUER = "ran-cms";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is not set or is too short (min 32 chars). Set it in Netlify environment variables.");
  }
  return secret;
}

// ── Sign a token after a successful login or refresh ──
// Returns { token, expiresAt } — expiresAt is epoch milliseconds,
// so the client can compute time-remaining and show a countdown.
export function signToken(username) {
  const token = jwt.sign(
    { sub: username },
    getSecret(),
    {
      expiresIn: TOKEN_TTL_SECONDS,
      issuer: ISSUER,
      algorithm: "HS256",
    }
  );
  const expiresAt = Date.now() + TOKEN_TTL_SECONDS * 1000;
  return { token, expiresAt };
}

// ── Verify a token from the Authorization header ──
export async function verifyAuth(event) {
  const header = event.headers.authorization || event.headers.Authorization;
  if (!header || !header.startsWith("Bearer ")) return null;

  const token = header.slice(7).trim();
  if (!token) return null;

  let payload;
  try {
    payload = jwt.verify(token, getSecret(), {
      issuer: ISSUER,
      algorithms: ["HS256"],
    });
  } catch {
    return null;
  }

  const username = payload.sub;
  if (!username || typeof username !== "string") return null;

  try {
    const sql = getDB();
    const rows = await sql`SELECT id, username, password_hash, totp_secret, totp_enabled FROM admin_users WHERE username = ${username}`;
    if (rows.length === 0) return null;
    return rows[0];
  } catch {
    return null;
  }
}
