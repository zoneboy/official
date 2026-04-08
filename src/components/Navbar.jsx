import { useState, useEffect } from "react";
import { COLORS, FONTS, GRADIENTS } from "../styles/tokens";

const NAV_ITEMS = [
  { label: "Home", page: "home" },
  { label: "About Us", page: "about" },
  { label: "Events", page: "events" },
  { label: "News", page: "blog" },
  { label: "Contact", page: "contact" },
];

export default function Navbar({ currentPage, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navigate = (page) => {
    setPage(page);
    setMobileOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(250,250,249,0.94)" : "rgba(250,250,249,0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        transition: "all 0.3s",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.04)" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: 1400,
          margin: "0 auto",
          padding: "16px 32px",
        }}
      >
        {/* Logo */}
        <div
          onClick={() => navigate("home")}
          style={{
            cursor: "pointer",
            fontFamily: FONTS.headline,
            fontWeight: 800,
            fontSize: 16,
            color: "#14532d",
            textTransform: "uppercase",
            letterSpacing: "-0.5px",
          }}
        >
          Recyclers Association of Nigeria
        </div>

        {/* Desktop Links */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.page}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(item.page);
              }}
              style={{
                fontFamily: FONTS.headline,
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "-0.3px",
                color: currentPage === item.page ? "#15803d" : "#64748b",
                borderBottom:
                  currentPage === item.page
                    ? "2px solid #15803d"
                    : "2px solid transparent",
                paddingBottom: 4,
                textDecoration: "none",
                transition: "all 0.2s",
              }}
            >
              {item.label}
            </a>
          ))}

          <button
            style={{
              background: GRADIENTS.primary,
              color: "#fff",
              padding: "10px 24px",
              borderRadius: 12,
              border: "none",
              fontFamily: FONTS.headline,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Member Login
          </button>
        </div>
      </div>
    </nav>
  );
}
