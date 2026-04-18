// netlify/functions/captcha.js
// GET /api/captcha — Issues a signed math challenge.
// Clients show the question, collect the user's answer, then submit
// { captcha_token, captcha_answer } back to /api/subscribe or /api/contact.

import { json, err, CORS } from "./db.js";
import { issueChallenge } from "./captcha-helper.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };
  if (event.httpMethod !== "GET") return err("Method Not Allowed", 405);

  try {
    const { question, token } = issueChallenge();
    return json({ question, token });
  } catch (e) {
    console.error("captcha:", e.message);
    return err("Could not issue challenge", 500);
  }
};
