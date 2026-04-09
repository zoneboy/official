export const handler = async (event) => {
  // 1. Block any requests that aren't POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email is required" }) };
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    // 2. Talk directly to Brevo's API using native fetch (No SDK needed)
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        listIds: [3] // ⚠️ Change '2' to the ID of your Newsletter list in Brevo
      })
    });

    const data = await response.json();

    // 3. Handle Brevo's responses
    if (!response.ok) {
       // If the user is already on the list, Brevo throws an error. We treat it as a success for the UI.
       if (data.code === 'duplicate_parameter') {
          return { statusCode: 200, body: JSON.stringify({ message: "Already subscribed" }) };
       }
       console.error("Brevo API Error:", data);
       throw new Error(data.message || "Failed to add contact");
    }

    // 4. Success!
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Successfully subscribed" }),
    };

  } catch (error) {
    console.error("Function Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Server Error" }) };
  }
};