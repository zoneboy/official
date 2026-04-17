// netlify/functions/cms-setup-2fa.js
// POST /api/cms-setup-2fa — Generate TOTP secret or enable/disable 2FA
import { getDB, json, err, CORS } from "./db.js";
import { verifyAuth } from "./auth-helper.js";
import bcrypt from "bcryptjs";
import * as OTPAuth from "otpauth";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405);

  const user = await verifyAuth(event);
  if (!user) return err("Unauthorized", 401);

  try {
    const sql = getDB();
    const { action, totp_code, password } = JSON.parse(event.body);

    // ── GENERATE: Create a new TOTP secret (does NOT enable it yet) ──
    if (action === "generate") {
      const secret = new OTPAuth.Secret({ size: 20 });
      const totp = new OTPAuth.TOTP({
        issuer: "RAN Admin",
        label: user.username,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret,
      });

      // Store the secret temporarily (not enabled until verified)
      await sql`UPDATE admin_users SET totp_secret = ${secret.base32} WHERE id = ${user.id}`;

      return json({
        success: true,
        secret: secret.base32,
        uri: totp.toString(),
      });
    }

    // ── ENABLE: Verify a code then enable 2FA ──
    if (action === "enable") {
      if (!totp_code) return err("Authenticator code required", 400);

      const rows = await sql`SELECT totp_secret FROM admin_users WHERE id = ${user.id}`;
      const secret = rows[0].totp_secret;
      if (!secret) return err("Generate a secret first", 400);

      const totp = new OTPAuth.TOTP({
        issuer: "RAN Admin",
        label: user.username,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secret),
      });

      const delta = totp.validate({ token: totp_code, window: 1 });
      if (delta === null) return err("Invalid code. Try again.", 400);

      await sql`UPDATE admin_users SET totp_enabled = TRUE WHERE id = ${user.id}`;
      return json({ success: true, message: "2FA enabled successfully" });
    }

    // ── DISABLE: Requires current password to disable 2FA ──
    if (action === "disable") {
      if (!password) return err("Current password required to disable 2FA", 400);
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return err("Invalid password", 401);

      await sql`UPDATE admin_users SET totp_enabled = FALSE, totp_secret = '' WHERE id = ${user.id}`;
      return json({ success: true, message: "2FA disabled" });
    }

    return err("Unknown action", 400);
  } catch (e) {
    console.error("cms-setup-2fa:", e);
    return err(e.message || "Server error");
  }
};
