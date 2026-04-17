import { useMemo } from "react";
import DOMPurify from "dompurify";
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon } from "../components";
import { useCMSData } from "../data/useCMSData";

// ── Detect whether content is HTML (from the new WYSIWYG editor) or legacy plain text ──
function isHtmlContent(content) {
  if (!content) return false;
  if (Array.isArray(content)) return false;
  if (typeof content !== "string") return false;
  return /<(p|h[1-6]|ul|ol|li|blockquote|strong|em|a|img|br)\b/i.test(content);
}

// ── Legacy renderer for old plain-text articles (bullets start with •, headings end with :) ──
function LegacyContent({ paragraphs }) {
  if (!paragraphs || paragraphs.length === 0) {
    return <p>Content is currently being updated. Check back soon.</p>;
  }
  return (
    <>
      {paragraphs.map((paragraph, i) => {
        if (paragraph.startsWith("•")) {
          return (
            <div key={i} style={{ display: "flex", gap: 12, marginLeft: 16 }}>
              <span style={{ color: COLORS.primary, fontWeight: 800 }}>•</span>
              <p style={{ margin: 0 }}>{paragraph.replace("• ", "")}</p>
            </div>
          );
        }
        if (paragraph.endsWith(":")) {
          return (
            <h3 key={i} style={{ fontFamily: FONTS.headline, fontSize: 20, color: COLORS.onSurface, marginTop: 16, marginBottom: -8 }}>
              {paragraph}
            </h3>
          );
        }
        return <p key={i}>{paragraph}</p>;
      })}
    </>
  );
}

// ── HTML renderer with sanitization ──
function RichContent({ html, isMobile }) {
  const clean = useMemo(
    () =>
      DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          "p", "br", "strong", "em", "b", "i", "u",
          "h2", "h3", "h4",
          "ul", "ol", "li",
          "blockquote",
          "a",
          "img",
          "hr",
          "span",
        ],
        ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title", "style"],
        ALLOWED_URI_REGEXP: /^(https?:|mailto:|tel:|\/|#)/i,
        ADD_ATTR: ["target", "rel"],
      }),
    [html]
  );

  return (
    <div
      className="ran-article-content"
      dangerouslySetInnerHTML={{ __html: clean }}
      style={{ fontSize: isMobile ? 15 : 17, lineHeight: 1.85 }}
    />
  );
}

// ── Skeleton placeholder shown while CMS data loads ──
function ArticleSkeleton({ isMobile: m }) {
  const shimmer = {
    background: `linear-gradient(90deg, ${COLORS.surfaceContainer} 0%, ${COLORS.surfaceContainerHigh} 50%, ${COLORS.surfaceContainer} 100%)`,
    backgroundSize: "200% 100%",
    animation: "ran-shimmer 1.4s ease-in-out infinite",
    borderRadius: 6,
  };

  return (
    <article style={{ paddingBottom: 80, background: COLORS.surface, minHeight: "100vh" }}>
      {/* Hero placeholder */}
      <div style={{ height: m ? 240 : 380, background: COLORS.surfaceContainer, position: "relative" }} aria-hidden="true" />

      <div style={{ maxWidth: 840, margin: "0 auto", padding: m ? "32px 20px" : "48px 40px", marginTop: m ? -40 : -80, background: COLORS.surfaceContainerLowest, borderRadius: m ? 16 : 24, position: "relative", zIndex: 10, boxShadow: "0 12px 48px rgba(0,0,0,0.06)" }}>
        {/* Tag + date row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ ...shimmer, width: 80, height: 24, borderRadius: 24 }} />
          <div style={{ ...shimmer, width: 120, height: 14 }} />
        </div>

        {/* Title lines */}
        <div style={{ ...shimmer, width: "95%", height: m ? 30 : 46, marginBottom: 12 }} />
        <div style={{ ...shimmer, width: "75%", height: m ? 30 : 46, marginBottom: 28 }} />

        {/* Accent bar placeholder */}
        <div style={{ width: 80, height: 4, background: COLORS.outlineVariant, borderRadius: 2, marginBottom: 40 }} />

        {/* Body paragraphs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ ...shimmer, width: "100%", height: 14 }} />
          <div style={{ ...shimmer, width: "96%", height: 14 }} />
          <div style={{ ...shimmer, width: "90%", height: 14 }} />
          <div style={{ ...shimmer, width: "94%", height: 14 }} />
          <div style={{ ...shimmer, width: "60%", height: 14, marginBottom: 12 }} />
          <div style={{ ...shimmer, width: "100%", height: 14 }} />
          <div style={{ ...shimmer, width: "88%", height: 14 }} />
          <div style={{ ...shimmer, width: "92%", height: 14 }} />
        </div>
      </div>

      <style>{`
        @keyframes ran-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </article>
  );
}

// ── Not-found state (only shown after data has loaded and article is truly missing) ──
function NotFound({ setPage }) {
  return (
    <div style={{ padding: "100px 20px", textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${COLORS.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
        <Icon name="article" size={36} style={{ color: COLORS.primary }} />
      </div>
      <h2 style={{ fontFamily: FONTS.headline, fontSize: 28, fontWeight: 800, color: COLORS.onSurface, marginBottom: 10 }}>
        Article not found
      </h2>
      <p style={{ color: COLORS.onSurfaceVariant, fontSize: 15, maxWidth: 420, lineHeight: 1.6, marginBottom: 28 }}>
        This article may have been moved or removed. Browse our latest news and insights instead.
      </p>
      <button
        onClick={() => setPage("blog")}
        style={{ background: COLORS.primary, color: "#fff", padding: "12px 28px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: FONTS.headline, fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        <Icon name="arrow_back" size={18} /> Return to News
      </button>
    </div>
  );
}

export default function ArticlePage({ setPage, article }) {
  const { isMobile: m } = useBreakpoints();
  const { loading } = useCMSData();

  // Decision tree:
  //   1. Still loading and no article yet → skeleton (prevents the "not found" flash)
  //   2. Loaded but no article resolved → 404 UI
  //   3. Article found → render it
  if (loading && !article) {
    return <ArticleSkeleton isMobile={m} />;
  }

  if (!article) {
    return <NotFound setPage={setPage} />;
  }

  const rawContent = article.content;
  const contentAsString = Array.isArray(rawContent) ? rawContent.join("\n") : (rawContent || "");
  const useHtml = isHtmlContent(contentAsString);

  return (
    <article style={{ paddingBottom: 80, background: COLORS.surface, minHeight: "100vh" }}>
      <div style={{ height: m ? 240 : 380, background: article.image ? `url(${article.image}) center/cover` : article.gradient, position: "relative", display: "flex", alignItems: "flex-end", padding: m ? "24px 20px" : "48px 32px" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)" }} />
        <button
          onClick={() => { setPage("blog"); window.scrollTo(0, 0); }}
          style={{ position: "absolute", top: m ? 24 : 32, left: m ? 20 : 32, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "10px 18px", borderRadius: 24, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, cursor: "pointer", zIndex: 10 }}
        >
          <Icon name="arrow_back" size={18} /> Back to News
        </button>
      </div>

      <div style={{ maxWidth: 840, margin: "0 auto", padding: m ? "32px 20px" : "48px 40px", marginTop: m ? -40 : -80, background: COLORS.surfaceContainerLowest, borderRadius: m ? 16 : 24, position: "relative", zIndex: 10, boxShadow: "0 12px 48px rgba(0,0,0,0.06)" }}>
        <FadeIn>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ background: article.tagBg || `${COLORS.primary}15`, color: article.tagColor || COLORS.primary, padding: "6px 14px", borderRadius: 24, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5 }}>
              {article.tag}
            </span>
            <span style={{ color: COLORS.onSurfaceVariant, fontSize: 13, fontWeight: 600 }}>{article.date}</span>
          </div>

          <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 28 : 46, fontWeight: 800, color: COLORS.onSurface, lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 28 }}>
            {article.title}
          </h1>

          <div style={{ width: 80, height: 4, background: COLORS.secondary, borderRadius: 2, marginBottom: 40 }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 24, fontSize: m ? 15 : 17, color: COLORS.onSurfaceVariant, lineHeight: 1.85 }}>
            {useHtml ? (
              <RichContent html={contentAsString} isMobile={m} />
            ) : (
              <LegacyContent paragraphs={Array.isArray(rawContent) ? rawContent : contentAsString.split("\n").filter(p => p.trim())} />
            )}
          </div>

          {(article.author || article.company) && (
            <div style={{ marginTop: 48, paddingTop: 32, borderTop: `1px solid ${COLORS.outlineVariant}40`, display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 20, fontFamily: FONTS.headline, fontWeight: 800 }}>
                {article.author ? article.author.charAt(0) : "R"}
              </div>
              <div>
                <p style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 16, color: COLORS.onSurface, marginBottom: 4 }}>
                  {article.author || "RAN Contributor"}
                </p>
                {article.company && <p style={{ fontSize: 13, color: COLORS.onSurfaceVariant, marginBottom: 2 }}>{article.company}</p>}
                {article.phone && (
                  <a href={`tel:${article.phone.replace(/[^0-9+]/g, "")}`} style={{ fontSize: 13, color: COLORS.primary, fontWeight: 600, textDecoration: "none" }}>
                    {article.phone}
                  </a>
                )}
              </div>
            </div>
          )}
        </FadeIn>
      </div>

      {/* Scoped prose styles for rendered HTML content */}
      <style>{`
        .ran-article-content h2 {
          font-family: ${FONTS.headline};
          font-size: ${m ? "22px" : "28px"};
          font-weight: 800;
          color: ${COLORS.onSurface};
          margin: 32px 0 14px;
          line-height: 1.25;
          letter-spacing: -0.3px;
        }
        .ran-article-content h3 {
          font-family: ${FONTS.headline};
          font-size: ${m ? "18px" : "22px"};
          font-weight: 700;
          color: ${COLORS.onSurface};
          margin: 28px 0 12px;
          line-height: 1.3;
        }
        .ran-article-content h2:first-child,
        .ran-article-content h3:first-child { margin-top: 0; }
        .ran-article-content p {
          margin: 0 0 20px;
          color: ${COLORS.onSurfaceVariant};
        }
        .ran-article-content p:last-child { margin-bottom: 0; }
        .ran-article-content strong { color: ${COLORS.onSurface}; font-weight: 700; }
        .ran-article-content em { font-style: italic; }
        .ran-article-content a {
          color: ${COLORS.primary};
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 1.5px;
          font-weight: 600;
          transition: color 0.15s;
        }
        .ran-article-content a:hover {
          color: ${COLORS.secondary};
        }
        .ran-article-content ul,
        .ran-article-content ol {
          margin: 0 0 20px;
          padding-left: 28px;
          color: ${COLORS.onSurfaceVariant};
        }
        .ran-article-content ul li,
        .ran-article-content ol li {
          margin: 8px 0;
          padding-left: 4px;
        }
        .ran-article-content ul li::marker {
          color: ${COLORS.primary};
        }
        .ran-article-content ol li::marker {
          color: ${COLORS.primary};
          font-weight: 700;
        }
        .ran-article-content li p { margin: 0; }
        .ran-article-content blockquote {
          border-left: 4px solid ${COLORS.secondary};
          margin: 24px 0;
          font-style: italic;
          color: ${COLORS.onSurface};
          background: ${COLORS.surfaceContainerLow};
          border-radius: 0 8px 8px 0;
          padding: 16px 20px;
        }
        .ran-article-content blockquote p { margin: 0; }
        .ran-article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 24px 0;
          display: block;
        }
        .ran-article-content hr {
          border: none;
          border-top: 1px solid ${COLORS.outlineVariant}40;
          margin: 32px 0;
        }
      `}</style>
    </article>
  );
}
