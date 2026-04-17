import { useState } from "react";
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon, PillButton, IconLinkButton, NewsletterCTA } from "../components";
import { useCMSData } from "../data/useCMSData";

const CATS = ["All Updates","National","State News","Spotlights","Insights"];

// Mirror the slugify from App.jsx so <a href> values look right.
// Kept in sync with the real routing logic.
function slugify(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function BlogPage({ setPage, setCurrentArticle }) {
  const [active, setActive] = useState("All Updates");
  const { isMobile: m, isTablet } = useBreakpoints();
  const cols = m ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)";
  const { articles: ALL_ARTICLES } = useCMSData();

  const openArticle = (article) => setCurrentArticle(article);

  const displayedArticles = active === "All Updates" ? ALL_ARTICLES : ALL_ARTICLES.filter(a => a.tag === active);
  const featured = ALL_ARTICLES.length > 0 ? ALL_ARTICLES[0] : null;

  return (
    <>
      {featured && <section style={{ maxWidth: 1200, margin: "0 auto", padding: m?"24px 20px 0":"48px 32px 0" }}>
        <FadeIn><div style={{ borderRadius: 12, overflow: "hidden", display: "grid", gridTemplateColumns: m?"1fr":"7fr 5fr", minHeight: m?"auto":480 }}>
          <div style={{ background: featured.image?`url(${featured.image}) center/cover`:featured.gradient, minHeight: m?180:"auto", position: "relative" }}><div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent)" }} /></div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: m?"28px 20px":56, background: COLORS.surfaceContainerLowest }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ background: COLORS.secondaryContainer, color: COLORS.onSecondaryContainer, padding: "4px 12px", borderRadius: 24, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5 }}>Latest Feature</span>
              <span style={{ fontSize: 12, color: COLORS.onSurfaceVariant }}>{featured.date}</span>
            </div>
            <h1 style={{ fontFamily: FONTS.headline, fontSize: m?24:40, fontWeight: 800, color: COLORS.primary, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 12 }}>{featured.title}</h1>
            <p style={{ color: COLORS.onSurfaceVariant, fontSize: m?14:16, lineHeight: 1.7, marginBottom: 20 }}>{featured.desc}</p>
            <a
              href={`/blog/${slugify(featured.title)}`}
              onClick={(e) => { e.preventDefault(); openArticle(featured); }}
              style={{ color: COLORS.primary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              Read Full Publication <Icon name="arrow_forward" size={16} />
            </a>
          </div>
        </div></FadeIn>
      </section>}

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: m?"32px 20px 60px":"48px 32px 80px" }}>
        <FadeIn><div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
          {CATS.map(c => <PillButton key={c} active={active===c} onClick={() => setActive(c)} style={m?{fontSize:12,padding:"8px 14px"}:{}}>{c}</PillButton>)}
        </div></FadeIn>
        <div style={{ display: "grid", gridTemplateColumns: cols, gap: m?16:24 }}>
          {displayedArticles.length > 0 ? displayedArticles.slice(active==="All Updates"?1:0).map((a, i) => (
            <FadeIn key={a.id} delay={i*0.06}><article style={{ display: "flex", flexDirection: "column", background: COLORS.surfaceContainerLow, borderRadius: 12, overflow: "hidden", height: "100%" }}>
              <a
                href={`/blog/${slugify(a.title)}`}
                onClick={(e) => { e.preventDefault(); openArticle(a); }}
                style={{ textDecoration: "none", color: "inherit", display: "block" }}
              >
                <div style={{ height: m?160:200, background: a.image?`url(${a.image}) center/cover`:a.gradient, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.1), transparent)" }} />
                  <div style={{ position: "absolute", top: 12, left: 12 }}><span style={{ background: "rgba(255,255,255,0.9)", color: a.tagColor||COLORS.primary, padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{a.tag}</span></div>
                </div>
              </a>
              <div style={{ padding: m?20:28, display: "flex", flexDirection: "column", flex: 1 }}>
                <time style={{ fontSize: 11, fontWeight: 500, color: COLORS.tertiary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>{a.date}</time>
                <h3 style={{ fontFamily: FONTS.headline, fontSize: m?16:18, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>
                  <a
                    href={`/blog/${slugify(a.title)}`}
                    onClick={(e) => { e.preventDefault(); openArticle(a); }}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {a.title}
                  </a>
                </h3>
                <p style={{ color: COLORS.onSurfaceVariant, fontSize: 13, lineHeight: 1.6, flex: 1, marginBottom: 14 }}>{a.desc}</p>
                <div style={{ borderTop: `1px solid ${COLORS.outlineVariant}20`, paddingTop: 12 }}>
                  <a
                    href={`/blog/${slugify(a.title)}`}
                    onClick={(e) => { e.preventDefault(); openArticle(a); }}
                    style={{ color: COLORS.primary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    Read More <Icon name="chevron_right" size={16} />
                  </a>
                </div>
              </div>
            </article></FadeIn>
          )) : <p style={{ color: COLORS.onSurfaceVariant, fontSize: 14 }}>No articles found for this category.</p>}

          {active === "All Updates" && <FadeIn delay={0.4}><NewsletterCTA compact /></FadeIn>}
        </div>
      </section>
    </>
  );
}
