import { COLORS, FONTS, GRADIENTS } from "../styles/tokens";
import Icon from "./Icon";

export function PrimaryButton({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: GRADIENTS.primary,
        color: COLORS.onPrimary,
        padding: "16px 36px",
        borderRadius: 12,
        border: "none",
        fontFamily: FONTS.headline,
        fontWeight: 700,
        fontSize: 16,
        cursor: "pointer",
        transition: "all 0.2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function OutlineButton({ children, onClick, light = false, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: light ? "rgba(255,255,255,0.1)" : "transparent",
        backdropFilter: light ? "blur(10px)" : "none",
        border: `1.5px solid ${light ? "rgba(255,255,255,0.25)" : COLORS.outlineVariant}`,
        color: light ? "#fff" : COLORS.onSurface,
        padding: "16px 36px",
        borderRadius: 12,
        fontFamily: FONTS.headline,
        fontWeight: 700,
        fontSize: 16,
        cursor: "pointer",
        transition: "all 0.2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function SmallButton({ children, onClick, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: COLORS.primary,
        color: "#fff",
        padding: "8px 20px",
        borderRadius: 20,
        border: "none",
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        transition: "all 0.2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function PillButton({ children, onClick, active = false, style = {} }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 22px",
        borderRadius: 24,
        fontSize: 13,
        border: "none",
        cursor: "pointer",
        background: active ? COLORS.primary : COLORS.surfaceContainerHigh,
        color: active ? "#fff" : COLORS.onSurfaceVariant,
        fontWeight: active ? 700 : 600,
        boxShadow: active ? `0 4px 12px ${COLORS.primary}33` : "none",
        transition: "all 0.2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function IconLinkButton({ children, icon = "arrow_forward", onClick, style = {} }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
      style={{
        color: COLORS.primary,
        fontFamily: FONTS.headline,
        fontWeight: 700,
        fontSize: 13,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        transition: "gap 0.2s",
        ...style,
      }}
    >
      {children} <Icon name={icon} size={16} />
    </a>
  );
}
