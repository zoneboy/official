import { useState, useEffect } from "react";
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" ? window.matchMedia(query).matches : false);
  useEffect(() => { const mql = window.matchMedia(query); const h = (e) => setMatches(e.matches); mql.addEventListener("change", h); return () => mql.removeEventListener("change", h); }, [query]);
  return matches;
}
export function useBreakpoints() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  return { isMobile, isTablet, isDesktop };
}
