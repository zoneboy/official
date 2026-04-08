import { COLORS, FONTS } from "../styles/tokens";
import { FadeIn, Icon, HoverCard } from "../components";

const LEADERS = [
  { name: "Oluwaseun Adeyemi", role: "National President", dept: "Executive HQ", initials: "OA" },
  { name: "Dr. Amina Yusuf", role: "Vice President", dept: "Strategic Planning", initials: "AY" },
  { name: "Chidi Okoro", role: "Secretary General", dept: "National Secretariat", initials: "CO" },
  { name: "Funmi Lawson", role: "Financial Director", dept: "Treasury", initials: "FL" },
];
const COORDS = [
  { name: "Zainab Bello", state: "Kano State Coordinator", initials: "ZB" },
  { name: "Emeka Nwachukwu", state: "Lagos State Coordinator", initials: "EN" },
  { name: "Ahmed Ibrahim", state: "Kaduna State Coordinator", initials: "AI" },
  { name: "Blessing Udoh", state: "Akwa Ibom Coordinator", initials: "BU" },
];
const SDGS = [
  { icon: "recycling", sdg: "SDG 12", label: "Responsible Consumption" },
  { icon: "work", sdg: "SDG 8", label: "Decent Work & Growth" },
  { icon: "groups", sdg: "SDG 17", label: "Partnerships for Goals" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: 500, display: "flex", alignItems: "center", background: COLORS.surface, padding: "0 48px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #f9f9f8 50%, transparent)", zIndex: 10 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,108,12,0.04), rgba(0,108,12,0.02))" }} />
        <div style={{ position: "relative", zIndex: 20, maxWidth: 700 }}>
          <FadeIn>
            <span style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: `${COLORS.secondaryContainer}30`, color: COLORS.onSecondaryContainer, fontFamily: FONTS.headline, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>ESTABLISHED 2014</span>
            <h1 style={{ fontFamily: FONTS.headline, fontSize: 72, fontWeight: 800, color: COLORS.primary, lineHeight: 0.92, letterSpacing: "-3px", marginBottom: 24 }}>
              Architects of<br />Nigeria's <span style={{ color: COLORS.secondary }}>Circular</span> Future.
            </h1>
            <p style={{ fontSize: 18, color: COLORS.onSurfaceVariant, maxWidth: 520, lineHeight: 1.7 }}>We are the unified voice of the waste management and recycling sector in Nigeria, dedicated to engineering sustainable economic growth through circularity.</p>
          </FadeIn>
        </div>
      </section>

      {/* Bento */}
      <section style={{ padding: "100px 32px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "7fr 5fr", gap: 24, marginBottom: 24 }}>
          <FadeIn>
            <div style={{ background: COLORS.surfaceContainerLow, padding: 48, borderRadius: 8 }}>
              <h2 style={{ fontFamily: FONTS.headline, fontSize: 36, fontWeight: 700, color: COLORS.primary, marginBottom: 20 }}>Our Legacy</h2>
              <p style={{ color: COLORS.onSurfaceVariant, fontSize: 16, lineHeight: 1.8 }}>Founded to bridge the gap between waste generation and value recovery, the Recyclers Association of Nigeria (RAN) has evolved into a national powerhouse driving policy, innovation, and infrastructure across the federation.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 28 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="history" size={22} style={{ color: "#fff" }} /></div>
                <span style={{ fontFamily: FONTS.headline, fontWeight: 700 }}>10+ Years of Environmental Advocacy</span>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ background: COLORS.primary, padding: 48, borderRadius: 8, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, bottom: -20, opacity: 0.08 }}><Icon name="eco" size={160} style={{ color: "#fff" }} /></div>
              <h3 style={{ fontFamily: FONTS.headline, fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 18, position: "relative" }}>Our Mission</h3>
              <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 16, lineHeight: 1.8, position: "relative" }}>To professionalize the recycling industry in Nigeria by setting standards, fostering collaborations, and advocating for policies that promote resource efficiency.</p>
            </div>
          </FadeIn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 24 }}>
          <FadeIn delay={0.15}>
            <div style={{ background: COLORS.secondary, padding: 48, borderRadius: 8, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, bottom: -20, opacity: 0.08 }}><Icon name="visibility" size={160} style={{ color: "#fff" }} /></div>
              <h3 style={{ fontFamily: FONTS.headline, fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 18, position: "relative" }}>Our Vision</h3>
              <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 16, lineHeight: 1.8, position: "relative" }}>A Nigeria where waste is no longer an environmental burden but a catalyst for industrialization and national prosperity.</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ background: COLORS.surfaceContainerHighest, padding: 48, borderRadius: 8 }}>
              <h3 style={{ fontFamily: FONTS.headline, fontSize: 28, fontWeight: 700, marginBottom: 24 }}>SDG Alignment</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {SDGS.map((s) => (
                  <div key={s.sdg} style={{ background: COLORS.surfaceContainerLowest, padding: 16, borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <Icon name={s.icon} fill size={22} style={{ color: COLORS.primary, marginBottom: 8, display: "block" }} />
                    <div style={{ fontSize: 10, fontFamily: FONTS.headline, fontWeight: 900, color: COLORS.onSurfaceVariant, letterSpacing: 1, marginBottom: 4 }}>{s.sdg}</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Leadership */}
      <section style={{ padding: "100px 0", background: COLORS.surfaceContainerLow }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 48px" }}>
          <FadeIn>
            <h2 style={{ fontFamily: FONTS.headline, fontSize: 44, fontWeight: 800, letterSpacing: "-1px", marginBottom: 8 }}>Executive Leadership</h2>
            <p style={{ color: COLORS.onSurfaceVariant, fontSize: 17, maxWidth: 500, marginBottom: 48 }}>Guiding Nigeria's circular economy with expertise, integrity, and visionary governance.</p>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 64 }}>
            {LEADERS.map((l, i) => (
              <FadeIn key={l.name} delay={i * 0.08}>
                <HoverCard bg={COLORS.surfaceContainerLowest} padding="24px">
                  <div style={{ width: "100%", aspectRatio: "1", background: `linear-gradient(135deg, ${COLORS.surfaceContainerHigh}, ${COLORS.outlineVariant})`, borderRadius: 8, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: FONTS.headline, fontWeight: 800, fontSize: 40, color: COLORS.outline }}>{l.initials}</span>
                  </div>
                  <h4 style={{ fontFamily: FONTS.headline, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{l.name}</h4>
                  <p style={{ color: COLORS.primary, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{l.role}</p>
                  <p style={{ fontSize: 10, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: 2, fontWeight: 900 }}>{l.dept}</p>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
          <FadeIn><h3 style={{ fontFamily: FONTS.headline, fontSize: 26, fontWeight: 700, marginBottom: 24, borderLeft: `4px solid ${COLORS.secondary}`, paddingLeft: 20 }}>State Coordinators</h3></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {COORDS.map((c, i) => (
              <FadeIn key={c.name} delay={i * 0.06}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, background: COLORS.surfaceContainerLowest, borderRadius: 8, border: `1px solid ${COLORS.outlineVariant}20` }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: COLORS.surfaceContainerHigh, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: FONTS.headline, fontWeight: 800, fontSize: 16, color: COLORS.outline }}>{c.initials}</span>
                  </div>
                  <div>
                    <h5 style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13 }}>{c.name}</h5>
                    <p style={{ fontSize: 11, color: COLORS.onSurfaceVariant }}>{c.state}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 48px" }}>
        <FadeIn>
          <div style={{ background: COLORS.primaryContainer, borderRadius: 24, padding: "64px 72px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48, overflow: "hidden" }}>
            <div style={{ maxWidth: 520 }}>
              <h2 style={{ fontFamily: FONTS.headline, fontSize: 40, fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 18 }}>Join the Vanguard of Sustainable Nigeria.</h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 28 }}>Become a registered member and access professional networks, policy advocacy, and industry standards.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button style={{ background: COLORS.surface, color: COLORS.primary, padding: "14px 28px", borderRadius: 12, border: "none", fontFamily: FONTS.headline, fontWeight: 700, cursor: "pointer" }}>Apply for Membership</button>
                <button style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.4)", color: "#fff", padding: "14px 28px", borderRadius: 12, fontFamily: FONTS.headline, fontWeight: 700, cursor: "pointer" }}>Download Brochure</button>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", padding: 32, borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)", maxWidth: 300 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.secondary, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="verified" size={22} style={{ color: "#fff" }} /></div>
                <span style={{ fontFamily: FONTS.headline, fontWeight: 700, color: "#fff" }}>Official Certifications</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>Industry certifications that validate your recycling operations to global standards.</p>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
