import { useState } from "react";
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon } from "../components";
import { useCMSData } from "../data/useCMSData";

const CATS = ["All", "Newsletter", "Report", "Policy", "General"];
const CAT_ICONS = { Newsletter: "newspaper", Report: "assessment", Policy: "gavel", General: "folder" };
const CAT_COLORS = { Newsletter: COLORS.secondary, Report: COLORS.primary, Policy: COLORS.tertiary, General: COLORS.onSurfaceVariant };
const ITEMS_PER_PAGE = 5;

export default function ResourcesPage() {
  const { isMobile: m } = useBreakpoints();
  const { resources, loading } = useCMSData();
  const [active, setActive] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = active === "All" ? resources : resources.filter(r => r.category === active);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset to page 1 when filter changes
  const handleFilter = (cat) => { setActive(cat); setPage(1); };

  return (
    <>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: m ? 260 : 380, display: "flex", alignItems: "center", background: COLORS.surface, padding: m ? "40px 20px" : "0 48px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${COLORS.primaryContainer}18 0%, transparent 70%)` }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 700 }}>
          <FadeIn>
            <span style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: `${COLORS.secondaryContainer}30`, color: COLORS.onSecondaryContainer, fontFamily: FONTS.headline, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>DOWNLOADS</span>
            <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 32 : 64, fontWeight: 800, color: COLORS.primary, lineHeight: 0.95, letterSpacing: m ? "-1px" : "-3px", marginBottom: 16 }}>Resources</h1>
            <p style={{ fontSize: m ? 15 : 18, color: COLORS.onSurfaceVariant, maxWidth: 520, lineHeight: 1.7 }}>Access newsletters, reports, policy documents, and other downloadable materials from RAN.</p>
          </FadeIn>
        </div>
        {!m && <div style={{ position: "absolute", right: 60, bottom: -30, opacity: 0.05 }}><Icon name="cloud_download" size={320} style={{ color: COLORS.primary }} /></div>}
      </section>

      {/* Filters */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: m ? "28px 20px 0" : "48px 32px 0" }}>
        <FadeIn>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
            {CATS.map(c => (
              <button key={c} onClick={() => handleFilter(c)} style={{
                padding: m ? "8px 14px" : "10px 20px", borderRadius: 24, border: `1.5px solid ${active === c ? COLORS.primary : COLORS.outlineVariant + "40"}`,
                background: active === c ? COLORS.primary : "transparent", color: active === c ? "#fff" : COLORS.onSurfaceVariant,
                fontFamily: FONTS.headline, fontWeight: 700, fontSize: m ? 12 : 13, cursor: "pointer", transition: "all 0.2s"
              }}>{c}</button>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* Resource List */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: m ? "0 20px 60px" : "0 32px 80px" }}>
        {loading ? (
          <p style={{ color: COLORS.onSurfaceVariant, textAlign: "center", padding: "40px 0" }}>Loading resources...</p>
        ) : paginated.length === 0 ? (
          <FadeIn><div style={{ textAlign: "center", padding: "60px 20px" }}>
            <Icon name="folder_open" size={48} style={{ color: COLORS.outlineVariant, marginBottom: 16, display: "block", margin: "0 auto 16px" }} />
            <p style={{ color: COLORS.onSurfaceVariant, fontSize: 16, fontWeight: 600 }}>No resources found{active !== "All" ? ` for "${active}"` : ""}.</p>
            <p style={{ color: COLORS.outline, fontSize: 14, marginTop: 6 }}>Check back later for new uploads.</p>
          </div></FadeIn>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {paginated.map((r, i) => {
              const catColor = CAT_COLORS[r.category] || CAT_COLORS.General;
              const catIcon = CAT_ICONS[r.category] || CAT_ICONS.General;
              return (
                <FadeIn key={r.id} delay={i * 0.06}>
                  <div style={{
                    display: "flex", alignItems: m ? "flex-start" : "center", gap: m ? 14 : 20,
                    padding: m ? "20px 16px" : "24px 28px", background: COLORS.surfaceContainerLowest,
                    borderRadius: 12, border: `1px solid ${COLORS.outlineVariant}20`,
                    transition: "box-shadow 0.2s, transform 0.2s", cursor: "default",
                    flexDirection: m ? "column" : "row"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                  >
                    {/* Icon */}
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${catColor}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={catIcon} size={24} style={{ color: catColor }} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                        <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 16 : 18, fontWeight: 700, color: COLORS.onSurface }}>{r.title}</h3>
                        <span style={{ padding: "2px 10px", borderRadius: 20, background: `${catColor}15`, color: catColor, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{r.category}</span>
                      </div>
                      {r.description && <p style={{ color: COLORS.onSurfaceVariant, fontSize: 13, lineHeight: 1.6, marginBottom: 4 }}>{r.description}</p>}
                      {r.date && <p style={{ fontSize: 11, color: COLORS.outline, fontWeight: 600 }}>{r.date}</p>}
                    </div>

                    {/* Download Button */}
                    {r.fileUrl ? (
                      <a href={r.fileUrl} download style={{
                        display: "inline-flex", alignItems: "center", gap: 8, padding: m ? "10px 20px" : "12px 24px",
                        borderRadius: 10, background: COLORS.primary, color: "#fff", textDecoration: "none",
                        fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, flexShrink: 0,
                        transition: "opacity 0.2s", whiteSpace: "nowrap"
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                      >
                        <Icon name="download" size={18} style={{ color: "#fff" }} />
                        Download
                      </a>
                    ) : (
                      <span style={{ padding: "10px 20px", borderRadius: 10, background: COLORS.surfaceContainerHigh, color: COLORS.outline, fontFamily: FONTS.headline, fontWeight: 600, fontSize: 12, flexShrink: 0 }}>Coming Soon</span>
                    )}
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <FadeIn delay={0.2}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 36, flexWrap: "wrap" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{
                padding: "10px 20px", borderRadius: 24, border: `1.5px solid ${page === 1 ? COLORS.surfaceContainerHighest : COLORS.primary}`,
                background: "transparent", color: page === 1 ? COLORS.outline : COLORS.primary,
                cursor: page === 1 ? "not-allowed" : "pointer", fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13
              }}>Previous</button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} style={{
                  width: 38, height: 38, borderRadius: "50%", border: `1.5px solid ${n === page ? COLORS.primary : COLORS.outlineVariant + "40"}`,
                  background: n === page ? COLORS.primary : "transparent", color: n === page ? "#fff" : COLORS.onSurfaceVariant,
                  fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                }}>{n}</button>
              ))}

              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{
                padding: "10px 20px", borderRadius: 24, border: `1.5px solid ${page === totalPages ? COLORS.surfaceContainerHighest : COLORS.primary}`,
                background: "transparent", color: page === totalPages ? COLORS.outline : COLORS.primary,
                cursor: page === totalPages ? "not-allowed" : "pointer", fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13
              }}>Next</button>
            </div>
          </FadeIn>
        )}
      </section>
    </>
  );
}
