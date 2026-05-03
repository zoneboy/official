import { useState, useEffect, createContext, useContext, createElement } from "react";
import { COLORS } from "../styles/tokens";

const FALLBACK = { boardOfTrustees: [], leaders: [], regional: [], stateCoords: [], events: [], articles: [], resources: [], galleries: [] };
const CMSContext = createContext({ ...FALLBACK, loading: true, error: null });

const TAG_COLORS = {
  Conference: { tagBg: COLORS.secondaryContainer + "30", tagColor: COLORS.secondary },
  Workshop: { tagBg: COLORS.primary + "15", tagColor: COLORS.primary },
  Webinar: { tagBg: COLORS.tertiary + "15", tagColor: COLORS.tertiary },
  Meeting: { tagBg: COLORS.secondary + "15", tagColor: COLORS.secondary },
  Insights: { tagBg: COLORS.secondaryContainer + "20", tagColor: COLORS.secondary },
  National: { tagBg: COLORS.primary + "15", tagColor: COLORS.primary },
  "State News": { tagBg: COLORS.tertiary + "15", tagColor: COLORS.tertiary },
  Spotlights: { tagBg: COLORS.secondary + "20", tagColor: COLORS.secondary },
};
const GRADS = [
  "linear-gradient(135deg,#C8E6C9,#81C784)",
  "linear-gradient(135deg,#FFE082,#FFC107)",
  "linear-gradient(135deg,#90CAF9,#42A5F5)",
  "linear-gradient(135deg,#FFAB91,#FF7043)",
  "linear-gradient(135deg,#CE93D8,#AB47BC)",
];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function initials(name) {
  return name ? name.split(" ").map(function(w) { return w[0]; }).join("").slice(0, 2).toUpperCase() : "??";
}

function isHtmlContent(content) {
  if (!content || typeof content !== "string") return false;
  return /<(p|h[1-6]|ul|ol|li|blockquote|strong|em|a|img|br)\b/i.test(content);
}

function xTrustee(r) {
  return { id: r.id, name: r.name, role: r.role, image: r.image || "", initials: initials(r.name) };
}

function xLeader(r) {
  return { name: r.name, role: r.role, dept: r.dept, image: r.image || "", initials: initials(r.name) };
}

function xRegional(r) {
  return { name: r.name, region: r.region, image: r.image || "", initials: initials(r.name) };
}

function xState(r) {
  return { name: r.name, state: r.state, image: r.image || "", initials: initials(r.name) };
}

function xEvent(r, i) {
  var d = r.event_date ? new Date(r.event_date) : null;
  var c = TAG_COLORS[r.tag] || TAG_COLORS.Conference;
  return {
    id: r.id,
    month: d ? MONTHS[d.getMonth()] : "TBD",
    day: d ? String(d.getDate()).padStart(2, "0") : "??",
    year: d ? d.getFullYear() : 2026,
    tag: r.tag,
    tagBg: c.tagBg,
    title: r.title,
    desc: r.description,
    time: r.event_time,
    loc: r.location,
    locIcon: r.loc_type === "virtual" ? "video_call" : "location_on",
    gradient: GRADS[i % GRADS.length],
    image: r.image || "",
    link: r.link || "",
  };
}

function xArticle(r, i) {
  var d = r.publish_date ? new Date(r.publish_date) : null;
  var c = TAG_COLORS[r.tag] || TAG_COLORS.Insights;

  var rawContent = r.content || "";
  var content;
  if (isHtmlContent(rawContent)) {
    content = rawContent;
  } else {
    content = rawContent
      ? rawContent.split("\n").filter(function(p) { return p.trim(); })
      : [];
  }

  return {
    id: r.id,
    tag: r.tag,
    tagBg: c.tagBg,
    tagColor: c.tagColor,
    date: d ? d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" }) : "Unpublished",
    title: r.title,
    desc: r.description,
    image: r.image || "",
    gradient: GRADS[i % GRADS.length],
    author: r.author,
    phone: r.phone,
    company: r.company,
    content: content,
  };
}

function xResource(r) {
  var d = r.publish_date ? new Date(r.publish_date) : null;
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    fileUrl: r.file_url || "",
    category: r.category || "General",
    date: d ? d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" }) : "",
  };
}

// ── Gallery transformer ──
// Normalizes JSONB videos/images arrays. Videos arrive as {id, url, title} objects;
// images arrive as plain URL strings. Anything malformed is filtered out.
function xGallery(r, i) {
  var d = r.event_date ? new Date(r.event_date) : null;

  var rawVideos = Array.isArray(r.videos) ? r.videos : [];
  var videos = rawVideos
    .filter(function(v) { return v && typeof v === "object" && v.url; })
    .map(function(v) {
      return {
        id: v.id || (Date.now().toString(36) + Math.random().toString(36).slice(2, 7)),
        url: v.url,
        title: v.title || "",
      };
    });

  var rawImages = Array.isArray(r.images) ? r.images : [];
  var images = rawImages.filter(function(img) { return typeof img === "string" && img.trim(); });

  return {
    id: r.id,
    title: r.title || "",
    eventName: r.event_name || r.title || "",
    description: r.description || "",
    coverImage: r.cover_image || "",
    videos: videos,
    images: images,
    date: d ? d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" }) : "",
    rawDate: r.event_date || null,
    gradient: GRADS[i % GRADS.length],
  };
}

export function CMSProvider(props) {
  var children = props.children;
  var _d = useState(FALLBACK), data = _d[0], setData = _d[1];
  var _l = useState(true), loading = _l[0], setLoading = _l[1];
  var _e = useState(null), error = _e[0], setError = _e[1];

  useEffect(function() {
    var cancelled = false;
    fetch("/api/cms-public")
      .then(function(res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function(raw) {
        if (!cancelled) {
          setData({
            boardOfTrustees: (raw.boardOfTrustees || []).map(xTrustee),
            leaders: (raw.leaders || []).map(xLeader),
            regional: (raw.regional || []).map(xRegional),
            stateCoords: (raw.stateCoords || []).map(xState),
            events: (raw.events || []).map(xEvent),
            articles: (raw.articles || []).map(xArticle),
            resources: (raw.resources || []).map(xResource),
            galleries: (raw.galleries || []).map(xGallery),
          });
          setLoading(false);
        }
      })
      .catch(function(e) {
        console.error("CMS fetch:", e);
        if (!cancelled) {
          setError(e.message);
          setLoading(false);
        }
      });
    return function() { cancelled = true; };
  }, []);

  var value = {
    boardOfTrustees: data.boardOfTrustees,
    leaders: data.leaders,
    regional: data.regional,
    stateCoords: data.stateCoords,
    events: data.events,
    articles: data.articles,
    resources: data.resources,
    galleries: data.galleries,
    loading: loading,
    error: error,
  };

  return createElement(CMSContext.Provider, { value: value }, children);
}

export function useCMSData() {
  return useContext(CMSContext);
}
