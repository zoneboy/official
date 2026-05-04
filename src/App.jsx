import { useState, useEffect, useCallback } from "react";
import { COLORS, FONTS } from "./styles/tokens";
import { Navbar, Footer } from "./components";
import { HomePage, AboutPage, EventsPage, BlogPage, ContactPage, ArticlePage, MembershipGuidePage, ResourcesPage, PrivacyPolicyPage, TermsOfServicePage, AdminPage, GalleryPage, GalleryDetailPage } from "./pages";
import { CMSProvider, useCMSData } from "./data/useCMSData";

const PAGE_TO_PATH = {
  home: "/", about: "/about", events: "/events", blog: "/blog", 
  gallery: "/gallery", contact: "/contact", membership: "/membership", 
  resources: "/resources", privacy: "/privacy", terms: "/terms", admin: "/admin",
};

export function slugify(title) {
  if (!title) return "";
  return title.toLowerCase().replace(/['']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

function parsePath(pathname) {
  if (pathname === "/" || pathname === "") return { page: "home", articleSlug: null };
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return { page: "admin", articleSlug: null };
  const articleMatch = pathname.match(/^\/blog\/(.+?)\/?$/);
  if (articleMatch) return { page: "article", articleSlug: articleMatch[1] };
  const galleryMatch = pathname.match(/^\/gallery\/(.+?)\/?$/);
  if (galleryMatch) return { page: "galleryDetail", articleSlug: galleryMatch[1] };
  const trimmed = pathname.replace(/\/$/, "");
  const match = Object.entries(PAGE_TO_PATH).find(([, path]) => path === trimmed);
  if (match) return { page: match[0], articleSlug: null };
  return { page: "home", articleSlug: null };
}

function buildPath(page, article) {
  if (page === "article" && article) return `/blog/${slugify(article.title)}`;
  if (page === "galleryDetail" && article) return `/gallery/${slugify(article.title)}`;
  return PAGE_TO_PATH[page] || "/";
}

function AppInner() {
  const { articles, galleries } = useCMSData();
  const [{ page, articleSlug }, setRoute] = useState(() => parsePath(window.location.pathname));
  const [currentArticle, setCurrentArticle] = useState(null);

  useEffect(() => {
    const onPop = () => setRoute(parsePath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (page === "article") {
      if (!articleSlug || !articles || articles.length === 0) return;
      setCurrentArticle(articles.find((a) => slugify(a.title) === articleSlug) || null);
    } else if (page === "galleryDetail") {
      if (!articleSlug || !galleries || galleries.length === 0) return;
      setCurrentArticle(galleries.find((g) => slugify(g.title) === articleSlug) || null);
    } else {
      setCurrentArticle(null);
    }
  }, [page, articleSlug, articles, galleries]);

  const navigate = useCallback((nextPage, article = null) => {
    const path = buildPath(nextPage, article);
    if (window.location.pathname !== path) window.history.pushState({}, "", path);
    setRoute({ page: nextPage, articleSlug: article ? slugify(article.title) : null });
    if (article) setCurrentArticle(article);
    window.scrollTo(0, 0);
  }, []);

  const setPage = useCallback((p) => navigate(p), [navigate]);
  const openArticle = useCallback((article) => navigate("article", article), [navigate]);
  const openGallery = useCallback((gallery) => navigate("galleryDetail", gallery), [navigate]);

  if (page === "admin") return <div style={{ fontFamily: FONTS.body }}><AdminPage setPage={setPage} /></div>;

  const renderPage = () => {
    switch (page) {
      case "home":       return <HomePage setPage={setPage} setCurrentArticle={openArticle} setCurrentGallery={openGallery} />;
      case "about":      return <AboutPage />;
      case "events":     return <EventsPage />;
      case "gallery":    return <GalleryPage setPage={setPage} setCurrentGallery={openGallery} />;
      case "galleryDetail": return <GalleryDetailPage setPage={setPage} gallery={currentArticle} />;
      case "blog":       return <BlogPage setPage={setPage} setCurrentArticle={openArticle} />;
      case "article":    return <ArticlePage setPage={setPage} article={currentArticle} />;
      case "contact":    return <ContactPage />;
      case "membership": return <MembershipGuidePage />;
      case "resources":  return <ResourcesPage />;
      case "privacy":    return <PrivacyPolicyPage />;
      case "terms":      return <TermsOfServicePage />;
      default:           return <HomePage setPage={setPage} setCurrentArticle={openArticle} setCurrentGallery={openGallery} />;
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

export default function App() { return <CMSProvider><AppInner /></CMSProvider>; }
