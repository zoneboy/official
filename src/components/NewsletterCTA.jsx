import { useState, useCallback } from "react";
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import Icon from "./Icon";
import FadeIn from "./FadeIn";

function generateMath() {
  const a = Math.floor(Math.random() * 12) + 2;
  const b = Math.floor(Math.random() * 12) + 2;
  return { question: `${a} + ${b}`, answer: a + b };
}

export default function NewsletterCTA({ compact }) {
  const { isMobile } = useBreakpoints();
  const m = compact || isMobile;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [math, setMath] = useState(generateMath);
  const [mathInput, setMathInput] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);

  const refreshMath = useCallback(() => {
    setMath(generateMath());
    setMathInput("");
  }, []);

  const handleEmailNext = () => {
    setError("");
    if (!email) { setError("Please enter your email."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError("Please enter a valid email address."); return; }
    setShowCaptcha(true);
    refreshMath();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!showCaptcha) { handleEmailNext(); return; }

    if (!mathInput) { setError("Please solve the math problem."); return; }
    if (parseInt(mathInput, 10) !== math.answer) {
      setError("Incorrect answer. Try again.");
      refreshMath();
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captcha: math.answer, captchaInput: parseInt(mathInput, 10) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed");
      setStatus("success");
      setEmail("");
      setMathInput("");
      setShowCaptcha(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("idle");
      refreshMath();
    }
  };

  // ── Full-width CTA (homepage) ──
  if (!compact) {
    return (
      <section style={{ padding: isMobile ? "40px 20px" : "80px 32px" }}>
        <FadeIn>
          <div style={{ maxWidth: 1200, margin: "0 auto", background: COLORS.primaryContainer, borderRadius: 16, padding: isMobile ? "40px 24px" : "64px 80px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -40, top: -40, opacity: 0.08 }}><Icon name="recycling" size={isMobile ? 160 : 280} style={{ color: "#fff" }} /></div>
            <div style={{ position: "relative", zIndex: 10, maxWidth: 560 }}>
              <h2 style={{ fontFamily: FONTS.headline, fontSize: isMobile ? 24 : 36, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Stay informed about the circular economy</h2>
              <p style={{ color: COLORS.primaryFixedDim, fontSize: isMobile ? 14 : 17, marginBottom: 28, lineHeight: 1.6 }}>Subscribe to our monthly newsletter for policy updates, industry news, and funding opportunities.</p>
              {status === "success" ? (
                <div style={{ background: "rgba(255,255,255,0.1)", padding: "16px 24px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.25)", display: "inline-flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.primary, flexShrink: 0 }}><Icon name="check" size={20} /></div>
                  <div><p style={{ color: "#fff", fontFamily: FONTS.headline, fontWeight: 800, fontSize: 16, marginBottom: 2 }}>Subscription Confirmed!</p><p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>Thank you for joining our network.</p></div>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12, marginBottom: showCaptcha ? 14 : 0 }}>
                    <input type="email" required placeholder="Your work email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} disabled={status === "loading" || showCaptcha} style={{ flex: 1, padding: "14px 20px", borderRadius: 12, border: "none", fontSize: 14, outline: "none", opacity: (status === "loading" || showCaptcha) ? 0.6 : 1 }} />
                    {!showCaptcha && <button type="button" onClick={handleEmailNext} disabled={status === "loading"} style={{ background: "#fff", color: COLORS.primary, padding: "14px 28px", borderRadius: 12, border: "none", fontFamily: FONTS.headline, fontWeight: 700, cursor: "pointer", minWidth: 120 }}>Continue</button>}
                  </div>
                  {showCaptcha && (
                    <FadeIn>
                      <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: isMobile ? "16px" : "18px 22px", marginBottom: 4 }}>
                        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>Human Verification</p>
                        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center", gap: 12 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                            <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 800, color: "#fff", background: "rgba(0,0,0,0.25)", padding: "8px 16px", borderRadius: 8, letterSpacing: 3, whiteSpace: "nowrap" }}>{math.question} = ?</span>
                            <input type="number" value={mathInput} onChange={(e) => { setMathInput(e.target.value); setError(""); }} onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }} placeholder="?" style={{ width: 70, padding: "10px 14px", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, textAlign: "center", outline: "none" }} />
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button type="button" onClick={handleSubmit} disabled={status === "loading"} style={{ background: "#fff", color: COLORS.primary, padding: "12px 24px", borderRadius: 10, border: "none", fontFamily: FONTS.headline, fontWeight: 700, cursor: status === "loading" ? "not-allowed" : "pointer", fontSize: 13, opacity: status === "loading" ? 0.7 : 1 }}>{status === "loading" ? "Subscribing..." : "Subscribe"}</button>
                            <button type="button" onClick={() => { setShowCaptcha(false); setMathInput(""); setError(""); }} style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", padding: "12px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Back</button>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  )}
                  {error && <p style={{ color: "#fca5a5", fontSize: 12, fontWeight: 600, marginTop: 8 }}>{error}</p>}
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </section>
    );
  }

  // ── Compact card (blog sidebar) ──
  return (
    <article style={{ display: "flex", flexDirection: "column", background: COLORS.primary, borderRadius: 12, padding: m ? 20 : 28, justifyContent: "space-between", position: "relative", overflow: "hidden", height: "100%" }}>
      <div style={{ position: "absolute", top: 0, right: 0, padding: 20, opacity: 0.08 }}><Icon name="mail" size={m ? 80 : 120} style={{ color: "#fff" }} /></div>
      <div style={{ position: "relative", zIndex: 10 }}>
        <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 18 : 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Stay Informed</h3>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>Join 5,000+ professionals receiving our weekly digest.</p>
      </div>
      <div style={{ position: "relative", zIndex: 10 }}>
        {status === "success" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.1)", padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.primary, flexShrink: 0 }}><Icon name="check" size={16} /></div>
            <div><p style={{ color: "#fff", fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13 }}>Subscribed!</p><p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>Thank you for joining.</p></div>
          </div>
        ) : !showCaptcha ? (
          <div>
            <input type="email" placeholder="Email Address" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} onKeyDown={(e) => { if (e.key === "Enter") handleEmailNext(); }} style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "none", background: COLORS.primaryContainer, color: "#fff", fontSize: 13, marginBottom: 10, outline: "none" }} />
            <button type="button" onClick={handleEmailNext} style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: COLORS.surface, color: COLORS.primary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Subscribe Now</button>
            {error && <p style={{ color: "#fca5a5", fontSize: 11, fontWeight: 600, marginTop: 6 }}>{error}</p>}
          </div>
        ) : (
          <div>
            <div style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: 14, marginBottom: 10 }}>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Verify you're human</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 800, color: "#fff", background: "rgba(0,0,0,0.3)", padding: "6px 12px", borderRadius: 6, letterSpacing: 2, whiteSpace: "nowrap" }}>{math.question} = ?</span>
                <input type="number" value={mathInput} onChange={(e) => { setMathInput(e.target.value); setError(""); }} onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }} placeholder="?" style={{ width: 54, padding: "8px 10px", borderRadius: 6, border: "none", fontSize: 14, fontWeight: 700, textAlign: "center", outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={handleSubmit} disabled={status === "loading"} style={{ flex: 1, padding: "12px", borderRadius: 8, border: "none", background: COLORS.surface, color: COLORS.primary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, cursor: status === "loading" ? "not-allowed" : "pointer", opacity: status === "loading" ? 0.7 : 1 }}>{status === "loading" ? "..." : "Subscribe"}</button>
              <button type="button" onClick={() => { setShowCaptcha(false); setMathInput(""); setError(""); }} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Back</button>
            </div>
            {error && <p style={{ color: "#fca5a5", fontSize: 11, fontWeight: 600, marginTop: 6 }}>{error}</p>}
          </div>
        )}
      </div>
    </article>
  );
}
