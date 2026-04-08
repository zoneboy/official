import { useState } from "react";
import { COLORS, FONTS } from "../styles/tokens";
import { FadeIn, Icon, PillButton, IconLinkButton } from "../components";

const CATS = ["All Updates", "National Updates", "State Chapter News", "Member Spotlights", "Industry Insights"];
const ARTICLES = [
  { cat: "State Chapter News", date: "March 21, 2026", title: "Lagos State Chapter Launches New Tech Hub for Upcyclers", desc: "The new facility in Ikeja provides advanced machinery and digital tracking tools.", gradient: "linear-gradient(135deg, #81C784, #66BB6A)" },
  { cat: "Industry Insights", date: "March 18, 2026", title: "Sustainable Finance: The Rise of Green Bonds in Nigeria", desc: "How green bonds are providing crucial capital for large-scale recycling infrastructure.", gradient: "linear-gradient(135deg, #AED581, #9CCC65)" },
  { cat: "Member Spotlights", date: "March 15, 2026", title: "Entrepreneur of the Month: Dr. Amadi's Zero-Waste Vision", desc: "Redefining waste value chains in the Niger Delta from a small collection point to a national network.", gradient: "linear-gradient(135deg, #80CBC4, #4DB6AC)" },
  { cat: "National Updates", date: "March 12, 2026", title: "Federal Policy Update: New Standards for PET Recycling", desc: "Revised quality benchmarks for food-grade recycled plastics from the Ministry of Environment.", gradient: "linear-gradient(135deg, #FFE082, #FFD54F)" },
  { cat: "Industry Insights", date: "March 09, 2026", title: "Solar Energy Adoption in Recycling Operations", desc: "How Nigerian recyclers are pivoting to renewable energy to combat rising grid costs.", gradient: "linear-gradient(135deg, #EF9A9A, #E57373)" },
];

export default function BlogPage() {
  const [active, setActive] = useState("All Updates");
  return (
    <>
      {/* Featured */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 0" }}>
        <FadeIn>
          <div style={{ borderRadius: 12, overflow: "hidden", display: "grid", gridTemplateColumns: "7fr 5fr", minHeight: 480 }}>
            <div style={{ background: "linear-gradient(135deg, #2E7D32, #388E3C, #43A047)", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,108,12,0.2), transparent)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 56, background: COLORS.surfaceContainerLowest }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ background: COLORS.secondaryContainer, color: COLORS.onSecondaryContainer, padding: "5px 14px", borderRadius: 24, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Featured Report</span>
                <span style={{ fontSize: 13, color: COLORS.onSurfaceVariant }}>April 02, 2026</span>
              </div>
              <h1 style={{ fontFamily: FONTS.headline, fontSize: 40, fontWeight: 800, color: COLORS.primary, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 16 }}>Nigeria's Circular Economy Road Map 2030</h1>
              <p style={{ color: COLORS.onSurfaceVariant, fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>A comprehensive strategy to transform Nigeria's waste management sector into a multi-billion dollar industrial powerhouse.</p>
              <IconLinkButton>Read Full Publication</IconLinkButton>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 80px" }}>
        <FadeIn>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
            {CATS.map((c) => <PillButton key={c} active={active === c} onClick={() => setActive(c)}>{c}</PillButton>)}
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {ARTICLES.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.06}>
              <article style={{ display: "flex", flexDirection: "column", background: COLORS.surfaceContainerLow, borderRadius: 12, overflow: "hidden", transition: "all 0.3s" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ height: 200, background: a.gradient, position: "relative" }}>
                  <div style={{ position: "absolute", top: 14, left: 14 }}><span style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", color: COLORS.primary, padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{a.cat}</span></div>
                </div>
                <div style={{ padding: 28, display: "flex", flexDirection: "column", flex: 1 }}>
                  <time style={{ fontSize: 11, fontWeight: 500, color: COLORS.tertiary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>{a.date}</time>
                  <h3 style={{ fontFamily: FONTS.headline, fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginBottom: 10 }}>{a.title}</h3>
                  <p style={{ color: COLORS.onSurfaceVariant, fontSize: 13, lineHeight: 1.6, flex: 1, marginBottom: 16 }}>{a.desc}</p>
                  <div style={{ borderTop: `1px solid ${COLORS.outlineVariant}20`, paddingTop: 14 }}><IconLinkButton icon="chevron_right">Read More</IconLinkButton></div>
                </div>
              </article>
            </FadeIn>
          ))}
          {/* Newsletter */}
          <FadeIn delay={0.4}>
            <article style={{ display: "flex", flexDirection: "column", background: COLORS.primary, borderRadius: 12, padding: 28, justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, padding: 24, opacity: 0.08 }}><Icon name="mail" size={120} style={{ color: "#fff" }} /></div>
              <div style={{ position: "relative", zIndex: 10 }}>
                <h3 style={{ fontFamily: FONTS.headline, fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Stay Informed on Nigeria's Circular Future</h3>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>Join 5,000+ professionals receiving our weekly digest.</p>
              </div>
              <div style={{ position: "relative", zIndex: 10 }}>
                <input type="email" placeholder="Email Address" style={{ width: "100%", padding: "12px 16px", borderRadius: 8, border: "none", background: COLORS.primaryContainer, color: "#fff", fontSize: 13, marginBottom: 10, outline: "none" }} />
                <button style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: COLORS.surface, color: COLORS.primary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Subscribe Now</button>
              </div>
            </article>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
