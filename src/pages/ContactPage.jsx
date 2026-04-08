import { COLORS, FONTS, GRADIENTS } from "../styles/tokens";
import { FadeIn, Icon } from "../components";

const HUBS = [
  { region: "South West Hub", area: "Lagos & Ogun Region", coord: "Engr. Babatunde Alabi", email: "sw@ran.org.ng" },
  { region: "North Central Hub", area: "FCT & Plateau Region", coord: "Dr. Amina Yusuf", email: "nc@ran.org.ng" },
  { region: "South East Hub", area: "Enugu & Anambra Region", coord: "Chief Emeka Nwosu", email: "se@ran.org.ng" },
];
const STEPS = [
  { num: "01", title: "Application Submission", desc: "Submit operational permit, CAC documents, and environmental impact summary via our digital portal.", bg: COLORS.secondaryContainer, color: COLORS.onSecondaryContainer, rotate: -6, mt: 0 },
  { num: "02", title: "Compliance Review", desc: "Technical committee reviews facility standards against national safety and recycling benchmarks.", bg: COLORS.primaryContainer, color: COLORS.onPrimaryContainer, rotate: 12, mt: 48 },
  { num: "03", title: "Site Verification", desc: "Regional coordinator conducts a brief physical inspection to verify operational capacity.", bg: COLORS.tertiaryContainer, color: "#fff", rotate: -12, mt: 0 },
  { num: "04", title: "Full Induction", desc: "Receive digital credentials, official RAN membership seal, and access to the national database.", bg: COLORS.secondary, color: "#fff", rotate: 6, mt: 48 },
];
const BENEFITS = [
  { title: "Policy Advocacy", desc: "We represent your interests at federal and state regulatory levels." },
  { title: "Market Intelligence", desc: "Access weekly reports on global plastic, metal, and fiber pricing." },
  { title: "Induction Grants", desc: "Eligibility for low-interest equipment financing through our banking partners." },
];

export default function ContactPage() {
  return (
    <>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 32px 80px" }}>
        <FadeIn>
          <div style={{ display: "flex", gap: 48, alignItems: "flex-end", marginBottom: 64, flexWrap: "wrap" }}>
            <div style={{ flex: "3 1 300px" }}>
              <span style={{ color: COLORS.secondary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 14 }}>Get Involved</span>
              <h1 style={{ fontFamily: FONTS.headline, fontSize: 60, fontWeight: 800, letterSpacing: "-2px", lineHeight: 0.95 }}>Powering Nigeria's <br /><span style={{ color: COLORS.primary, fontStyle: "italic" }}>Circular Transition.</span></h1>
            </div>
            <div style={{ flex: "2 1 200px", paddingBottom: 8 }}>
              <p style={{ color: COLORS.onSurfaceVariant, fontSize: 17, lineHeight: 1.7 }}>Whether you're an established recycler or a burgeoning startup, join the national collective engineering a waste-free future.</p>
            </div>
          </div>
        </FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: "7fr 5fr", gap: 48 }}>
          {/* Form */}
          <FadeIn>
            <div style={{ background: COLORS.surfaceContainerLow, padding: 56, borderRadius: 32, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -60, bottom: -60, width: 240, height: 240, background: `${COLORS.primary}08`, borderRadius: "50%", filter: "blur(40px)" }} />
              <div style={{ position: "relative", zIndex: 10 }}>
                <h2 style={{ fontFamily: FONTS.headline, fontSize: 26, fontWeight: 700, marginBottom: 28 }}>Send a Message</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
                  {[{ l: "Full Name", p: "Ifeanyi Okafor" }, { l: "Organization", p: "GreenCycle Ltd" }].map((f) => (
                    <div key={f.l}>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: COLORS.outline, marginBottom: 8 }}>{f.l}</label>
                      <input type="text" placeholder={f.p} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "none", background: COLORS.surfaceContainerLowest, fontSize: 14, outline: "none", color: COLORS.onSurface }} />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: COLORS.outline, marginBottom: 8 }}>Email Address</label>
                  <input type="email" placeholder="contact@organization.ng" style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "none", background: COLORS.surfaceContainerLowest, fontSize: 14, outline: "none" }} />
                </div>
                <div style={{ marginBottom: 28 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: COLORS.outline, marginBottom: 8 }}>Message</label>
                  <textarea placeholder="How can we assist your mission?" rows={4} style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "none", background: COLORS.surfaceContainerLowest, fontSize: 14, outline: "none", resize: "vertical", fontFamily: FONTS.body }} />
                </div>
                <button style={{ background: GRADIENTS.primary, color: "#fff", padding: "16px 36px", borderRadius: 12, border: "none", fontFamily: FONTS.headline, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Submit Inquiry</button>
              </div>
            </div>
          </FadeIn>
          {/* Hubs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <FadeIn delay={0.1}>
              <h3 style={{ fontFamily: FONTS.headline, fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}><Icon name="location_on" fill size={24} style={{ color: COLORS.secondary }} /> Regional Nodes</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {HUBS.map((h) => (
                  <div key={h.region} style={{ background: COLORS.surfaceContainerHigh, padding: 22, borderRadius: 16, transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = COLORS.surfaceContainerHighest} onMouseLeave={(e) => e.currentTarget.style.background = COLORS.surfaceContainerHigh}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <p style={{ color: COLORS.primary, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>{h.region}</p>
                        <p style={{ fontFamily: FONTS.headline, fontSize: 16, fontWeight: 700 }}>{h.area}</p>
                      </div>
                      <a href={`mailto:${h.email}`} style={{ background: COLORS.surfaceContainerLowest, padding: 8, borderRadius: 8, display: "flex", textDecoration: "none" }}><Icon name="mail" size={16} style={{ color: COLORS.onSurface }} /></a>
                    </div>
                    <p style={{ fontSize: 13, color: COLORS.onSurfaceVariant, marginTop: 10 }}>Coordinator: {h.coord}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={{ background: `${COLORS.secondaryFixed}30`, padding: 28, borderRadius: 32, border: `1px solid ${COLORS.secondary}15` }}>
                <h4 style={{ fontFamily: FONTS.headline, fontWeight: 700, color: COLORS.secondary, fontSize: 18, marginBottom: 10 }}>Direct Secretariat</h4>
                <p style={{ fontSize: 13, color: COLORS.onSurfaceVariant, lineHeight: 1.7, marginBottom: 20 }}>For institutional partnerships or national policy inquiries, contact our central secretariat.</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.secondary, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="call" size={22} style={{ color: "#fff" }} /></div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: COLORS.outline, letterSpacing: 1 }}>Hotline</p>
                    <p style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 16 }}>+234 (0) 800-RECYCLE</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Membership Steps */}
      <section style={{ background: COLORS.secondaryFixed, padding: "100px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <FadeIn>
            <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 64px" }}>
              <h2 style={{ fontFamily: FONTS.headline, fontSize: 42, fontWeight: 900, letterSpacing: "-1px", marginBottom: 14 }}>Become a Certified Member</h2>
              <p style={{ fontSize: 16, color: COLORS.onSurfaceVariant, lineHeight: 1.7 }}>Our vetting process ensures all members adhere to the highest standards.</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {STEPS.map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.1}>
                <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", padding: 28, borderRadius: 32, marginTop: s.mt, transition: "all 0.4s" }} onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "translateY(-8px)"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ width: 52, height: 52, background: s.bg, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, transform: `rotate(${s.rotate}deg)`, transition: "transform 0.3s" }}>
                    <span style={{ fontFamily: FONTS.headline, fontSize: 20, fontWeight: 900, color: s.color }}>{s.num}</span>
                  </div>
                  <h3 style={{ fontFamily: FONTS.headline, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 13, color: COLORS.onSurfaceVariant, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.5}>
            <div style={{ textAlign: "center", marginTop: 64 }}>
              <button style={{ background: COLORS.inverseSurface, color: COLORS.secondaryFixed, padding: "18px 44px", borderRadius: 32, border: "none", fontFamily: FONTS.headline, fontWeight: 800, fontSize: 16, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10 }}>Start Your Registration <Icon name="arrow_forward" size={20} /></button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Benefits */}
      <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
        <FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div style={{ borderRadius: 48, overflow: "hidden", aspectRatio: "4/3", background: "linear-gradient(135deg, #2E7D32, #43A047)", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,108,12,0.55), transparent)" }} />
              <div style={{ position: "absolute", bottom: 36, left: 36, color: "#fff" }}>
                <p style={{ fontFamily: FONTS.headline, fontWeight: 900, fontSize: 28 }}>Quality Benchmarks</p>
                <p style={{ opacity: 0.8, fontSize: 14 }}>Certified Excellence in Waste Management</p>
              </div>
            </div>
            <div>
              <span style={{ color: COLORS.secondary, fontWeight: 700, fontSize: 12, letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Member Benefits</span>
              <h3 style={{ fontFamily: FONTS.headline, fontSize: 34, fontWeight: 700, marginBottom: 28 }}>Why join the association?</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {BENEFITS.map((b) => (
                  <div key={b.title} style={{ display: "flex", gap: 14 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${COLORS.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="check_circle" fill size={18} style={{ color: COLORS.primary }} /></div>
                    <div>
                      <h4 style={{ fontWeight: 700, marginBottom: 4 }}>{b.title}</h4>
                      <p style={{ fontSize: 14, color: COLORS.onSurfaceVariant }}>{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
