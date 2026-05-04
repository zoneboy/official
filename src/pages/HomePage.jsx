import { useState, useEffect, useMemo } from "react";
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon, HoverCard, SectionTag, SectionTitle, AccentBar, IconLinkButton, PrimaryButton, OutlineButton, NewsletterCTA } from "../components";
import { useCMSData } from "../data/useCMSData";

// Cloudinary URL transform helper — passes non-Cloudinary URLs through unchanged.
function cld(url, transform) {
  if (!url || typeof url !== "string") return url;
  const m = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/);
  if (!m) return url;
  if (/^[a-z]_[^/]+\//.test(m[2])) return url;
  return `${m[1]}${transform}/${m[2]}`;
}

const SLIDE_TRANSFORM = "w_1400,h_900,c_fill,q_auto,f_auto";

const BENEFITS = [
  { icon: "verified", title: "Professional Recognition", desc: "Gain industry-standard certifications and a formal voice in the national recycling ecosystem.", color: COLORS.primary },
  { icon: "hub", title: "Industry Networking", desc: "Connect with off-takers, technology providers, and fellow recyclers across all 36 states.", color: COLORS.secondary },
  { icon: "gavel", title: "Policy Influence", desc: "Active participation in government stakeholder meetings to shape national environmental laws.", color: COLORS.tertiary },
  { icon: "school", title: "Capacity Building", desc: "Access to training and capacity-building programs.", color: COLORS.primary },
  { icon: "handshake", title: "Business Support", desc: "Business development support and partnerships within the recycling value chain.", color: COLORS.secondary },
  { icon: "lightbulb", title: "Innovations & Funding", desc: "Updates on best practices, innovations, industry trends and funding opportunities.", color: COLORS.tertiary },
];

// ── Sights & Sounds: pulls the 5 most recent images across all galleries ──
function SightsAndSounds({ galleries, setPage, setCurrentGallery, m, pad }) {
  // Flatten gallery images, keeping a back-reference to the parent gallery so
  // a click can navigate to the right detail page. Sort galleries by date
  // descending and take up to 2 images per gallery so a single mega-gallery
  // doesn't dominate the slideshow. Cap at 5 total.
  const slides = useMemo(() => {
    if (!galleries || galleries.length === 0) return [];
    const sorted = [...galleries].sort((a, b) => {
      const da = new Date(a.date).getTime() || 0;
      const db = new Date(b.date).getTime() || 0;
      return db - da;
    });
    const collected = [];
    for (const g of sorted) {
      if (!g.images || g.images.length === 0) continue;
      for (let i = 0; i < Math.min(2, g.images.length); i++) {
        collected.push({ url: g.images[i], gallery: g });
        if (collected.length >= 5) break;
      }
      if (collected.length >= 5) break;
    }
    return collected;
  }, [galleries]);

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const total = slides.length;

  // Auto-advance every 5s, paused on hover or when the tab is hidden
  useEffect(() => {
    if (total <= 1 || paused) return;
    const start = () => {
      if (document.hidden) return null;
      return setInterval(() => setIdx((p) => (p + 1) % total), 5000);
    };
    let timer = start();
    const onVis = () => {
      if (timer) clearInterval(timer);
      timer = start();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [total, paused]);

  // Reset the loaded flag when the slide changes so the fade-in plays
  useEffect(() => { setLoaded(false); }, [idx]);

  // Preload the next slide so the transition feels instant
  useEffect(() => {
    if (total <= 1) return;
    const next = (idx + 1) % total;
    const im = new Image();
    im.src = cld(slides[next].url, SLIDE_TRANSFORM);
    return () => { im.src = ""; };
  }, [idx, slides, total]);

  if (total === 0) return null;

  const current = slides[idx];
  const currentUrl = cld(current.url, SLIDE_TRANSFORM);

  const goToGallery = (gallery) => {
    setCurrentGallery(gallery);
    window.scrollTo(0, 0);
  };

  const next = () => setIdx((p) => (p + 1) % total);
  const prev = () => setIdx((p) => (p === 0 ? total - 1 : p - 1));

  return (
    <section style={{ padding: m ? "60px 0" : "100px 0", background: COLORS.surfaceContainerLow }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: pad }}>
        <FadeIn>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: m ? 28 : 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <SectionTag>Sights & Sounds</SectionTag>
              <h2 style={{ fontFamily: FONTS.headline, fontSize: m ? 26 : 36, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.1, marginBottom: 8 }}>
                From our recent events
              </h2>
              <p style={{ color: COLORS.onSurfaceVariant, fontSize: m ? 14 : 16, maxWidth: 480, lineHeight: 1.6 }}>
                A glimpse into the conferences, workshops, and gatherings shaping Nigeria's circular economy.
              </p>
            </div>
            {!m && (
              <IconLinkButton icon="arrow_right_alt" onClick={() => { setPage("gallery"); window.scrollTo(0, 0); }}>
                View All Galleries
              </IconLinkButton>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            style={{
              position: "relative",
              borderRadius: m ? 12 : 16,
              overflow: "hidden",
              background: "#0a1410",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              aspectRatio: m ? "4/3" : "16/9",
            }}
          >
            {/* Main image — clickable, takes user to parent gallery's detail page */}
            <button
              type="button"
              onClick={() => goToGallery(current.gallery)}
              style={{
                position: "absolute", inset: 0, padding: 0, border: "none",
                background: "transparent", cursor: "pointer", display: "block",
              }}
              aria-label={`View ${current.gallery.title} gallery`}
            >
              <img
                key={currentUrl}
                src={currentUrl}
                alt={current.gallery.title}
                onLoad={() => setLoaded(true)}
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  opacity: loaded ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
              />
              {/* Gradient overlay for caption legibility */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 45%, transparent 70%)",
                pointerEvents: "none",
              }} />
              {/* Caption */}
              <div style={{
                position: "absolute", left: 0, right: 0, bottom: 0,
                padding: m ? "20px 20px 60px" : "32px 40px 72px",
                color: "#fff", textAlign: "left", pointerEvents: "none",
              }}>
                <span style={{
                  display: "inline-block", padding: "4px 12px", borderRadius: 20,
                  background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                  fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
                  marginBottom: 12,
                }}>
                  {current.gallery.date}
                </span>
                <h3 style={{
                  fontFamily: FONTS.headline, fontSize: m ? 20 : 28, fontWeight: 800,
                  lineHeight: 1.2, letterSpacing: "-0.5px", maxWidth: 680,
                }}>
                  {current.gallery.title}
                </h3>
              </div>
            </button>

            {/* Prev / Next controls */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous slide"
                  style={{
                    position: "absolute", left: m ? 12 : 20, top: "50%", transform: "translateY(-50%)",
                    width: m ? 40 : 48, height: m ? 40 : 48, borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", zIndex: 2,
                  }}
                >
                  <Icon name="chevron_left" size={m ? 22 : 28} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next slide"
                  style={{
                    position: "absolute", right: m ? 12 : 20, top: "50%", transform: "translateY(-50%)",
                    width: m ? 40 : 48, height: m ? 40 : 48, borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.3)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", zIndex: 2,
                  }}
                >
                  <Icon name="chevron_right" size={m ? 22 : 28} />
                </button>

                {/* Dot indicators */}
                <div style={{
                  position: "absolute", bottom: m ? 16 : 24, left: "50%",
                  transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 2,
                }}>
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIdx(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      style={{
                        width: i === idx ? 24 : 8, height: 8, borderRadius: 4,
                        background: i === idx ? "#fff" : "rgba(255,255,255,0.5)",
                        border: "none", cursor: "pointer", padding: 0,
                        transition: "width 0.3s, background 0.3s",
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </FadeIn>

        {/* Mobile-only "View All" link below the slideshow (better thumb reach) */}
        {m && (
          <FadeIn delay={0.2}>
            <div style={{ marginTop: 24, textAlign: "center" }}>
              <IconLinkButton icon="arrow_right_alt" onClick={() => { setPage("gallery"); window.scrollTo(0, 0); }}>
                View All Galleries
              </IconLinkButton>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
}

export default function HomePage({ setPage, setCurrentArticle, setCurrentGallery }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const { isMobile, isTablet } = useBreakpoints();
  const m = isMobile;
  const cols = m ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)";
  const pad = m ? "0 20px" : "0 32px";
  const nav = (p) => setPage(p);
  const openArticle = (article) => setCurrentArticle(article);

  const { events: ALL_EVENTS, articles: ALL_ARTICLES, galleries } = useCMSData();

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const activeEvents = ALL_EVENTS.filter((ev) => { const d = new Date(`${ev.month} ${ev.day}, ${ev.year}`); return d >= today; }).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: m ? 500 : 700, display: "flex", alignItems: "center", overflow: "hidden", background: "linear-gradient(135deg, rgba(10, 46, 12, 0.8) 0%, rgba(20, 83, 45, 0.7) 100%), url('/banner.png') center/cover no-repeat" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.07, backgroundImage: "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.3) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 800, padding: m ? "40px 20px" : "0 48px" }}>
          <FadeIn><h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 32 : 64, fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: m ? "-1px" : "-2px", marginBottom: 20 }}>Uniting Recycling Professionals, <span style={{ color: COLORS.primaryFixedDim }}>Standardizing</span> Nigeria's Circular Economy</h1></FadeIn>
          <FadeIn delay={0.15}><p style={{ fontSize: m ? 15 : 18, color: "rgba(255,255,255,0.75)", maxWidth: 560, lineHeight: 1.7, marginBottom: 28 }}>Advancing the interests of recycling entrepreneurs through provision of strategic resources, policy advocacy, standard setting, and collaborative innovation.</p></FadeIn>
          <FadeIn delay={0.3}><div style={{ display: "flex", flexDirection: m ? "column" : "row", gap: 12 }}>
            <PrimaryButton onClick={() => window.open("https://portal.recyclersassociation.org/","_blank","noopener,noreferrer")} style={m ? { width: "100%", textAlign: "center" } : {}}>Join RAN</PrimaryButton>
            <OutlineButton light onClick={() => nav("about")} style={m ? { width: "100%", textAlign: "center" } : {}}>Our Mission</OutlineButton>
          </div></FadeIn>
        </div>
        {!m && <><div style={{ position: "absolute", top: -80, right: -80, width: 500, height: 500, border: "2px solid rgba(119,221,106,0.08)", borderRadius: "50%" }} /><div style={{ position: "absolute", bottom: -120, right: 200, width: 300, height: 300, border: "1.5px solid rgba(119,221,106,0.05)", borderRadius: "50%" }} /></>}
      </section>

      {/* Benefits */}
      <section style={{ padding: m ? "60px 0" : "100px 0", background: COLORS.surface }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: pad }}>
          <FadeIn><div style={{ marginBottom: m ? 36 : 60 }}><SectionTag>Membership Value</SectionTag><SectionTitle>Driving Excellence in Waste Management</SectionTitle></div></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: m ? 16 : 24 }}>
            {BENEFITS.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.1}><HoverCard padding={m ? "28px 20px" : "40px"}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: `${b.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}><Icon name={b.icon} size={24} style={{ color: b.color }} /></div>
                <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 18 : 22, fontWeight: 700, marginBottom: 8 }}>{b.title}</h3>
                <p style={{ color: COLORS.onSurfaceVariant, lineHeight: 1.7, fontSize: m ? 14 : 16 }}>{b.desc}</p>
              </HoverCard></FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section style={{ padding: m ? "60px 0" : "100px 0", background: COLORS.surfaceContainerLow }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: pad }}>
          <FadeIn><h2 style={{ fontFamily: FONTS.headline, fontSize: m ? 26 : 36, fontWeight: 800, marginBottom: 8 }}>Upcoming Events</h2><AccentBar /></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: m ? 16 : 24 }}>
            {activeEvents.length > 0 ? activeEvents.map((ev, i) => (
              <FadeIn key={ev.id} delay={i * 0.1}>
                <div style={{ background: "#fff", borderRadius: 8, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: m ? 140 : 180, background: ev.image ? `url(${ev.image}) center/cover` : ev.gradient, position: "relative", cursor: ev.image ? "zoom-in" : "default" }} onClick={() => ev.image && setSelectedImage(ev.image)}>
                    <div style={{ position: "absolute", top: 12, left: 12, background: COLORS.primary, color: "#fff", borderRadius: 6, padding: "5px 10px", fontFamily: FONTS.headline, fontWeight: 800, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>{ev.month} {ev.day}</div>
                  </div>
                  <div style={{ padding: m ? 20 : 28, display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 16 : 18, fontWeight: 700, marginBottom: 8 }}>{ev.title}</h3>
                    <p style={{ color: COLORS.onSurfaceVariant, fontSize: 14, lineHeight: 1.6, marginBottom: 14, flex: 1 }}>{ev.desc}</p>
                    <IconLinkButton onClick={() => nav("events")}>More Info</IconLinkButton>
                  </div>
                </div>
              </FadeIn>
            )) : <FadeIn><div style={{ gridColumn: "1 / -1", padding: "40px 0" }}><p style={{ color: COLORS.onSurfaceVariant, fontSize: 15 }}>No upcoming events at this time.</p></div></FadeIn>}
          </div>
        </div>
      </section>

      {/* News */}
      <section style={{ padding: m ? "60px 0" : "100px 0", background: COLORS.surface }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: pad }}>
          <FadeIn><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: m ? 28 : 48, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontFamily: FONTS.headline, fontSize: m ? 24 : 36, fontWeight: 800 }}>Latest News & Insights</h2>
            <IconLinkButton icon="arrow_right_alt" onClick={() => nav("blog")} style={{ color: COLORS.onSurfaceVariant, fontSize: 14 }}>View All</IconLinkButton>
          </div></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: cols, gap: m ? 20 : 32 }}>
            {ALL_ARTICLES.length > 0 ? ALL_ARTICLES.slice(0, 3).map((a, i) => (
              <FadeIn key={a.id} delay={i * 0.1}><article>
                <div style={{ borderRadius: 12, height: m ? 160 : 200, background: a.image ? `url(${a.image}) center/cover` : a.gradient, marginBottom: 16, cursor: a.image ? "zoom-in" : "default" }} onClick={() => a.image && setSelectedImage(a.image)} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ background: a.tagBg, color: a.tagColor, padding: "3px 10px", borderRadius: 4, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{a.tag}</span>
                  <span style={{ fontSize: 12, color: COLORS.onSurfaceVariant }}>{a.date}</span>
                </div>
                <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 17 : 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>{a.title}</h3>
                <p style={{ color: COLORS.onSurfaceVariant, lineHeight: 1.7, marginBottom: 12, fontSize: 14 }}>{a.desc}</p>
                <a href={`/blog/${a.id}`} onClick={(e) => { e.preventDefault(); openArticle(a); }} style={{ color: COLORS.secondary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, textDecoration: "none" }}>Read Article</a>
              </article></FadeIn>
            )) : <FadeIn><div style={{ gridColumn: "1 / -1", padding: "20px 0" }}><p style={{ color: COLORS.onSurfaceVariant, fontSize: 15 }}>No news updates available.</p></div></FadeIn>}
          </div>
        </div>
      </section>

      {/* Sights & Sounds — gallery slideshow */}
      <SightsAndSounds galleries={galleries} setPage={setPage} setCurrentGallery={setCurrentGallery} m={m} pad={pad} />

      <NewsletterCTA />

      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", padding: 20 }}>
          <button onClick={() => setSelectedImage(null)} style={{ position: "absolute", top: m?24:40, right: m?24:40, background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Icon name="close" size={24} /></button>
          <img src={selectedImage} alt="Full view" style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 12, objectFit: "contain" }} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}
