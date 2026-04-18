// netlify/functions/contact.js
// POST /api/contact — contact form with server-verified captcha.
import { corsHeaders, requireSameOrigin, json, err } from "./db.js";
import { verifyChallenge } from "./captcha-helper.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders(event), body: "" };
  if (event.httpMethod !== "POST") return err("Method Not Allowed", 405, event);

  const originCheck = requireSameOrigin(event);
  if (originCheck) return originCheck;

  try {
    const { name, org, email, message, captcha_token, captcha_answer } = JSON.parse(event.body);

    if (!name || !email || !message) return err("Missing required fields", 400, event);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return err("Please enter a valid email address", 400, event);

    if (!captcha_token) return err("Human verification is required", 400, event);
    if (!verifyChallenge(captcha_token, captcha_answer)) {
      return err("Verification failed. Please try again.", 400, event);
    }

    if (name.length > 200 || email.length > 320 || (org && org.length > 200) || message.length > 5000) {
      return err("Input too long", 400, event);
    }

    const esc = (s) => String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json", "api-key": BREVO_API_KEY },
      body: JSON.stringify({
        sender: { name: "RAN Website Contact Form", email: "ran@recyclersassociation.org" },
        to: [{ email: "membership@recyclersassociation.org", name: "RAN Secretariat" }],
        replyTo: { email, name },
        subject: `New Website Inquiry from ${name}${org ? ` (${org})` : ''}`,
        htmlContent: `<div style="font-family:sans-serif;color:#191c1c;max-width:600px"><h2 style="color:#006c0c;border-bottom:2px solid #e1e3e2;padding-bottom:10px">New Contact Form Submission</h2><p><strong>Name:</strong> ${esc(name)}</p><p><strong>Organization:</strong> ${esc(org || 'N/A')}</p><p><strong>Email:</strong> ${esc(email)}</p><br/><p><strong>Message:</strong></p><div style="background:#f3f4f3;padding:16px;border-radius:8px;white-space:pre-wrap">${esc(message)}</div></div>`
      })
    });
    const data = await response.json();
    if (!response.ok) { console.error("Brevo:", data); throw new Error(data.message || "Failed"); }
    return json({ message: "Message sent successfully" }, 200, event);
  } catch (e) {
    console.error("contact:", e);
    return err("Server Error", 500, event);
  }
};
