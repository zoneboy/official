// src/pages/GalleryDetailPage.jsx
import { useState, useEffect } from "react";
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon } from "../components";

function getEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : url;
}

export default function GalleryDetailPage({ setPage, gallery }) {
  const { isMobile: m } = useBreakpoints();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!gallery || !gallery.images || gallery.images.length <= 1) return;
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % gallery.images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [gallery, idx]); 

  if (!gallery) {
    return (
      <div style={{ padding: "100px 20px", textAlign: "center", minHeight: "60vh" }}>
        <h2 style={{ fontFamily: FONTS.headline, fontSize: 24, fontWeight: 800, color: COLORS.onSurface }}>Gallery not found</h2>
        <button onClick={() => setPage("gallery")} style={{ marginTop: 20, background: COLORS.primary, color: "#fff", padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: FONTS.headline, fontWeight: 700 }}>Return to Galleries</button>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(gallery.youtubeUrl);
  const images = gallery.images || [];

  return (
    <article style={{ minHeight: "100vh", background: COLORS.surface, paddingBottom: 80 }}>
      <div style={{ background: COLORS.surfaceContainerLowest, borderBottom: `1px solid ${COLORS.outlineVariant}30`, padding: m ? "24px 20px" : "32px 48px", position: "sticky", top: 72, zIndex: 40 }}>
        <button onClick={() => { setPage("gallery"); window.scrollTo(0, 0); }} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", color: COLORS.primary, border: "none", fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 16 }}>
          <Icon name="arrow_back" size={18} /> Back to Galleries
        </button>
        <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 24 : 36, fontWeight: 800, color: COLORS.onSurface, letterSpacing: "-1px", marginBottom: 8 }}>{gallery.title}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: COLORS.onSurfaceVariant, fontSize: 13, fontWeight: 600 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="calendar_month" size={16} /> {gallery.date}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: m ? "32px 20px" : "48px 32px" }}>
        {gallery.description && (
          <FadeIn><p style={{ fontSize: m ? 15 : 17, color: COLORS.onSurfaceVariant, lineHeight: 1.8, marginBottom: 48, padding: m ? "0" : "0 20px" }}>{gallery.description}</p></FadeIn>
        )}

        {embedUrl && (
          <FadeIn delay={0.1}><div style={{ marginBottom: 56, background: "#000", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              <iframe src={embedUrl} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} />
            </div>
          </div></FadeIn>
        )}

        {images.length > 0 && (
          <FadeIn delay={0.2}><div style={{ background: COLORS.surfaceContainerLowest, borderRadius: 16, overflow: "hidden", border: `1px solid ${COLORS.outlineVariant}30`, boxShadow: "0 12px 32px rgba(0,0,0,0.05)" }}>
            <div style={{ position: "relative", height: m ? 300 : 540, background: COLORS.surfaceContainerHigh, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={images[idx]} alt={`Slide ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain", background: "#111" }} />
              
              {images.length > 1 && <>
                <button onClick={() => setIdx(idx === 0 ? images.length - 1 : idx - 1)} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.4)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}><Icon name="chevron_left" size={28} /></button>
                <button onClick={() => setIdx((idx + 1) % images.length)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.4)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.4)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}><Icon name="chevron_right" size={28} /></button>
                
                <div style={{ position: "absolute", bottom: 16, right: 16, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 12px", borderRadius: 16, fontSize: 12, fontWeight: 700, backdropFilter: "blur(4px)" }}>
                  {idx + 1} / {images.length}
                </div>
              </>}
            </div>

            {images.length > 1 && (
              <div style={{ display: "flex", gap: 8, padding: 16, overflowX: "auto", background: COLORS.surfaceContainerLowest, borderTop: `1px solid ${COLORS.outlineVariant}30` }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setIdx(i)} style={{ width: 80, height: 60, flexShrink: 0, borderRadius: 8, border: `2px solid ${i === idx ? COLORS.primary : "transparent"}`, padding: 0, overflow: "hidden", cursor: "pointer", opacity: i === idx ? 1 : 0.5, transition: "all 0.2s" }}>
                    <img src={img} alt={`Thumb ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div></FadeIn>
        )}
      </div>
    </article>
  );
}