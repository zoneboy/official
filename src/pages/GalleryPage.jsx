// src/pages/GalleryPage.jsx
// Same logic as before — only difference is the card thumbnail now requests
// a Cloudinary-transformed version (`w_600,h_400,c_fill,q_auto,f_auto`) instead
// of the full-resolution original. With 230-image galleries the original
// could easily be a 4 MB file rendered into a 220px-tall card.
//
// NEW: The "Video" badge now reflects the count of YouTube videos attached.

import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon } from "../components";
import { useCMSData } from "../data/useCMSData";

// Cloudinary URL transform helper — passes non-Cloudinary URLs through unchanged.
function cld(url, transform) {
  if (!url || typeof url !== "string") return url;
  const m = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/);
  if (!m) return url;
  if (/^[a-z]_[^/]+\//.test(m[2])) return url;
  return `${m[1]}${transform}/${m[2]}`;
}

const CARD_THUMB = "w_600,h_400,c_fill,q_auto,f_auto";

// Pull a YouTube ID so video-only galleries can still show a real thumbnail.
function getYouTubeId(url) {
  if (!url || typeof url !== "string") return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

// Strip HTML tags from the (now rich-text) description for the card preview.
function stripHtml(html) {
  if (!html || typeof html !== "string") return "";
  return html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/\s+/g, " ").trim();
}

export default function GalleryPage({ setPage, setCurrentGallery }) {
  const { isMobile: m, isTablet } = useBreakpoints();
  const { galleries, loading } = useCMSData();
  const cols = m ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)";

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: m ? "40px 20px 80px" : "60px 32px 100px", minHeight: "100vh" }}>
      <FadeIn>
        <span style={{ color: COLORS.secondary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Media</span>
        <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 36 : 56, fontWeight: 800, color: COLORS.primary, letterSpacing: "-1px", marginBottom: 20 }}>Event Galleries</h1>
        <p style={{ color: COLORS.onSurfaceVariant, fontSize: m ? 15 : 18, maxWidth: 600, lineHeight: 1.7, marginBottom: 48 }}>
          Highlights from our conferences, workshops, and national environmental campaigns.
        </p>
      </FadeIn>

      {loading ? (
        <p style={{ color: COLORS.onSurfaceVariant }}>Loading galleries...</p>
      ) : galleries.length === 0 ? (
        <FadeIn>
          <div style={{ textAlign: "center", padding: "60px 20px", background: COLORS.surfaceContainerLowest, borderRadius: 16 }}>
            <Icon name="photo_library" size={48} style={{ color: COLORS.outlineVariant, marginBottom: 16 }} />
            <p style={{ color: COLORS.onSurfaceVariant, fontSize: 16, fontWeight: 600 }}>No galleries uploaded yet.</p>
          </div>
        </FadeIn>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: m ? 16 : 24 }}>
          {galleries.map((g, i) => {
            const videoCount = (g.youtubeUrls || []).length;
            const firstVideoId = (g.youtubeUrls || []).map(getYouTubeId).find(Boolean);
            // Prefer the first gallery image; if there are none, fall back to the
            // first video's YouTube thumbnail so the card is never blank.
            const thumb = g.images.length > 0
              ? cld(g.images[0], CARD_THUMB)
              : (firstVideoId ? `https://i.ytimg.com/vi/${firstVideoId}/hqdefault.jpg` : null);
            const isVideoThumb = g.images.length === 0 && !!firstVideoId;
            const descText = stripHtml(g.description);
            return (
              <FadeIn key={g.id} delay={i * 0.08}>
                <article
                  style={{ background: COLORS.surfaceContainerLowest, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", border: `1px solid ${COLORS.outlineVariant}30`, transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.06)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  onClick={() => setCurrentGallery(g)}
                >
                  <div style={{ height: 220, background: thumb ? `url(${thumb}) center/cover` : g.gradient, position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
                    {isVideoThumb && (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(220,38,38,0.92)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(0,0,0,0.4)" }}>
                          <Icon name="play_arrow" size={32} style={{ color: "#fff", marginLeft: 3 }} />
                        </span>
                      </div>
                    )}
                    <div style={{ position: "absolute", bottom: 16, left: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {g.images.length > 0 && (
                        <span style={{ background: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, backdropFilter: "blur(4px)" }}>
                          <Icon name="photo_library" size={14} /> {g.images.length}
                        </span>
                      )}
                      {videoCount > 0 && (
                        <span style={{ background: "rgba(220,38,38,0.8)", color: "#fff", padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, backdropFilter: "blur(4px)" }}>
                          <Icon name="play_arrow" size={14} /> {videoCount} {videoCount === 1 ? "Video" : "Videos"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ padding: 20, display: "flex", flexDirection: "column", flex: 1 }}>
                    <span style={{ fontSize: 11, color: COLORS.secondary, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{g.date}</span>
                    <h3 style={{ fontFamily: FONTS.headline, fontSize: 18, fontWeight: 800, color: COLORS.onSurface, marginBottom: 8 }}>{g.title}</h3>
                    <p style={{ color: COLORS.onSurfaceVariant, fontSize: 13, lineHeight: 1.6, flex: 1 }}>
                      {descText.slice(0, 100)}{descText.length > 100 ? "..." : ""}
                    </p>
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
