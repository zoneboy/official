export const handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  try {
    const { email } = JSON.parse(event.body);
    if (!email) return { statusCode: 400, body: JSON.stringify({ error: "Email is required" }) };
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
