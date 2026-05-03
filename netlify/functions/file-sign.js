// netlify/functions/file-sign.js
// POST /api/file-sign — Generates a short-lived signed URL for a private
// Cloudinary asset. Auth-required, same-origin only.
//
// Request body: { stored_url: "cloudinary-private:raw:ran/resources/abc123" }
// Returns: { url: "https://res.cloudinary.com/.../signed/...", expires_at: 1234567890 }
import { v2 as cloudinary } from "cloudinary";
import { corsHeaders, requireSameOrigin, json, err } from "./db.js";
import { verifyAuth } from "./auth-helper.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Signed URLs expire after this many seconds. One hour is a sensible default —
// long enough to cover a typical admin session of viewing/downloading,
// short enough that a leaked URL isn't useful for long.
const SIGN_TTL_SECONDS = 60 * 60;

// Parse our internal stored format: "cloudinary-private:<resource_type>:<public_id>"
function parseStoredUrl(storedUrl) {
  if (!storedUrl || typeof storedUrl !== "string") return null;
  if (!storedUrl.startsWith("cloudinary-private:")) return null;
  const rest = storedUrl.slice("cloudinary-private:".length);
  const colonIdx = rest.indexOf(":");
  if (colonIdx === -1) return null;
  const resourceType = rest.slice(0, colonIdx);
  const publicId = rest.slice(colonIdx + 1);
  // Whitelist resource_type values to avoid surprises
  if (!["image", "raw", "video"].includes(resourceType)) return null;
  if (!publicId || publicId.length > 256) return null;
  return { resourceType, publicId };
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders(event), body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405, event);

  const originCheck = requireSameOrigin(event);
  if (originCheck) return originCheck;

  // Auth required — only authenticated admins can mint signed URLs.
  // (The original Postgres-backed file system also gated private files
  // through admin-only access, so this matches the existing security model.)
  const user = await verifyAuth(event);
  if (!user) return err("Unauthorized", 401, event);

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("file-sign: missing Cloudinary env vars");
    return err("Signing service not configured", 500, event);
  }

  try {
    const { stored_url } = JSON.parse(event.body);

    const parsed = parseStoredUrl(stored_url);
    if (!parsed) return err("Invalid stored URL format", 400, event);

    const expiresAt = Math.floor(Date.now() / 1000) + SIGN_TTL_SECONDS;

    // Build a private (signed) URL. `type: "authenticated"` matches what we
    // uploaded with; `sign_url: true` adds the signature; `expires_at`
    // bakes the expiry into the signature.
    const signedUrl = cloudinary.url(parsed.publicId, {
      resource_type: parsed.resourceType,
      type: "authenticated",
      sign_url: true,
      secure: true,
      expires_at: expiresAt,
    });

    return json({
      url: signedUrl,
      expires_at: expiresAt * 1000, // ms for JS convenience
    }, 200, event);
  } catch (e) {
    console.error("file-sign:", e);
    return err("Failed to generate signed URL", 500, event);
  }
};
