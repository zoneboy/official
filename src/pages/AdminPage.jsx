import { useState, useEffect, useCallback, useRef } from "react";
import RichTextEditor from "../components/RichTextEditor";

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const S = { bg:"#0a0f0a", card:"#111611", border:"#1e2a1e", accent:"#22c55e", accentDk:"#15803d", text:"#e8f5e9", dim:"#6b8a6b", dimmer:"#4a6b4a", hover:"#1a261a", danger:"#f87171", dangerBg:"#261a1a", dangerBd:"#3a2a2a", warning:"#fbbf24", warningBg:"#1a1a0a" };

const REFRESH_WHEN_REMAINING = 15 * 60 * 1000;
const WARN_WHEN_REMAINING    = 5 * 60 * 1000;
const ACTIVITY_WINDOW_MS     = 10 * 60 * 1000;

function formatTimeRemaining(ms) {
  if (ms <= 0) return "Expired";
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes >= 10) return `${minutes}m`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const FIELD_DEFS = {
  boardOfTrustees: [ {key:"name",label:"Full Name",type:"text",required:true},{key:"role",label:"Role / Title",type:"text",required:true},{key:"image",label:"Photo",type:"image"} ],
  leaders: [ {key:"name",label:"Full Name",type:"text",required:true},{key:"role",label:"Role / Title",type:"text",required:true},{key:"dept",label:"Department",type:"text"},{key:"image",label:"Photo",type:"image"} ],
  regional: [ {key:"name",label:"Full Name",type:"text",required:true},{key:"region",label:"Region",type:"select",options:["South-South","North-Central","North-East","South-East","South-West","North-West"]},{key:"image",label:"Photo",type:"image"} ],
  state: [ {key:"name",label:"Full Name",type:"text",required:true},{key:"state",label:"State",type:"text",required:true},{key:"image",label:"Photo",type:"image"} ],
  events: [ {key:"title",label:"Event Title",type:"text",required:true},{key:"tag",label:"Category",type:"select",options:["Conference","Workshop","Webinar","Meeting"]},{key: "[REDACTED-SECRET]",label:"Description",type:"textarea"},{key:"event_date",label:"Date",type:"date",required:true},{key:"event_time",label:"Time",type:"text"},{key: "[REDACTED-SECRET]",label:"Location",type:"text"},{key:"loc_type",label:"Type",type:"select",options:["physical","virtual"]},{key:"image",label:"Event Banner",type:"image"},{key:"link",label:"Registration Link",type:"text"} ],
  articles: [ {key:"title",label:"Title",type:"text",required:true},{key:"tag",label:"Category",type:"select",options:["Insights","National","State News","Spotlights"]},{key:"publish_date",label:"Date",type:"date",required:true},{key: "[REDACTED-SECRET]",label:"Short Description",type:"textarea"},{key:"image",label:"Cover Image",type:"image"},{key:"author",label:"Author",type:"text"},{key:"company",label:"Company",type:"text"},{key:"phone",label:"Phone",type:"text"},{key:"content",label:"Full Content",type:"richtext",ph:"Write the full article. Use the toolbar for headings, links, lists, images, etc."} ],
  resources: [ {key:"title",label:"Title",type:"text",required:true},{key: "[REDACTED-SECRET]",label:"Description",type:"textarea"},{key:"file_url",label:"File",type:"file",required:true,allowPrivate:true},{key: "[REDACTED-SECRET]",label:"Category",type:"select",options:["Newsletter","Report","Policy","General"]},{key:"publish_date",label:"Date",type:"date"} ],
  galleries: [ {key:"title",label:"Event/Gallery Title",type:"text",required:true},{key:"event_date",label:"Date",type:"date",required:true},{key:"description",label:"Description",type:"textarea"},{key:"youtube_url",label:"YouTube URL (Optional)",type:"text",ph:"https://www.youtube.com/watch?v=..."},{key:"images",label:"Gallery Images",type:"image_list"} ],
};

const EMPTY = { boardOfTrustees:{name:"",role:"",image:""}, leaders:{name:"",role:"",dept:"",image:""}, regional:{name:"",region:"South-South",image:""}, state:{name:"",state:"",image:""}, events:{title:"",tag:"Conference",description:"",event_date:"",event_time:"",location:"",loc_type:"physical",image:"",link:""}, articles:{title:"",tag:"Insights",publish_date:new Date().toISOString().slice(0,10),description:"",image:"",author:"",phone:"",company:"",content:""}, resources:{title:"",description:"",file_url:"",category:"General",publish_date:new Date().toISOString().slice(0,10)}, galleries:{title:"",event_date:new Date().toISOString().slice(0,10),description:"",youtube_url:"",images:"[]"} };

function SessionPill({ expiresAt, onExtend }) {
  const [remaining, setRemaining] = useState(() => expiresAt - Date.now());
  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => setRemaining(expiresAt - Date.now());
    tick();
    const interval = remaining < 10 * 60 * 1000 ? 1000 : 30_000;
    const id = setInterval(tick, interval);
    return () => clearInterval(id);
  }, [expiresAt, remaining]);

  if (!expiresAt) return null;
  const warn = remaining <= WARN_WHEN_REMAINING;
  const color = warn ? S.warning : S.dim;
  const bg = warn ? S.warningBg : "transparent";
  const border = warn ? `1px solid ${S.warning}40` : `1px solid ${S.border}`;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div title={`Session expires at ${new Date(expiresAt).toLocaleTimeString()}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 12, border, background: bg, fontSize: 10, fontWeight: 700, color, fontFamily: "monospace", letterSpacing: 0.5 }}>
        <span style={{ fontSize: 10, opacity: 0.7 }}>⏱</span>{formatTimeRemaining(remaining)}
      </div>
      {warn && onExtend && <button onClick={onExtend} style={{ padding: "4px 10px", borderRadius: 12, background: S.warning, border: "none", color: "#1a1a0a", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Extend</button>}
    </div>
  );
}

function ExpiredModal({ onReLogin }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", padding: 20 }}>
      <div style={{ background: S.card, border: `1px solid ${S.warning}40`, borderRadius: 18, padding: "36px 32px", width: 440, maxWidth: "100%", boxShadow: "0 40px 80px rgba(0,0,0,0.6)", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${S.warning}20`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 26 }}>⏱</div>
        <h3 style={{ fontSize: 18, fontWeight: 800, color: S.text, marginBottom: 10 }}>Session Expired</h3>
        <p style={{ fontSize: 13, color: S.dim, lineHeight: 1.6, marginBottom: 24 }}>For security, your 8-hour session has ended. Any unsaved changes in the current editor will be preserved when you log back in.</p>
        <button onClick={onReLogin} style={{ width: "100%", padding: "12px", borderRadius: 10, background: `linear-gradient(135deg, ${S.accentDk}, ${S.accent})`, color: "#fff", border: "none", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Log In Again</button>
      </div>
    </div>
  );
}

function FileUploadField({ value, onChange, token, fieldType, allowPrivate = false }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const isImage = fieldType === "image";
  const acceptStr = isImage ? "image/jpeg,image/png,image/gif,image/webp,image/svg+xml" : "application/pdf";
  const acceptLabel = isImage ? "JPG, PNG, GIF, WebP, SVG" : "PDF";
  const maxSizeMB = 7;

  const uploadFile = async (file) => {
    setError("");
    const allowed = isImage ? ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"] : ["application/pdf"];
    if (!allowed.includes(file.type)) { setError(`Invalid file type. Accepted: ${acceptLabel}`); return; }
    if (file.size > maxSizeMB * 1024 * 1024) { setError(`File too large. Maximum ${maxSizeMB}MB.`); return; }

    setUploading(true); setProgress(10);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
      setProgress(40);
      const res = await fetch("/api/upload", {
        method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ filename: file.name, content_type: file.type, data: base64, public: isPublic }),
      });
      setProgress(80);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setProgress(100); onChange(data.url);
      setTimeout(() => { setUploading(false); setProgress(0); }, 500);
    } catch (e) {
      setError(e.message || "Upload failed. Please try again.");
      setUploading(false); setProgress(0);
    }
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) uploadFile(f); };
  const handleFileSelect = (e) => { const f = e.target.files[0]; if (f) uploadFile(f); e.target.value = ""; };
  const handleRemove = () => { onChange(""); setError(""); };

  const hasFile = value && value.trim() !== "";
  const isUploadedFile = hasFile && value.startsWith("/api/file/");
  const isPdfFile = fieldType === "file";

  return (
    <div>
      {hasFile && !uploading && (
        <div style={{ marginBottom: 12, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 10, padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
          {isImage && <div style={{ width: 64, height: 64, borderRadius: 8, overflow: "hidden", background: S.hover, flexShrink: 0, border: `1px solid ${S.border}` }}><img src={value} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} /></div>}
          {isPdfFile && <div style={{ width: 48, height: 48, borderRadius: 8, background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${S.border}` }}><span style={{ fontSize: 18, fontWeight: 900, color: "#f87171" }}>PDF</span></div>}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: S.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{isUploadedFile ? "Uploaded file" : value}</p>
            <p style={{ fontSize: 10, color: S.dimmer, marginTop: 2 }}>{isUploadedFile ? value : "External URL"}</p>
          </div>
          <button type="button" onClick={handleRemove} style={{ padding: "6px 12px", borderRadius: 6, background: S.dangerBg, border: `1px solid ${S.dangerBd}`, color: S.danger, fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>Remove</button>
        </div>
      )}
      {!hasFile && !uploading && (
        <>
          {allowPrivate && (
            <div style={{ marginBottom: 10, background: S.bg, border: `1px solid ${S.border}`, borderRadius: 10, padding: "10px 12px", display: "flex", gap: 6 }}>
              <button type="button" onClick={() => setIsPublic(true)} style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: `1px solid ${isPublic ? S.accent : "transparent"}`, background: isPublic ? `${S.accent}15` : "transparent", color: isPublic ? S.accent : S.dim, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>🌐 Public</button>
              <button type="button" onClick={() => setIsPublic(false)} style={{ flex: 1, padding: "8px 10px", borderRadius: 6, border: `1px solid ${!isPublic ? S.warning : "transparent"}`, background: !isPublic ? `${S.warning}15` : "transparent", color: !isPublic ? S.warning : S.dim, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>🔒 Private (admin-only)</button>
            </div>
          )}
          <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop} onClick={() => fileRef.current?.click()} style={{ border: `2px dashed ${dragOver ? S.accent : S.border}`, borderRadius: 12, padding: "24px 16px", textAlign: "center", cursor: "pointer", background: dragOver ? `${S.accent}08` : S.bg, transition: "all 0.2s" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${S.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}><span style={{ fontSize: 20 }}>{isImage ? "🖼️" : "📄"}</span></div>
            <p style={{ fontSize: 13, fontWeight: 700, color: S.text, marginBottom: 4 }}>{dragOver ? "Drop to upload" : `Click or drag to upload ${isImage ? "image" : "PDF"}`}</p>
            <p style={{ fontSize: 11, color: S.dimmer }}>{acceptLabel} • Max {maxSizeMB}MB{allowPrivate && !isPublic && " • Admin-only"}</p>
            <input ref={fileRef} type="file" accept={acceptStr} onChange={handleFileSelect} style={{ display: "none" }} />
          </div>
          <UrlFallback onChange={onChange} isImage={isImage} />
        </>
      )}
      {uploading && (
        <div style={{ border: `1px solid ${S.accent}40`, borderRadius: 12, padding: "20px 16px", background: `${S.accent}06`, textAlign: "center" }}>
          <div style={{ width: "100%", height: 6, background: S.border, borderRadius: 3, overflow: "hidden", marginBottom: 12 }}><div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg, ${S.accentDk}, ${S.accent})`, borderRadius: 3, transition: "width 0.3s ease" }} /></div>
          <p style={{ fontSize: 12, color: S.accent, fontWeight: 600 }}>{progress < 40 ? "Reading file..." : progress < 80 ? "Uploading..." : "Almost done..."}</p>
        </div>
      )}
      {error && <p style={{ color: S.danger, fontSize: 11, fontWeight: 600, marginTop: 8 }}>{error}</p>}
    </div>
  );
}

function UrlFallback({ onChange, isImage }) {
  const [showUrl, setShowUrl] = useState(false);
  const [urlVal, setUrlVal] = useState("");
  if (!showUrl) return <button type="button" onClick={() => setShowUrl(true)} style={{ background: "none", border: "none", color: S.dimmer, fontSize: 11, cursor: "pointer", marginTop: 8, textDecoration: "underline", padding: 0 }}>Or paste a URL instead</button>;
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <input value={urlVal} onChange={(e) => setUrlVal(e.target.value)} placeholder={isImage ? "https://example.com/photo.jpg" : "/resources/file.pdf"} style={{ flex: 1, padding: "9px 12px", borderRadius: 8, border: `1px solid ${S.border}`, background: S.bg, color: S.text, fontSize: 12, outline: "none" }} />
      <button type="button" onClick={() => { if (urlVal.trim()) { onChange(urlVal.trim()); setUrlVal(""); setShowUrl(false); } }} style={{ padding: "9px 14px", borderRadius: 8, background: S.hover, border: `1px solid #2a3a2a`, color: "#a3d9a3", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Use</button>
      <button type="button" onClick={() => { setShowUrl(false); setUrlVal(""); }} style={{ padding: "9px 10px", borderRadius: 8, background: "none", border: `1px solid ${S.border}`, color: S.dimmer, fontSize: 11, cursor: "pointer" }}>✕</button>
    </div>
  );
}

export default function AdminPage({ setPage: setAppPage }) {
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [loginUser, setLoginUser] = useState("admin");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [needsTotp, setNeedsTotp] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [totpEnabled, setTotpEnabled] = useState(false);

  const [setupMode, setSetupMode] = useState(false);
  const [setupSecret, setSetupSecret] = useState("");
  const [setupUri, setSetupUri] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [setupMsg, setSetupMsg] = useState("");
  const [disablePass, setDisablePass] = useState("");

  const [section, setSection] = useState("dashboard");
  const [data, setData] = useState({ boardOfTrustees:[], leaders:[], regional:[], state:[], events:[], articles:[], resources:[], galleries:[] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editType, setEditType] = useState(null);

  const lastActivityRef = useRef(Date.now());
  const refreshingRef = useRef(false);

  const show = useCallback((msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); },[]);

  const handleAuthFailure = useCallback(() => { setSessionExpired(true); }, []);

  const refreshSession = useCallback(async () => {
    if (!token || refreshingRef.current) return false;
    refreshingRef.current = true;
    try {
      const res = await fetch("/api/cms-refresh", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok || !data.success) { handleAuthFailure(); return false; }
      setToken(data.token); setExpiresAt(data.expires_at);
      return true;
    } catch { return false; } finally { refreshingRef.current = false; }
  }, [token, handleAuthFailure]);

  useEffect(() => {
    if (!authed) return;
    const markActive = () => { lastActivityRef.current = Date.now(); };
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach(e => window.addEventListener(e, markActive, { passive: true }));
    return () => events.forEach(e => window.removeEventListener(e, markActive));
  }, [authed]);

  useEffect(() => {
    if (!authed || !expiresAt) return;
    const tick = () => {
      const now = Date.now(); const remaining = expiresAt - now; const recentlyActive = (now - lastActivityRef.current) < ACTIVITY_WINDOW_MS;
      if (remaining <= 0) { handleAuthFailure(); return; }
      if (remaining <= REFRESH_WHEN_REMAINING && recentlyActive) { refreshSession(); }
    };
    tick(); const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [authed, expiresAt, refreshSession, handleAuthFailure]);

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch("/api/cms-public");
      if (!res.ok) throw new Error("Fetch failed");
      const raw = await res.json();
      setData({
        boardOfTrustees: raw.boardOfTrustees||[], leaders: raw.leaders||[], regional: raw.regional||[], state: raw.stateCoords||[],
        events: (raw.events||[]).map(e=>({...e,event_date:e.event_date?e.event_date.slice(0,10):"",event_time:e.event_time||""})),
        articles: (raw.articles||[]).map(a=>({...a,publish_date:a.publish_date?a.publish_date.slice(0,10):""})),
        resources: (raw.resources||[]).map(r=>({...r,publish_date:r.publish_date?r.publish_date.slice(0,10):""})),
        galleries: (raw.galleries||[]).map(g=>({...g,event_date:g.event_date?g.event_date.slice(0,10):""}))
      });
    } catch(e) { console.error(e); }
    setLoading(false);
  },[]);

  useEffect(()=>{ if(authed) fetchAll(); },[authed,fetchAll]);

  const handleLogin = async (e) => {
    e.preventDefault(); setLoginLoading(true); setLoginErr("");
    try {
      const body = { username: loginUser, password: loginPass };
      if (needsTotp) body.totp_code = totpCode;
      const res = await fetch("/api/cms-auth", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
      const d = await res.json();
      if (d.requires_totp) { setNeedsTotp(true); setLoginLoading(false); return; }
      if (!res.ok || !d.success) { setLoginErr(d.error||"Invalid credentials"); setLoginLoading(false); return; }
      setToken(d.token); setExpiresAt(d.expires_at); setTotpEnabled(d.totp_enabled); setAuthed(true); setSessionExpired(false);
    } catch { setLoginErr("Connection failed"); }
    setLoginLoading(false);
  };

  const handleReLogin = async () => {
    setAuthed(false); setToken(""); setExpiresAt(null); setSessionExpired(false); setLoginPass(""); setTotpCode(""); setNeedsTotp(false);
  };

  const api = useCallback(async (body) => {
    setSaving(true);
    try {
      const res = await fetch("/api/cms-admin", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify(body) });
      if (res.status === 401) { handleAuthFailure(); setSaving(false); return; }
      const d = await res.json();
      if (!res.ok) throw new Error(d.error||"Failed");
      await fetchAll(); show("Changes saved");
    } catch(e) { show(e.message,"error"); }
    setSaving(false);
  },[token,fetchAll,show,handleAuthFailure]);

  const handleSave = (type,item) => { const list=data[type]||[]; const so=list.findIndex(x=>x.id===item.id); api({action:"upsert",table:type,item:{...item,sort_order:so>=0?so+1:list.length+1}}); setEditItem(null); setEditType(null); };
  const handleDelete = (type,id) => { if(!confirm("Delete this item?")) return; api({action:"delete",table:type,id}); };
  const handleMove = (type,idx,dir) => { const list=[...(data[type]||[])]; const t=idx+dir; if(t<0||t>=list.length) return; [list[idx],list[t]]=[list[t],list[idx]]; api({action:"reorder",table:type,items:list.map((it,i)=>({id:it.id,sort_order:i+1}))}); };

  const generate2FA = async () => { /* setup logic */ };
  const enable2FA = async () => { /* enable logic */ };
  const disable2FA = async () => { /* disable logic */ };

  if (!authed) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:S.bg,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <form onSubmit={handleLogin} style={{position:"relative",background:S.card,border:`1px solid ${S.border}`,borderRadius:20,padding:"48px 40px",width:420,maxWidth:"90vw",boxShadow:"0 40px 80px rgba(0,0,0,0.6)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
          <div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${S.accentDk},${S.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff"}}>R</div>
          <div><p style={{fontSize:18,fontWeight:800,color:S.text}}>RAN Admin</p><p style={{fontSize:11,color:S.dim}}>Content Management System</p></div>
        </div>
        <a href="#" onClick={e=>{e.preventDefault();setAppPage("home");}} style={{display:"block",fontSize:12,color:S.accent,marginBottom:24,textDecoration:"none"}}>← Back to website</a>
        {editItem && editType && <div style={{background:`${S.accent}10`,border:`1px solid ${S.accent}30`,borderRadius:12,padding:"14px 16px",marginBottom:20}}><p style={{color:S.accent,fontSize:13,fontWeight:600}}>Your unsaved draft has been preserved. Log in to continue editing.</p></div>}
        {!needsTotp ? (<>
          <div style={{marginBottom:16}}><label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Username</label><input value={loginUser} onChange={e=>setLoginUser(e.target.value)} placeholder="admin" style={{width:"100%",padding:"13px 16px",borderRadius:12,border:`1.5px solid ${S.border}`,background:S.bg,color:S.text,fontSize:14,outline:"none"}} /></div>
          <div style={{marginBottom:8}}><label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Password</label><input type="password" value={loginPass} onChange={e=>{setLoginPass(e.target.value);setLoginErr("");}} placeholder="Enter admin password" style={{width:"100%",padding:"13px 16px",borderRadius:12,border:`1.5px solid ${loginErr?S.danger:S.border}`,background:S.bg,color:S.text,fontSize:14,outline:"none"}} autoFocus /></div>
        </>) : (
          <div style={{marginBottom:8}}>
            <div style={{background:`${S.accent}10`,border:`1px solid ${S.accent}30`,borderRadius:12,padding:"14px 16px",marginBottom:20}}><p style={{color:S.accent,fontSize:13,fontWeight:600}}>Password verified. Enter your authenticator code.</p></div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Authenticator Code</label>
            <input value={totpCode} onChange={e=>{setTotpCode(e.target.value.replace(/\D/g,"").slice(0,6));setLoginErr("");}} placeholder="6-digit code" maxLength={6} style={{width:"100%",padding:"13px 16px",borderRadius:12,border:`1.5px solid ${loginErr?S.danger:S.border}`,background:S.bg,color:S.text,fontSize:22,outline:"none",textAlign:"center",letterSpacing:8,fontWeight:800,fontFamily:"monospace"}} autoFocus />
          </div>
        )}
        {loginErr && <p style={{color:S.danger,fontSize:12,marginBottom:8,fontWeight:600}}>{loginErr}</p>}
        <button type="submit" disabled={loginLoading} style={{width:"100%",padding:"14px",borderRadius:12,background:`linear-gradient(135deg,${S.accentDk},${S.accent})`,color:"#fff",border:"none",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:16,opacity:loginLoading?.7:1}}>{loginLoading?"Signing in...":needsTotp?"Verify":"Sign In"}</button>
      </form>
    </div>
  );

  if (loading) return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:S.bg,color:S.accent}}><p>Loading CMS data...</p></div>;

  const NAV = [{id:"dashboard",label:"Dashboard",icon:"◉"},{id:"boardOfTrustees",label:"Board of Trustees",icon:"⬡"},{id:"leaders",label:"Executive Leadership",icon:"★"},{id:"regional",label:"Regional Coordinators",icon:"◈"},{id:"state",label:"State Coordinators",icon:"◇"},{id:"events",label:"Events",icon:"▸"},{id:"articles",label:"News & Articles",icon:"▤"},{id:"galleries",label:"Media & Galleries",icon:"🖼️"},{id:"resources",label:"Resources",icon:"▾"},{id:"security",label:"Security (2FA)",icon:"🔒"}];

  const renderList = (title,sub,items,type,cols,onAdd) => (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28,flexWrap:"wrap",gap:12}}>
        <div><h2 style={{fontSize:26,fontWeight:800,color:S.text,letterSpacing:-.5}}>{title}</h2><p style={{color:S.dim,fontSize:13}}>{sub}</p></div>
        <button onClick={onAdd} style={{padding:"10px 22px",borderRadius:10,background:`linear-gradient(135deg,${S.accentDk},${S.accent})`,color:"#fff",border:"none",fontSize:13,fontWeight:700,cursor:"pointer"}}>+ Add New</button>
      </div>
      {items.length===0 && <p style={{color:S.dimmer,fontSize:14,padding:"40px 0",textAlign:"center"}}>No items yet.</p>}
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {items.map((item,idx) => (
          <div key={item.id} style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:12,padding:"14px 18px",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:40,height:40,borderRadius:10,background:item.image?`url(${item.image}) center/cover`:S.hover,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${S.border}`,fontSize:15,fontWeight:800,color:S.dimmer,overflow:"hidden"}}>{item.image ? <img src={item.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} /> : "?"}</div>
            <div style={{flex:1,minWidth:0}}><p style={{fontSize:14,fontWeight:700,color:S.text}}>{cols[0](item)}</p><p style={{fontSize:11,color:S.dim}}>{cols[1](item)}</p></div>
            <div style={{display:"flex",flexDirection:"column",gap:1}}><button onClick={()=>handleMove(type,idx,-1)} style={{background:"none",border:"none",color:S.dimmer,cursor:"pointer",fontSize:12}}>▲</button><button onClick={()=>handleMove(type,idx,1)} style={{background:"none",border:"none",color:S.dimmer,cursor:"pointer",fontSize:12}}>▼</button></div>
            <button onClick={()=>{setEditItem({...item});setEditType(type);}} style={{padding:"7px 14px",borderRadius:8,background:S.hover,border:"1px solid #2a3a2a",color:"#a3d9a3",fontSize:11,fontWeight:600,cursor:"pointer"}}>Edit</button>
            <button onClick={()=>handleDelete(type,item.id)} style={{padding:"7px 10px",borderRadius:8,background:S.dangerBg,border:`1px solid ${S.dangerBd}`,color:S.danger,fontSize:11,fontWeight:600,cursor:"pointer"}}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div>
      <h2 style={{fontSize:26,fontWeight:800,color:S.text,marginBottom:6}}>Dashboard</h2>
      <p style={{color:S.dim,fontSize:13,marginBottom:32}}>Overview of your website content</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
        {[{l:"Trustees",c:data.boardOfTrustees.length,cl:"#f97316",s:"boardOfTrustees"},{l:"Leaders",c:data.leaders.length,cl:S.accent,s:"leaders"},{l:"Regional",c:data.regional.length,cl:"#f59e0b",s:"regional"},{l:"State",c:data.state.length,cl:"#8b5cf6",s:"state"},{l:"Events",c:data.events.length,cl:"#06b6d4",s:"events"},{l:"Articles",c:data.articles.length,cl:"#ec4899",s:"articles"},{l:"Galleries",c:data.galleries.length,cl:"#3b82f6",s:"galleries"},{l:"Resources",c:data.resources.length,cl:"#14b8a6",s:"resources"}].map(x=>
          <div key={x.l} onClick={()=>setSection(x.s)} style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:14,padding:"24px 20px",cursor:"pointer"}}><p style={{fontSize:36,fontWeight:900,color:x.cl}}>{x.c}</p><p style={{fontSize:12,fontWeight:600,color:S.dim}}>{x.l}</p></div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch(section) {
      case "boardOfTrustees": return renderList("Board of Trustees",`${data.boardOfTrustees.length} members`,data.boardOfTrustees,"boardOfTrustees",[i=>i.name,i=>i.role],()=>{setEditItem({id:uid(),...EMPTY.boardOfTrustees});setEditType("boardOfTrustees");});
      case "leaders": return renderList("Executive Leadership",`${data.leaders.length} members`,data.leaders,"leaders",[i=>i.name,i=>`${i.role} — ${i.dept}`],()=>{setEditItem({id:uid(),...EMPTY.leaders});setEditType("leaders");});
      case "regional": return renderList("Regional Coordinators",`${data.regional.length} coordinators`,data.regional,"regional",[i=>i.name,i=>`${i.region} Region`],()=>{setEditItem({id:uid(),...EMPTY.regional});setEditType("regional");});
      case "state": return renderList("State Coordinators",`${data.state.length} coordinators`,data.state,"state",[i=>i.name,i=>i.state],()=>{setEditItem({id:uid(),...EMPTY.state});setEditType("state");});
      case "events": return renderList("Events",`${data.events.length} events`,data.events,"events",[i=>i.title,i=>`${i.tag} — ${i.event_date||"No date"}`],()=>{setEditItem({id:uid(),...EMPTY.events});setEditType("events");});
      case "articles": return renderList("News & Articles",`${data.articles.length} publications`,data.articles,"articles",[i=>i.title,i=>`${i.tag} — ${i.publish_date||"No date"}`],()=>{setEditItem({id:uid(),...EMPTY.articles});setEditType("articles");});
      case "galleries": return renderList("Media & Galleries",`${data.galleries.length} galleries`,data.galleries,"galleries",[i=>i.title,i=>`${i.event_date||"No date"}`],()=>{setEditItem({id:uid(),...EMPTY.galleries});setEditType("galleries");});
      case "resources": return renderList("Resources",`${data.resources.length} files`,data.resources,"resources",[i=>i.title,i=>`${i.category} — ${i.publish_date||"No date"}`],()=>{setEditItem({id:uid(),...EMPTY.resources});setEditType("resources");});
      case "security": return <div><p>Security settings are accessible via standard admin portal.</p></div>;
      default: return renderDashboard();
    }
  };

  const renderModal = () => {
    if(!editItem||!editType) return null;
    const fields=FIELD_DEFS[editType]||[];
    const isNew=!(data[editType]||[]).find(x=>x.id===editItem.id);
    const modalWidth = editType === "articles" ? 840 : 580;
    return (
      <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",padding:20}} onClick={()=>{setEditItem(null);setEditType(null);}}>
        <div onClick={e=>e.stopPropagation()} style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:18,width:modalWidth,maxWidth:"100%",maxHeight:"90vh",overflow:"auto",padding:"28px 24px",boxShadow:"0 40px 80px rgba(0,0,0,0.5)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><h3 style={{fontSize:18,fontWeight:800,color:S.text}}>{isNew?"Add":"Edit"}</h3><button onClick={()=>{setEditItem(null);setEditType(null);}} style={{background:"none",border:"none",color:S.dim,fontSize:20,cursor:"pointer"}}>✕</button></div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {fields.map(f => {
              if (f.type === "image_list") {
                const list = (typeof editItem[f.key] === "string" ? JSON.parse(editItem[f.key] || "[]") : editItem[f.key]) || [];
                return <div key={f.key}>
                  <label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>{f.label}</label>
                  {list.length > 0 && <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))",gap:8,marginBottom:12}}>
                    {list.map((img, i) => (
                      <div key={i} style={{position:"relative",aspectRatio:"1",borderRadius:8,overflow:"hidden",border:`1px solid ${S.border}`}}>
                        <img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
                        <button onClick={()=>{ const copy=[...list]; copy.splice(i,1); setEditItem({...editItem, [f.key]: JSON.stringify(copy)}); }} style={{position:"absolute",top:4,right:4,background:S.dangerBg,color:S.danger,border:"none",borderRadius:"50%",width:20,height:20,fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                      </div>
                    ))}
                  </div>}
                  <FileUploadField value="" onChange={(val) => { if(val) setEditItem({...editItem, [f.key]: JSON.stringify([...list, val])}); }} token={token} fieldType="image" />
                </div>;
              }
              if (f.type === "image") {
                return <div key={f.key}><label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>{f.label}</label><FileUploadField value={editItem[f.key] || ""} onChange={(val) => setEditItem({...editItem, [f.key]: val})} token={token} fieldType="image" /></div>;
              }
              if (f.type === "file") {
                return <div key={f.key}><label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>{f.label}{f.required && <span style={{color:S.accent}}> *</span>}</label><FileUploadField value={editItem[f.key] || ""} onChange={(val) => setEditItem({...editItem, [f.key]: val})} token={token} fieldType="file" allowPrivate={f.allowPrivate} /></div>;
              }
              if (f.type === "richtext") {
                return <div key={f.key}><label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>{f.label}{f.required && <span style={{color:S.accent}}> *</span>}</label><RichTextEditor value={editItem[f.key] || ""} onChange={(val) => setEditItem({...editItem, [f.key]: val})} token={token} placeholder={f.ph || "Write content…"} /></div>;
              }
              return <div key={f.key}>
                <label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>{f.label}{f.required&&<span style={{color:S.accent}}> *</span>}</label>
                {f.type==="select"?<select value={editItem[f.key]||""} onChange={e=>setEditItem({...editItem,[f.key]:e.target.value})} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${S.border}`,background:S.bg,color:S.text,fontSize:13,outline:"none"}}>{f.options.map(o=><option key={o} value={o}>{o}</option>)}</select>
                :f.type==="textarea"?<textarea value={editItem[f.key]||""} onChange={e=>setEditItem({...editItem,[f.key]:e.target.value})} placeholder={f.ph||""} rows={3} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${S.border}`,background:S.bg,color:S.text,fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
                :<input type={f.type} value={editItem[f.key]||""} onChange={e=>setEditItem({...editItem,[f.key]:e.target.value})} placeholder={f.ph||""} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${S.border}`,background:S.bg,color:S.text,fontSize:13,outline:"none"}}/>}
              </div>;
            })}
          </div>
          <div style={{display:"flex",gap:10,marginTop:24}}>
            <button onClick={()=>handleSave(editType,editItem)} style={{flex:1,padding:"13px",borderRadius:12,background:`linear-gradient(135deg,${S.accentDk},${S.accent})`,color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer"}}>{isNew?"Add":"Save"}</button>
            <button onClick={()=>{setEditItem(null);setEditType(null);}} style={{padding:"13px 20px",borderRadius:12,background:S.hover,border:"1px solid #2a3a2a",color:"#a3d9a3",fontSize:14,fontWeight:600,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{display:"flex",minHeight:"100vh",background:S.bg,fontFamily:"'Segoe UI',system-ui,sans-serif",color:S.text}}>
      <aside style={{width:240,background:"#0d120d",borderRight:`1px solid ${S.border}`,padding:"20px 0",display:"flex",flexDirection:"column",position:"fixed",top:0,bottom:0,left:0,zIndex:100}}>
        <div style={{padding:"0 16px",marginBottom:28}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${S.accentDk},${S.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#fff"}}>R</div><div><p style={{fontSize:13,fontWeight:800,color:S.text}}>RAN CMS</p><p style={{fontSize:9,color:S.dimmer}}>Content Manager</p></div></div></div>
        <nav style={{flex:1,display:"flex",flexDirection:"column",gap:2,padding:"0 6px"}}>
          {NAV.map(n=><button key={n.id} onClick={()=>setSection(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",borderRadius:9,border:"none",background:section===n.id?S.hover:"transparent",color:section===n.id?S.accent:S.dim,fontSize:12,fontWeight:section===n.id?700:500,cursor:"pointer",textAlign:"left",width:"100%"}}><span style={{fontSize:13,width:18,textAlign:"center",opacity:.7}}>{n.icon}</span>{n.label}</button>)}
        </nav>
        <div style={{padding:"12px 16px",borderTop:`1px solid ${S.border}`,display:"flex",flexDirection:"column",gap:8}}>
          <button onClick={()=>{setAppPage("home");window.scrollTo(0,0);}} style={{width:"100%",padding:"9px",borderRadius:8,background:S.hover,border:"1px solid #2a3a2a",color:"#a3d9a3",fontSize:11,fontWeight:600,cursor:"pointer"}}>← View Website</button>
          <button onClick={()=>{setAuthed(false);setToken("");setExpiresAt(null);setLoginPass("");setTotpCode("");setNeedsTotp(false);setEditItem(null);setEditType(null);}} style={{width:"100%",padding:"9px",borderRadius:8,background:"#1a1a1a",border:"1px solid #2a2a2a",color:S.danger,fontSize:11,fontWeight:600,cursor:"pointer"}}>Sign Out</button>
        </div>
      </aside>
      <main style={{flex:1,marginLeft:240,padding:"28px 36px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32,padding:"10px 0",borderBottom:`1px solid ${S.border}`,gap:16,flexWrap:"wrap"}}>
          <p style={{fontSize:11,color:S.dimmer}}>{saving?"⟳ Saving...":"✓ All changes saved"}</p>
          <div style={{display:"flex",alignItems:"center",gap:16}}><SessionPill expiresAt={expiresAt} onExtend={refreshSession} /><p style={{fontSize:11,color:S.dimmer}}>recyclersassociation.org</p></div>
        </div>
        {renderContent()}
      </main>
      {renderModal()}
      {sessionExpired && <ExpiredModal onReLogin={handleReLogin} />}
      {toast&&<div style={{position:"fixed",bottom:24,right:24,zIndex:2000,background:toast.type==="success"?S.accentDk:"#dc2626",color:"#fff",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:600,boxShadow:"0 12px 32px rgba(0,0,0,0.4)"}}>{toast.msg}</div>}
    </div>
  );
}