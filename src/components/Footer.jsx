import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import Icon from "./Icon";

const LINKS = [
  { title: "Quick Links", items: [{ label: "About Us", page: "about" }, { label: "News", page: "blog" }, { label: "Events", page: "events" }, { label: "Contact", page: "contact" }] },
  // Added the page property to Membership Guide here:
  { title: "Resources", items: [{ label: "Membership Guide", page: "membership" }, { label: "Policy Papers" }, { label: "Privacy Policy" }, { label: "Terms of Service" }] },
];

export default function Footer({ setPage }) {
  const { isMobile } = useBreakpoints();
  const nav = (p) => { if (p) { setPage(p); window.scrollTo(0, 0); } };
  
  return (
    <footer style={{ background: "#f5f5f4", paddingTop: isMobile ? 48 : 80, paddingBottom: 40 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 20px" : "0 32px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? 32 : 48 }}>
        <div>
          <div style={{ fontFamily: FONTS.headline, fontWeight: 900, fontSize: 20, color: "#14532d", marginBottom: 12 }}>RAN</div>
          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, maxWidth: 280 }}>The authoritative body representing recycling professionals and coordinating Nigeria's transition to a sustainable circular economy.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {["public", "rss_feed", "share"].map((ic) => (
              <a key={ic} href="#" onClick={(e) => e.preventDefault()} style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.primary, textDecoration: "none" }}><Icon name={ic} size={18} /></a>
            ))}
          </div>
        </div>
        {LINKS.map((col) => (
          <div key={col.title}>
            <h4 style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, color: COLORS.onSurface, marginBottom: 16 }}>{col.title}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {col.items.map((it) => (
                <a key={it.label} href="#" onClick={(e) => { e.preventDefault(); if(it.page) nav(it.page); }} style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>{it.label}</a>
              ))}
            </div>
          </div>
        ))}
        <div>
          <h4 style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, color: COLORS.onSurface, marginBottom: 16 }}>Head Office</h4>
          <address style={{ fontStyle: "normal", fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
            F3, Global Plaza, Kaura District<br />Abuja, FCT, Nigeria
            <span style={{ display: "block", marginTop: 14, color: COLORS.primary, fontWeight: 700 }}>ran@recyclersassociation.org<br />+234 907 981 9777</span>
          </address>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 20px" : "0 32px" }}>
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: 40, paddingTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#94a3b8" }}>© 2026 Recyclers Association of Nigeria. Engineering a Sustainable Future.</p>
        </div>
      </div>
    </footer>
  );
}