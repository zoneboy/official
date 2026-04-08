import { COLORS, FONTS } from "../styles/tokens";

export function SectionTag({ children }) {
  return (
    <span
      style={{
        color: COLORS.secondary,
        fontFamily: FONTS.headline,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: 3,
        textTransform: "uppercase",
        display: "block",
        marginBottom: 12,
      }}
    >
      {children}
    </span>
  );
}

export function SectionTitle({ children, style = {} }) {
  return (
    <h2
      style={{
        fontFamily: FONTS.headline,
        fontSize: 42,
        fontWeight: 800,
        color: COLORS.onSurface,
        letterSpacing: "-1px",
        lineHeight: 1.1,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

export function AccentBar({ color = COLORS.secondary, width = 60 }) {
  return (
    <div
      style={{
        width,
        height: 4,
        background: color,
        borderRadius: 2,
        marginBottom: 48,
      }}
    />
  );
}

export function Badge({ children, bg, color, style = {} }) {
  return (
    <span
      style={{
        background: bg,
        color,
        padding: "4px 12px",
        borderRadius: 24,
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
