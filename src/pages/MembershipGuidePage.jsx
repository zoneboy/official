import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon } from "../components";

const CATEGORIES = [
  { id: "associate", title: "Associate Members", icon: "person", color: COLORS.primary, desc: "Shall be persons in the business of recycling with integrity and genuine desire to share in the passion for a cleaner, habitable environment and sustainable development of Nigeria, Africa and the world, and defend the violation of it anywhere. They shall have the right to vote in accordance with the RAN Constitution and its Bye-Laws and be voted for into the office of State Co-Ordinator." },
  { id: "corporate", title: "Corporate Members", icon: "business", color: COLORS.secondary, desc: "Shall be organizations duly registered to operate recycling businesses in Nigeria. Corporate Members shall have the right to vote and be voted for in accordance with the provisions of the RAN Constitution and its Bye-Laws." },
  { id: "professional", title: "Professional Members", icon: "workspace_premium", color: COLORS.tertiary, desc: "Shall be outstanding persons, students, researchers in various recycling sectors whom the association desires to recommend as members proposed by the Executive Council and ratified by two-third majority votes of members at a General Meeting." },
  { id: "affiliate", title: "Affiliate Members", icon: "handshake", color: COLORS.primary, desc: "Shall be organizations, or other entities whose objectives align wholly or in part with those of the Association—whether in Nigeria, across Africa, or globally." },
  { id: "patrons", title: "Patrons", icon: "star", color: COLORS.secondary, desc: "Are prominent institutions that have contributed immensely to the growth of individuals and start-up industries within the recycling space in Nigeria." }
];

export default function MembershipGuidePage() {
  const { isMobile: m } = useBreakpoints();
  return (
    <div style={{ background: COLORS.surface, minHeight: "100vh", paddingBottom: 80 }}>
      <section style={{ background: COLORS.surfaceContainerLow, padding: m?"60px 20px":"100px 32px", textAlign: "center" }}>
        <FadeIn>
          <span style={{ color: COLORS.secondary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 16 }}>Membership Guide</span>
          <h1 style={{ fontFamily: FONTS.headline, fontSize: m?32:56, fontWeight: 800, color: COLORS.primary, letterSpacing: "-1px", marginBottom: 20 }}>Recyclers Association<br />Membership Categories</h1>
          <p style={{ color: COLORS.onSurfaceVariant, fontSize: m?15:18, maxWidth: 680, margin: "0 auto", lineHeight: 1.7 }}>Discover the different pathways to join our mission for a cleaner, sustainable, and economically vibrant Nigeria.</p>
        </FadeIn>
      </section>
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: m?"48px 20px":"80px 32px" }}>
        <FadeIn><h2 style={{ fontFamily: FONTS.headline, fontSize: m?24:32, fontWeight: 700, marginBottom: 40, borderLeft: `4px solid ${COLORS.secondary}`, paddingLeft: 16 }}>Types of Membership</h2></FadeIn>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {CATEGORIES.map((cat,i) => <FadeIn key={cat.id} delay={i*0.1}><div style={{ background: COLORS.surfaceContainerLowest, padding: m?24:40, borderRadius: 16, border: `1px solid ${COLORS.outlineVariant}40`, display: "flex", flexDirection: m?"column":"row", gap: m?16:28, alignItems: m?"flex-start":"center", boxShadow: "0 8px 32px rgba(0,0,0,0.03)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${cat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon name={cat.icon} size={36} style={{ color: cat.color }} /></div>
            <div><h3 style={{ fontFamily: FONTS.headline, fontSize: m?20:24, fontWeight: 800, marginBottom: 12, color: COLORS.onSurface }}>{cat.title}</h3><p style={{ fontSize: m?14:15, color: COLORS.onSurfaceVariant, lineHeight: 1.8 }}>{cat.desc}</p></div>
          </div></FadeIn>)}
        </div>
      </section>
    </div>
  );
}
