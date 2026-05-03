// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { COLORS, FONTS, GRADIENTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import Icon from "./Icon";

const NAV_ITEMS = [
  { label: "Home", page: "home" },
  { label: "About Us", page: "about" },
  { label: "Events", page: "events" },
  { label: "Gallery", page: "gallery" },
  { label: "Blog", page: "blog" },
  { label: "Contact", page: "contact" },
];

export default function Navbar({ currentPage, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile } = useBreakpoints();
  useEffect(() => { const h = () => setScrolled(window.scrollY > 20); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => { if (!isMobile) setMenuOpen(false); }, [isMobile]);
  const navigate = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); };

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: scrolled ? "rgba(250,250,249,0.94)" : "rgba(250,250,249,0.8)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", transition: "all 0.3s", borderBottom: scrolled ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1400, margin: "0 auto", padding: isMobile ? "14px 20px" : "16px 32px" }}>
        <div onClick={() => navigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="Recyclers Association of Nigeria" style={{ height: isMobile ? 32 : 40, width: "auto" }} />
        </div>
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {NAV_ITEMS.map((n) => (
              <a key={n.page} href="#" onClick={(e) => { e.preventDefault(); navigate(n.page); }} style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, color: currentPage === n.page ? "#15803d" : "#64748b", borderBottom: currentPage === n.page ? "2px solid #15803d" : "2px solid transparent", paddingBottom: 4, textDecoration: "none" }}>{n.label}</a>
            ))}
            <button onClick={() => window.open("https://portal.recyclersassociation.org/", "_blank", "noopener,noreferrer")} style={{ background: GRADIENTS.primary, color: "#fff", padding: "10px 24px", borderRadius: 12, border: "none", fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Member Login</button>
          </div>
        )}
        {isMobile && <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", padding: 8 }}><Icon name={menuOpen ? "close" : "menu"} size={24} style={{ color: COLORS.onSurface }} /></button>}
      </div>
      {isMobile && menuOpen && (
        <div style={{ background: COLORS.surfaceContainerLowest, borderTop: "1px solid rgba(0,0,0,0.05)", padding: "16px 20px 24px", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((n) => (
            <a key={n.page} href="#" onClick={(e) => { e.preventDefault(); navigate(n.page); }} style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 15, color: currentPage === n.page ? COLORS.primary : COLORS.onSurfaceVariant, padding: "12px 8px", borderRadius: 8, background: currentPage === n.page ? `${COLORS.primary}10` : "transparent", textDecoration: "none" }}>{n.label}</a>
          ))}
          <button onClick={() => window.open("https://portal.recyclersassociation.org/", "_blank", "noopener,noreferrer")} style={{ background: GRADIENTS.primary, color: "#fff", padding: "14px 24px", borderRadius: 12, border: "none", fontFamily: FONTS.headline, fontWeight: 700, fontSize: 14, marginTop: 8, cursor: "pointer" }}>Member Login</button>
        </div>
      )}
    </nav>
  );
}