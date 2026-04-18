// netlify/functions/subscribe.js
// POST /api/subscribe — newsletter subscription with server-verified captcha.
import { corsHeaders, requireSameOrigin, json, err } from "./db.js";
import { verifyChallenge } from "./captcha-helper.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders(event), body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405, event);

  const originCheck = requireSameOrigin(event);
  if (originCheck) return originCheck;

  try {
    const { email, captcha_token, captcha_answer } = JSON.parse(event.body);

    if (!email) return err("Email is required", 400, event);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return err("Please enter a valid email address", 400, event);
    if (/^\+?\d[\d\s\-()]+$/.test(email)) return err("Only email addresses are accepted", 400, event);

    if (!captcha_token) return err("Human verification is required", 400, event);
    if (!verifyChallenge(captcha_token, captcha_answer)) {
      return err("Verification failed. Please try again.", 400, event);
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json", "api-key": BREVO_API_KEY },
      body: JSON.stringify({ email, listIds: [3] })
    });
    const data = await response.json();
    if (!response.ok) {
      if (data.code === 'duplicate_parameter') {
        return json({ message: "Already subscribed" }, 200, event);
      }
      console.error("Brevo:", data);
      throw new Error(data.message || "Failed");
    }
    return json({ message: "Successfully subscribed" }, 200, event);
  } catch (e) {
    console.error("subscribe:", e);
    return err("Server Error", 500, event);
  }
};
