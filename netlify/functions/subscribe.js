export const handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  try {
    const { email, captcha, captchaInput } = JSON.parse(event.body);

    // Validate email exists
    if (!email) return { statusCode: 400, body: JSON.stringify({ error: "Email is required" }) };

    // Validate email format strictly
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: "Please enter a valid email address" }) };
    }

    // Block non-email submissions (no phone numbers, names, etc.)
    if (/^\+?\d[\d\s\-()]+$/.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ error: "Only email addresses are accepted" }) };
    }

    // Verify math captcha
    if (captcha === undefined || captchaInput === undefined) {
      return { statusCode: 400, body: JSON.stringify({ error: "Human verification is required" }) };
    }
    if (typeof captcha !== "number" || typeof captchaInput !== "number" || captcha !== captchaInput) {
      return { statusCode: 400, body: JSON.stringify({ error: "Verification failed. Please try again." }) };
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json", "api-key": BREVO_API_KEY },
      body: JSON.stringify({ email, listIds: [3] })
    });
    const data = await response.json();
    if (!response.ok) {
      if (data.code === 'duplicate_parameter') return { statusCode: 200, body: JSON.stringify({ message: "Already subscribed" }) };
      console.error("Brevo:", data); throw new Error(data.message || "Failed");
    }
    return { statusCode: 200, body: JSON.stringify({ message: "Successfully subscribed" }) };
  } catch (e) {
    console.error("subscribe:", e);
    return { statusCode: 500, body: JSON.stringify({ error: "Server Error" }) };
  }
};
