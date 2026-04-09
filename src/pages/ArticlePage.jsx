import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon } from "../components";

export default function ArticlePage({ setPage, article }) {
  const { isMobile: m } = useBreakpoints();

  // Safety fallback if no article is selected
  if (!article) {
    return (
      <div style={{ padding: "100px 20px", textAlign: "center", minHeight: "60vh" }}>
        <h2 style={{ fontFamily: FONTS.headline }}>Article not found</h2>
        <button 
          onClick={() => setPage("blog")}
          style={{ background: COLORS.primary, color: "#fff", padding: "12px 24px", borderRadius: 8, border: "none", marginTop: 20, cursor: "pointer", fontFamily: FONTS.headline, fontWeight: 700 }}
        >
          Return to News
        </button>
      </div>
    );
  }

  return (
    <article style={{ paddingBottom: 80, background: COLORS.surface, minHeight: "100vh" }}>
      {/* Header Banner */}
      <div style={{ height: m ? 240 : 380, background: article.image ? `url(${article.image}) center/cover` : article.gradient, position: "relative", display: "flex", alignItems: "flex-end", padding: m ? "24px 20px" : "48px 32px" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)" }} />
        
        <button 
          onClick={() => { setPage("blog"); window.scrollTo(0, 0); }}
          style={{ position: "absolute", top: m ? 24 : 32, left: m ? 20 : 32, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "10px 18px", borderRadius: 24, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "background 0.2s", zIndex: 10 }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.3)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
        >
          <Icon name="arrow_back" size={18} /> Back to News
        </button>
      </div>
      
      {/* Content Container */}
      <div style={{ maxWidth: 840, margin: "0 auto", padding: m ? "32px 20px" : "48px 40px", marginTop: m ? -40 : -80, background: COLORS.surfaceContainerLowest, borderRadius: m ? 16 : 24, position: "relative", zIndex: 10, boxShadow: "0 12px 48px rgba(0,0,0,0.06)" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: article.tagBg || `${COLORS.primary}15`, color: article.tagColor || COLORS.primary, padding: "6px 14px", borderRadius: 24, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5 }}>{article.tag}</span>
            <span style={{ color: COLORS.onSurfaceVariant, fontSize: 13, fontWeight: 600 }}>{article.date}</span>
          </div>
          
          <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 28 : 46, fontWeight: 800, color: COLORS.onSurface, lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 28 }}>
            {article.title}
          </h1>
          
          <div style={{ width: 80, height: 4, background: COLORS.secondary, borderRadius: 2, marginBottom: 40 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 24, fontSize: m ? 15 : 17, color: COLORS.onSurfaceVariant, lineHeight: 1.85 }}>
            {article.content ? (
              article.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))
            ) : (
              <p>Content is currently being updated by the secretariat. Check back soon.</p>
            )}
          </div>
        </FadeIn>
      </div>
    </article>
  );
}