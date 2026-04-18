// netlify/functions/cms-auth.js
// POST /api/cms-auth — Authenticate with bcrypt password + TOTP 2FA.
// On success, issues a signed JWT (see auth-helper.js).
import { getDB, json, err, corsHeaders, requireSameOrigin } from "./db.js";
import { signToken } from "./auth-helper.js";
import { decrypt } from "./crypto-helper.js";
import bcrypt from "bcryptjs";
import * as OTPAuth from "otpauth";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders(event), body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405, event);

  // Only accept login requests from our own domain. Without this, an attacker
  // site could submit a password-guessing form against our auth endpoint.
  const originCheck = requireSameOrigin(event);
  if (originCheck) return originCheck;

  try {
    const { username, password, totp_code } = JSON.parse(event.body);
    if (!username || !password) return err("Username and password required", 400, event);

    const sql = getDB();
    const rows = await sql`SELECT id, username, password_hash, totp_secret, totp_enabled FROM admin_users WHERE username = ${username}`;
    if (rows.length === 0) return err("Invalid credentials", 401, event);

    const user = rows[0];

    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) return err("Invalid credentials", 401, event);

    if (user.totp_enabled) {
      if (!totp_code) {
        return json({ success: false, requires_totp: true, message: "Enter your authenticator code" }, 200, event);
      }

      let plainSecret;
      try {
        plainSecret = decrypt(user.totp_secret);
      } catch (e) {
        console.error("cms-auth: TOTP decrypt failed:", e.message);
        return err("Server misconfigured — contact administrator", 500, event);
      }

      if (!plainSecret) {
        return err("2FA is enabled but no secret is stored. Contact administrator.", 500, event);
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
      if (delta === null) return err("Invalid authenticator code", 401, event);
    }

    let token;
    try {
      token = signToken(user.username);
    } catch (e) {
      console.error("cms-auth: JWT signing failed:", e.message);
      return err("Server misconfigured — contact administrator", 500, event);
    }

    return json({
      success: true,
      token,
      user: user.username,
      totp_enabled: user.totp_enabled,
    }, 200, event);
  } catch (e) {
    console.error("cms-auth:", e);
    return err("Authentication failed", 500, event);
  }
};
