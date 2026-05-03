import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon } from "../components";
import { useCMSData } from "../data/useCMSData";

// Mirror the slugify from App.jsx so <a href> values match the router.
function slugify(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Skeleton tile shown while CMS data loads
function SkeletonTile({ m }) {
  const shimmer = {
    background: `linear-gradient(90deg, ${COLORS.surfaceContainer} 0%, ${COLORS.surfaceContainerHigh} 50%, ${COLORS.surfaceContainer} 100%)`,
    backgroundSize: "200% 100%",
    animation: "ran-shimmer 1.4s ease-in-out infinite",
  };
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", background: COLORS.surfaceContainerLowest, border: `1px solid ${COLORS.outlineVariant}20` }}>
      <div style={{ ...shimmer, height: m ? 180 : 220 }} />
      <div style={{ padding: m ? 18 : 24 }}>
        <div style={{ ...shimmer, height: 14, width: "60%", borderRadius: 4, marginBottom: 10 }} />
        <div style={{ ...shimmer, height: 18, width: "90%", borderRadius: 4, marginBottom: 8 }} />
        <div style={{ ...shimmer, height: 18, width: "70%", borderRadius: 4 }} />
      </div>
    </div>
  );
}

export default function GalleryPage({ setPage, setCurrentGallery }) {
  const { isMobile, isTablet } = useBreakpoints();
  const m = isMobile;
  const cols = m ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)";
  const { galleries, loading } = useCMSData();

  const openGallery = (gallery) => {
    if (setCurrentGallery) setCurrentGallery(gallery);
  };

  return (
    <>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: m ? 260 : 380, display: "flex", alignItems: "center", background: COLORS.surface, padding: m ? "40px 20px" : "0 48px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${COLORS.primaryContainer}18 0%, transparent 70%)` }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 700 }}>
          <FadeIn>
            <span style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: `${COLORS.secondaryContainer}30`, color: COLORS.onSecondaryContainer, fontFamily: FONTS.headline, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>EVENT MEMORIES</span>
            <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 32 : 64, fontWeight: 800, color: COLORS.primary, lineHeight: 0.95, letterSpacing: m ? "-1px" : "-3px", marginBottom: 16 }}>Gallery</h1>
            <p style={{ fontSize: m ? 15 : 18, color: COLORS.onSurfaceVariant, maxWidth: 520, lineHeight: 1.7 }}>Relive the moments — videos and photos from our conferences, workshops, and industry gatherings.</p>
          </FadeIn>
        </div>
        {!m && <div style={{ position: "absolute", right: 60, bottom: -30, opacity: 0.05 }}><Icon name="photo_library" size={320} style={{ color: COLORS.primary }} /></div>}
      </section>

      {/* Grid */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: m ? "32px 20px 60px" : "48px 32px 80px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: m ? 16 : 24 }}>
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonTile key={i} m={m} />)}
          </div>
        ) : galleries.length === 0 ? (
          <FadeIn><div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${COLORS.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Icon name="photo_library" size={36} style={{ color: COLORS.primary }} />
            </div>
            <h2 style={{ fontFamily: FONTS.headline, fontSize: 24, fontWeight: 800, color: COLORS.onSurface, marginBottom: 10 }}>No galleries yet</h2>
            <p style={{ color: COLORS.onSurfaceVariant, fontSize: 15, maxWidth: 420, margin: "0 auto", lineHeight: 1.6 }}>Event galleries will appear here as they're published. Check back soon.</p>
          </div></FadeIn>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: m ? 16 : 24 }}>
            {galleries.map((g, i) => {
              const videoCount = g.videos.length;
              const imageCount = g.images.length;
              const totalItems = videoCount + imageCount;

              return (
                <FadeIn key={g.id} delay={i * 0.06}>
                  <a
                    href={`/gallery/${slugify(g.eventName || g.title)}`}
                    onClick={(e) => { e.preventDefault(); openGallery(g); }}
                    style={{ textDecoration: "none", color: "inherit", display: "block", height: "100%" }}
                  >
                    <article style={{
                      background: COLORS.surfaceContainerLowest,
                      borderRadius: 12,
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      border: `1px solid ${COLORS.outlineVariant}20`,
                      transition: "all 0.25s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.10)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.borderColor = `${COLORS.primary}30`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.borderColor = `${COLORS.outlineVariant}20`;
                    }}
                    >
                      {/* Cover */}
                      <div style={{
                        height: m ? 180 : 220,
                        background: g.coverImage ? `url(${g.coverImage}) center/cover` : g.gradient,
                        position: "relative",
                      }}>
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 50%)" }} />

                        {/* Item count badges */}
                        <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 6 }}>
                          {videoCount > 0 && (
                            <span style={{
                              background: "rgba(0,0,0,0.65)",
                              backdropFilter: "blur(8px)",
                              color: "#fff",
                              padding: "5px 10px",
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}>
                              <Icon name="play_circle" size={14} /> {videoCount}
                            </span>
                          )}
                          {imageCount > 0 && (
                            <span style={{
                              background: "rgba(0,0,0,0.65)",
                              backdropFilter: "blur(8px)",
                              color: "#fff",
                              padding: "5px 10px",
                              borderRadius: 8,
                              fontSize: 11,
                              fontWeight: 700,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}>
                              <Icon name="photo" size={14} /> {imageCount}
                            </span>
                          )}
                        </div>

                        {g.date && (
                          <div style={{ position: "absolute", bottom: 14, left: 14, color: "#fff", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, background: "rgba(0,0,0,0.4)", padding: "4px 10px", borderRadius: 6, backdropFilter: "blur(8px)" }}>
                            {g.date}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ padding: m ? 18 : 24, display: "flex", flexDirection: "column", flex: 1 }}>
                        <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 17 : 19, fontWeight: 800, color: COLORS.onSurface, lineHeight: 1.3, marginBottom: 8 }}>
                          {g.eventName || g.title}
                        </h3>
                        {g.description && (
                          <p style={{ color: COLORS.onSurfaceVariant, fontSize: 13, lineHeight: 1.6, flex: 1, marginBottom: 14 }}>
                            {g.description}
                          </p>
                        )}
                        <div style={{
                          color: COLORS.primary,
                          fontFamily: FONTS.headline,
                          fontWeight: 700,
                          fontSize: 13,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: "auto",
                        }}>
                          {totalItems > 0 ? "View Gallery" : "No media yet"}
                          {totalItems > 0 && <Icon name="arrow_forward" size={16} />}
                        </div>
                      </div>
                    </article>
                  </a>
                </FadeIn>
              );
            })}
          </div>
        )}
      </section>

      <style>{`
        @keyframes ran-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
