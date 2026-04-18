// netlify/functions/captcha.js
// GET /api/captcha — Issues a signed math challenge.
import { corsHeaders, json, err } from "./db.js";
import { issueChallenge } from "./captcha-helper.js";

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsHeaders(event), body: "" };
  if (event.httpMethod !== "GET") return err("Method Not Allowed", 405, event);

  try {
    const { question, token } = issueChallenge();
    return json({ question, token }, 200, event);
  } catch (e) {
    console.error("captcha:", e.message);
    return err("Could not issue challenge", 500, event);
  }
};
