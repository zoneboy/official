import { COLORS, FONTS } from "../styles/tokens";
import Icon from "./Icon";

const FOOTER_LINKS = [
  {
    title: "Quick Links",
    items: [
      { label: "About Us", page: "about" },
      { label: "News", page: "blog" },
      { label: "Events", page: "events" },
      { label: "Contact", page: "contact" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Membership Guide" },
      { label: "Policy Papers" },
      { label: "Privacy Policy" },
      { label: "Terms of Service" },
    ],
  },
];

export default function Footer({ setPage }) {
  const navigate = (page) => {
    if (page) {
      setPage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer style={{ background: "#f5f5f4", paddingTop: 80, paddingBottom: 40 }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 48,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: FONTS.headline,
              fontWeight: 900,
              fontSize: 20,
              color: "#14532d",
              marginBottom: 12,
            }}
          >
            RAN
          </div>
          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, maxWidth: 280 }}>
            The authoritative body representing recycling professionals and
            coordinating Nigeria's transition to a sustainable circular economy.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {["public", "rss_feed", "share"].map((iconName) => (
              <a
                key={iconName}
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.primary,
                  textDecoration: "none",
                }}
              >
                <Icon name={iconName} size={18} />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_LINKS.map((col) => (
          <div key={col.title}>
            <h4
              style={{
                fontFamily: FONTS.headline,
                fontWeight: 700,
                fontSize: 13,
                color: COLORS.onSurface,
                marginBottom: 20,
              }}
            >
              {col.title}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {col.items.map((item) => (
                <a
                  key={item.label}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.page);
                  }}
                  style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ))}

        <div>
          <h4
            style={{
              fontFamily: FONTS.headline,
              fontWeight: 700,
              fontSize: 13,
              color: COLORS.onSurface,
              marginBottom: 20,
            }}
          >
            Head Office
          </h4>
          <address style={{ fontStyle: "normal", fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
            Suite 402, Green Building Complex
            <br />
            Herbert Macaulay Way, CBD
            <br />
            Abuja, FCT, Nigeria
            <span style={{ display: "block", marginTop: 14, color: COLORS.primary, fontWeight: 700 }}>
              info@recyclersassociation.org.ng
            </span>
          </address>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px" }}>
        <div
          style={{
            borderTop: "1px solid rgba(0,0,0,0.06)",
            marginTop: 48,
            paddingTop: 24,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 12, color: "#94a3b8" }}>
            © 2026 Recyclers Association of Nigeria. Engineering a Sustainable Future.
          </p>
        </div>
      </div>
    </footer>
  );
}
