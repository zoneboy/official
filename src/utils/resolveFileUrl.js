// src/utils/resolveFileUrl.js
// Resolves a stored file URL into a URL the browser can actually render.
//
// Three cases:
//   1. "cloudinary-private:<type>:<id>" — call /api/file-sign to get a signed URL
//   2. "/api/file/<id>"                  — legacy Postgres-stored, used as-is
//   3. "https://..." or anything else    — used as-is
//
// Signed URLs are cached in memory and reused until ~5 minutes before expiry,
// which avoids hammering /api/file-sign on every render.

const CACHE = new Map(); // storedUrl -> { url, expiresAt }
const REFRESH_BUFFER_MS = 5 * 60 * 1000; // refresh 5 min before actual expiry

function isPrivateCloudinary(url) {
  return typeof url === "string" && url.startsWith("cloudinary-private:");
}

// Public resolver — handles all three cases. Returns a Promise<string|null>.
// Pass `token` for private URLs; pass null/undefined for public-only contexts.
export async function resolveFileUrl(storedUrl, token) {
  if (!storedUrl || typeof storedUrl !== "string") return null;

  // Public URL — nothing to do.
  if (!isPrivateCloudinary(storedUrl)) return storedUrl;

  // Private — needs signing. Without a token we can't sign.
  if (!token) {
    console.warn("resolveFileUrl: private URL requested without auth token");
    return null;
  }

  // Cache lookup
  const cached = CACHE.get(storedUrl);
  const now = Date.now();
  if (cached && cached.expiresAt - REFRESH_BUFFER_MS > now) {
    return cached.url;
  }

  // Fetch a fresh signed URL
  try {
    const res = await fetch("/api/file-sign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ stored_url: storedUrl }),
    });
    if (!res.ok) {
      console.warn(`resolveFileUrl: sign failed (${res.status})`);
      return null;
    }
    const data = await res.json();
    if (!data.url) return null;
    CACHE.set(storedUrl, { url: data.url, expiresAt: data.expires_at });
    return data.url;
  } catch (e) {
    console.error("resolveFileUrl:", e);
    return null;
  }
}

// Synchronous helper — checks if a URL needs signing without doing it.
// Useful for UI rendering decisions (show "Loading..." vs render directly).
export function needsSigning(storedUrl) {
  return isPrivateCloudinary(storedUrl);
}

// Clear the cache — call on logout to prevent stale signed URLs hanging around.
export function clearFileUrlCache() {
  CACHE.clear();
}
