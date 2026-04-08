import { useState } from "react";
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon, PillButton, IconLinkButton } from "../components";

const CATS = ["All Updates", "National", "State News", "Spotlights", "Insights"];
const ARTICLES = [
  { cat: "State Chapter News", date: "March 21, 2026", title: "Lagos Chapter Launches Tech Hub for Upcyclers", desc: "Advanced machinery and digital tracking tools for member organizations in Ikeja.", gradient: "linear-gradient(135deg, #81C784, #66BB6A)" },
  { cat: "Industry Insights", date: "March 18, 2026", title: "The Rise of Green Bonds in Nigeria", desc: "Green bonds providing crucial capital for large-scale recycling infrastructure.", gradient: "linear-gradient(135deg, #AED581, #9CCC65)" },
  { cat: "Member Spotlights", date: "March 15, 2026", title: "Dr. Amadi's Zero-Waste Vision", desc: "From a collection point to a national logistics network in the Niger Delta.", gradient: "linear-gradient(135deg, #80CBC4, #4DB6AC)" },
  { cat: "National Updates", date: "March 12, 2026", title: "New Standards for PET Recycling", desc: "Revised quality benchmarks for food-grade recycled plastics.", gradient: "linear-gradient(135deg, #FFE082, #FFD54F)" },
  { cat: "Industry Insights", date: "March 09, 2026", title: "Solar Energy in Recycling Operations", desc: "Pivoting to renewable energy to combat rising grid costs.", gradient: "linear-gradient(135deg, #EF9A9A, #E57373)" },
];

export default function BlogPage() {
  const [active, setActive] = useState("All Updates");
  const { isMobile: m, isTablet } = useBreakpoints();
  const cols = m ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";

  return (
    <>
      {/* Featured */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: m ? "24px 20px 0" : "48px 32px 0" }}>
        <FadeIn>
          <div style={{ borderRadius: 12, overflow: "hidden", display: "grid", gridTemplateColumns: m ? "1fr" : "7fr 5fr", minHeight: m ? "auto" : 480 }}>
            <div style={{ background: "linear-gradient(135deg, #2E7D32, #388E3C, #43A047)", minHeight: m ? 180 : "auto", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,108,12,0.2), transparent)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: m ? "28px 20px" : 56, background: COLORS.surfaceContainerLowest }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <span style={{ background: COLORS.secondaryContainer, color: COLORS.onSecondaryContainer, padding: "4px 12px", borderRadius: 24, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Featured Report</span>
                <span style={{ fontSize: 12, color: COLORS.onSurfaceVariant }}>April 02, 2026</span>
              </div>
              <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 24 : 40, fontWeight: 800, color: COLORS.primary, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 12 }}>Nigeria's Circular Economy Road Map 2030</h1>
              <p style={{ color: COLORS.onSurfaceVariant, fontSize: m ? 14 : 16, lineHeight: 1.7, marginBottom: 20 }}>A comprehensive strategy to transform Nigeria's waste management sector.</p>
              <IconLinkButton>Read Full Publication</IconLinkButton>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: m ? "32px 20px 60px" : "48px 32px 80px" }}>
        <FadeIn>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
            {CATS.map((c) => <PillButton key={c} active={active === c} onClick={() => setActive(c)} style={m ? { fontSize: 12, padding: "8px 14px" } : {}}>{c}</PillButton>)}
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: m ? 16 : 24 }}>
          {ARTICLES.map((a, i) => (
            <FadeIn key={a.title} delay={i * 0.06}>
              <article style={{ display: "flex", flexDirection: "column", background: COLORS.surfaceContainerLow, borderRadius: 12, overflow: "hidden", transition: "all 0.3s" }}>
                <div style={{ height: m ? 160 : 200, background: a.gradient, position: "relative" }}>
                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <span style={{ background: "rgba(255,255,255,0.9)", color: COLORS.primary, padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{a.cat}</span>
                  </div>
                </div>
                <div style={{ padding: m ? 20 : 28, display: "flex", flexDirection: "column", flex: 1 }}>
                  <time style={{ fontSize: 11, fontWeight: 500, color: COLORS.tertiary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{a.date}</time>
                  <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 16 : 18, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>{a.title}</h3>
                  <p style={{ color: COLORS.onSurfaceVariant, fontSize: 13, lineHeight: 1.6, flex: 1, marginBottom: 14 }}>{a.desc}</p>
                  <div style={{ borderTop: `1px solid ${COLORS.outlineVariant}20`, paddingTop: 12 }}>
                    <IconLinkButton icon="chevron_right">Read More</IconLinkButton>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
          {/* Newsletter card */}
          <FadeIn delay={0.4}>
            <article style={{ display: "flex", flexDirection: "column", background: COLORS.primary, borderRadius: 12, padding: m ? 20 : 28, justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, padding: 20, opacity: 0.08 }}><Icon name="mail" size={m ? 80 : 120} style={{ color: "#fff" }} /></div>
              <div style={{ position: "relative", zIndex: 10 }}>
                <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 18 : 22, fontWeight: 800, color: "#fff", marginBottom: 8 }}>Stay Informed</h3>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>Join 5,000+ professionals receiving our weekly digest.</p>
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
