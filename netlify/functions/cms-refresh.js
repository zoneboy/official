// netlify/functions/cms-refresh.js
// POST /api/cms-refresh — Exchange a still-valid token for a fresh one.
// Does NOT accept expired tokens (there are no refresh tokens — if you let
// the session lapse, you log in again, password + TOTP). This extends an
// active session transparently so active admins don't get kicked out mid-edit.
import { json, err, corsHeaders, requireSameOrigin } from "./db.js";
import { verifyAuth, signToken } from "./auth-helper.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders(event), body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405, event);

  const originCheck = requireSameOrigin(event);
  if (originCheck) return originCheck;

  const user = await verifyAuth(event);
  if (!user) return err("Session expired — please log in again", 401, event);

  try {
    const signed = signToken(user.username);
    return json({
      success: true,
      token: signed.token,
      expires_at: signed.expiresAt,
    }, 200, event);
  } catch (e) {
    console.error("cms-refresh:", e.message);
    return err("Could not refresh session", 500, event);
  }
};
