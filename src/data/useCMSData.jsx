import { useState, useEffect, createContext, useContext } from "react";
import { COLORS } from "../styles/tokens";

const FALLBACK = { leaders: [], regional: [], stateCoords: [], events: [], articles: [] };
const CMSContext = createContext({ ...FALLBACK, loading: true, error: null });

const TAG_COLORS = {
  Conference: { tagBg: `${COLORS.secondaryContainer}30`, tagColor: COLORS.secondary },
  Workshop: { tagBg: `${COLORS.primary}15`, tagColor: COLORS.primary },
  Webinar: { tagBg: `${COLORS.tertiary}15`, tagColor: COLORS.tertiary },
  Meeting: { tagBg: `${COLORS.secondary}15`, tagColor: COLORS.secondary },
  Insights: { tagBg: `${COLORS.secondaryContainer}20`, tagColor: COLORS.secondary },
  National: { tagBg: `${COLORS.primary}15`, tagColor: COLORS.primary },
  "State News": { tagBg: `${COLORS.tertiary}15`, tagColor: COLORS.tertiary },
  Spotlights: { tagBg: `${COLORS.secondary}20`, tagColor: COLORS.secondary },
};
const GRADS = ["linear-gradient(135deg,#C8E6C9,#81C784)","linear-gradient(135deg,#FFE082,#FFC107)","linear-gradient(135deg,#90CAF9,#42A5F5)","linear-gradient(135deg,#FFAB91,#FF7043)","linear-gradient(135deg,#CE93D8,#AB47BC)"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function initials(name) { return name ? name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() : "??"; }
function xLeader(r) { return { name: r.name, role: r.role, dept: r.dept, image: r.image || "", initials: initials(r.name) }; }
function xRegional(r) { return { name: r.name, region: r.region, image: r.image || "", initials: initials(r.name) }; }
function xState(r) { return { name: r.name, state: r.state, image: r.image || "", initials: initials(r.name) }; }
function xEvent(r, i) {
  const d = r.event_date ? new Date(r.event_date) : null;
  const c = TAG_COLORS[r.tag] || TAG_COLORS.Conference;
  return { id: r.id, month: d ? MONTHS[d.getMonth()] : "TBD", day: d ? String(d.getDate()).padStart(2,"0") : "??", year: d ? d.getFullYear() : 2026, tag: r.tag, tagBg: c.tagBg, title: r.title, desc: r.description, time: r.event_time, loc: r.location, locIcon: r.loc_type === "virtual" ? "video_call" : "location_on", gradient: GRADS[i % GRADS.length], image: r.image || "", link: r.link || "" };
}
function xArticle(r, i) {
  const d = r.publish_date ? new Date(r.publish_date) : null;
  const c = TAG_COLORS[r.tag] || TAG_COLORS.Insights;
  return { id: r.id, tag: r.tag, tagBg: c.tagBg, tagColor: c.tagColor, date: d ? d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" }) : "Unpublished", title: r.title, desc: r.description, image: r.image || "", gradient: GRADS[i % GRADS.length], author: r.author, phone: r.phone, company: r.company, content: r.content ? r.content.split("\n").filter(p => p.trim()) : [] };
}

export function CMSProvider({ children }) {
  const [data, setData] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/cms-public");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw = await res.json();
        if (!cancelled) { setData({ leaders: (raw.leaders||[]).map(xLeader), regional: (raw.regional||[]).map(xRegional), stateCoords: (raw.stateCoords||[]).map(xState), events: (raw.events||[]).map(xEvent), articles: (raw.articles||[]).map(xArticle) }); setLoading(false); }
      } catch (e) { console.error("CMS fetch:", e); if (!cancelled) { setError(e.message); setLoading(false); } }
    })();
    return () => { cancelled = true; };
  }, []);
  return <CMSContext.Provider value={{ ...data, loading, error }}>{children}</CMSContext.Provider>;
}
export function useCMSData() { return useContext(CMSContext); }
