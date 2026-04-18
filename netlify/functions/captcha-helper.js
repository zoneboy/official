// netlify/functions/captcha-helper.js
// Signed captcha challenges: answer lives only inside a signed JWT the client
// cannot read or forge. Reuses JWT_SECRET.

import jwt from "jsonwebtoken";

const TTL_SECONDS = 300;      // 5 minutes
const ISSUER = "ran-captcha";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is not set or too short.");
  }
  return secret;
}

// ── Generate a random math challenge ──
function randomChallenge() {
  const a = Math.floor(Math.random() * 12) + 2;
  const b = Math.floor(Math.random() * 12) + 2;
  const op = Math.random() < 0.5 ? "+" : "-";
  const question = op === "+" ? `${a} + ${b}` : `${a + b} - ${b}`;
  const answer = op === "+" ? a + b : a;
  return { question, answer };
}

// ── Issue a new challenge ──
// Returns { question, token } — `token` is a signed JWT containing the answer.
export function issueChallenge() {
  const { question, answer } = randomChallenge();
  const token = jwt.sign(
    { a: answer },
    getSecret(),
    {
      expiresIn: TTL_SECONDS,
      issuer: ISSUER,
      algorithm: "HS256",
    }
  );
  return { question, token };
}

// ── Verify a submitted answer against a challenge token ──
// Returns true on success, false on any kind of failure (bad sig, expired,
// wrong answer, malformed). Never throws.
export function verifyChallenge(token, submittedAnswer) {
  if (!token || typeof token !== "string") return false;

  let payload;
  try {
    payload = jwt.verify(token, getSecret(), {
      issuer: ISSUER,
      algorithms: ["HS256"],
    });
  } catch {
    return false;
  }

  // Coerce the submitted answer to a number and compare strictly.
  const submitted = Number(submittedAnswer);
  if (!Number.isFinite(submitted)) return false;

  return payload.a === submitted;
}
