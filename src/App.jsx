import { useState, useEffect, useCallback } from "react";
import { COLORS, FONTS } from "./styles/tokens";
import { Navbar, Footer } from "./components";
import { HomePage, AboutPage, EventsPage, BlogPage, ContactPage, ArticlePage, MembershipGuidePage, ResourcesPage, PrivacyPolicyPage, TermsOfServicePage, AdminPage } from "./pages";
import { CMSProvider, useCMSData } from "./data/useCMSData";

// ── URL ↔ page mapping ──
const PAGE_TO_PATH = {
  home: "/",
  about: "/about",
  events: "/events",
  blog: "/blog",
  contact: "/contact",
  membership: "/membership",
  resources: "/resources",
  privacy: "/privacy",
  terms: "/terms",
  admin: "/admin",
};

// ── Slugify a title for use in URLs ──
// "The Crude Reality: How Global Oil Prices..." → "the-crude-reality-how-global-oil-prices"
export function slugify(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/['']/g, "")           // strip apostrophes
    .replace(/[^a-z0-9]+/g, "-")    // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, "")        // trim leading/trailing hyphens
    .slice(0, 80);                  // keep URLs reasonable
}

// ── Parse the current URL into { page, articleSlug } ──
function parsePath(pathname) {
  if (pathname === "/" || pathname === "") return { page: "home", articleSlug: null };
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return { page: "admin", articleSlug: null };

  // /blog/some-slug → article page
  const articleMatch = pathname.match(/^\/blog\/(.+?)\/?$/);
  if (articleMatch) return { page: "article", articleSlug: articleMatch[1] };

  // Known single-segment pages
  const trimmed = pathname.replace(/\/$/, "");
  const match = Object.entries(PAGE_TO_PATH).find(([, path]) => path === trimmed);
  if (match) return { page: match[0], articleSlug: null };

  // Unknown path → treat as home (could also be a 404 page)
  return { page: "home", articleSlug: null };
}

// ── Build a URL for a page + optional article ──
function buildPath(page, article) {
  if (page === "article" && article) {
    return `/blog/${slugify(article.title)}`;
  }
  return PAGE_TO_PATH[page] || "/";
}

// ── Inner component (has access to CMS data for article-slug resolution) ──
function AppInner() {
  const { articles } = useCMSData();

  const [{ page, articleSlug }, setRoute] = useState(() => parsePath(window.location.pathname));
  const [currentArticle, setCurrentArticle] = useState(null);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const onPop = () => {
      setRoute(parsePath(window.location.pathname));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // When the route asks for an article by slug, resolve it from loaded CMS data
  useEffect(() => {
    if (page !== "article") {
      setCurrentArticle(null);
      return;
    }
    if (!articleSlug || !articles || articles.length === 0) return;
    const found = articles.find((a) => slugify(a.title) === articleSlug);
    setCurrentArticle(found || null);
  }, [page, articleSlug, articles]);

  // Navigate programmatically — updates both URL and state
  const navigate = useCallback((nextPage, article = null) => {
    const path = buildPath(nextPage, article);
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    setRoute({ page: nextPage, articleSlug: article ? slugify(article.title) : null });
    if (article) setCurrentArticle(article);
    window.scrollTo(0, 0);
  }, []);

  // Legacy setPage(pageName) signature still works for all existing page components
  const setPage = useCallback((p) => navigate(p), [navigate]);

  // Special handler for opening an article: updates URL to /blog/<slug>
  const openArticle = useCallback((article) => navigate("article", article), [navigate]);

  if (page === "admin") {
    return (
      <div style={{ fontFamily: FONTS.body }}>
        <AdminPage setPage={setPage} />
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "home":       return <HomePage setPage={setPage} setCurrentArticle={openArticle} />;
      case "about":      return <AboutPage />;
      case "events":     return <EventsPage />;
      case "blog":       return <BlogPage setPage={setPage} setCurrentArticle={openArticle} />;
      case "article":    return <ArticlePage setPage={setPage} article={currentArticle} />;
      case "contact":    return <ContactPage />;
      case "membership": return <MembershipGuidePage />;
      case "resources":  return <ResourcesPage />;
      case "privacy":    return <PrivacyPolicyPage />;
      case "terms":      return <TermsOfServicePage />;
      default:           return <HomePage setPage={setPage} setCurrentArticle={openArticle} />;
    }
  };

  return (
    <div style={{ fontFamily: FONTS.body, background: COLORS.surface, color: COLORS.onSurface, minHeight: "100vh" }}>
      <Navbar currentPage={page} setPage={setPage} />
      <main style={{ paddingTop: 72 }}>{renderPage()}</main>
      <Footer setPage={setPage} />
    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <AppInner />
    </CMSProvider>
  );
}
