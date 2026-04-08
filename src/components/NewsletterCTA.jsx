import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import Icon from "./Icon";
import FadeIn from "./FadeIn";

export default function NewsletterCTA() {
  const { isMobile } = useBreakpoints();
  return (
    <section style={{ padding: isMobile ? "40px 20px" : "80px 32px" }}>
      <FadeIn>
        <div style={{ maxWidth: 1200, margin: "0 auto", background: COLORS.primaryContainer, borderRadius: 16, padding: isMobile ? "40px 24px" : "64px 80px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -40, top: -40, opacity: 0.08 }}><Icon name="recycling" size={isMobile ? 160 : 280} style={{ color: "#fff" }} /></div>
          <div style={{ position: "relative", zIndex: 10, maxWidth: 560 }}>
            <h2 style={{ fontFamily: FONTS.headline, fontSize: isMobile ? 24 : 36, fontWeight: 800, color: "#fff", marginBottom: 14 }}>Stay informed about the circular economy</h2>
            <p style={{ color: COLORS.primaryFixedDim, fontSize: isMobile ? 14 : 17, marginBottom: 28, lineHeight: 1.6 }}>Subscribe to our monthly briefing for policy updates, industry news, and funding opportunities.</p>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 12 }}>
              <input type="email" placeholder="Your work email" style={{ flex: 1, padding: "14px 20px", borderRadius: 12, border: "none", fontSize: 14, outline: "none" }} />
              <button style={{ background: "#fff", color: COLORS.primary, padding: "14px 28px", borderRadius: 12, border: "none", fontFamily: FONTS.headline, fontWeight: 700, cursor: "pointer" }}>Subscribe</button>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
