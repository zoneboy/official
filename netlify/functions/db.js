// netlify/functions/db.js
import { neon } from "@neondatabase/serverless";

export function getDB() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL not set");
  return neon(process.env.DATABASE_URL);
}

// ── Allowed origins ──
// Configurable via the ALLOWED_ORIGINS environment variable (comma-separated).
// Defaults cover the production domain, typical www variant, and localhost for dev.
// Netlify preview deploys are matched by regex (*.netlify.app).
const DEFAULT_ORIGINS = [
  "https://recyclersassociation.org",
  "https://www.recyclersassociation.org",
  "http://localhost:5173",
  "http://localhost:8888",
];

function getAllowedOrigins() {
  const env = process.env.ALLOWED_ORIGINS;
  if (!env) return DEFAULT_ORIGINS;
  return env.split(",").map(s => s.trim()).filter(Boolean);
}

// Matches Netlify preview deploy URLs: https://<random>--<site>.netlify.app
// or https://<branch>--<site>.netlify.app
const NETLIFY_PREVIEW_RE = /^https:\/\/[a-z0-9-]+--[a-z0-9-]+\.netlify\.app$/i;

function isOriginAllowed(origin) {
  if (!origin) return false;
  const allowed = getAllowedOrigins();
  if (allowed.includes(origin)) return true;
  if (NETLIFY_PREVIEW_RE.test(origin)) return true;
  return false;
}

// ── Public CORS (no credentials) ──
// Used by read-only endpoints that are safe to call cross-origin.
// Echoes the caller's Origin only if it's allowlisted; otherwise returns
// no CORS headers at all so the browser blocks the response.
export function corsHeaders(event) {
  const origin = event?.headers?.origin || event?.headers?.Origin;
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Vary": "Origin",
  };
  if (isOriginAllowed(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

// ── Backwards-compat export ──
// Some existing code imports `CORS` as a static object. Keep it available but
// with no wildcard — it only sets method/header metadata, not an Allow-Origin.
// New code should use corsHeaders(event) instead.
export const CORS = {
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Vary": "Origin",
};

// ── Same-origin enforcement ──
// For endpoints that perform state changes (admin mutations, form submissions).
// Checks both Origin and Referer against the allowlist. Returns null if the
// request is legitimate, or a ready-to-return 403 response object otherwise.
//
// This is the CSRF defense: even if an attacker tricks a logged-in admin's
// browser into firing a request, the attacker's origin won't match.
export function requireSameOrigin(event) {
  const origin = event?.headers?.origin || event?.headers?.Origin;
  const referer = event?.headers?.referer || event?.headers?.Referer;

  // Prefer Origin (always set on CORS requests, not spoofable by web attackers).
  if (origin && isOriginAllowed(origin)) return null;

  // Fallback to Referer for same-origin POSTs where browsers don't send Origin.
  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (isOriginAllowed(refOrigin)) return null;
    } catch {
      // malformed referer — fall through to reject
    }
  }

  return {
    statusCode: 403,
    headers: { "Content-Type": "application/json", ...corsHeaders(event) },
    body: JSON.stringify({ error: "Forbidden: cross-origin request blocked" }),
  };
}

// ── Response helpers ──
// These now need the event so they can set origin-aware CORS headers.
// The old signatures `json(data, status)` and `err(msg, status)` without event
// still work (they just return no Access-Control-Allow-Origin).
export const json = (data, s = 200, event = null) => ({
  statusCode: s,
  headers: { "Content-Type": "application/json", ...(event ? corsHeaders(event) : CORS) },
  body: JSON.stringify(data),
});

export const err = (msg, s = 500, event = null) => json({ error: msg }, s, event);
