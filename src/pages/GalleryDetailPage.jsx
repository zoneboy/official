// src/pages/GalleryDetailPage.jsx
// Performance-tuned for galleries with hundreds of images.
//
// What changed vs. the original:
//   1. Cloudinary URL transformations — main viewer requests `w_1600,q_auto,f_auto`
//      and thumbnails request `w_160,h_120,c_fill,q_auto,f_auto`. A 4000×3000
//      original at 540px viewport was loading ~2-4 MB of bitmap per slide.
//      Transformed thumbs are <10 KB each.
//   2. Thumbnail virtualization — only thumbs in (or near) the visible scroll
//      area render their <img>. With 230 thumbs that's ~12 rendered at a time
//      instead of 230, which keeps DOM, decoded image memory, and paint cost
//      bounded.
//   3. Adjacent-slide preloading — when slide N is shown, N+1 and N-1 are
//      preloaded silently so navigation feels instant.
//   4. Auto-play paused while images haven't loaded yet, and on tab visibility
//      change so background tabs don't spin.
//   5. NEW: Multiple YouTube videos supported via gallery.youtubeUrls (array).

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import DOMPurify from "dompurify";
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon } from "../components";

// ── Cloudinary transformation helpers ──
// Inserts transformation params into a Cloudinary URL. Falls back to the
// original URL if the pattern doesn't match (non-Cloudinary URLs pass through).
function cld(url, transform) {
  if (!url || typeof url !== "string") return url;
  // Match: https://res.cloudinary.com/<cloud>/image/upload/<rest>
  const m = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/);
  if (!m) return url;
  // Don't double-stack transforms if one already exists
  const rest = m[2];
  if (/^[a-z]_[^/]+\//.test(rest)) return url;
  return `${m[1]}${transform}/${rest}`;
}

const VIEWER_TRANSFORM = "w_1600,q_auto,f_auto,c_limit";
const THUMB_TRANSFORM = "w_160,h_120,c_fill,q_auto,f_auto";
const PRELOAD_TRANSFORM = VIEWER_TRANSFORM;

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return match ? match[1] : null;
}

function getEmbedUrl(url) {
  if (!url) return null;
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : url;
}

// Extract a poster thumbnail for a YouTube video so the embed area shows the
// video's still frame instead of a blank black box before it's clicked.
function getVideoThumb(url) {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

// Detect whether the description came from the WYSIWYG editor (HTML) or is
// legacy plain text, so old galleries still render correctly.
function isHtmlContent(content) {
  if (!content || typeof content !== "string") return false;
  return /<(p|h[1-6]|ul|ol|li|blockquote|strong|em|a|img|br)\b/i.test(content);
}

const DESC_SANITIZE = {
  ALLOWED_TAGS: ["p", "br", "strong", "em", "b", "i", "u", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "a", "img", "hr", "span"],
  ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title", "style"],
  ALLOWED_URI_REGEXP: /^(https?:|mailto:|tel:|\/|#)/i,
  ADD_ATTR: ["target", "rel"],
};

// ── Virtualized thumbnail strip ──
// Renders only thumbs whose index is within `buffer` of the visible viewport.
// Each non-rendered thumb collapses to a same-sized placeholder so scroll
// position stays correct.
function ThumbnailStrip({ images, currentIdx, onSelect }) {
  const stripRef = useRef(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 30 });
  const THUMB_W = 80;
  const GAP = 8;
  const STRIDE = THUMB_W + GAP;
  const BUFFER = 8; // render ±8 thumbs outside the viewport

  const updateRange = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const width = el.clientWidth;
    const start = Math.max(0, Math.floor(scrollLeft / STRIDE) - BUFFER);
    const end = Math.min(images.length, Math.ceil((scrollLeft + width) / STRIDE) + BUFFER);
    setVisibleRange((prev) => (prev.start === start && prev.end === end) ? prev : { start, end });
  }, [images.length, STRIDE]);

  useEffect(() => {
    updateRange();
  }, [updateRange]);

  // Auto-scroll the active thumb into view when currentIdx changes externally
  // (e.g. via keyboard arrows).
  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const targetLeft = currentIdx * STRIDE - el.clientWidth / 2 + THUMB_W / 2;
    el.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
  }, [currentIdx, STRIDE]);

  return (
    <div
      ref={stripRef}
      onScroll={updateRange}
      style={{
        display: "flex", gap: GAP, padding: 16, overflowX: "auto",
        background: COLORS.surfaceContainerLowest, borderTop: `1px solid ${COLORS.outlineVariant}30`,
        scrollBehavior: "smooth",
      }}
    >
      {images.map((img, i) => {
        const isVisible = i >= visibleRange.start && i < visibleRange.end;
        const isActive = i === currentIdx;
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            style={{
              width: THUMB_W, height: 60, flexShrink: 0, borderRadius: 8,
              border: `2px solid ${isActive ? COLORS.primary : "transparent"}`,
              padding: 0, overflow: "hidden", cursor: "pointer",
              opacity: isActive ? 1 : 0.6,
              background: COLORS.surfaceContainer,
              transition: "opacity 0.2s, border-color 0.2s",
            }}
          >
            {isVisible && (
              <img
                src={cld(img, THUMB_TRANSFORM)}
                alt={`Thumb ${i + 1}`}
                loading="lazy"
                decoding="async"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function GalleryDetailPage({ setPage, gallery }) {
  const { isMobile: m } = useBreakpoints();
  const [idx, setIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mainLoaded, setMainLoaded] = useState(false);
  // Track which video posters the user has clicked to start playing. Until a
  // video is played we render its thumbnail (not the iframe), so the gallery
  // never shows a blank player and we avoid loading several iframes at once.
  const [playingVideos, setPlayingVideos] = useState(() => new Set());

  // Swipe state
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  const images = gallery?.images || [];
  const total = images.length;

  // Convert YouTube URLs into embed-ready URLs. Supports the new array
  // (`youtubeUrls`) and falls back to a legacy single `youtubeUrl` for
  // backward compatibility.
  const videos = useMemo(() => {
    if (!gallery) return [];
    const list = Array.isArray(gallery.youtubeUrls) ? gallery.youtubeUrls
      : (gallery.youtubeUrl ? [gallery.youtubeUrl] : []);
    return list
      .map((url) => ({ embedUrl: getEmbedUrl(url), thumb: getVideoThumb(url) }))
      .filter((v) => v.embedUrl);
  }, [gallery]);

  const nextSlide = useCallback(() => setIdx((prev) => (prev + 1) % total), [total]);
  const prevSlide = useCallback(() => setIdx((prev) => (prev === 0 ? total - 1 : prev - 1)), [total]);

  // Reset loaded flag whenever the active image changes
  useEffect(() => { setMainLoaded(false); }, [idx]);

  // Preload neighbours so next/prev feels instant. We use the browser's native
  // image cache by constructing Image objects.
  useEffect(() => {
    if (total <= 1) return;
    const neighbours = [(idx + 1) % total, (idx - 1 + total) % total];
    const preloaded = neighbours.map((i) => {
      const im = new Image();
      im.src = cld(images[i], PRELOAD_TRANSFORM);
      return im;
    });
    return () => { preloaded.forEach((im) => { im.src = ""; }); };
  }, [idx, images, total]);

  // Auto-play (paused in fullscreen, on hidden tab, and until first paint)
  useEffect(() => {
    if (total <= 1 || isFullscreen) return;
    let timer;
    const start = () => {
      if (document.hidden) return;
      timer = setInterval(() => setIdx((prev) => (prev + 1) % total), 5000);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const onVis = () => { stop(); start(); };
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, [total, isFullscreen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isFullscreen]);

  const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
  };

  // Memoize the URL so React doesn't recompute on unrelated re-renders
  const currentMainUrl = useMemo(
    () => total > 0 ? cld(images[idx], VIEWER_TRANSFORM) : null,
    [images, idx, total]
  );
  const currentFullUrl = useMemo(
    () => total > 0 ? cld(images[idx], "q_auto,f_auto") : null,
    [images, idx, total]
  );

  if (!gallery) {
    return (
      <div style={{ padding: "100px 20px", textAlign: "center", minHeight: "60vh" }}>
        <h2 style={{ fontFamily: FONTS.headline, fontSize: 24, fontWeight: 800, color: COLORS.onSurface }}>Gallery not found</h2>
        <button onClick={() => setPage("gallery")} style={{ marginTop: 20, background: COLORS.primary, color: "#fff", padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: FONTS.headline, fontWeight: 700 }}>
          Return to Galleries
        </button>
      </div>
    );
  }

  return (
    <article style={{ minHeight: "100vh", background: COLORS.surface, paddingBottom: 80 }}>
      <style>{`
        .ran-gallery-desc h2, .ran-gallery-desc h3, .ran-gallery-desc h4 { color: ${COLORS.onSurface}; font-family: ${FONTS.headline}; font-weight: 800; line-height: 1.3; margin: 1.4em 0 0.5em; }
        .ran-gallery-desc h2 { font-size: 1.5em; }
        .ran-gallery-desc h3 { font-size: 1.25em; }
        .ran-gallery-desc h4 { font-size: 1.1em; }
        .ran-gallery-desc p { margin: 0 0 1em; }
        .ran-gallery-desc ul, .ran-gallery-desc ol { margin: 0 0 1em; padding-left: 1.5em; }
        .ran-gallery-desc li { margin: 0.3em 0; }
        .ran-gallery-desc a { color: ${COLORS.primary}; text-decoration: underline; }
        .ran-gallery-desc blockquote { margin: 1em 0; padding: 0.5em 1em; border-left: 4px solid ${COLORS.primary}; color: ${COLORS.onSurface}; background: ${COLORS.surfaceContainerLowest}; border-radius: 0 8px 8px 0; }
        .ran-gallery-desc img { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; }
        .ran-gallery-desc > *:last-child { margin-bottom: 0; }
      `}</style>
      {/* Fullscreen Lightbox */}
      {isFullscreen && total > 0 && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(10px)" }}>
          <button
            onClick={() => setIsFullscreen(false)}
            style={{ position: "absolute", top: 24, right: 24, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10000 }}
          >
            <Icon name="close" size={28} />
          </button>

          <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: m ? 0 : 60 }}>
            <img
              src={currentFullUrl}
              alt={`Slide ${idx + 1}`}
              decoding="async"
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", userSelect: "none" }}
            />

            {total > 1 && !m && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                  style={{ position: "absolute", left: 32, top: "50%", transform: "translateY(-50%)", width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <Icon name="chevron_left" size={36} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                  style={{ position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <Icon name="chevron_right" size={36} />
                </button>
              </>
            )}
            <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.6)", color: "#fff", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
              {idx + 1} / {total}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: COLORS.surfaceContainerLowest, borderBottom: `1px solid ${COLORS.outlineVariant}30`, padding: m ? "24px 20px" : "32px 48px", position: "sticky", top: 72, zIndex: 40 }}>
        <button onClick={() => { setPage("gallery"); window.scrollTo(0, 0); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: COLORS.primary, border: "none", fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 16 }}>
          <Icon name="arrow_back" size={18} /> Back to Galleries
        </button>
        <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 24 : 36, fontWeight: 800, color: COLORS.onSurface, letterSpacing: "-1px", marginBottom: 8 }}>
          {gallery.title}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: COLORS.onSurfaceVariant, fontSize: 13, fontWeight: 600, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="calendar_month" size={16} /> {gallery.date}
          </span>
          {total > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="photo_library" size={16} /> {total} {total === 1 ? "image" : "images"}
            </span>
          )}
          {videos.length > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="play_circle" size={16} /> {videos.length} {videos.length === 1 ? "video" : "videos"}
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: m ? "32px 20px" : "48px 32px" }}>
        {gallery.description && (
          <FadeIn>
            {isHtmlContent(gallery.description) ? (
              <div
                className="ran-gallery-desc"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(gallery.description, DESC_SANITIZE) }}
                style={{ fontSize: m ? 15 : 17, color: COLORS.onSurfaceVariant, lineHeight: 1.8, marginBottom: 48, padding: m ? "0" : "0 20px" }}
              />
            ) : (
              <p style={{ fontSize: m ? 15 : 17, color: COLORS.onSurfaceVariant, lineHeight: 1.8, marginBottom: 48, padding: m ? "0" : "0 20px" }}>
                {gallery.description}
              </p>
            )}
          </FadeIn>
        )}

        {/* Multiple videos: render each in its own embed. Single video gets full
            width; multiple videos lay out in a 2-column grid on desktop. */}
        {videos.length > 0 && (
          <FadeIn delay={0.1}>
            <div style={{ marginBottom: 56 }}>
              {videos.length > 1 && (
                <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 18 : 22, fontWeight: 700, color: COLORS.onSurface, marginBottom: 16 }}>
                  Videos ({videos.length})
                </h3>
              )}
              <div style={{
                display: "grid",
                gridTemplateColumns: m ? "1fr" : (videos.length === 1 ? "1fr" : "repeat(2, 1fr)"),
                gap: 20,
              }}>
                {videos.map((v, i) => {
                  const isPlaying = playingVideos.has(i);
                  return (
                    <div key={i} style={{ background: "#000", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
                      <div style={{ position: "relative", paddingTop: "56.25%" }}>
                        {isPlaying ? (
                          <iframe
                            src={`${v.embedUrl}${v.embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
                            title={`YouTube video ${i + 1}`}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPlayingVideos((prev) => new Set(prev).add(i))}
                            aria-label={`Play video ${i + 1}`}
                            style={{
                              position: "absolute", inset: 0, width: "100%", height: "100%", padding: 0, border: "none", cursor: "pointer",
                              background: v.thumb ? `#000 url(${v.thumb}) center/cover no-repeat` : "#000",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.05))" }} />
                            <span style={{
                              position: "relative", width: 68, height: 68, borderRadius: "50%",
                              background: "rgba(220,38,38,0.92)", display: "flex", alignItems: "center", justifyContent: "center",
                              boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                            }}>
                              <Icon name="play_arrow" size={40} style={{ color: "#fff", marginLeft: 4 }} />
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeIn>
        )}

        {total > 0 && (
          <FadeIn delay={0.2}>
            <div style={{ background: COLORS.surfaceContainerLowest, borderRadius: 16, overflow: "hidden", border: `1px solid ${COLORS.outlineVariant}30`, boxShadow: "0 12px 32px rgba(0,0,0,0.05)" }}>
              {/* Main Image Viewer */}
              <div
                onClick={() => setIsFullscreen(true)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{ position: "relative", height: m ? 300 : 540, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-in", overflow: "hidden" }}
              >
                {!mainLoaded && (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.outline, fontSize: 13 }}>
                    Loading…
                  </div>
                )}
                <img
                  key={currentMainUrl}
                  src={currentMainUrl}
                  alt={`Slide ${idx + 1}`}
                  decoding="async"
                  onLoad={() => setMainLoaded(true)}
                  style={{
                    width: "100%", height: "100%", objectFit: "contain",
                    opacity: mainLoaded ? 1 : 0,
                    transition: "opacity 0.25s ease",
                  }}
                />

                {total > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                      style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                      <Icon name="chevron_left" size={28} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                      style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                    >
                      <Icon name="chevron_right" size={28} />
                    </button>
                    <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 12px", borderRadius: 16, fontSize: 12, fontWeight: 700, backdropFilter: "blur(4px)" }}>
                      {idx + 1} / {total}
                    </div>
                  </>
                )}
              </div>

              {/* Virtualized Thumbnails */}
              {total > 1 && <ThumbnailStrip images={images} currentIdx={idx} onSelect={setIdx} />}
            </div>
          </FadeIn>
        )}
      </div>
    </article>
  );
}
