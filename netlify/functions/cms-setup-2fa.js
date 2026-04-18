// netlify/functions/cms-setup-2fa.js
// POST /api/cms-setup-2fa — Generate TOTP secret or enable/disable 2FA.
import { getDB, json, err, corsHeaders, requireSameOrigin } from "./db.js";
import { verifyAuth } from "./auth-helper.js";
import { encrypt, decrypt } from "./crypto-helper.js";
import bcrypt from "bcryptjs";
import * as OTPAuth from "otpauth";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders(event), body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405, event);

  const originCheck = requireSameOrigin(event);
  if (originCheck) return originCheck;

  const user = await verifyAuth(event);
  if (!user) return err("Unauthorized", 401, event);

  try {
    const sql = getDB();
    const { action, totp_code, password } = JSON.parse(event.body);

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

      let encryptedSecret;
      try {
        encryptedSecret = encrypt(secret.base32);
      } catch (e) {
        console.error("cms-setup-2fa: encrypt failed:", e.message);
        return err("Server misconfigured — contact administrator", 500, event);
      }

      await sql`UPDATE admin_users SET totp_secret = ${encryptedSecret} WHERE id = ${user.id}`;

      return json({
        success: true,
        secret: secret.base32,
        uri: totp.toString(),
      }, 200, event);
    }

    if (action === "enable") {
      if (!totp_code) return err("Authenticator code required", 400, event);

      const rows = await sql`SELECT totp_secret FROM admin_users WHERE id = ${user.id}`;
      const storedSecret = rows[0].totp_secret;
      if (!storedSecret) return err("Generate a secret first", 400, event);

      let plainSecret;
      try {
        plainSecret = decrypt(storedSecret);
      } catch (e) {
        console.error("cms-setup-2fa: decrypt failed:", e.message);
        return err("Stored secret could not be read. Regenerate your 2FA setup.", 500, event);
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
      if (delta === null) return err("Invalid code. Try again.", 400, event);

      await sql`UPDATE admin_users SET totp_enabled = TRUE WHERE id = ${user.id}`;
      return json({ success: true, message: "2FA enabled successfully" }, 200, event);
    }

    if (action === "disable") {
      if (!password) return err("Current password required to disable 2FA", 400, event);
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return err("Invalid password", 401, event);

      await sql`UPDATE admin_users SET totp_enabled = FALSE, totp_secret = '' WHERE id = ${user.id}`;
      return json({ success: true, message: "2FA disabled" }, 200, event);
    }

    return err("Unknown action", 400, event);
  } catch (e) {
    console.error("cms-setup-2fa:", e);
    return err("Server error", 500, event);
  }
};
