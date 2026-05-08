// src/components/MultiUrlField.jsx
// Reusable list-of-URLs editor. Used by galleries for multiple YouTube links.
// Supports adding URLs one at a time, or pasting many at once via "Bulk add".

import { useState } from "react";

const S = {
  bg: "#0a0f0a", card: "#111611", border: "#1e2a1e",
  accent: "#22c55e", accentDk: "#15803d",
  text: "#e8f5e9", dim: "#6b8a6b", dimmer: "#4a6b4a",
  hover: "#1a261a", danger: "#f87171",
  dangerBg: "#261a1a", dangerBd: "#3a2a2a",
};

// ── Detect a YouTube ID for a small thumbnail preview ──
function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  return m ? m[1] : null;
}

export default function MultiUrlField({ value, onChange, placeholder = "https://www.youtube.com/watch?v=...", label = "Video URLs" }) {
  const list = Array.isArray(value) ? value : [];
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  const addUrl = () => {
    const trimmed = draft.trim();
    if (!trimmed) { setError("Enter a URL first."); return; }
    if (list.includes(trimmed)) { setError("That URL is already in the list."); return; }
    onChange([...list, trimmed]);
    setDraft("");
    setError("");
  };

  const addBulk = () => {
    // Split on newlines/commas so users can paste many at once
    const parts = draft.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) { setError("Paste one or more URLs."); return; }
    const fresh = parts.filter(p => !list.includes(p));
    if (fresh.length === 0) { setError("All pasted URLs are already in the list."); return; }
    onChange([...list, ...fresh]);
    setDraft("");
    setError("");
  };

  const removeUrl = (idx) => {
    const copy = [...list];
    copy.splice(idx, 1);
    onChange(copy);
  };

  const moveUrl = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= list.length) return;
    const copy = [...list];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    onChange(copy);
  };

  const handleKey = (e) => {
    // Enter adds a single URL; Shift+Enter inserts a newline (for bulk paste).
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addUrl();
    }
  };

  return (
    <div>
      {/* Existing list */}
      {list.length > 0 && (
        <div style={{
          display: "flex", flexDirection: "column", gap: 6, marginBottom: 12,
          maxHeight: list.length > 8 ? 280 : "none",
          overflowY: list.length > 8 ? "auto" : "visible",
          padding: list.length > 8 ? 4 : 0,
          border: list.length > 8 ? `1px solid ${S.border}` : "none",
          borderRadius: list.length > 8 ? 8 : 0,
        }}>
          {list.map((url, i) => {
            const ytId = getYouTubeId(url);
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: S.bg, border: `1px solid ${S.border}`,
                borderRadius: 8, padding: 8,
              }}>
                {/* Thumbnail */}
                <div style={{
                  width: 56, height: 40, borderRadius: 6, flexShrink: 0,
                  background: ytId ? `url(https://i.ytimg.com/vi/${ytId}/default.jpg) center/cover` : S.hover,
                  border: `1px solid ${S.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: S.dimmer, fontSize: 16,
                }}>
                  {!ytId && "▶"}
                </div>

                {/* URL */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 11, color: S.text, fontWeight: 600,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{url}</p>
                  <p style={{ fontSize: 10, color: S.dimmer, marginTop: 2 }}>
                    Video {i + 1} of {list.length}
                  </p>
                </div>

                {/* Reorder */}
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <button type="button" onClick={() => moveUrl(i, -1)} disabled={i === 0}
                    style={{ background: "none", border: "none", color: i === 0 ? S.dimmer : S.dim, cursor: i === 0 ? "not-allowed" : "pointer", fontSize: 11, padding: "1px 6px" }}>▲</button>
                  <button type="button" onClick={() => moveUrl(i, 1)} disabled={i === list.length - 1}
                    style={{ background: "none", border: "none", color: i === list.length - 1 ? S.dimmer : S.dim, cursor: i === list.length - 1 ? "not-allowed" : "pointer", fontSize: 11, padding: "1px 6px" }}>▼</button>
                </div>

                {/* Remove */}
                <button type="button" onClick={() => removeUrl(i)}
                  style={{ padding: "5px 9px", borderRadius: 6, background: S.dangerBg, border: `1px solid ${S.dangerBd}`, color: S.danger, fontSize: 10, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add new */}
      <div style={{ display: "flex", gap: 6 }}>
        <textarea
          value={draft}
          onChange={(e) => { setDraft(e.target.value); setError(""); }}
          onKeyDown={handleKey}
          placeholder={placeholder}
          rows={draft.includes("\n") ? 3 : 1}
          style={{
            flex: 1, padding: "10px 12px", borderRadius: 8,
            border: `1px solid ${error ? S.danger : S.border}`,
            background: S.bg, color: S.text, fontSize: 12, outline: "none",
            resize: "vertical", fontFamily: "inherit", minHeight: 38,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button type="button" onClick={addUrl}
            style={{ padding: "8px 14px", borderRadius: 8, background: `linear-gradient(135deg, ${S.accentDk}, ${S.accent})`, border: "none", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
            + Add
          </button>
          <button type="button" onClick={addBulk} title="Paste multiple URLs separated by line breaks or commas"
            style={{ padding: "8px 14px", borderRadius: 8, background: S.hover, border: "1px solid #2a3a2a", color: "#a3d9a3", fontSize: 10, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            Bulk add
          </button>
        </div>
      </div>

      {error && <p style={{ color: S.danger, fontSize: 11, fontWeight: 600, marginTop: 6 }}>{error}</p>}
      <p style={{ fontSize: 10, color: S.dimmer, marginTop: 6, lineHeight: 1.5 }}>
        Tip: Paste multiple URLs (one per line or comma-separated) and click "Bulk add" to insert them all at once. Press Enter to add a single URL, Shift+Enter for a new line.
      </p>
    </div>
  );
}
