// netlify/functions/auth-helper.js
// Shared JWT sign/verify logic for all admin endpoints.
// Using a single source of truth prevents the kind of drift bug that caused
// the earlier verifyAuth inconsistency between cms-admin.js and cms-setup-2fa.js.

import jwt from "jsonwebtoken";
import { getDB } from "./db.js";

const TOKEN_TTL = "8h";
const ISSUER = "ran-cms";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is not set or is too short (min 32 chars). Set it in Netlify environment variables.");
  }
  return secret;
}

// ── Sign a token after a successful login ──
// Payload is intentionally minimal: just the username. The `iat` (issued at)
// and `exp` (expiry) claims are added automatically by jwt.sign.
export function signToken(username) {
  return jwt.sign(
    { sub: username },
    getSecret(),
    {
      expiresIn: TOKEN_TTL,
      issuer: ISSUER,
      algorithm: "HS256",
    }
  );
}

// ── Verify a token from the Authorization header ──
// Returns the admin_users row if valid, or null otherwise.
// Never throws — all errors become null (unauthorized).
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
    // Catches expired, malformed, bad signature, wrong issuer, wrong algorithm
    return null;
  }

  const username = payload.sub;
  if (!username || typeof username !== "string") return null;

  // Verify the user still exists in the database.
  // This means deleting an admin row immediately invalidates all their tokens.
  try {
    const sql = getDB();
    const rows = await sql`SELECT id, username, password_hash, totp_secret, totp_enabled FROM admin_users WHERE username = ${username}`;
    if (rows.length === 0) return null;
    return rows[0];
  } catch {
    return null;
  }
}
