// src/pages/GalleryPage.jsx
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon } from "../components";
import { useCMSData } from "../data/useCMSData";

export default function GalleryPage({ setPage, setCurrentGallery }) {
  const { isMobile: m, isTablet } = useBreakpoints();
  const { galleries, loading } = useCMSData();
  const cols = m ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)";

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: m ? "40px 20px 80px" : "60px 32px 100px", minHeight: "100vh" }}>
      <FadeIn>
        <span style={{ color: COLORS.secondary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Media</span>
        <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 36 : 56, fontWeight: 800, color: COLORS.primary, letterSpacing: "-1px", marginBottom: 20 }}>Event Galleries</h1>
        <p style={{ color: COLORS.onSurfaceVariant, fontSize: m ? 15 : 18, maxWidth: 600, lineHeight: 1.7, marginBottom: 48 }}>Highlights from our conferences, workshops, and national environmental campaigns.</p>
      </FadeIn>

      {loading ? (
        <p style={{ color: COLORS.onSurfaceVariant }}>Loading galleries...</p>
      ) : galleries.length === 0 ? (
        <FadeIn><div style={{ textAlign: "center", padding: "60px 20px", background: COLORS.surfaceContainerLowest, borderRadius: 16 }}>
          <Icon name="photo_library" size={48} style={{ color: COLORS.outlineVariant, marginBottom: 16 }} />
          <p style={{ color: COLORS.onSurfaceVariant, fontSize: 16, fontWeight: 600 }}>No galleries uploaded yet.</p>
        </div></FadeIn>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: m ? 16 : 24 }}>
          {galleries.map((g, i) => {
            const thumb = g.images.length > 0 ? g.images[0] : null;
            return (
              <FadeIn key={g.id} delay={i * 0.08}>
                <article style={{ background: COLORS.surfaceContainerLowest, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", border: `1px solid ${COLORS.outlineVariant}30`, transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  onClick={() => setCurrentGallery(g)}
                >
                  <div style={{ height: 220, background: thumb ? `url(${thumb}) center/cover` : g.gradient, position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", gap: 10 }}>
                      {g.images.length > 0 && <span style={{ background: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, backdropFilter: "blur(4px)" }}><Icon name="photo_library" size={14} /> {g.images.length}</span>}
                      {g.youtubeUrl && <span style={{ background: "rgba(220,38,38,0.8)", color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, backdropFilter: "blur(4px)" }}><Icon name="play_arrow" size={14} /> Video</span>}
                    </div>
                  </div>
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                    <span style={{ fontSize: 11, color: COLORS.secondary, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{g.date}</span>
                    <h3 style={{ fontFamily: FONTS.headline, fontSize: 18, fontWeight: 800, color: COLORS.onSurface, marginBottom: 8 }}>{g.title}</h3>
                    <p style={{ color: COLORS.onSurfaceVariant, fontSize: 13, lineHeight: 1.6, flex: 1 }}>{g.description.slice(0, 100)}{g.description.length > 100 ? "..." : ""}</p>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      )}
    </section>
  );
}