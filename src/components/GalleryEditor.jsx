// src/components/GalleryEditor.jsx
// Custom admin component for editing the videos[] and images[] JSONB arrays
// inside the Galleries section of the CMS. Designed to live inside the
// existing dark-themed AdminPage modal.
import { useState, useRef } from "react";

const S = {
  bg: "#0a0f0a",
  card: "#111611",
  border: "#1e2a1e",
  accent: "#22c55e",
  accentDk: "#15803d",
  text: "#e8f5e9",
  dim: "#6b8a6b",
  dimmer: "#4a6b4a",
  hover: "#1a261a",
  danger: "#f87171",
  dangerBg: "#261a1a",
  dangerBd: "#3a2a2a",
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// Best-effort YouTube ID extractor — used only to render thumbnails in the
// admin list. The real validation happens at render time on the public page.
function extractYouTubeId(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m && m[1]) return m[1];
  }
  return null;
}

// ── Video list editor ──
function VideoList({ videos, onChange }) {
  const [draftUrl, setDraftUrl] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [error, setError] = useState("");

  const addVideo = () => {
    setError("");
    const url = draftUrl.trim();
    if (!url) { setError("Paste a YouTube URL."); return; }
    const id = extractYouTubeId(url);
    if (!id) { setError("That doesn't look like a valid YouTube URL."); return; }
    onChange([...videos, { id: uid(), url, title: draftTitle.trim() }]);
    setDraftUrl("");
    setDraftTitle("");
  };

  const removeVideo = (i) => {
    const next = [...videos];
    next.splice(i, 1);
    onChange(next);
  };

  const moveVideo = (i, dir) => {
    const target = i + dir;
    if (target < 0 || target >= videos.length) return;
    const next = [...videos];
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  };

  const updateTitle = (i, title) => {
    const next = [...videos];
    next[i] = { ...next[i], title };
    onChange(next);
  };

  return (
    <div>
      {/* Existing videos */}
      {videos.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {videos.map((v, i) => {
            const ytId = extractYouTubeId(v.url);
            const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null;
            return (
              <div key={v.id || i} style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 10,
                background: S.bg,
                border: `1px solid ${S.border}`,
                borderRadius: 8,
              }}>
                {/* Thumbnail */}
                <div style={{
                  width: 80,
                  height: 45,
                  borderRadius: 4,
                  background: thumb ? `url(${thumb}) center/cover` : "#1a1a2e",
                  flexShrink: 0,
                  border: `1px solid ${S.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {!thumb && <span style={{ color: S.danger, fontSize: 10, fontWeight: 700 }}>INVALID</span>}
                </div>

                {/* Editable info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <input
                    value={v.title || ""}
                    onChange={(e) => updateTitle(i, e.target.value)}
                    placeholder="Video title (optional)"
                    style={{
                      width: "100%",
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: `1px solid ${S.border}`,
                      background: S.card,
                      color: S.text,
                      fontSize: 12,
                      outline: "none",
                      marginBottom: 4,
                    }}
                  />
                  <p style={{
                    fontSize: 10,
                    color: S.dimmer,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {v.url}
                  </p>
                </div>

                {/* Reorder */}
                <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <button
                    type="button"
                    onClick={() => moveVideo(i, -1)}
                    disabled={i === 0}
                    style={{ background: "none", border: "none", color: i === 0 ? S.dimmer : S.dim, cursor: i === 0 ? "not-allowed" : "pointer", fontSize: 11, padding: "1px 5px" }}
                  >▲</button>
                  <button
                    type="button"
                    onClick={() => moveVideo(i, 1)}
                    disabled={i === videos.length - 1}
                    style={{ background: "none", border: "none", color: i === videos.length - 1 ? S.dimmer : S.dim, cursor: i === videos.length - 1 ? "not-allowed" : "pointer", fontSize: 11, padding: "1px 5px" }}
                  >▼</button>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeVideo(i)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: S.dangerBg,
                    border: `1px solid ${S.dangerBd}`,
                    color: S.danger,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >✕</button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add new video */}
      <div style={{
        background: S.bg,
        border: `1px dashed ${S.border}`,
        borderRadius: 8,
        padding: 12,
      }}>
        <input
          value={draftUrl}
          onChange={(e) => { setDraftUrl(e.target.value); setError(""); }}
          placeholder="YouTube URL (e.g., https://youtube.com/watch?v=...)"
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: 6,
            border: `1px solid ${S.border}`,
            background: S.card,
            color: S.text,
            fontSize: 12,
            outline: "none",
            marginBottom: 8,
          }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addVideo(); } }}
            placeholder="Title (optional)"
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 6,
              border: `1px solid ${S.border}`,
              background: S.card,
              color: S.text,
              fontSize: 12,
              outline: "none",
            }}
          />
          <button
            type="button"
            onClick={addVideo}
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              background: `linear-gradient(135deg, ${S.accentDk}, ${S.accent})`,
              color: "#fff",
              border: "none",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            + Add Video
          </button>
        </div>
        {error && <p style={{ color: S.danger, fontSize: 11, fontWeight: 600, marginTop: 6 }}>{error}</p>}
      </div>
    </div>
  );
}

// ── Image list editor ──
// Multi-upload via drag-drop or file picker. Each upload is sent through the
// existing /api/upload endpoint and the returned URL is appended to the array.
function ImageList({ images, onChange, token, folder }) {
  const fileRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState("");

  const uploadFiles = async (files) => {
    setError("");
    const fileArray = Array.from(files);
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const valid = fileArray.filter(f => allowed.includes(f.type) && f.size <= 7 * 1024 * 1024);
    const rejected = fileArray.length - valid.length;

    if (valid.length === 0) {
      setError("No valid images. Use JPG/PNG/GIF/WebP up to 7MB each.");
      return;
    }

    setUploading(true);
    setUploadProgress({ current: 0, total: valid.length });
    const newUrls = [];

    for (let i = 0; i < valid.length; i++) {
      const file = valid[i];
      try {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = () => reject(new Error("Read failed"));
          reader.readAsDataURL(file);
        });

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            filename: file.name,
            content_type: file.type,
            data: base64,
            public: true,
            folder: folder || "ran/galleries",
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        newUrls.push(data.url);
        setUploadProgress({ current: i + 1, total: valid.length });
      } catch (e) {
        setError(`Upload failed at file ${i + 1}: ${e.message}`);
        break;
      }
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
    }
    if (rejected > 0) {
      setError(prev => (prev ? `${prev} ` : "") + `${rejected} file(s) skipped (wrong type or >7MB).`);
    }
    setUploading(false);
    setUploadProgress({ current: 0, total: 0 });
  };

  const removeImage = (i) => {
    const next = [...images];
    next.splice(i, 1);
    onChange(next);
  };

  const moveImage = (i, dir) => {
    const target = i + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };

  const handleSelect = (e) => {
    if (e.target.files?.length) uploadFiles(e.target.files);
    e.target.value = "";
  };

  return (
    <div>
      {/* Image grid */}
      {images.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
          gap: 8,
          marginBottom: 14,
        }}>
          {images.map((url, i) => (
            <div key={i} style={{
              position: "relative",
              aspectRatio: "4/3",
              borderRadius: 6,
              overflow: "hidden",
              background: S.bg,
              border: `1px solid ${S.border}`,
            }}>
              <img
                src={url}
                alt={`Slide ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              {/* Index badge */}
              <div style={{
                position: "absolute",
                top: 4,
                left: 4,
                background: "rgba(0,0,0,0.75)",
                color: "#fff",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
              }}>
                {i + 1}
              </div>
              {/* Actions overlay */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                padding: "20px 4px 4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}>
                <div style={{ display: "flex", gap: 1 }}>
                  <button
                    type="button"
                    onClick={() => moveImage(i, -1)}
                    disabled={i === 0}
                    title="Move left"
                    style={{ background: "rgba(255,255,255,0.15)", border: "none", color: i === 0 ? S.dimmer : "#fff", cursor: i === 0 ? "not-allowed" : "pointer", padding: "3px 6px", fontSize: 10, borderRadius: 3 }}
                  >◀</button>
                  <button
                    type="button"
                    onClick={() => moveImage(i, 1)}
                    disabled={i === images.length - 1}
                    title="Move right"
                    style={{ background: "rgba(255,255,255,0.15)", border: "none", color: i === images.length - 1 ? S.dimmer : "#fff", cursor: i === images.length - 1 ? "not-allowed" : "pointer", padding: "3px 6px", fontSize: 10, borderRadius: 3 }}
                  >▶</button>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  title="Remove"
                  style={{ background: S.dangerBg, border: `1px solid ${S.dangerBd}`, color: S.danger, padding: "3px 7px", fontSize: 10, fontWeight: 700, borderRadius: 3, cursor: "pointer" }}
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? S.accent : S.border}`,
          borderRadius: 10,
          padding: "20px 16px",
          textAlign: "center",
          cursor: uploading ? "default" : "pointer",
          background: dragOver ? `${S.accent}08` : S.bg,
          transition: "all 0.2s",
        }}
      >
        {uploading ? (
          <div>
            <div style={{ width: "100%", height: 5, background: S.border, borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
              <div style={{
                width: `${uploadProgress.total ? (uploadProgress.current / uploadProgress.total) * 100 : 0}%`,
                height: "100%",
                background: `linear-gradient(90deg, ${S.accentDk}, ${S.accent})`,
                transition: "width 0.3s",
              }} />
            </div>
            <p style={{ fontSize: 12, color: S.accent, fontWeight: 600 }}>
              Uploading {uploadProgress.current} of {uploadProgress.total}…
            </p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 12, fontWeight: 700, color: S.text, marginBottom: 4 }}>
              {dragOver ? "Drop to upload" : "Click or drag images here"}
            </p>
            <p style={{ fontSize: 10, color: S.dimmer }}>
              JPG, PNG, GIF, WebP — multiple files allowed, max 7MB each
            </p>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          onChange={handleSelect}
          style={{ display: "none" }}
        />
      </div>

      {error && <p style={{ color: S.danger, fontSize: 11, fontWeight: 600, marginTop: 8 }}>{error}</p>}
    </div>
  );
}

// ── Main editor ──
export default function GalleryEditor({ videos, images, onVideosChange, onImagesChange, token, folder }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Videos section */}
      <div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}>
          <label style={{
            fontSize: 10,
            fontWeight: 700,
            color: S.dimmer,
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}>
            YouTube Videos
          </label>
          <span style={{ fontSize: 10, color: S.dimmer }}>
            {videos.length} {videos.length === 1 ? "video" : "videos"}
          </span>
        </div>
        <VideoList videos={videos} onChange={onVideosChange} />
      </div>

      {/* Images section */}
      <div>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}>
          <label style={{
            fontSize: 10,
            fontWeight: 700,
            color: S.dimmer,
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}>
            Slideshow Images
          </label>
          <span style={{ fontSize: 10, color: S.dimmer }}>
            {images.length} {images.length === 1 ? "image" : "images"}
          </span>
        </div>
        <ImageList images={images} onChange={onImagesChange} token={token} folder={folder} />
      </div>
    </div>
  );
}
