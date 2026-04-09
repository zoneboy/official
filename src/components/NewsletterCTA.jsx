import { useState } from "react";
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import Icon from "./Icon";
import FadeIn from "./FadeIn";

export default function NewsletterCTA() {
  const { isMobile } = useBreakpoints();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    try {
      // Calls the Netlify function you just created
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to subscribe");
      
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      setStatus("idle"); 
      alert("We encountered an issue adding you to the list. Please try again later.");
    }
  };

  return (
    <section style={{ padding: isMobile ? "40px 20px" : "80px 32px" }}>
      <FadeIn>
        <div style={{ maxWidth: 1200, margin: "0 auto", background: COLORS.primaryContainer, borderRadius: 16, padding: isMobile ? "40px 24px" : "64px 80px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -40, top: -40, opacity: 0.08 }}>
            <Icon name="recycling" size={isMobile ? 160 : 280} style={{ color: "#fff" }} />
          </div>
          <div style={{ position: "relative", zIndex: 10, maxWidth: 560 }}>
            <h2 style={{ fontFamily: FONTS.headline, fontSize: isMobile ? 24 : 36, fontWeight: 800, color: "#fff", marginBottom: 14 }}>
              Stay informed about the circular economy
            </h2>
            <p style={{ color: COLORS.primaryFixedDim, fontSize: isMobile ? 14 : 17, marginBottom: 28, lineHeight: 1.6 }}>
              Subscribe to our monthly briefing for policy updates, industry news, and funding opportunities.
            </p>
            
            {status === "success" ? (
              <div style={{ background: "rgba(255,255,255,0.1)", padding: "16px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.25)", display: "inline-flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.primary, flexShrink: 0 }}>
                  <Icon name="check" size={20} />
                </div>
                <div>
                  <p style={{ color: "#fff", fontFamily: FONTS.headline, fontWeight: 800, fontSize: 16, marginBottom: 2 }}>Subscription Confirmed!</p>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>Thank you for joining our network.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
                <input 
                  type="email" 
                  required
                  placeholder="Your work email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  style={{ 
                    flex: 1, 
                    padding: "14px 20px", 
                    borderRadius: 12, 
                    border: "none", 
                    fontSize: 14, 
                    outline: "none",
                    opacity: status === "loading" ? 0.7 : 1,
                    transition: "opacity 0.2s"
                  }} 
                />
                <button 
                  type="submit"
                  disabled={status === "loading"}
                  style={{ 
                    background: "#fff", 
                    color: COLORS.primary, 
                    padding: "14px 28px", 
                    borderRadius: 12, 
                    border: "none", 
                    fontFamily: FONTS.headline, 
                    fontWeight: 700, 
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    opacity: status === "loading" ? 0.8 : 1,
                    transition: "all 0.2s",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minWidth: 120
                  }}
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
            
          </div>
        </div>
      </FadeIn>
    </section>
  );
}