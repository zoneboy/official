// netlify/functions/cms-auth.js
// POST /api/cms-auth — Authenticate with bcrypt password + TOTP 2FA.
// On success, issues a signed JWT (see auth-helper.js).
// TOTP secrets are encrypted at rest (see crypto-helper.js) and decrypted
// only in-memory to verify the submitted code.
import { getDB, json, err, CORS } from "./db.js";
import { signToken } from "./auth-helper.js";
import { decrypt } from "./crypto-helper.js";
import bcrypt from "bcryptjs";
import * as OTPAuth from "otpauth";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405);

  try {
    const { username, password, totp_code } = JSON.parse(event.body);
    if (!username || !password) return err("Username and password required", 400);

    const sql = getDB();
    const rows = await sql`SELECT id, username, password_hash, totp_secret, totp_enabled FROM admin_users WHERE username = ${username}`;
    if (rows.length === 0) return err("Invalid credentials", 401);

    const user = rows[0];

    // ── Verify password ──
    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) return err("Invalid credentials", 401);

    // ── Check 2FA ──
    if (user.totp_enabled) {
      if (!totp_code) {
        return json({ success: false, requires_totp: true, message: "Enter your authenticator code" });
      }

      // Decrypt the stored secret only in memory. The plaintext is never
      // written to disk or logs. Legacy plaintext rows pass through decrypt()
      // unchanged so existing admins keep working through the transition.
      let plainSecret;
      try {
        plainSecret = decrypt(user.totp_secret);
      } catch (e) {
        console.error("cms-auth: TOTP decrypt failed:", e.message);
        return err("Server misconfigured — contact administrator", 500);
      }

      if (!plainSecret) {
        return err("2FA is enabled but no secret is stored. Contact administrator.", 500);
      }

      const totp = new OTPAuth.TOTP({
        issuer: "RAN Admin",
        label: user.username,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(plainSecret),
      });

      const delta = totp.validate({ token: totp_code, window: 1 });
      if (delta === null) return err("Invalid authenticator code", 401);
    }

    // ── Issue a signed JWT ──
    let token;
    try {
      token = signToken(user.username);
    } catch (e) {
      console.error("cms-auth: JWT signing failed:", e.message);
      return err("Server misconfigured — contact administrator", 500);
    }

    return json({
      success: true,
      token,
      user: user.username,
      totp_enabled: user.totp_enabled,
    });
  } catch (e) {
    console.error("cms-auth:", e);
    return err("Authentication failed");
  }
};
