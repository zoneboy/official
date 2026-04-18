// netlify/functions/crypto-helper.js
// AES-256-GCM encryption for secrets at rest (e.g., TOTP secrets).
// Requires process.env.TOTP_ENCRYPTION_KEY — 64 hex chars (= 32 bytes = 256 bits).

import crypto from "crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;   // 96 bits — recommended for GCM
const TAG_LEN = 16;  // 128 bits — GCM default auth tag size

function getKey() {
  const hex = process.env.TOTP_ENCRYPTION_KEY;
  if (!hex) {
    throw new Error("TOTP_ENCRYPTION_KEY is not set. Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"");
  }
  if (!/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error("TOTP_ENCRYPTION_KEY must be 64 hex characters (32 bytes).");
  }
  return Buffer.from(hex, "hex");
}

// ── Encrypt a plaintext string ──
// Returns a self-contained string: "v1:<iv_b64>:<tag_b64>:<ciphertext_b64>"
// The "v1:" prefix lets us rotate algorithms/keys later without breaking old rows.
export function encrypt(plaintext) {
  if (typeof plaintext !== "string") {
    throw new Error("encrypt expects a string");
  }
  if (plaintext === "") return ""; // Preserve empty strings (e.g., disabled 2FA clears the secret)

  const key = getKey();
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [
    "v1",
    iv.toString("base64"),
    tag.toString("base64"),
    ciphertext.toString("base64"),
  ].join(":");
}

// ── Decrypt a value produced by encrypt() ──
// Transparently passes through plaintext Base32 TOTP secrets (legacy rows that
// haven't been migrated yet), so existing admins keep working until their next
// login. After legacy rows are migrated once, everything is encrypted.
export function decrypt(value) {
  if (!value || typeof value !== "string") return "";
  if (value === "") return "";

  // Legacy plaintext Base32 secret (A-Z, 2-7, optional padding). Pass through.
  // OTPAuth generates Base32 secrets, so this check is reliable for legacy rows.
  if (!value.startsWith("v1:")) {
    return value;
  }

  const parts = value.split(":");
  if (parts.length !== 4) {
    throw new Error("Invalid encrypted value format");
  }
  const [, ivB64, tagB64, ctB64] = parts;

  const key = getKey();
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(ctB64, "base64");

  if (iv.length !== IV_LEN) throw new Error("Invalid IV length");
  if (tag.length !== TAG_LEN) throw new Error("Invalid auth tag length");

  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);

  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}

// ── Convenience: re-encrypt a legacy value if needed ──
// Returns { value, wasLegacy } — lets callers detect legacy rows and opportunistically
// upgrade them to the encrypted format.
export function ensureEncrypted(value) {
  if (!value) return { value: "", wasLegacy: false };
  if (value.startsWith("v1:")) return { value, wasLegacy: false };
  return { value: encrypt(value), wasLegacy: true };
}
