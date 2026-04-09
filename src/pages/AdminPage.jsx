import { useState, useEffect, useCallback } from "react";

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,7);
const S = { bg:"#0a0f0a", card:"#111611", border:"#1e2a1e", accent:"#22c55e", accentDk:"#15803d", text:"#e8f5e9", dim:"#6b8a6b", dimmer:"#4a6b4a", hover:"#1a261a", danger:"#f87171", dangerBg:"#261a1a", dangerBd:"#3a2a2a" };

const FIELD_DEFS = {
  leaders: [ {key:"name",label:"Full Name",type:"text",required:true},{key:"role",label:"Role / Title",type:"text",required:true},{key:"dept",label:"Department",type:"text"},{key:"image",label:"Photo URL",type:"text",ph:"/team/name.jpg"} ],
  regional: [ {key:"name",label:"Full Name",type:"text",required:true},{key:"region",label:"Region",type:"select",options:["South-South","North-Central","North-East","South-East","South-West","North-West"]},{key:"image",label:"Photo URL",type:"text",ph:"/team/name.jpg"} ],
  state: [ {key:"name",label:"Full Name",type:"text",required:true},{key:"state",label:"State",type:"text",required:true},{key:"image",label:"Photo URL",type:"text",ph:"/team/name.jpg"} ],
  events: [ {key:"title",label:"Event Title",type:"text",required:true},{key:"tag",label:"Category",type:"select",options:["Conference","Workshop","Webinar","Meeting"]},{key:"description",label:"Description",type:"textarea"},{key:"event_date",label:"Date",type:"date",required:true},{key:"event_time",label:"Time",type:"text"},{key:"location",label:"Location",type:"text"},{key:"loc_type",label:"Type",type:"select",options:["physical","virtual"]},{key:"image",label:"Banner URL",type:"text"},{key:"link",label:"Registration Link",type:"text"} ],
  articles: [ {key:"title",label:"Title",type:"text",required:true},{key:"tag",label:"Category",type:"select",options:["Insights","National","State News","Spotlights"]},{key:"publish_date",label:"Date",type:"date",required:true},{key:"description",label:"Short Description",type:"textarea"},{key:"image",label:"Cover Image URL",type:"text"},{key:"author",label:"Author",type:"text"},{key:"company",label:"Company",type:"text"},{key:"phone",label:"Phone",type:"text"},{key:"content",label:"Full Content",type:"longtext",ph:"Each paragraph on a new line. Bullets start with •"} ],
};
const EMPTY = { leaders:{name:"",role:"",dept:"",image:""}, regional:{name:"",region:"South-South",image:""}, state:{name:"",state:"",image:""}, events:{title:"",tag:"Conference",description:"",event_date:"",event_time:"",location:"",loc_type:"physical",image:"",link:""}, articles:{title:"",tag:"Insights",publish_date:new Date().toISOString().slice(0,10),description:"",image:"",author:"",phone:"",company:"",content:""} };

export default function AdminPage({ setPage: setAppPage }) {
  // Auth state
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState("");
  const [loginUser, setLoginUser] = useState("admin");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [needsTotp, setNeedsTotp] = useState(false);
  const [totpCode, setTotpCode] = useState("");
  const [totpEnabled, setTotpEnabled] = useState(false);

  // 2FA setup state
  const [setupMode, setSetupMode] = useState(false);
  const [setupSecret, setSetupSecret] = useState("");
  const [setupUri, setSetupUri] = useState("");
  const [setupCode, setSetupCode] = useState("");
  const [setupMsg, setSetupMsg] = useState("");
  const [disablePass, setDisablePass] = useState("");

  // CMS state
  const [section, setSection] = useState("dashboard");
  const [data, setData] = useState({ leaders:[], regional:[], state:[], events:[], articles:[] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editType, setEditType] = useState(null);

  const show = useCallback((msg,type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); },[]);

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch("/api/cms-public");
      if (!res.ok) throw new Error("Fetch failed");
      const raw = await res.json();
      setData({ leaders: raw.leaders||[], regional: raw.regional||[], state: raw.stateCoords||[], events: (raw.events||[]).map(e=>({...e,event_date:e.event_date?e.event_date.slice(0,10):"",event_time:e.event_time||""})), articles: (raw.articles||[]).map(a=>({...a,publish_date:a.publish_date?a.publish_date.slice(0,10):""})) });
    } catch(e) { console.error(e); }
    setLoading(false);
  },[]);

  useEffect(()=>{ if(authed) fetchAll(); },[authed,fetchAll]);

  // ── LOGIN ──
  const handleLogin = async (e) => {
    e.preventDefault(); setLoginLoading(true); setLoginErr("");
    try {
      const body = { username: loginUser, password: loginPass };
      if (needsTotp) body.totp_code = totpCode;
      const res = await fetch("/api/cms-auth", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
      const d = await res.json();
      if (d.requires_totp) { setNeedsTotp(true); setLoginLoading(false); return; }
      if (!res.ok || !d.success) { setLoginErr(d.error||"Invalid credentials"); setLoginLoading(false); return; }
      setToken(d.token); setTotpEnabled(d.totp_enabled); setAuthed(true);
    } catch { setLoginErr("Connection failed"); }
    setLoginLoading(false);
  };

  const api = useCallback(async (body) => {
    setSaving(true);
    try {
      const res = await fetch("/api/cms-admin", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify(body) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error||"Failed");
      await fetchAll(); show("Changes saved");
    } catch(e) { show(e.message,"error"); }
    setSaving(false);
  },[token,fetchAll,show]);

  const handleSave = (type,item) => { const list=data[type]||[]; const so=list.findIndex(x=>x.id===item.id); api({action:"upsert",table:type,item:{...item,sort_order:so>=0?so+1:list.length+1}}); setEditItem(null); setEditType(null); };
  const handleDelete = (type,id) => { if(!confirm("Delete this item?")) return; api({action:"delete",table:type,id}); };
  const handleMove = (type,idx,dir) => { const list=[...(data[type]||[])]; const t=idx+dir; if(t<0||t>=list.length) return; [list[idx],list[t]]=[list[t],list[idx]]; api({action:"reorder",table:type,items:list.map((it,i)=>({id:it.id,sort_order:i+1}))}); };

  // ── 2FA SETUP ──
  const generate2FA = async () => {
    setSetupMsg("");
    const res = await fetch("/api/cms-setup-2fa", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify({action:"generate"}) });
    const d = await res.json();
    if (d.success) { setSetupSecret(d.secret); setSetupUri(d.uri); }
    else setSetupMsg(d.error||"Failed to generate");
  };
  const enable2FA = async () => {
    setSetupMsg("");
    const res = await fetch("/api/cms-setup-2fa", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify({action:"enable",totp_code:setupCode}) });
    const d = await res.json();
    if (d.success) { setTotpEnabled(true); setSetupMode(false); setSetupSecret(""); setSetupUri(""); show("2FA enabled!"); }
    else setSetupMsg(d.error||"Invalid code");
  };
  const disable2FA = async () => {
    setSetupMsg("");
    const res = await fetch("/api/cms-setup-2fa", { method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify({action:"disable",password:disablePass}) });
    const d = await res.json();
    if (d.success) { setTotpEnabled(false); setSetupMode(false); setDisablePass(""); show("2FA disabled"); }
    else setSetupMsg(d.error||"Failed");
  };

  // ── LOGIN SCREEN ──
  if (!authed) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:S.bg,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{position:"fixed",inset:0,opacity:0.04,backgroundImage:"radial-gradient(circle at 25% 25%,#22c55e 1px,transparent 1px),radial-gradient(circle at 75% 75%,#22c55e 1px,transparent 1px)",backgroundSize:"60px 60px"}}/>
      <form onSubmit={handleLogin} style={{position:"relative",background:S.card,border:`1px solid ${S.border}`,borderRadius:20,padding:"48px 40px",width:420,maxWidth:"90vw",boxShadow:"0 40px 80px rgba(0,0,0,0.6)"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}>
          <div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${S.accentDk},${S.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"#fff"}}>R</div>
          <div><p style={{fontSize:18,fontWeight:800,color:S.text}}>RAN Admin</p><p style={{fontSize:11,color:S.dim}}>Content Management System</p></div>
        </div>
        <a href="#" onClick={e=>{e.preventDefault();setAppPage("home");}} style={{display:"block",fontSize:12,color:S.accent,marginBottom:24,textDecoration:"none"}}>← Back to website</a>

        {!needsTotp ? (<>
          <div style={{marginBottom:16}}><label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Username</label>
            <input value={loginUser} onChange={e=>setLoginUser(e.target.value)} placeholder="admin" style={{width:"100%",padding:"13px 16px",borderRadius:12,border:`1.5px solid ${S.border}`,background:S.bg,color:S.text,fontSize:14,outline:"none"}} /></div>
          <div style={{marginBottom:8}}><label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Password</label>
            <input type="password" value={loginPass} onChange={e=>{setLoginPass(e.target.value);setLoginErr("");}} placeholder="Enter admin password" style={{width:"100%",padding:"13px 16px",borderRadius:12,border:`1.5px solid ${loginErr?S.danger:S.border}`,background:S.bg,color:S.text,fontSize:14,outline:"none"}} autoFocus /></div>
        </>) : (
          <div style={{marginBottom:8}}>
            <div style={{background:`${S.accent}10`,border:`1px solid ${S.accent}30`,borderRadius:12,padding:"14px 16px",marginBottom:20}}>
              <p style={{color:S.accent,fontSize:13,fontWeight:600}}>Password verified. Enter your authenticator code.</p>
            </div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Authenticator Code</label>
            <input value={totpCode} onChange={e=>{setTotpCode(e.target.value.replace(/\D/g,"").slice(0,6));setLoginErr("");}} placeholder="6-digit code" maxLength={6} style={{width:"100%",padding:"13px 16px",borderRadius:12,border:`1.5px solid ${loginErr?S.danger:S.border}`,background:S.bg,color:S.text,fontSize:22,outline:"none",textAlign:"center",letterSpacing:8,fontWeight:800,fontFamily:"monospace"}} autoFocus />
          </div>
        )}
        {loginErr && <p style={{color:S.danger,fontSize:12,marginBottom:8,fontWeight:600}}>{loginErr}</p>}
        <button type="submit" disabled={loginLoading} style={{width:"100%",padding:"14px",borderRadius:12,background:`linear-gradient(135deg,${S.accentDk},${S.accent})`,color:"#fff",border:"none",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:16,opacity:loginLoading?.7:1}}>{loginLoading?"Signing in...":needsTotp?"Verify":"Sign In"}</button>
        {needsTotp && <button type="button" onClick={()=>{setNeedsTotp(false);setTotpCode("");setLoginErr("");}} style={{width:"100%",padding:"12px",borderRadius:12,background:"transparent",border:`1px solid ${S.border}`,color:S.dim,fontSize:13,cursor:"pointer",marginTop:8}}>Back to password</button>}
      </form>
    </div>
  );

  if (loading) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:S.bg,color:S.accent,fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <div style={{textAlign:"center"}}><div style={{width:40,height:40,border:`3px solid ${S.border}`,borderTopColor:S.accent,borderRadius:"50%",animation:"spin .8s linear infinite",margin:"0 auto 16px"}}/><p style={{fontSize:14,color:S.dim}}>Loading CMS data...</p></div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const NAV = [{id:"dashboard",label:"Dashboard",icon:"◉"},{id:"leaders",label:"Executive Leadership",icon:"★"},{id:"regional",label:"Regional Coordinators",icon:"◈"},{id:"state",label:"State Coordinators",icon:"◇"},{id:"events",label:"Events",icon:"▸"},{id:"articles",label:"News & Articles",icon:"▤"},{id:"security",label:"Security (2FA)",icon:"🔒"}];

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
            <div style={{width:40,height:40,borderRadius:10,background:item.image?`url(${item.image}) center/cover`:S.hover,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${S.border}`,fontSize:15,fontWeight:800,color:S.dimmer}}>{!item.image&&(cols[0](item)||"?").charAt(0).toUpperCase()}</div>
            <div style={{flex:1,minWidth:0}}><p style={{fontSize:14,fontWeight:700,color:S.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{cols[0](item)}</p><p style={{fontSize:11,color:S.dim,marginTop:1}}>{cols[1](item)}</p></div>
            <div style={{display:"flex",flexDirection:"column",gap:1}}><button onClick={()=>handleMove(type,idx,-1)} style={{background:"none",border:"none",color:S.dimmer,cursor:"pointer",fontSize:12,padding:"1px 5px"}}>▲</button><button onClick={()=>handleMove(type,idx,1)} style={{background:"none",border:"none",color:S.dimmer,cursor:"pointer",fontSize:12,padding:"1px 5px"}}>▼</button></div>
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
        {[{l:"Leaders",c:data.leaders.length,cl:S.accent,s:"leaders"},{l:"Regional",c:data.regional.length,cl:"#f59e0b",s:"regional"},{l:"State",c:data.state.length,cl:"#8b5cf6",s:"state"},{l:"Events",c:data.events.length,cl:"#06b6d4",s:"events"},{l:"Articles",c:data.articles.length,cl:"#ec4899",s:"articles"}].map(x=>
          <div key={x.l} onClick={()=>setSection(x.s)} style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:14,padding:"24px 20px",cursor:"pointer",position:"relative",overflow:"hidden"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=x.cl+"44";e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=S.border;e.currentTarget.style.transform="none";}}>
            <p style={{fontSize:36,fontWeight:900,color:x.cl,letterSpacing:-2}}>{x.c}</p><p style={{fontSize:12,fontWeight:600,color:S.dim}}>{x.l}</p></div>
        )}
      </div>
      {!totpEnabled && <div style={{marginTop:32,background:"#1a1a0a",border:"1px solid #3a3a1a",borderRadius:14,padding:"20px 24px",display:"flex",alignItems:"center",gap:16}}>
        <span style={{fontSize:24}}>⚠️</span>
        <div style={{flex:1}}><p style={{color:"#fbbf24",fontWeight:700,fontSize:14}}>Two-factor authentication is not enabled</p><p style={{color:"#a3a060",fontSize:12,marginTop:2}}>Secure your admin account with an authenticator app.</p></div>
        <button onClick={()=>setSection("security")} style={{padding:"8px 18px",borderRadius:8,background:"#fbbf24",color:"#1a1a0a",border:"none",fontSize:12,fontWeight:700,cursor:"pointer"}}>Set Up 2FA</button>
      </div>}
    </div>
  );

  // ── SECURITY / 2FA SECTION ──
  const renderSecurity = () => (
    <div>
      <h2 style={{fontSize:26,fontWeight:800,color:S.text,marginBottom:6}}>Security Settings</h2>
      <p style={{color:S.dim,fontSize:13,marginBottom:32}}>Manage two-factor authentication for your admin account</p>

      <div style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:16,padding:"32px 28px",maxWidth:560}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
          <div style={{width:48,height:48,borderRadius:12,background:totpEnabled?"#15803d20":"#fbbf2420",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{totpEnabled?"🔒":"🔓"}</div>
          <div><p style={{fontSize:16,fontWeight:800,color:S.text}}>Two-Factor Authentication</p><p style={{fontSize:12,color:totpEnabled?S.accent:"#fbbf24",fontWeight:600}}>{totpEnabled?"Enabled — your account is protected":"Not enabled"}</p></div>
        </div>

        {!totpEnabled && !setupMode && (
          <button onClick={()=>{setSetupMode(true);generate2FA();}} style={{padding:"12px 24px",borderRadius:10,background:`linear-gradient(135deg,${S.accentDk},${S.accent})`,color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer"}}>Enable 2FA</button>
        )}

        {!totpEnabled && setupMode && (
          <div>
            <p style={{color:S.text,fontSize:14,marginBottom:16,lineHeight:1.6}}>Scan the QR code below with your authenticator app (Google Authenticator, Authy, 1Password, etc.)</p>

            {setupUri && (
              <div style={{marginBottom:20}}>
                <div style={{background:"#fff",padding:16,borderRadius:12,display:"inline-block",marginBottom:12}}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(setupUri)}`} alt="2FA QR Code" style={{width:200,height:200,display:"block"}} />
                </div>
                <div style={{marginTop:8}}>
                  <p style={{fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Manual entry key</p>
                  <code style={{background:S.bg,padding:"8px 14px",borderRadius:8,fontSize:14,color:S.accent,fontWeight:700,display:"inline-block",letterSpacing:2,wordBreak:"break-all",border:`1px solid ${S.border}`}}>{setupSecret}</code>
                </div>
              </div>
            )}

            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Enter 6-digit code from app</label>
              <input value={setupCode} onChange={e=>setSetupCode(e.target.value.replace(/\D/g,"").slice(0,6))} placeholder="000000" maxLength={6} style={{width:180,padding:"12px 16px",borderRadius:10,border:`1px solid ${S.border}`,background:S.bg,color:S.text,fontSize:22,outline:"none",textAlign:"center",letterSpacing:8,fontWeight:800,fontFamily:"monospace"}} />
            </div>
            {setupMsg && <p style={{color:S.danger,fontSize:12,marginBottom:12,fontWeight:600}}>{setupMsg}</p>}
            <div style={{display:"flex",gap:10}}>
              <button onClick={enable2FA} disabled={setupCode.length!==6} style={{padding:"12px 24px",borderRadius:10,background:`linear-gradient(135deg,${S.accentDk},${S.accent})`,color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",opacity:setupCode.length===6?1:.5}}>Verify & Enable</button>
              <button onClick={()=>{setSetupMode(false);setSetupSecret("");setSetupUri("");setSetupCode("");setSetupMsg("");}} style={{padding:"12px 20px",borderRadius:10,background:S.hover,border:`1px solid #2a3a2a`,color:"#a3d9a3",fontSize:13,fontWeight:600,cursor:"pointer"}}>Cancel</button>
            </div>
          </div>
        )}

        {totpEnabled && !setupMode && (
          <div>
            <p style={{color:S.dim,fontSize:13,lineHeight:1.6,marginBottom:16}}>To disable 2FA, enter your current password below.</p>
            <div style={{display:"flex",gap:10,alignItems:"flex-end"}}>
              <div><label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.5,textTransform:"uppercase",marginBottom:6}}>Current Password</label>
                <input type="password" value={disablePass} onChange={e=>setDisablePass(e.target.value)} placeholder="Enter password" style={{width:220,padding:"11px 14px",borderRadius:10,border:`1px solid ${S.border}`,background:S.bg,color:S.text,fontSize:14,outline:"none"}} /></div>
              <button onClick={disable2FA} style={{padding:"11px 20px",borderRadius:10,background:S.dangerBg,border:`1px solid ${S.dangerBd}`,color:S.danger,fontSize:13,fontWeight:700,cursor:"pointer"}}>Disable 2FA</button>
            </div>
            {setupMsg && <p style={{color:S.danger,fontSize:12,marginTop:8,fontWeight:600}}>{setupMsg}</p>}
          </div>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch(section) {
      case "leaders": return renderList("Executive Leadership",`${data.leaders.length} members`,data.leaders,"leaders",[i=>i.name||"(Unnamed)",i=>`${i.role} — ${i.dept}`],()=>{setEditItem({id:uid(),...EMPTY.leaders});setEditType("leaders");});
      case "regional": return renderList("Regional Coordinators",`${data.regional.length} coordinators`,data.regional,"regional",[i=>i.name||"(Unnamed)",i=>`${i.region} Region`],()=>{setEditItem({id:uid(),...EMPTY.regional});setEditType("regional");});
      case "state": return renderList("State Coordinators",`${data.state.length} coordinators`,data.state,"state",[i=>i.name||"(Unnamed)",i=>i.state],()=>{setEditItem({id:uid(),...EMPTY.state});setEditType("state");});
      case "events": return renderList("Events",`${data.events.length} events`,data.events,"events",[i=>i.title||"(Untitled)",i=>`${i.tag} — ${i.event_date||"No date"}`],()=>{setEditItem({id:uid(),...EMPTY.events});setEditType("events");});
      case "articles": return renderList("News & Articles",`${data.articles.length} publications`,data.articles,"articles",[i=>i.title||"(Untitled)",i=>`${i.tag} — ${i.publish_date||"No date"}`],()=>{setEditItem({id:uid(),...EMPTY.articles});setEditType("articles");});
      case "security": return renderSecurity();
      default: return renderDashboard();
    }
  };

  const renderModal = () => {
    if(!editItem||!editType) return null;
    const fields=FIELD_DEFS[editType]||[];
    const isNew=!(data[editType]||[]).find(x=>x.id===editItem.id);
    return (
      <div style={{position:"fixed",inset:0,zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.7)",backdropFilter:"blur(8px)",padding:20}} onClick={()=>{setEditItem(null);setEditType(null);}}>
        <div onClick={e=>e.stopPropagation()} style={{background:S.card,border:`1px solid ${S.border}`,borderRadius:18,width:540,maxWidth:"100%",maxHeight:"85vh",overflow:"auto",padding:"28px 24px",boxShadow:"0 40px 80px rgba(0,0,0,0.5)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><h3 style={{fontSize:18,fontWeight:800,color:S.text}}>{isNew?"Add":"Edit"}</h3><button onClick={()=>{setEditItem(null);setEditType(null);}} style={{background:"none",border:"none",color:S.dim,fontSize:20,cursor:"pointer"}}>✕</button></div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {fields.map(f=><div key={f.key}>
              <label style={{display:"block",fontSize:10,fontWeight:700,color:S.dimmer,letterSpacing:1.2,textTransform:"uppercase",marginBottom:5}}>{f.label}{f.required&&<span style={{color:S.accent}}> *</span>}</label>
              {f.type==="select"?<select value={editItem[f.key]||""} onChange={e=>setEditItem({...editItem,[f.key]:e.target.value})} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${S.border}`,background:S.bg,color:S.text,fontSize:13,outline:"none"}}>{f.options.map(o=><option key={o} value={o}>{o}</option>)}</select>
              :f.type==="textarea"?<textarea value={editItem[f.key]||""} onChange={e=>setEditItem({...editItem,[f.key]:e.target.value})} placeholder={f.ph||""} rows={3} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${S.border}`,background:S.bg,color:S.text,fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
              :f.type==="longtext"?<textarea value={editItem[f.key]||""} onChange={e=>setEditItem({...editItem,[f.key]:e.target.value})} placeholder={f.ph||""} rows={10} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${S.border}`,background:S.bg,color:S.text,fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit",lineHeight:1.7}}/>
              :<input type={f.type} value={editItem[f.key]||""} onChange={e=>setEditItem({...editItem,[f.key]:e.target.value})} placeholder={f.ph||""} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${S.border}`,background:S.bg,color:S.text,fontSize:13,outline:"none"}}/>}
            </div>)}
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
        <div style={{padding:"0 16px",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:32,height:32,borderRadius:9,background:`linear-gradient(135deg,${S.accentDk},${S.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:900,color:"#fff"}}>R</div><div><p style={{fontSize:13,fontWeight:800,color:S.text}}>RAN CMS</p><p style={{fontSize:9,color:S.dimmer}}>Content Manager</p></div></div>
        </div>
        <nav style={{flex:1,display:"flex",flexDirection:"column",gap:2,padding:"0 6px"}}>
          {NAV.map(n=><button key={n.id} onClick={()=>setSection(n.id)} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",borderRadius:9,border:"none",background:section===n.id?S.hover:"transparent",color:section===n.id?S.accent:S.dim,fontSize:12,fontWeight:section===n.id?700:500,cursor:"pointer",textAlign:"left",width:"100%"}}><span style={{fontSize:13,width:18,textAlign:"center",opacity:.7}}>{n.icon}</span>{n.label}</button>)}
        </nav>
        <div style={{padding:"12px 16px",borderTop:`1px solid ${S.border}`,display:"flex",flexDirection:"column",gap:8}}>
          <button onClick={()=>{setAppPage("home");window.scrollTo(0,0);}} style={{width:"100%",padding:"9px",borderRadius:8,background:S.hover,border:"1px solid #2a3a2a",color:"#a3d9a3",fontSize:11,fontWeight:600,cursor:"pointer"}}>← View Website</button>
          <button onClick={()=>{setAuthed(false);setToken("");setLoginPass("");setTotpCode("");setNeedsTotp(false);}} style={{width:"100%",padding:"9px",borderRadius:8,background:"#1a1a1a",border:"1px solid #2a2a2a",color:S.danger,fontSize:11,fontWeight:600,cursor:"pointer"}}>Sign Out</button>
        </div>
      </aside>
      <main style={{flex:1,marginLeft:240,padding:"28px 36px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32,padding:"10px 0",borderBottom:`1px solid ${S.border}`}}><p style={{fontSize:11,color:S.dimmer}}>{saving?"⟳ Saving...":"✓ All changes saved"}</p><p style={{fontSize:11,color:S.dimmer}}>recyclersassociation.org</p></div>
        {renderContent()}
      </main>
      {renderModal()}
      {toast&&<div style={{position:"fixed",bottom:24,right:24,zIndex:2000,background:toast.type==="success"?S.accentDk:"#dc2626",color:"#fff",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:600,boxShadow:"0 12px 32px rgba(0,0,0,0.4)",animation:"su .3s ease"}}>{toast.type==="success"?"✓":"✕"} {toast.msg}</div>}
      <style>{`@keyframes su{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes spin{to{transform:rotate(360deg)}}*{box-sizing:border-box;margin:0}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:${S.bg}}::-webkit-scrollbar-thumb{background:${S.border};border-radius:3px}input[type="date"]::-webkit-calendar-picker-indicator{filter:invert(0.7)}`}</style>
    </div>
  );
}
