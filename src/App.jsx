import { useState, useEffect, useCallback } from "react";
import { COLORS, FONTS } from "./styles/tokens";
import { Navbar, Footer } from "./components";
import { HomePage, AboutPage, EventsPage, BlogPage, ContactPage, ArticlePage, MembershipGuidePage, ResourcesPage, PrivacyPolicyPage, TermsOfServicePage, AdminPage, GalleryPage, GalleryDetailPage } from "./pages";
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
  gallery: "/gallery",
  privacy: "/privacy",
  terms: "/terms",
  admin: "/admin",
};

// ── Slugify a title for use in URLs ──
export function slugify(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .replace(/['']/g, "")           // strip apostrophes
    .replace(/[^a-z0-9]+/g, "-")    // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, "")        // trim leading/trailing hyphens
    .slice(0, 80);                  // keep URLs reasonable
}

// ── Parse the current URL into { page, articleSlug, gallerySlug } ──
function parsePath(pathname) {
  if (pathname === "/" || pathname === "") return { page: "home", articleSlug: null, gallerySlug: null };
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return { page: "admin", articleSlug: null, gallerySlug: null };

  // /blog/some-slug → article page
  const articleMatch = pathname.match(/^\/blog\/(.+?)\/?$/);
  if (articleMatch) return { page: "article", articleSlug: articleMatch[1], gallerySlug: null };

  // /gallery/some-slug → gallery detail page
  const galleryMatch = pathname.match(/^\/gallery\/(.+?)\/?$/);
  if (galleryMatch) return { page: "galleryDetail", articleSlug: null, gallerySlug: galleryMatch[1] };

  // Known single-segment pages
  const trimmed = pathname.replace(/\/$/, "");
  const match = Object.entries(PAGE_TO_PATH).find(([, path]) => path === trimmed);
  if (match) return { page: match[0], articleSlug: null, gallerySlug: null };

  return { page: "home", articleSlug: null, gallerySlug: null };
}

// ── Build a URL for a page + optional article/gallery ──
function buildPath(page, payload) {
  if (page === "article" && payload) {
    return `/blog/${slugify(payload.title)}`;
  }
  if (page === "galleryDetail" && payload) {
    return `/gallery/${slugify(payload.eventName || payload.title)}`;
  }
  return PAGE_TO_PATH[page] || "/";
}

// ── Inner component (has access to CMS data for slug resolution) ──
function AppInner() {
  const { articles, galleries } = useCMSData();

  const [{ page, articleSlug, gallerySlug }, setRoute] = useState(() => parsePath(window.location.pathname));
  const [currentArticle, setCurrentArticle] = useState(null);
  const [currentGallery, setCurrentGallery] = useState(null);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const onPop = () => {
      setRoute(parsePath(window.location.pathname));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Resolve article from slug when CMS data loads
  useEffect(() => {
    if (page !== "article") {
      setCurrentArticle(null);
      return;
    }
    if (!articleSlug || !articles || articles.length === 0) return;
    const found = articles.find((a) => slugify(a.title) === articleSlug);
    setCurrentArticle(found || null);
  }, [page, articleSlug, articles]);

  // Resolve gallery from slug when CMS data loads
  useEffect(() => {
    if (page !== "galleryDetail") {
      setCurrentGallery(null);
      return;
    }
    if (!gallerySlug || !galleries || galleries.length === 0) return;
    const found = galleries.find((g) => slugify(g.eventName || g.title) === gallerySlug);
    setCurrentGallery(found || null);
  }, [page, gallerySlug, galleries]);

  // Navigate programmatically — updates both URL and state
  const navigate = useCallback((nextPage, payload = null) => {
    const path = buildPath(nextPage, payload);
    if (window.location.pathname !== path) {
      window.history.pushState({}, "", path);
    }
    let nextArticleSlug = null;
    let nextGallerySlug = null;
    if (nextPage === "article" && payload) {
      nextArticleSlug = slugify(payload.title);
      setCurrentArticle(payload);
    }
    if (nextPage === "galleryDetail" && payload) {
      nextGallerySlug = slugify(payload.eventName || payload.title);
      setCurrentGallery(payload);
    }
    setRoute({ page: nextPage, articleSlug: nextArticleSlug, gallerySlug: nextGallerySlug });
    window.scrollTo(0, 0);
  }, []);

  // Legacy setPage(pageName) signature still works for all existing page components
  const setPage = useCallback((p) => navigate(p), [navigate]);

  // Special handlers — these update URL to /blog/<slug> or /gallery/<slug>
  const openArticle = useCallback((article) => navigate("article", article), [navigate]);
  const openGallery = useCallback((gallery) => navigate("galleryDetail", gallery), [navigate]);

  if (page === "admin") {
    return (
      <div style={{ fontFamily: FONTS.body }}>
        <AdminPage setPage={setPage} />
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "home":          return <HomePage setPage={setPage} setCurrentArticle={openArticle} />;
      case "about":         return <AboutPage />;
      case "events":        return <EventsPage />;
      case "blog":          return <BlogPage setPage={setPage} setCurrentArticle={openArticle} />;
      case "article":       return <ArticlePage setPage={setPage} article={currentArticle} />;
      case "contact":       return <ContactPage />;
      case "membership":    return <MembershipGuidePage />;
      case "resources":     return <ResourcesPage />;
      case "gallery":       return <GalleryPage setPage={setPage} setCurrentGallery={openGallery} />;
      case "galleryDetail": return <GalleryDetailPage setPage={setPage} gallery={currentGallery} />;
      case "privacy":       return <PrivacyPolicyPage />;
      case "terms":         return <TermsOfServicePage />;
      default:              return <HomePage setPage={setPage} setCurrentArticle={openArticle} />;
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
