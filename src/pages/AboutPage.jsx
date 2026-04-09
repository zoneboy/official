/* --- FILE: src/pages/AboutPage.jsx --- */
import { useState } from "react";
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon, HoverCard } from "../components";

const LEADERS = [
  { name: "Rita Idehai", role: "Immediate Past President", dept: "Advisory", initials: "RI", image: "/team/rita.jpg" },
  { name: "Harold Okonoboh", role: "President", dept: "Executive HQ", initials: "HO", image: "/team/harold.jpg" },
  { name: "Victor Okunola", role: "Vice President", dept: "Strategic Planning", initials: "VO", image: "/team/victor.jpg" },
  { name: "Oluwaseyi Olatunbosun", role: "Treasurer", dept: "Treasury", initials: "OO", image: "/team/oluwaseyi.jpg" },
  { name: "Cajetan Okeke", role: "General Secretary", dept: "National Secretariat", initials: "CO", image: "/team/cajetan.jpg" },
  { name: "Idu Okeahialam", role: "Public & Social Relations", dept: "Communications", initials: "IO", image: "/team/idu.jpg" },
  { name: "Taofeek Lateef", role: "Provost & Membership Reg. Officer", dept: "Administration", initials: "TL", image: "/team/taofeek.jpg" },
];

const REGIONAL_COORDS = [
  { name: "Daniel Ntia", region: "South-South", initials: "DN", image: "/team/daniel-ntia.jpg" },
  { name: "Owoeye Femi", region: "North-Central", initials: "OF", image: "/team/owoeye-femi.jpg" },
  { name: "Hapsat Sali", region: "North-East", initials: "HS", image: "/team/hapsat-sali.jpg" },
  { name: "Amunnadi Obinna", region: "South-East", initials: "AO", image: "/team/amunnadi-obinna.jpg" },
  { name: "Test Test", region: "South-West", initials: "TT", image: "" },
  { name: "Test Test ", region: "North-West", initials: "TT", image: "" },
];

const COORDS = [
  { name: "Uche Orji", state: "Abia State", initials: "UO", image: "" },
  { name: "Sadiq Mahmud", state: "Adamawa State", initials: "SM", image: "" },
  { name: "Blessing Udoh", state: "Akwa Ibom State", initials: "BU", image: "" },
  { name: "Chika Nwosu", state: "Anambra State", initials: "CN", image: "" },
  { name: "Isa Danladi", state: "Bauchi State", initials: "ID", image: "" },
  { name: "Timi Preye", state: "Bayelsa State", initials: "TP", image: "" },
  { name: "Terkura Akem", state: "Benue State", initials: "TA", image: "" },
  { name: "Mustapha Zulum", state: "Borno State", initials: "MZ", image: "" },
  { name: "Etim Bassey", state: "Cross River State", initials: "EB", image: "" },
  { name: "Oghenekaro Efe", state: "Delta State", initials: "OE", image: "" },
  { name: "Nnamdi Chukwu", state: "Ebonyi State", initials: "NC", image: "" },
  { name: "Osaro Igbinedion", state: "Edo State", initials: "OI", image: "" },
  { name: "Femi Adebayo", state: "Ekiti State", initials: "FA", image: "" },
  { name: "Obinna Eze", state: "Enugu State", initials: "OE", image: "" },
  { name: "Aliyu Usman", state: "Gombe State", initials: "AU", image: "" },
  { name: "Emeka Ike", state: "Imo State", initials: "EI", image: "" },
  { name: "Suleiman Danjuma", state: "Jigawa State", initials: "SD", image: "" },
  { name: "Ahmed Ibrahim", state: "Kaduna State", initials: "AI", image: "" },
  { name: "Zainab Bello", state: "Kano State", initials: "ZB", image: "" },
  { name: "Kabir Masari", state: "Katsina State", initials: "KM", image: "" },
  { name: "Farouk Aliyu", state: "Kebbi State", initials: "FA", image: "" },
  { name: "Idris Abubakar", state: "Kogi State", initials: "IA", image: "" },
  { name: "Tunde Salman", state: "Kwara State", initials: "TS", image: "" },
  { name: "Emeka Nwachukwu", state: "Lagos State", initials: "EN", image: "" },
  { name: "Tanko Ibrahim", state: "Nasarawa State", initials: "TI", image: "" },
  { name: "Musa Babangida", state: "Niger State", initials: "MB", image: "" },
  { name: "Kunle Afolayan", state: "Ogun State", initials: "KA", image: "" },
  { name: "Segun Adewale", state: "Ondo State", initials: "SA", image: "" },
  { name: "Wale Adeleke", state: "Osun State", initials: "WA", image: "" },
  { name: "Abiola Ojo", state: "Oyo State", initials: "AO", image: "" },
  { name: "Gideon Daling", state: "Plateau State", initials: "GD", image: "" },
  { name: "Tamuno George", state: "Rivers State", initials: "TG", image: "" },
  { name: "Aliyu Shehu", state: "Sokoto State", initials: "AS", image: "" },
  { name: "Danladi Ishaya", state: "Taraba State", initials: "DI", image: "" },
  { name: "Ibrahim Bukar", state: "Yobe State", initials: "IB", image: "" },
  { name: "Abdulaziz Kabir", state: "Zamfara State", initials: "AK", image: "" }
];

const SDGS = [
  { icon: "recycling", sdg: "SDG 12", label: "Responsible Consumption" },
  { icon: "work", sdg: "SDG 8", label: "Decent Work & Growth" },
  { icon: "groups", sdg: "SDG 17", label: "Partnerships for Goals" },
];

export default function AboutPage() {
  const { isMobile: m } = useBreakpoints();
  const pad = m ? "0 20px" : "0 48px";
  
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(COORDS.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentCoords = COORDS.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: m ? 360 : 500, display: "flex", alignItems: "center", background: COLORS.surface, padding: m ? "40px 20px" : "0 48px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #f9f9f8 60%, transparent)", zIndex: 10 }} />
        <div style={{ position: "relative", zIndex: 20, maxWidth: 700 }}>
          <FadeIn>
            <span style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: `${COLORS.secondaryContainer}30`, color: COLORS.onSecondaryContainer, fontFamily: FONTS.headline, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>ESTABLISHED 2018</span>
            <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 36 : 72, fontWeight: 800, color: COLORS.primary, lineHeight: 0.92, letterSpacing: m ? "-1px" : "-3px", marginBottom: 20 }}>
              Architects of{!m && <br />} Nigeria's <span style={{ color: COLORS.secondary }}>Circular</span> Future.
            </h1>
            <p style={{ fontSize: m ? 15 : 18, color: COLORS.onSurfaceVariant, maxWidth: 520, lineHeight: 1.7 }}>We are the unified voice of the waste management and recycling sector in Nigeria.</p>
          </FadeIn>
        </div>
      </section>

      {/* Bento */}
      <section style={{ padding: m ? "48px 20px" : "100px 32px", maxWidth: 1400, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "7fr 5fr", gap: m ? 16 : 24, marginBottom: m ? 16 : 24 }}>
          <FadeIn>
            <div style={{ background: COLORS.surfaceContainerLow, padding: m ? 28 : 48, borderRadius: 8 }}>
              <h2 style={{ fontFamily: FONTS.headline, fontSize: m ? 24 : 36, fontWeight: 700, color: COLORS.primary, marginBottom: 16 }}>Our Legacy</h2>
              <p style={{ color: COLORS.onSurfaceVariant, fontSize: m ? 14 : 16, lineHeight: 1.8 }}>Founded to bridge the gap between waste generation and value recovery, RAN has evolved into a national powerhouse driving policy, innovation, and infrastructure across the federation.</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name="history" size={20} style={{ color: "#fff" }} /></div>
                <span style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: m ? 13 : 16 }}>8+ Years of Environmental Advocacy</span>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ background: COLORS.primary, padding: m ? 28 : 48, borderRadius: 8, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, bottom: -20, opacity: 0.08 }}><Icon name="eco" size={m ? 100 : 160} style={{ color: "#fff" }} /></div>
              <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 22 : 28, fontWeight: 700, color: "#fff", marginBottom: 14, position: "relative" }}>Our Mission</h3>
              <p style={{ color: "rgba(255,255,255,0.88)", fontSize: m ? 14 : 16, lineHeight: 1.8, position: "relative", marginBottom: 8 }}>
                To promote effective waste management in Nigeria through education and advocacy, utilizing the 4Rs approach:
              </p>
              <ul style={{ color: "rgba(255,255,255,0.88)", fontSize: m ? 14 : 16, lineHeight: 1.8, position: "relative", paddingLeft: 20 }}>
                <li>Reduce</li>
                <li>Reuse</li>
                <li>Repurpose</li>
                <li>Recycle</li>
              </ul>
            </div>
          </FadeIn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "5fr 7fr", gap: m ? 16 : 24 }}>
          <FadeIn delay={0.15}>
            <div style={{ background: COLORS.secondary, padding: m ? 28 : 48, borderRadius: 8, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, bottom: -20, opacity: 0.08 }}><Icon name="visibility" size={m ? 100 : 160} style={{ color: "#fff" }} /></div>
              <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 22 : 28, fontWeight: 700, color: "#fff", marginBottom: 14, position: "relative" }}>Our Vision</h3>
              <p style={{ color: "rgba(255,255,255,0.88)", fontSize: m ? 14 : 16, lineHeight: 1.8, position: "relative" }}>
                To foster a cleaner and greener Nigeria, where zero waste is achieved through sustainable waste management practices and collective action.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ background: COLORS.surfaceContainerHighest, padding: m ? 28 : 48, borderRadius: 8 }}>
              <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 22 : 28, fontWeight: 700, marginBottom: 20 }}>SDG Alignment</h3>
              <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
                {SDGS.map((s) => (
                  <div key={s.sdg} style={{ background: COLORS.surfaceContainerLowest, padding: 14, borderRadius: 8 }}>
                    <Icon name={s.icon} fill size={20} style={{ color: COLORS.primary, marginBottom: 6, display: "block" }} />
                    <div style={{ fontSize: 10, fontFamily: FONTS.headline, fontWeight: 900, color: COLORS.onSurfaceVariant, letterSpacing: 1, marginBottom: 3 }}>{s.sdg}</div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Leadership */}
      <section style={{ padding: m ? "48px 0" : "100px 0", background: COLORS.surfaceContainerLow }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: pad }}>
          <FadeIn>
            <h2 style={{ fontFamily: FONTS.headline, fontSize: m ? 28 : 44, fontWeight: 800, letterSpacing: "-1px", marginBottom: 8 }}>Executive Leadership</h2>
            <p style={{ color: COLORS.onSurfaceVariant, fontSize: m ? 14 : 17, maxWidth: 500, marginBottom: 36 }}>Guiding Nigeria's circular economy with expertise and visionary governance.</p>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: m ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: m ? 12 : 24, marginBottom: 48 }}>
            {LEADERS.map((l, i) => (
              <FadeIn key={l.name} delay={i * 0.08}>
                <HoverCard bg={COLORS.surfaceContainerLowest} padding={m ? "16px" : "24px"}>
                  <div style={{ width: "100%", aspectRatio: "1", background: `linear-gradient(135deg, ${COLORS.surfaceContainerHigh}, ${COLORS.outlineVariant})`, borderRadius: 8, marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    {l.image ? (
                      <img src={l.image} alt={l.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontFamily: FONTS.headline, fontWeight: 800, fontSize: m ? 28 : 40, color: COLORS.outline }}>{l.initials}</span>
                    )}
                  </div>
                  <h4 style={{ fontFamily: FONTS.headline, fontSize: m ? 14 : 18, fontWeight: 700, marginBottom: 3 }}>{l.name}</h4>
                  <p style={{ color: COLORS.primary, fontWeight: 700, fontSize: m ? 11 : 13, marginBottom: 3 }}>{l.role}</p>
                  <p style={{ fontSize: m ? 9 : 10, color: COLORS.onSurfaceVariant, textTransform: "uppercase", letterSpacing: 2, fontWeight: 900 }}>{l.dept}</p>
                </HoverCard>
              </FadeIn>
            ))}
          </div>

          <FadeIn><h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 20 : 26, fontWeight: 700, marginBottom: 20, borderLeft: `4px solid ${COLORS.secondary}`, paddingLeft: 16 }}>Regional Coordinators</h3></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: 12, marginBottom: 48 }}>
            {REGIONAL_COORDS.map((c, i) => (
              <FadeIn key={c.name} delay={i * 0.06}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: COLORS.surfaceContainerLowest, borderRadius: 8, border: `1px solid ${COLORS.outlineVariant}20` }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.surfaceContainerHigh, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                    {c.image ? (
                      <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontFamily: FONTS.headline, fontWeight: 800, fontSize: 14, color: COLORS.outline }}>{c.initials}</span>
                    )}
                  </div>
                  <div>
                    <h5 style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13 }}>{c.name}</h5>
                    <p style={{ fontSize: 11, color: COLORS.onSurfaceVariant }}>{c.region} Regional Coordinator</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn><h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 20 : 26, fontWeight: 700, marginBottom: 20, borderLeft: `4px solid ${COLORS.secondary}`, paddingLeft: 16 }}>State Coordinators</h3></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(4, 1fr)", gap: 12 }}>
            {currentCoords.map((c, i) => (
              <FadeIn key={`${c.name}-${i}`} delay={i * 0.04}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: COLORS.surfaceContainerLowest, borderRadius: 8, border: `1px solid ${COLORS.outlineVariant}20` }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.surfaceContainerHigh, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                    {c.image ? (
                      <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontFamily: FONTS.headline, fontWeight: 800, fontSize: 14, color: COLORS.outline }}>{c.initials}</span>
                    )}
                  </div>
                  <div>
                    <h5 style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13 }}>{c.name}</h5>
                    <p style={{ fontSize: 11, color: COLORS.onSurfaceVariant }}>{c.state}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <FadeIn delay={0.2}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, marginTop: 32 }}>
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))} 
                  disabled={page === 1}
                  style={{ 
                    padding: "10px 20px", 
                    borderRadius: 24, 
                    border: `1.5px solid ${page === 1 ? COLORS.surfaceContainerHighest : COLORS.primary}`, 
                    background: "transparent", 
                    color: page === 1 ? COLORS.outline : COLORS.primary,
                    cursor: page === 1 ? "not-allowed" : "pointer", 
                    fontFamily: FONTS.headline, 
                    fontWeight: 700, 
                    fontSize: 13,
                    transition: "all 0.2s"
                  }}
                >
                  Previous
                </button>
                <span style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, color: COLORS.onSurfaceVariant }}>
                  Page {page} of {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                  disabled={page === totalPages}
                  style={{ 
                    padding: "10px 20px", 
                    borderRadius: 24, 
                    border: `1.5px solid ${page === totalPages ? COLORS.surfaceContainerHighest : COLORS.primary}`, 
                    background: "transparent", 
                    color: page === totalPages ? COLORS.outline : COLORS.primary,
                    cursor: page === totalPages ? "not-allowed" : "pointer", 
                    fontFamily: FONTS.headline, 
                    fontWeight: 700, 
                    fontSize: 13,
                    transition: "all 0.2s"
                  }}
                >
                  Next
                </button>
              </div>
            </FadeIn>
          )}

        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: m ? "40px 20px" : "80px 48px" }}>
        <FadeIn>
          <div style={{ background: COLORS.primaryContainer, borderRadius: m ? 16 : 24, padding: m ? "36px 24px" : "64px 72px", display: "flex", flexDirection: m ? "column" : "row", alignItems: m ? "stretch" : "center", justifyContent: "space-between", gap: m ? 28 : 48, overflow: "hidden" }}>
            <div style={{ maxWidth: m ? "100%" : 520 }}>
              <h2 style={{ fontFamily: FONTS.headline, fontSize: m ? 26 : 40, fontWeight: 800, color: "#fff", lineHeight: 1.15, marginBottom: 14 }}>Join the Vanguard of Sustainable Nigeria.</h2>
              <p style={{ fontSize: m ? 14 : 16, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 24 }}>Become a registered member and access professional networks, policy advocacy, and industry standards.</p>
              <div style={{ display: "flex", flexDirection: m ? "column" : "row", gap: 12 }}>
                <button style={{ background: COLORS.surface, color: COLORS.primary, padding: "14px 28px", borderRadius: 12, border: "none", fontFamily: FONTS.headline, fontWeight: 700, cursor: "pointer" }}>Apply for Membership</button>
                <button style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.4)", color: "#fff", padding: "14px 28px", borderRadius: 12, fontFamily: FONTS.headline, fontWeight: 700, cursor: "pointer" }}>Download Brochure</button>
              </div>
            </div>
            {!m && (
              <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", padding: 32, borderRadius: 16, border: "1px solid rgba(255,255,255,0.15)", maxWidth: 300 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: COLORS.secondary, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="verified" size={22} style={{ color: "#fff" }} /></div>
                  <span style={{ fontFamily: FONTS.headline, fontWeight: 700, color: "#fff" }}>Official Certifications</span>
                </div>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>Industry certifications that validate your recycling operations to global standards.</p>
              </div>
            )}
          </div>
        </FadeIn>
      </section>
    </>
  );
}