import { COLORS } from "../styles/tokens";
export default function HoverCard({ children, bg = COLORS.surfaceContainerLow, hoverBg = "#fff", radius = 8, padding = "40px", style = {} }) {
  return (
    <div style={{ background: bg, padding, borderRadius: radius, transition: "all 0.4s", cursor: "default", ...style }}
      onMouseEnter={(e) => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = bg; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
      {children}
    </div>
  );
}
