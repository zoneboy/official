import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
const LINKS = [
  { title: "Quick Links", items: [{ label: "About Us", page: "about" }, { label: "Blog", page: "blog" }, { label: "Events", page: "events" }, { label: "Contact", page: "contact" }] },
  { title: "Resources", items: [{ label: "Membership Guide", page: "membership" }, { label: "Resources", page: "resources" }, { label: "Privacy Policy", page: "privacy" }, { label: "Terms of Service", page: "terms" }] },
];
const SOCIALS = [
  { name: "Facebook", url: "https://web.facebook.com/people/Recyclers-Association-of-Nigeria/61578271825094/", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { name: "Instagram", url: "https://www.instagram.com/recyclersinnigeria/", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/ranigeria", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> }
];
export default function Footer({ setPage }) {
  const { isMobile } = useBreakpoints();
  const nav = (p) => { if (p) { setPage(p); window.scrollTo(0, 0); } };
  return (
    <footer style={{ background: "#f5f5f4", paddingTop: isMobile ? 48 : 80, paddingBottom: 40 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 20px" : "0 32px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? 32 : 48 }}>
        <div>
          <div style={{ fontFamily: FONTS.headline, fontWeight: 900, fontSize: 20, color: "#14532d", marginBottom: 12 }}>RAN</div>
          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, maxWidth: 280 }}>The umbrella body representing recycling professionals and coordinating Nigeria's transition to a sustainable circular economy.</p>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {SOCIALS.map((s) => <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.primary, textDecoration: "none", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"} aria-label={s.name}>{s.icon}</a>)}
          </div>
        </div>
        {LINKS.map((col) => (
          <div key={col.title}>
            <h4 style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, color: COLORS.onSurface, marginBottom: 16 }}>{col.title}</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {col.items.map((it) => <a key={it.label} href="#" onClick={(e) => { e.preventDefault(); if(it.page) nav(it.page); }} style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>{it.label}</a>)}
            </div>
          </div>
        ))}
        <div>
          <h4 style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 13, color: COLORS.onSurface, marginBottom: 16 }}>Our Offices</h4>
          <address style={{ fontStyle: "normal", fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
            <span style={{ fontWeight: 700, color: COLORS.onSurface }}>Lagos Secretariat</span><br />
            3e Olumegbon Ikoyi, Lagos State
          </address>
          <address style={{ fontStyle: "normal", fontSize: 13, color: "#64748b", lineHeight: 1.8, marginTop: 14 }}>
            <span style={{ fontWeight: 700, color: COLORS.onSurface }}>Abuja Secretariat</span><br />
            Pigba Kasa Junction, Apo-Kabusa Road<br />Abuja FCT
          </address>
          <div style={{ marginTop: 14 }}>
            <span style={{ display: "block", color: COLORS.primary, fontWeight: 700, fontSize: 13, lineHeight: 1.8 }}>ran@recyclersassociation.org<br />+234 907 981 9777</span>
          </div>
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
