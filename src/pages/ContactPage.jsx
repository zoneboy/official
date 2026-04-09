import { useState, useEffect } from "react";
import { COLORS, FONTS, GRADIENTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon } from "../components";

const STEPS = [
  { num: "01", title: "Application Submission", desc: "Submit operational permit, CAC documents, and environmental impact summary.", bg: COLORS.secondaryContainer, color: COLORS.onSecondaryContainer, rotate: -6 },
  { num: "02", title: "Compliance Review", desc: "Technical committee reviews facility standards against national benchmarks.", bg: COLORS.primaryContainer, color: COLORS.onPrimaryContainer, rotate: 12 },
  { num: "03", title: "Site Verification", desc: "Regional coordinator conducts a brief physical inspection.", bg: COLORS.tertiaryContainer, color: "#fff", rotate: -12 },
  { num: "04", title: "Full Induction", desc: "Receive digital credentials, membership seal, and database access.", bg: COLORS.secondary, color: "#fff", rotate: 6 },
];
const BENEFITS = [
  { title: "Networking & Insights", desc: "Access to industry insights, and networking opportunities." },
  { title: "Advocacy & Representation", desc: "Representation in policy discussions and advocacy for recyclers." },
  { title: "Capacity Building", desc: "Access to training and capacity-building programs." },
  { title: "Business Support", desc: "Business development support and partnerships within the recycling value chain." },
  { title: "Innovations & Funding", desc: "Updates on best practices, innovations, industry trends and funding opportunities." },
];

export default function ContactPage() {
  const { isMobile: m } = useBreakpoints();
  const [formData, setFormData] = useState({ name: "", org: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0 });
  const [userAnswer, setUserAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const generateCaptcha = () => { setCaptcha({ num1: Math.floor(Math.random()*10)+1, num2: Math.floor(Math.random()*10)+1 }); setUserAnswer(""); setCaptchaError(false); };
  useEffect(() => { generateCaptcha(); }, []);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(userAnswer) !== captcha.num1 + captcha.num2) { setCaptchaError(true); return; }
    setStatus("loading"); setCaptchaError(false);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!response.ok) throw new Error("Failed");
      setStatus("success"); setFormData({ name: "", org: "", email: "", message: "" }); generateCaptcha();
    } catch (error) { console.error(error); setStatus("idle"); alert("We encountered an issue. Please try again or use the direct email."); }
  };

  return (
    <>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: m?"32px 20px 48px":"48px 32px 80px" }}>
        <FadeIn><div style={{ marginBottom: m?36:64 }}>
          <span style={{ color: COLORS.secondary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Get Involved</span>
          <h1 style={{ fontFamily: FONTS.headline, fontSize: m?32:60, fontWeight: 800, letterSpacing: m?"-1px":"-2px", lineHeight: 0.95 }}>Powering Nigeria's {!m && <br />}<span style={{ color: COLORS.primary, fontStyle: "italic" }}>Circular Transition.</span></h1>
          <p style={{ color: COLORS.onSurfaceVariant, fontSize: m?14:17, lineHeight: 1.7, maxWidth: 480, marginTop: 16 }}>Whether you're an established recycler or a burgeoning startup, join the national collective engineering a waste-free future.</p>
        </div></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: m?"1fr":"7fr 5fr", gap: m?28:48 }}>
          <FadeIn><div style={{ background: COLORS.surfaceContainerLow, padding: m?"32px 20px":56, borderRadius: m?20:32, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", right: -60, bottom: -60, width: 240, height: 240, background: `${COLORS.primary}08`, borderRadius: "50%", filter: "blur(40px)" }} />
            <div style={{ position: "relative", zIndex: 10 }}>
              <h2 style={{ fontFamily: FONTS.headline, fontSize: m?22:26, fontWeight: 700, marginBottom: 24 }}>Send a Message</h2>
              {status === "success" ? (
                <div style={{ background: COLORS.surfaceContainerLowest, padding: "32px 24px", borderRadius: 16, textAlign: "center", border: `1px solid ${COLORS.outlineVariant}40` }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${COLORS.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Icon name="check_circle" size={32} style={{ color: COLORS.primary }} /></div>
                  <h3 style={{ fontFamily: FONTS.headline, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Message Received</h3>
                  <p style={{ color: COLORS.onSurfaceVariant, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Thank you for reaching out. A member of the secretariat will get back to you shortly.</p>
                  <button onClick={() => { setStatus("idle"); generateCaptcha(); }} style={{ background: "transparent", border: `1.5px solid ${COLORS.outlineVariant}`, color: COLORS.onSurface, padding: "10px 24px", borderRadius: 24, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: "grid", gridTemplateColumns: m?"1fr":"1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div><label style={{ display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: COLORS.outline, marginBottom: 8 }}>Full Name *</label><input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Ifeanyi Okafor" style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "none", background: COLORS.surfaceContainerLowest, fontSize: 14, outline: "none", color: COLORS.onSurface }} disabled={status==="loading"} /></div>
                    <div><label style={{ display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: COLORS.outline, marginBottom: 8 }}>Organization</label><input type="text" name="org" value={formData.org} onChange={handleChange} placeholder="GreenCycle Ltd" style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "none", background: COLORS.surfaceContainerLowest, fontSize: 14, outline: "none", color: COLORS.onSurface }} disabled={status==="loading"} /></div>
                  </div>
                  <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: COLORS.outline, marginBottom: 8 }}>Email Address *</label><input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="contact@organization.ng" style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "none", background: COLORS.surfaceContainerLowest, fontSize: 14, outline: "none" }} disabled={status==="loading"} /></div>
                  <div style={{ marginBottom: 24 }}><label style={{ display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: COLORS.outline, marginBottom: 8 }}>Message *</label><textarea name="message" required value={formData.message} onChange={handleChange} placeholder="How can we assist your mission?" rows={4} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "none", background: COLORS.surfaceContainerLowest, fontSize: 14, outline: "none", resize: "vertical", fontFamily: FONTS.body }} disabled={status==="loading"} /></div>
                  <div style={{ marginBottom: 24, padding: "16px", background: COLORS.surfaceContainerLowest, borderRadius: 12, border: `1px solid ${captchaError?COLORS.error:COLORS.outlineVariant+"40"}` }}>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: captchaError?COLORS.error:COLORS.outline, marginBottom: 8 }}>Human Verification *</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontFamily: FONTS.headline, fontWeight: 800, fontSize: 16, color: COLORS.onSurface }}>What is {captcha.num1} + {captcha.num2}?</span>
                      <input type="number" required value={userAnswer} onChange={(e) => { setUserAnswer(e.target.value); if(captchaError) setCaptchaError(false); }} placeholder="Answer" style={{ width: 100, padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${captchaError?COLORS.error:COLORS.outlineVariant}`, background: "#fff", fontSize: 14, outline: "none", color: COLORS.onSurface }} disabled={status==="loading"} />
                    </div>
                    {captchaError && <p style={{ color: COLORS.error, fontSize: 12, fontWeight: 600, marginTop: 8 }}>Incorrect answer. Please try again.</p>}
                  </div>
                  <button type="submit" disabled={status==="loading"} style={{ background: GRADIENTS.primary, color: "#fff", padding: "16px 36px", borderRadius: 12, border: "none", fontFamily: FONTS.headline, fontWeight: 700, fontSize: 14, cursor: status==="loading"?"not-allowed":"pointer", width: m?"100%":"auto", opacity: status==="loading"?0.8:1 }}>{status === "loading" ? "Sending..." : "Submit Inquiry"}</button>
                </form>
              )}
            </div>
          </div></FadeIn>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <FadeIn delay={0.1} style={{ height: "100%" }}><div style={{ background: `${COLORS.secondaryFixed}30`, padding: m?32:48, borderRadius: m?20:32, border: `1px solid ${COLORS.secondary}15`, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: COLORS.secondary, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}><Icon name="support_agent" size={32} style={{ color: "#fff" }} /></div>
              <h4 style={{ fontFamily: FONTS.headline, fontWeight: 800, color: COLORS.secondary, fontSize: m?24:28, marginBottom: 16 }}>Direct Secretariat</h4>
              <p style={{ fontSize: 15, color: COLORS.onSurfaceVariant, lineHeight: 1.7, marginBottom: 36 }}>For institutional partnerships, national policy inquiries, or general support, our secretariat team is available to assist you.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <a href="tel:+2349079819777" style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}><Icon name="call" size={24} style={{ color: COLORS.secondary }} /></div>
                  <div><p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: COLORS.outline, letterSpacing: 1.5, marginBottom: 4 }}>Hotline</p><p style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: m?16:18, color: COLORS.onSurface }}>+234 907 981 9777</p></div>
                </a>
                <a href="mailto:ran@recyclersassociation.org" style={{ display: "flex", alignItems: "center", gap: 16, textDecoration: "none" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}><Icon name="mail" size={24} style={{ color: COLORS.secondary }} /></div>
                  <div><p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: COLORS.outline, letterSpacing: 1.5, marginBottom: 4 }}>Email Us</p><p style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: m?15:16, color: COLORS.onSurface, wordBreak: "break-all" }}>ran@recyclersassociation.org</p></div>
                </a>
              </div>
            </div></FadeIn>
          </div>
        </div>
      </section>

      {/* Membership Steps */}
      <section style={{ background: COLORS.secondaryFixed, padding: m?"60px 0":"100px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: m?"0 20px":"0 32px" }}>
          <FadeIn><div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto", marginBottom: m?36:64 }}>
            <h2 style={{ fontFamily: FONTS.headline, fontSize: m?26:42, fontWeight: 900, letterSpacing: "-1px", marginBottom: 12 }}>Become a Certified Member</h2>
            <p style={{ fontSize: m?14:16, color: COLORS.onSurfaceVariant, lineHeight: 1.7 }}>Our vetting process ensures all members adhere to the highest standards.</p>
          </div></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: m?"1fr":"repeat(4,1fr)", gap: 16 }}>
            {STEPS.map((s,i) => <FadeIn key={s.num} delay={i*0.1}><div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", padding: m?24:28, borderRadius: m?20:32, marginTop: !m&&i%2!==0?48:0 }}>
              <div style={{ width: 48, height: 48, background: s.bg, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, transform: `rotate(${s.rotate}deg)` }}><span style={{ fontFamily: FONTS.headline, fontSize: 18, fontWeight: 900, color: s.color }}>{s.num}</span></div>
              <h3 style={{ fontFamily: FONTS.headline, fontSize: m?16:18, fontWeight: 800, marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: COLORS.onSurfaceVariant, lineHeight: 1.7 }}>{s.desc}</p>
            </div></FadeIn>)}
          </div>
          <FadeIn delay={0.5}><div style={{ textAlign: "center", marginTop: m?36:64 }}>
            <button onClick={() => window.open("https://portal.recyclersassociation.org/","_blank","noopener,noreferrer")} style={{ background: COLORS.inverseSurface, color: COLORS.secondaryFixed, padding: m?"16px 32px":"18px 44px", borderRadius: 32, border: "none", fontFamily: FONTS.headline, fontWeight: 800, fontSize: m?14:16, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10, width: m?"100%":"auto", justifyContent: "center" }}>Start Your Registration <Icon name="arrow_forward" size={20} /></button>
          </div></FadeIn>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: m?"48px 20px":"80px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn><div style={{ display: "grid", gridTemplateColumns: m?"1fr":"1fr 1fr", gap: m?28:56, alignItems: "center" }}>
          <div style={{ borderRadius: m?24:48, overflow: "hidden", aspectRatio: "4/3", background: "url('/quality-benchmarks.jpg') center/cover no-repeat", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
            <div style={{ position: "absolute", bottom: m?20:36, left: m?20:36, color: "#fff" }}><p style={{ fontFamily: FONTS.headline, fontWeight: 900, fontSize: m?20:28 }}>Quality Benchmarks</p><p style={{ opacity: 0.8, fontSize: m?12:14 }}>Certified Excellence in Waste Management</p></div>
          </div>
          <div>
            <span style={{ color: COLORS.secondary, fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Member Benefits</span>
            <h3 style={{ fontFamily: FONTS.headline, fontSize: m?24:34, fontWeight: 700, marginBottom: 24 }}>Why join the association?</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {BENEFITS.map(b => <div key={b.title} style={{ display: "flex", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${COLORS.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="check_circle" fill size={18} style={{ color: COLORS.primary }} /></div>
                <div><h4 style={{ fontWeight: 700, marginBottom: 3, fontSize: m?14:16 }}>{b.title}</h4><p style={{ fontSize: 14, color: COLORS.onSurfaceVariant }}>{b.desc}</p></div>
              </div>)}
            </div>
          </div>
        </div></FadeIn>
      </section>
    </>
  );
}
