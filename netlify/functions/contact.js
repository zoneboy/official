export const handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  try {
    const { name, org, email, message } = JSON.parse(event.body);
    if (!name || !email || !message) return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json", "api-key": BREVO_API_KEY },
      body: JSON.stringify({
        sender: { name: "RAN Website Contact Form", email: "ran@recyclersassociation.org" },
        to: [{ email: "membership@recyclersassociation.org", name: "RAN Secretariat" }],
        replyTo: { email, name },
        subject: `New Website Inquiry from ${name} ${org ? `(${org})` : ''}`,
        htmlContent: `<div style="font-family:sans-serif;color:#191c1c;max-width:600px"><h2 style="color:#006c0c;border-bottom:2px solid #e1e3e2;padding-bottom:10px">New Contact Form Submission</h2><p><strong>Name:</strong> ${name}</p><p><strong>Organization:</strong> ${org||'N/A'}</p><p><strong>Email:</strong> ${email}</p><br/><p><strong>Message:</strong></p><div style="background:#f3f4f3;padding:16px;border-radius:8px;white-space:pre-wrap">${message}</div></div>`
      })
    });
    const data = await response.json();
    if (!response.ok) { console.error("Brevo:", data); throw new Error(data.message || "Failed"); }
    return { statusCode: 200, body: JSON.stringify({ message: "Message sent successfully" }) };
  } catch (e) {
    console.error("contact:", e);
    return { statusCode: 500, body: JSON.stringify({ error: "Server Error" }) };
  }
};
