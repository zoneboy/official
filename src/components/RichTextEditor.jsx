// src/components/RichTextEditor.jsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useCallback, useRef, useState, useEffect } from "react";

const S = {
  bg: "#0a0f0a",
  card: "#111611",
  border: "#1e2a1e",
  accent: "#22c55e",
  text: "#e8f5e9",
  dim: "#6b8a6b",
  dimmer: "#4a6b4a",
  hover: "#1a261a",
  danger: "#f87171",
};

// ── Toolbar button ──
function TBtn({ active, onClick, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        padding: "6px 10px",
        minWidth: 32,
        height: 32,
        borderRadius: 6,
        border: `1px solid ${active ? S.accent : "transparent"}`,
        background: active ? `${S.accent}20` : "transparent",
        color: active ? S.accent : disabled ? S.dimmer : S.text,
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.4 : 1,
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) e.currentTarget.style.background = S.hover;
      }}
      onMouseLeave={(e) => {
        if (!disabled && !active) e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}

const Sep = () => (
  <div style={{ width: 1, height: 20, background: S.border, margin: "0 4px" }} />
);

// ── Link prompt modal ──
function LinkPrompt({ initialUrl, onConfirm, onCancel }) {
  const [url, setUrl] = useState(initialUrl || "");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const submit = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      onConfirm(null); // empty = remove link
      return;
    }
    // Auto-prefix https:// if missing and looks like a domain
    const final = /^(https?:\/\/|mailto:|tel:|\/)/i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    onConfirm(final);
  };

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(6px)",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: S.card,
          border: `1px solid ${S.border}`,
          borderRadius: 14,
          padding: "24px",
          width: 440,
          maxWidth: "100%",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
        }}
      >
        <h4 style={{ fontSize: 15, fontWeight: 800, color: S.text, marginBottom: 14 }}>
          {initialUrl ? "Edit link" : "Insert link"}
        </h4>
        <input
          ref={inputRef}
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") onCancel();
          }}
          placeholder="https://example.com"
          style={{
            width: "100%",
            padding: "11px 14px",
            borderRadius: 10,
            border: `1px solid ${S.border}`,
            background: S.bg,
            color: S.text,
            fontSize: 13,
            outline: "none",
            marginBottom: 16,
          }}
        />
        <p style={{ fontSize: 11, color: S.dimmer, marginBottom: 16, lineHeight: 1.5 }}>
          Leave empty and click <strong style={{ color: S.text }}>Save</strong> to remove the link.
          Prefix with <code style={{ color: S.accent }}>mailto:</code> for email or
          <code style={{ color: S.accent }}> tel:</code> for phone.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              background: S.hover,
              border: `1px solid #2a3a2a`,
              color: "#a3d9a3",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              background: `linear-gradient(135deg, #15803d, ${S.accent})`,
              color: "#fff",
              border: "none",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main editor ──
export default function RichTextEditor({ value, onChange, token, placeholder = "Write article content…" }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");
  const [linkPrompt, setLinkPrompt] = useState(null); // { initialUrl } | null

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // StarterKit includes bold, italic, bulletList, orderedList, blockquote, paragraph
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          style: "max-width:100%;height:auto;border-radius:8px;margin:16px 0;",
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // TipTap returns "<p></p>" when empty — normalize to empty string
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        style: `
          min-height: 280px;
          padding: 16px;
          outline: none;
          color: ${S.text};
          font-size: 14px;
          line-height: 1.7;
          font-family: inherit;
        `,
      },
    },
  });

  // Keep editor in sync if parent value changes (e.g. opening a different article)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const incoming = value || "";
    if (current !== incoming && !(current === "<p></p>" && incoming === "")) {
      editor.commands.setContent(incoming, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  const openLinkPrompt = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href || "";
    setLinkPrompt({ initialUrl: prev });
  }, [editor]);

  const handleLinkConfirm = (url) => {
    if (!editor) { setLinkPrompt(null); return; }
    if (url === null || url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    setLinkPrompt(null);
  };

  const handleImageUpload = async (file) => {
    setUploadErr("");
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      setUploadErr("Only JPG, PNG, GIF, WebP, or SVG allowed.");
      return;
    }
    if (file.size > 7 * 1024 * 1024) {
      setUploadErr("Image exceeds 7MB limit.");
      return;
    }

    setUploading(true);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = () => reject(new Error("File read failed"));
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          filename: file.name,
          content_type: file.type,
          data: base64,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      editor?.chain().focus().setImage({ src: data.url, alt: file.name }).run();
    } catch (e) {
      setUploadErr(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const triggerImageUpload = () => fileRef.current?.click();
  const onFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = "";
  };

  if (!editor) {
    return (
      <div style={{ padding: 20, color: S.dim, fontSize: 12 }}>Loading editor…</div>
    );
  }

  return (
    <div
      style={{
        border: `1px solid ${S.border}`,
        borderRadius: 10,
        background: S.bg,
        overflow: "hidden",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
          padding: "8px 10px",
          borderBottom: `1px solid ${S.border}`,
          background: S.card,
        }}
      >
        {/* Headings */}
        <TBtn
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Heading 2"
        >
          <span style={{ fontSize: 14, fontWeight: 800 }}>H2</span>
        </TBtn>
        <TBtn
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Heading 3"
        >
          <span style={{ fontSize: 13, fontWeight: 800 }}>H3</span>
        </TBtn>
        <TBtn
          active={editor.isActive("paragraph") && !editor.isActive("heading")}
          onClick={() => editor.chain().focus().setParagraph().run()}
          title="Paragraph"
        >
          <span style={{ fontSize: 11, fontWeight: 600 }}>¶</span>
        </TBtn>

        <Sep />

        {/* Marks */}
        <TBtn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <strong style={{ fontSize: 14 }}>B</strong>
        </TBtn>
        <TBtn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <em style={{ fontSize: 14, fontFamily: "serif" }}>I</em>
        </TBtn>

        <Sep />

        {/* Link */}
        <TBtn
          active={editor.isActive("link")}
          onClick={openLinkPrompt}
          title="Insert / edit link"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </TBtn>

        <Sep />

        {/* Lists */}
        <TBtn
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="9" y1="6" x2="20" y2="6" />
            <line x1="9" y1="12" x2="20" y2="12" />
            <line x1="9" y1="18" x2="20" y2="18" />
            <circle cx="4" cy="6" r="1.2" fill="currentColor" />
            <circle cx="4" cy="12" r="1.2" fill="currentColor" />
            <circle cx="4" cy="18" r="1.2" fill="currentColor" />
          </svg>
        </TBtn>
        <TBtn
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="20" y2="6" />
            <line x1="10" y1="12" x2="20" y2="12" />
            <line x1="10" y1="18" x2="20" y2="18" />
            <path d="M4 6h1v-2h-1" />
            <path d="M4 10h2l-2 3h2" />
            <path d="M4 16h2M4 19h2" />
          </svg>
        </TBtn>

        <Sep />

        {/* Blockquote */}
        <TBtn
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 7h4v4H8c0 2 1 3 3 3v2c-3 0-4-2-4-4V7zm6 0h4v4h-3c0 2 1 3 3 3v2c-3 0-4-2-4-4V7z" />
          </svg>
        </TBtn>

        <Sep />

        {/* Image upload */}
        <TBtn
          onClick={triggerImageUpload}
          disabled={uploading}
          title={uploading ? "Uploading…" : "Insert image"}
        >
          {uploading ? (
            <span style={{ fontSize: 11 }}>⟳</span>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          )}
        </TBtn>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
          onChange={onFileSelect}
          style={{ display: "none" }}
        />

        <Sep />

        {/* Undo / Redo */}
        <TBtn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7v6h6" />
            <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
          </svg>
        </TBtn>
        <TBtn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 7v6h-6" />
            <path d="M3 17a9 9 0 0 1 15-6.7L21 13" />
          </svg>
        </TBtn>

        <Sep />

        {/* Clear formatting */}
        <TBtn
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          title="Clear formatting"
        >
          <span style={{ fontSize: 11, letterSpacing: -1 }}>Tx</span>
        </TBtn>
      </div>

      {/* Upload error */}
      {uploadErr && (
        <div style={{
          padding: "6px 14px",
          background: "#2a1414",
          color: S.danger,
          fontSize: 11,
          fontWeight: 600,
          borderBottom: `1px solid ${S.border}`,
        }}>
          {uploadErr}
        </div>
      )}

      {/* Editor content area */}
      <div style={{ background: S.bg }}>
        <EditorContent editor={editor} />
      </div>

      {/* Scoped styles for the editor content */}
      <style>{`
        .ProseMirror { outline: none; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: "${placeholder.replace(/"/g, '\\"')}";
          color: ${S.dimmer};
          float: left;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h2 {
          font-size: 20px;
          font-weight: 800;
          margin: 20px 0 10px;
          color: ${S.text};
          line-height: 1.3;
        }
        .ProseMirror h3 {
          font-size: 16px;
          font-weight: 700;
          margin: 18px 0 8px;
          color: ${S.text};
          line-height: 1.3;
        }
        .ProseMirror p { margin: 0 0 12px; }
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 24px;
          margin: 0 0 12px;
        }
        .ProseMirror ul li, .ProseMirror ol li { margin: 4px 0; }
        .ProseMirror li p { margin: 0; }
        .ProseMirror blockquote {
          border-left: 3px solid ${S.accent};
          padding: 4px 0 4px 14px;
          margin: 14px 0;
          color: ${S.dim};
          font-style: italic;
        }
        .ProseMirror a {
          color: ${S.accent};
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 14px 0;
          border: 1px solid ${S.border};
        }
        .ProseMirror strong { color: ${S.text}; font-weight: 700; }
        .ProseMirror em { color: ${S.text}; }
        .ProseMirror:focus { outline: none; }
      `}</style>

      {linkPrompt && (
        <LinkPrompt
          initialUrl={linkPrompt.initialUrl}
          onConfirm={handleLinkConfirm}
          onCancel={() => setLinkPrompt(null)}
        />
      )}
    </div>
  );
}
