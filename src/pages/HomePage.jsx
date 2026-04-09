import { useState } from "react";
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon, HoverCard, SectionTag, SectionTitle, AccentBar, IconLinkButton, PrimaryButton, OutlineButton, NewsletterCTA } from "../components";
import { ALL_EVENTS } from "../data/events";
import { ALL_ARTICLES } from "../data/blog";

const BENEFITS = [
  { icon: "verified", title: "Professional Recognition", desc: "Gain industry-standard certifications and a formal voice in the national recycling ecosystem.", color: COLORS.primary },
  { icon: "hub", title: "Industry Networking", desc: "Connect with off-takers, technology providers, and fellow recyclers across all 36 states.", color: COLORS.secondary },
  { icon: "gavel", title: "Policy Influence", desc: "Active participation in government stakeholder meetings to shape national environmental laws.", color: COLORS.tertiary },
  { icon: "school", title: "Capacity Building", desc: "Access to training and capacity-building programs.", color: COLORS.primary },
  { icon: "handshake", title: "Business Support", desc: "Business development support and partnerships within the recycling value chain.", color: COLORS.secondary },
  { icon: "lightbulb", title: "Innovations & Funding", desc: "Updates on best practices, innovations, industry trends and funding opportunities.", color: COLORS.tertiary },
];

export default function HomePage({ setPage, setCurrentArticle }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const { isMobile, isTablet } = useBreakpoints();
  const m = isMobile;
  const cols = m ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";
  const pad = m ? "0 20px" : "0 32px";
  const nav = (p) => { setPage(p); window.scrollTo(0, 0); };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeEvents = ALL_EVENTS.filter((ev) => {
    const eventDate = new Date(`${ev.month} ${ev.day}, ${ev.year}`);
    return eventDate >= today;
  }).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: m ? 500 : 700, display: "flex", alignItems: "center", overflow: "hidden", background: "linear-gradient(135deg, #0a2e0c 0%, #14532d 50%, #1c871e 100%)" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 800, padding: m ? "40px 20px" : "0 48px" }}>
          <FadeIn>
            <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 32 : 64, fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: m ? "-1px" : "-2px", marginBottom: 20 }}>
              Uniting Recycling Professionals, <span style={{ color: COLORS.primaryFixedDim }}>Standardizing</span> Nigeria's Circular Economy
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p style={{ fontSize: m ? 15 : 18, color: "rgba(255,255,255,0.75)", maxWidth: 560, lineHeight: 1.7, marginBottom: 28 }}>
              Advancing the interests of recycling entrepreneurs through provision of strategic resources, policy advocacy, standard setting, and collaborative innovation.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div style={{ display: "flex", flexDirection: m ? "column" : "row", gap: 12 }}>
              <PrimaryButton onClick={() => window.open("https://portal.recyclersassociation.org/", "_blank", "noopener,noreferrer")} style={m ? { width: "100%", textAlign: "center" } : {}}>Join RAN</PrimaryButton>
              <OutlineButton light onClick={() => nav("about")} style={m ? { width: "100%", textAlign: "center" } : {}}>Our Mission</OutlineButton>
            </div>
          </FadeIn>
        </div>
        {!m && <><div style={{ position: "absolute", top: -80, right: -80, width: 500, height: 500, border: "2px solid rgba(119,221,106,0.08)", borderRadius: "50%" }} /><div style={{ position: "absolute", bottom: -120, right: 200, width: 300, height: 300, border: "1.5px solid rgba(119,221,106,0.05)", borderRadius: "50%" }} /></>}
      </section>

      {/* Benefits */}
      <section style={{ padding: m ? "60px 0" : "100px 0", background: COLORS.surface }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: pad }}>
          <FadeIn>
            <div style={{ marginBottom: m ? 36 : 60 }}>
              <SectionTag>Membership Value</SectionTag>
              <SectionTitle>Driving Excellence in Waste Management</SectionTitle>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: m ? 16 : 24 }}>
            {BENEFITS.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.1}>
                <HoverCard padding={m ? "28px 20px" : "40px"}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${b.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <Icon name={b.icon} size={24} style={{ color: b.color }} />
                  </div>
                  <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 18 : 22, fontWeight: 700, marginBottom: 8 }}>{b.title}</h3>
                  <p style={{ color: COLORS.onSurfaceVariant, lineHeight: 1.7, fontSize: m ? 14 : 16 }}>{b.desc}</p>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section style={{ padding: m ? "60px 0" : "100px 0", background: COLORS.surfaceContainerLow }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: pad }}>
          <FadeIn>
            <h2 style={{ fontFamily: FONTS.headline, fontSize: m ? 26 : 36, fontWeight: 800, marginBottom: 8 }}>Upcoming Events</h2>
            <AccentBar />
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: m ? 16 : 24 }}>
            {activeEvents.length > 0 ? (
              activeEvents.map((ev, i) => (
                <FadeIn key={ev.id} delay={i * 0.1}>
                  <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                    
                    <div 
                      style={{ 
                        height: m ? 140 : 180, 
                        background: ev.image ? `url(${ev.image}) center/cover` : ev.gradient, 
                        position: "relative",
                        cursor: ev.image ? "zoom-in" : "default" 
                      }}
                      onClick={() => ev.image && setSelectedImage(ev.image)}
                    >
                      <div style={{ position: "absolute", top: 12, left: 12, background: COLORS.primary, color: "#fff", borderRadius: 6, padding: "5px 10px", fontFamily: FONTS.headline, fontWeight: 800, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>{ev.month} {ev.day}</div>
                    </div>

                    <div style={{ padding: m ? 20 : 28, display: "flex", flexDirection: "column", flex: 1 }}>
                      <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 16 : 18, fontWeight: 700, marginBottom: 8 }}>{ev.title}</h3>
                      <p style={{ color: COLORS.onSurfaceVariant, fontSize: 14, lineHeight: 1.6, marginBottom: 14, flex: 1 }}>{ev.desc}</p>
                      <IconLinkButton onClick={() => nav("events")}>More Info</IconLinkButton>
                    </div>
                  </div>
                </FadeIn>
              ))
            ) : (
              <FadeIn>
                <div style={{ gridColumn: "1 / -1", padding: "40px 0" }}>
                  <p style={{ color: COLORS.onSurfaceVariant, fontSize: 15 }}>There are no upcoming events at this time. Please check back later.</p>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* News */}
      <section style={{ padding: m ? "60px 0" : "100px 0", background: COLORS.surface }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: pad }}>
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: m ? 28 : 48, flexWrap: "wrap", gap: 12 }}>
              <h2 style={{ fontFamily: FONTS.headline, fontSize: m ? 24 : 36, fontWeight: 800 }}>Latest News & Insights</h2>
              <IconLinkButton icon="arrow_right_alt" onClick={() => nav("blog")} style={{ color: COLORS.onSurfaceVariant, fontSize: 14 }}>View All</IconLinkButton>
            </div>
          </FadeIn>
          
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: m ? 20 : 32 }}>
            {ALL_ARTICLES.length > 0 ? (
              ALL_ARTICLES.slice(0, 3).map((a, i) => (
                <FadeIn key={a.id} delay={i * 0.1}>
                  <article>
                    <div 
                      style={{ 
                        borderRadius: 12, 
                        height: m ? 160 : 200, 
                        background: a.image ? `url(${a.image}) center/cover` : a.gradient, 
                        marginBottom: 16,
                        cursor: a.image ? "zoom-in" : "default" 
                      }} 
                      onClick={() => a.image && setSelectedImage(a.image)}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ background: a.tagBg, color: a.tagColor, padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{a.tag}</span>
                      <span style={{ fontSize: 12, color: COLORS.onSurfaceVariant }}>{a.date}</span>
                    </div>
                    <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 17 : 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>{a.title}</h3>
                    <p style={{ color: COLORS.onSurfaceVariant, lineHeight: 1.7, marginBottom: 12, fontSize: 14 }}>{a.desc}</p>
                    <a href="#" onClick={(e) => {
                      e.preventDefault();
                      setCurrentArticle(a);
                      setPage("article");
                      window.scrollTo(0, 0);
                    }} style={{ color: COLORS.secondary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>Read Article</a>
                  </article>
                </FadeIn>
              ))
            ) : (
              <FadeIn>
                <div style={{ gridColumn: "1 / -1", padding: "20px 0" }}>
                  <p style={{ color: COLORS.onSurfaceVariant, fontSize: 15 }}>No news updates available at the moment.</p>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      <NewsletterCTA />

      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(6px)",
            padding: 20
          }}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            style={{ position: "absolute", top: m ? 24 : 40, right: m ? 24 : 40, background: "rgba(255, 255, 255, 0.15)", border: "none", color: "#fff", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"}
          >
            <Icon name="close" size={24} />
          </button>
          <img 
            src={selectedImage} 
            alt="Full view" 
            style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 12, objectFit: "contain", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }} 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
}