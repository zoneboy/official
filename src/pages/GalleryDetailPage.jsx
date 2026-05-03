import { useState, useEffect, useCallback, useRef } from "react";
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon } from "../components";
import { useCMSData } from "../data/useCMSData";

// ── YouTube URL → video ID extractor ──
// Handles: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID,
// youtube.com/shorts/ID, with or without query params.
function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();

  // Already just an ID? (11 chars, alphanumeric + - and _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

// Build embed URL with sensible defaults (no auto-play, modest branding)
function youTubeEmbedUrl(videoId) {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

// ── Slideshow component ──
// 5s auto-advance, pauses for 10s after manual navigation, full-image lightbox on click
function Slideshow({ images, isMobile: m }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const pauseTimeoutRef = useRef(null);
  const thumbStripRef = useRef(null);

  // Auto-advance every 5 seconds, but only when not paused, not in lightbox,
  // and only if there's more than one image to advance through.
  useEffect(() => {
    if (paused || lightboxOpen || images.length <= 1) return;
    const id = setTimeout(() => {
      setIndex(i => (i + 1) % images.length);
    }, 5000);
    return () => clearTimeout(id);
  }, [index, paused, lightboxOpen, images.length]);

  // After any manual interaction, pause auto-advance for 10s so the user has
  // time to look at what they navigated to.
  const pauseAuto = useCallback(() => {
    setPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => setPaused(false), 10000);
  }, []);

  const goPrev = useCallback(() => {
    setIndex(i => (i - 1 + images.length) % images.length);
    pauseAuto();
  }, [images.length, pauseAuto]);

  const goNext = useCallback(() => {
    setIndex(i => (i + 1) % images.length);
    pauseAuto();
  }, [images.length, pauseAuto]);

  const goTo = useCallback((i) => {
    setIndex(i);
    pauseAuto();
  }, [pauseAuto]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (lightboxOpen) {
        if (e.key === "Escape") setLightboxOpen(false);
        if (e.key === "ArrowLeft") goPrev();
        if (e.key === "ArrowRight") goNext();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, goPrev, goNext]);

  // Auto-scroll thumbnail strip to keep the active thumb in view
  useEffect(() => {
    if (!thumbStripRef.current) return;
    const strip = thumbStripRef.current;
    const activeThumb = strip.children[index];
    if (activeThumb) {
      const stripRect = strip.getBoundingClientRect();
      const thumbRect = activeThumb.getBoundingClientRect();
      if (thumbRect.left < stripRect.left || thumbRect.right > stripRect.right) {
        activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [index]);

  // Cleanup pause timeout on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  if (images.length === 0) return null;

  const currentImage = images[index];

  return (
    <div>
      {/* Main viewer */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: m ? "4/3" : "16/9",
        background: "#000",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 14,
      }}>
        {/* Image */}
        <img
          src={currentImage}
          alt={`Slide ${index + 1} of ${images.length}`}
          onClick={() => setLightboxOpen(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            cursor: "zoom-in",
            transition: "opacity 0.4s",
          }}
        />

        {/* Counter */}
        <div style={{
          position: "absolute",
          top: 14,
          right: 14,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(8px)",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: FONTS.headline,
        }}>
          {index + 1} / {images.length}
        </div>

        {/* Pause indicator (visible when user has manually navigated) */}
        {paused && images.length > 1 && (
          <div style={{
            position: "absolute",
            top: 14,
            left: 14,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: FONTS.headline,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}>
            <Icon name="pause" size={14} /> Paused
          </div>
        )}

        {/* Navigation arrows — only if more than one image */}
        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              aria-label="Previous image"
              style={{
                position: "absolute",
                left: m ? 8 : 16,
                top: "50%",
                transform: "translateY(-50%)",
                width: m ? 40 : 48,
                height: m ? 40 : 48,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.85)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.6)"}
            >
              <Icon name="chevron_left" size={m ? 22 : 28} />
            </button>

            <button
              onClick={goNext}
              aria-label="Next image"
              style={{
                position: "absolute",
                right: m ? 8 : 16,
                top: "50%",
                transform: "translateY(-50%)",
                width: m ? 40 : 48,
                height: m ? 40 : 48,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.85)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.6)"}
            >
              <Icon name="chevron_right" size={m ? 22 : 28} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          ref={thumbStripRef}
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 8,
            scrollSnapType: "x mandatory",
            scrollbarWidth: "thin",
          }}
          className="ran-thumb-strip"
        >
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                flexShrink: 0,
                width: m ? 64 : 80,
                height: m ? 48 : 60,
                borderRadius: 6,
                overflow: "hidden",
                border: i === index ? `2.5px solid ${COLORS.primary}` : "2.5px solid transparent",
                cursor: "pointer",
                padding: 0,
                background: "transparent",
                opacity: i === index ? 1 : 0.6,
                transition: "all 0.2s",
                scrollSnapAlign: "center",
              }}
              onMouseEnter={e => { if (i !== index) e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={e => { if (i !== index) e.currentTarget.style.opacity = "0.6"; }}
            >
              <img
                src={img}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          onClick={() => setLightboxOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.92)",
            backdropFilter: "blur(8px)",
            padding: 20,
          }}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
            style={{
              position: "absolute",
              top: m ? 20 : 32,
              right: m ? 20 : 32,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              width: 44,
              height: 44,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 2,
            }}
          >
            <Icon name="close" size={24} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                aria-label="Previous"
                style={{
                  position: "absolute",
                  left: m ? 12 : 32,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="chevron_left" size={28} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                aria-label="Next"
                style={{
                  position: "absolute",
                  right: m ? 12 : 32,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="chevron_right" size={28} />
              </button>
            </>
          )}

          <img
            src={currentImage}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              borderRadius: 8,
              objectFit: "contain",
            }}
          />

          <div style={{
            position: "absolute",
            bottom: m ? 20 : 32,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: FONTS.headline,
            background: "rgba(0,0,0,0.5)",
            padding: "8px 16px",
            borderRadius: 20,
          }}>
            {index + 1} / {images.length}
          </div>
        </div>
      )}

      <style>{`
        .ran-thumb-strip::-webkit-scrollbar {
          height: 6px;
        }
        .ran-thumb-strip::-webkit-scrollbar-track {
          background: ${COLORS.surfaceContainerLow};
          border-radius: 3px;
        }
        .ran-thumb-strip::-webkit-scrollbar-thumb {
          background: ${COLORS.outlineVariant};
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}

// ── Skeleton during load ──
function GallerySkeleton({ m }) {
  const shimmer = {
    background: `linear-gradient(90deg, ${COLORS.surfaceContainer} 0%, ${COLORS.surfaceContainerHigh} 50%, ${COLORS.surfaceContainer} 100%)`,
    backgroundSize: "200% 100%",
    animation: "ran-shimmer 1.4s ease-in-out infinite",
    borderRadius: 6,
  };
  return (
    <div style={{ minHeight: "100vh", background: COLORS.surface, paddingBottom: 80 }}>
      <div style={{ height: m ? 200 : 320, background: COLORS.surfaceContainer }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: m ? "32px 20px" : "48px 32px" }}>
        <div style={{ ...shimmer, width: "60%", height: m ? 30 : 44, marginBottom: 16 }} />
        <div style={{ ...shimmer, width: "85%", height: 14, marginBottom: 8 }} />
        <div style={{ ...shimmer, width: "70%", height: 14, marginBottom: 40 }} />
        <div style={{ ...shimmer, width: "100%", aspectRatio: "16/9", borderRadius: 12 }} />
      </div>
      <style>{`@keyframes ran-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </div>
  );
}

function NotFound({ setPage }) {
  return (
    <div style={{ padding: "100px 20px", textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${COLORS.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
        <Icon name="photo_library" size={36} style={{ color: COLORS.primary }} />
      </div>
      <h2 style={{ fontFamily: FONTS.headline, fontSize: 28, fontWeight: 800, color: COLORS.onSurface, marginBottom: 10 }}>
        Gallery not found
      </h2>
      <p style={{ color: COLORS.onSurfaceVariant, fontSize: 15, maxWidth: 420, lineHeight: 1.6, marginBottom: 28 }}>
        This gallery may have been moved or removed. Browse our other event galleries.
      </p>
      <button
        onClick={() => setPage("gallery")}
        style={{ background: COLORS.primary, color: "#fff", padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: FONTS.headline, fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        <Icon name="arrow_back" size={18} /> All Galleries
      </button>
    </div>
  );
}

export default function GalleryDetailPage({ setPage, gallery }) {
  const { isMobile: m } = useBreakpoints();
  const { loading } = useCMSData();

  if (loading && !gallery) return <GallerySkeleton m={m} />;
  if (!gallery) return <NotFound setPage={setPage} />;

  const validVideos = gallery.videos
    .map(v => ({ ...v, youtubeId: extractYouTubeId(v.url) }))
    .filter(v => v.youtubeId);

  const hasImages = gallery.images.length > 0;
  const hasVideos = validVideos.length > 0;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.surface, paddingBottom: 80 }}>
      {/* Hero */}
      <div style={{
        height: m ? 200 : 320,
        background: gallery.coverImage ? `url(${gallery.coverImage}) center/cover` : gallery.gradient,
        position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.1))" }} />
        <button
          onClick={() => { setPage("gallery"); window.scrollTo(0, 0); }}
          style={{
            position: "absolute",
            top: m ? 20 : 32,
            left: m ? 20 : 32,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(10px)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.25)",
            padding: "10px 18px",
            borderRadius: 24,
            fontFamily: FONTS.headline,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            zIndex: 10,
          }}
        >
          <Icon name="arrow_back" size={18} /> All Galleries
        </button>
      </div>

      {/* Header card */}
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: m ? "0 20px" : "0 32px",
        marginTop: m ? -30 : -60,
        position: "relative",
        zIndex: 10,
      }}>
        <FadeIn>
          <div style={{
            background: COLORS.surfaceContainerLowest,
            borderRadius: m ? 16 : 20,
            padding: m ? "24px 20px" : "36px 40px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
            border: `1px solid ${COLORS.outlineVariant}20`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
              <span style={{
                background: `${COLORS.primary}15`,
                color: COLORS.primary,
                padding: "5px 12px",
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1.5,
              }}>
                Event Gallery
              </span>
              {gallery.date && (
                <span style={{ color: COLORS.onSurfaceVariant, fontSize: 13, fontWeight: 600 }}>
                  {gallery.date}
                </span>
              )}
            </div>
            <h1 style={{
              fontFamily: FONTS.headline,
              fontSize: m ? 26 : 40,
              fontWeight: 800,
              color: COLORS.onSurface,
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
              marginBottom: gallery.description ? 12 : 0,
            }}>
              {gallery.eventName || gallery.title}
            </h1>
            {gallery.description && (
              <p style={{
                fontSize: m ? 14 : 16,
                color: COLORS.onSurfaceVariant,
                lineHeight: 1.7,
                maxWidth: 760,
              }}>
                {gallery.description}
              </p>
            )}

            {/* Stats row */}
            <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
              {hasVideos && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.onSurfaceVariant, fontSize: 13, fontWeight: 600 }}>
                  <Icon name="play_circle" size={18} style={{ color: COLORS.primary }} />
                  {validVideos.length} {validVideos.length === 1 ? "video" : "videos"}
                </div>
              )}
              {hasImages && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.onSurfaceVariant, fontSize: 13, fontWeight: 600 }}>
                  <Icon name="photo" size={18} style={{ color: COLORS.primary }} />
                  {gallery.images.length} {gallery.images.length === 1 ? "photo" : "photos"}
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Empty state if neither videos nor images */}
      {!hasVideos && !hasImages && (
        <FadeIn>
          <div style={{ maxWidth: 1100, margin: "60px auto 0", padding: m ? "60px 20px" : "80px 32px", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${COLORS.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Icon name="hourglass_empty" size={32} style={{ color: COLORS.primary }} />
            </div>
            <h3 style={{ fontFamily: FONTS.headline, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Media coming soon</h3>
            <p style={{ color: COLORS.onSurfaceVariant, fontSize: 15, maxWidth: 420, margin: "0 auto" }}>
              Photos and videos for this event will be uploaded shortly.
            </p>
          </div>
        </FadeIn>
      )}

      {/* Videos section */}
      {hasVideos && (
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: m ? "40px 20px 0" : "60px 32px 0" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <Icon name="play_circle" size={m ? 22 : 26} style={{ color: COLORS.primary }} />
              <h2 style={{ fontFamily: FONTS.headline, fontSize: m ? 22 : 28, fontWeight: 800, color: COLORS.onSurface }}>
                Videos
              </h2>
            </div>
          </FadeIn>
          <div style={{
            display: "grid",
            gridTemplateColumns: m ? "1fr" : validVideos.length === 1 ? "1fr" : "repeat(auto-fit, minmax(420px, 1fr))",
            gap: m ? 20 : 28,
          }}>
            {validVideos.map((v, i) => (
              <FadeIn key={v.id} delay={i * 0.08}>
                <div>
                  <div style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/9",
                    background: "#000",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  }}>
                    <iframe
                      src={youTubeEmbedUrl(v.youtubeId)}
                      title={v.title || `Video ${i + 1}`}
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                    />
                  </div>
                  {v.title && (
                    <p style={{
                      fontFamily: FONTS.headline,
                      fontSize: m ? 14 : 15,
                      fontWeight: 700,
                      color: COLORS.onSurface,
                      marginTop: 12,
                      lineHeight: 1.4,
                    }}>
                      {v.title}
                    </p>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* Images / Slideshow section */}
      {hasImages && (
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: m ? "40px 20px 0" : "60px 32px 0" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <Icon name="photo" size={m ? 22 : 26} style={{ color: COLORS.primary }} />
              <h2 style={{ fontFamily: FONTS.headline, fontSize: m ? 22 : 28, fontWeight: 800, color: COLORS.onSurface }}>
                Photos
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Slideshow images={gallery.images} isMobile={m} />
          </FadeIn>
        </section>
      )}
    </div>
  );
}
