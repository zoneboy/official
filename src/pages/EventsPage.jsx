/* --- FILE: src/pages/EventsPage.jsx --- */
import { useState } from "react";
import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn, Icon, PillButton, SmallButton } from "../components";
import { ALL_EVENTS } from "../data/events";

const FILTERS = ["All Events", "Workshop", "Meeting", "Webinar", "Conference"];
const CAL = [null,null,null,null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];

export default function EventsPage() {
  const [filter, setFilter] = useState("All Events");
  const { isMobile: m } = useBreakpoints();

  // Apply filter logic
  const displayedEvents = filter === "All Events" ? ALL_EVENTS : ALL_EVENTS.filter((ev) => ev.tag === filter);

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: m ? "32px 20px 60px" : "48px 32px 80px" }}>
      <FadeIn>
        <span style={{ color: COLORS.secondary, fontFamily: FONTS.headline, fontWeight: 700, fontSize: 11, letterSpacing: 3, textTransform: "uppercase", display: "block", marginBottom: 12 }}>Industry Circularity</span>
        <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 30 : 52, fontWeight: 800, letterSpacing: m ? "-1px" : "-2px", lineHeight: 1.1, maxWidth: 650, marginBottom: 14 }}>
          Engineering a <span style={{ color: COLORS.primary }}>Sustainable</span> Future Together.
        </h1>
        <p style={{ color: COLORS.onSurfaceVariant, fontSize: m ? 14 : 17, maxWidth: 500, lineHeight: 1.7, marginBottom: 32 }}>Join our upcoming workshops, conferences, and meetings.</p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, background: COLORS.surfaceContainerLow, padding: m ? "10px 12px" : "14px", borderRadius: 12, marginBottom: 36 }}>
          {FILTERS.map((f) => <PillButton key={f} active={filter === f} onClick={() => setFilter(f)} style={m ? { fontSize: 12, padding: "8px 14px" } : {}}>{f}</PillButton>)}
        </div>
      </FadeIn>
      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "7fr 5fr", gap: m ? 24 : 48 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h2 style={{ fontFamily: FONTS.headline, fontSize: m ? 18 : 22, fontWeight: 700, marginBottom: 4 }}>Upcoming Engagements</h2>
          {displayedEvents.length > 0 ? (
            displayedEvents.map((ev, i) => (
              <FadeIn key={ev.id} delay={i * 0.08}>
                <div style={{ display: "flex", flexDirection: m ? "column" : "row", background: COLORS.surfaceContainerLowest, borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ width: m ? "100%" : 100, background: COLORS.surfaceContainerHigh, display: "flex", flexDirection: m ? "row" : "column", alignItems: "center", justifyContent: m ? "flex-start" : "center", padding: m ? "14px 16px" : "24px 16px", gap: m ? 8 : 0, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.secondary, textTransform: "uppercase", letterSpacing: 2 }}>{ev.month}</span>
                    <span style={{ fontFamily: FONTS.headline, fontSize: m ? 24 : 36, fontWeight: 900 }}>{ev.day}</span>
                  </div>
                  <div style={{ padding: m ? "16px" : "24px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ background: ev.tagBg, padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>{ev.tag}</span>
                      <span style={{ fontSize: 11, color: COLORS.onSurfaceVariant, display: "flex", alignItems: "center", gap: 4 }}><Icon name="schedule" size={14} /> {ev.time}</span>
                    </div>
                    <h3 style={{ fontFamily: FONTS.headline, fontSize: m ? 15 : 17, fontWeight: 700, marginBottom: 6 }}>{ev.title}</h3>
                    <p style={{ fontSize: 13, color: COLORS.onSurfaceVariant, lineHeight: 1.6, marginBottom: 10 }}>{ev.desc}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                      <span style={{ fontSize: 12, color: COLORS.tertiary, fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}><Icon name={ev.locIcon} size={14} /> {ev.loc}</span>
                      {ev.link ? (
                        <SmallButton onClick={() => window.open(ev.link, "_blank", "noopener,noreferrer")}>Register Now</SmallButton>
                      ) : (
                        <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.outline }}>Event Concluded</span>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))
          ) : (
            <p style={{ color: COLORS.onSurfaceVariant, fontSize: 14 }}>No events found for this category.</p>
          )}
        </div>
        {/* Calendar — hide on mobile, show on larger screens */}
        {!m && (
          <div>
            <div style={{ position: "sticky", top: 110, background: COLORS.surfaceContainerLow, borderRadius: 12, padding: 28, border: `1px solid ${COLORS.outlineVariant}15` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h2 style={{ fontFamily: FONTS.headline, fontSize: 18, fontWeight: 700 }}>April 2026</h2>
                <div style={{ display: "flex", gap: 6 }}>
                  {["chevron_left", "chevron_right"].map((ic) => <button key={ic} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={ic} size={20} /></button>)}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center" }}>
                {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} style={{ fontSize: 10, fontWeight: 700, color: COLORS.onSurfaceVariant, paddingBottom: 12 }}>{d}</div>)}
                {CAL.map((d, i) => {
                  const hl = d === 30; // Highlight the 30th for the conference
                  return <div key={i} style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: hl ? 700 : 500, borderRadius: "50%", background: hl ? COLORS.primary : "transparent", color: hl ? "#fff" : d ? COLORS.onSurfaceVariant : "rgba(0,0,0,0.15)" }}>{d || ""}</div>;
                })}
              </div>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${COLORS.outlineVariant}30`, display: "flex", gap: 12 }}>
                <div style={{ flex: 1, background: COLORS.surfaceContainerLowest, padding: 14, borderRadius: 8 }}>
                  <span style={{ fontFamily: FONTS.headline, fontSize: 24, fontWeight: 900, color: COLORS.primary }}>01</span>
                  <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase" }}>Events this month</p>
                </div>
                <div style={{ flex: 1, background: COLORS.surfaceContainerLowest, padding: 14, borderRadius: 8 }}>
                  <span style={{ fontFamily: FONTS.headline, fontSize: 24, fontWeight: 900, color: COLORS.secondary }}>850+</span>
                  <p style={{ fontSize: 10, fontWeight: 700, color: COLORS.onSurfaceVariant, textTransform: "uppercase" }}>Registrations</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}