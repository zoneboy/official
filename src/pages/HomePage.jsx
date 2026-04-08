import { COLORS, FONTS } from "../styles/tokens";
import { FadeIn, Icon, HoverCard, SectionTag, SectionTitle, AccentBar, IconLinkButton, PrimaryButton, OutlineButton, NewsletterCTA } from "../components";

const BENEFITS = [
  { icon: "verified", title: "Professional Recognition", desc: "Gain industry-standard certifications and a formal voice in the national recycling ecosystem.", color: COLORS.primary },
  { icon: "hub", title: "Industry Networking", desc: "Connect with off-takers, technology providers, and fellow recyclers across all 36 states.", color: COLORS.secondary },
  { icon: "gavel", title: "Policy Influence", desc: "Active participation in government stakeholder meetings to shape national environmental laws.", color: COLORS.tertiary },
];

const EVENTS_PREVIEW = [
  { date: "Nov 15", title: "Annual Recycling Forum", desc: "The flagship gathering of Nigeria's waste management leaders and international investors.", gradient: "linear-gradient(135deg, #C8E6C9, #81C784)" },
  { date: "Dec 02", title: "States Chapter Workshop", desc: "Technical training for state-level coordinators on operational standards and EPR compliance.", gradient: "linear-gradient(135deg, #FFE082, #FFC107)" },
  { date: "Jan 12", title: "Investors Networking Dinner", desc: "Bridging the gap between recycling innovators and sustainable finance institutions.", gradient: "linear-gradient(135deg, #90CAF9, #42A5F5)" },
];

const NEWS = [
  { tag: "Policy", tagBg: `${COLORS.secondaryContainer}20`, tagColor: COLORS.secondary, date: "March 28, 2026", title: "National Plastics Ban Policy Update", desc: "Analyzing the implications of the new federal directives on single-use plastics and the role of RAN members...", gradient: "linear-gradient(135deg, #81C784, #4CAF50)" },
  { tag: "Member Spotlight", tagBg: `${COLORS.primary}15`, tagColor: COLORS.primary, date: "March 15, 2026", title: "Member Spotlight: Lagos Innovators", desc: "How a small team in Mushin is revolutionizing PET collection using blockchain-based tracking systems...", gradient: "linear-gradient(135deg, #AED581, #8BC34A)" },
  { tag: "Economy", tagBg: `${COLORS.tertiary}15`, tagColor: COLORS.tertiary, date: "March 2, 2026", title: "Q1 Market Trends for Recyclables", desc: "A deep dive into global commodity prices for scrap metal and paper for Nigerian exporters...", gradient: "linear-gradient(135deg, #80CBC4, #4DB6AC)" },
];

export default function HomePage({ setPage }) {
  const nav = (p) => { setPage(p); window.scrollTo(0, 0); };
  return (
    <>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: 700, display: "flex", alignItems: "center", overflow: "hidden", background: "linear-gradient(135deg, #0a2e0c 0%, #14532d 50%, #1c871e 100%)" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 800, padding: "0 48px" }}>
          <FadeIn>
            <h1 style={{ fontFamily: FONTS.headline, fontSize: 64, fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: "-2px", marginBottom: 24 }}>
              Uniting Recycling Professionals, <span style={{ color: COLORS.primaryFixedDim }}>Standardizing</span> Nigeria's Circular Economy
            </h1>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", maxWidth: 560, lineHeight: 1.7, marginBottom: 36 }}>
              Advancing the interests of recycling entrepreneurs across the nation through policy advocacy, standard setting, and collaborative innovation.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div style={{ display: "flex", gap: 14 }}>
              <PrimaryButton onClick={() => nav("contact")}>Join RAN</PrimaryButton>
              <OutlineButton light onClick={() => nav("about")}>Our Mission</OutlineButton>
            </div>
          </FadeIn>
        </div>
        <div style={{ position: "absolute", top: -80, right: -80, width: 500, height: 500, border: "2px solid rgba(119,221,106,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: -120, right: 200, width: 300, height: 300, border: "1.5px solid rgba(119,221,106,0.05)", borderRadius: "50%" }} />
      </section>

      {/* Benefits */}
      <section style={{ padding: "100px 0", background: COLORS.surface }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 24 }}>
              <div style={{ maxWidth: 600 }}>
                <SectionTag>Membership Value</SectionTag>
                <SectionTitle>Driving Excellence in Waste Management</SectionTitle>
              </div>
              <p style={{ color: COLORS.onSurfaceVariant, maxWidth: 320, fontStyle: "italic", fontWeight: 500 }}>"Empowering the hands that heal our environment."</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {BENEFITS.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.1}>
                <HoverCard>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${b.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                    <Icon name={b.icon} size={28} style={{ color: b.color }} />
                  </div>
                  <h3 style={{ fontFamily: FONTS.headline, fontSize: 22, fontWeight: 700, marginBottom: 10 }}>{b.title}</h3>
                  <p style={{ color: COLORS.onSurfaceVariant, lineHeight: 1.7 }}>{b.desc}</p>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section style={{ padding: "100px 0", background: COLORS.surfaceContainerLow }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <FadeIn>
            <h2 style={{ fontFamily: FONTS.headline, fontSize: 36, fontWeight: 800, marginBottom: 8 }}>Upcoming Events</h2>
            <AccentBar />
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {EVENTS_PREVIEW.map((ev, i) => (
              <FadeIn key={ev.title} delay={i * 0.1}>
                <HoverCard bg="#fff" hoverBg="#fff" padding="0" radius={8}>
                  <div style={{ height: 180, background: ev.gradient, position: "relative", borderRadius: "8px 8px 0 0" }}>
                    <div style={{ position: "absolute", top: 14, left: 14, background: COLORS.primary, color: "#fff", borderRadius: 6, padding: "6px 12px", fontFamily: FONTS.headline, fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>{ev.date}</div>
                  </div>
                  <div style={{ padding: 28 }}>
                    <h3 style={{ fontFamily: FONTS.headline, fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{ev.title}</h3>
                    <p style={{ color: COLORS.onSurfaceVariant, fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{ev.desc}</p>
                    <IconLinkButton onClick={() => nav("events")}>More Info</IconLinkButton>
                  </div>
                </HoverCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section style={{ padding: "100px 0", background: COLORS.surface }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 48 }}>
              <h2 style={{ fontFamily: FONTS.headline, fontSize: 36, fontWeight: 800 }}>Latest News & Insights</h2>
              <IconLinkButton icon="arrow_right_alt" onClick={() => nav("blog")} style={{ color: COLORS.onSurfaceVariant, fontSize: 14 }}>View All News</IconLinkButton>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {NEWS.map((a, i) => (
              <FadeIn key={a.title} delay={i * 0.1}>
                <article style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 20, height: 200, background: a.gradient }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <span style={{ background: a.tagBg, color: a.tagColor, padding: "4px 10px", borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>{a.tag}</span>
                    <span style={{ fontSize: 12, color: COLORS.onSurfaceVariant }}>{a.date}</span>
                  </div>
                  <h3 style={{ fontFamily: FONTS.headline, fontSize: 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 10 }}>{a.title}</h3>
                  <p style={{ color: COLORS.onSurfaceVariant, lineHeight: 1.7, marginBottom: 16, flex: 1 }}>{a.desc}</p>
                  <a href="#" onClick={(e) => e.preventDefault()} style={{ color: COLORS.secondary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>Read Article</a>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <NewsletterCTA />
    </>
  );
}
