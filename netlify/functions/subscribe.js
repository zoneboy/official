// netlify/functions/subscribe.js
// POST /api/subscribe — newsletter subscription with server-verified captcha.
import { verifyChallenge } from "./captcha-helper.js";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  try {
    const { email, captcha_token, captcha_answer } = JSON.parse(event.body);

    // ── Email validation ──
    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email is required" }) };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: "Please enter a valid email address" }) };
    }
    if (/^\+?\d[\d\s\-()]+$/.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: "Only email addresses are accepted" }) };
    }

    // ── Signed captcha verification ──
    // The answer lives only inside the JWT; clients cannot forge it.
    if (!captcha_token) {
      return { statusCode: 400, body: JSON.stringify({ error: "Human verification is required" }) };
    }
    if (!verifyChallenge(captcha_token, captcha_answer)) {
      return { statusCode: 400, body: JSON.stringify({ error: "Verification failed. Please try again." }) };
    }

    // ── Call Brevo ──
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json", "api-key": BREVO_API_KEY },
      body: JSON.stringify({ email, listIds: [3] })
    });
    const data = await response.json();
    if (!response.ok) {
      if (data.code === 'duplicate_parameter') {
        return { statusCode: 200, body: JSON.stringify({ message: "Already subscribed" }) };
      }
      console.error("Brevo:", data);
      throw new Error(data.message || "Failed");
    }
    return { statusCode: 200, body: JSON.stringify({ message: "Successfully subscribed" }) };
  } catch (e) {
    console.error("subscribe:", e);
    return { statusCode: 500, body: JSON.stringify({ error: "Server Error" }) };
  }
};
