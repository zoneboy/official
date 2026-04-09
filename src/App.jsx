import { useState } from "react";
import { COLORS, FONTS } from "./styles/tokens";
import { Navbar, Footer } from "./components";
import { HomePage, AboutPage, EventsPage, BlogPage, ContactPage, ArticlePage, MembershipGuidePage, AdminPage } from "./pages";
import { CMSProvider } from "./data/useCMSData";

export default function App() {
  const [page, setPage] = useState(window.location.pathname === "/admin" ? "admin" : "home");
  const [currentArticle, setCurrentArticle] = useState(null);

  if (page === "admin") {
    return (
      <div style={{ fontFamily: FONTS.body }}>
        <AdminPage setPage={setPage} />
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "home":       return <HomePage setPage={setPage} setCurrentArticle={setCurrentArticle} />;
      case "about":      return <AboutPage />;
      case "events":     return <EventsPage />;
      case "blog":       return <BlogPage setPage={setPage} setCurrentArticle={setCurrentArticle} />;
      case "article":    return <ArticlePage setPage={setPage} article={currentArticle} />;
      case "contact":    return <ContactPage />;
      case "membership": return <MembershipGuidePage />;
      default:           return <HomePage setPage={setPage} setCurrentArticle={setCurrentArticle} />;
    }
  };

  return (
    <CMSProvider>
      <div style={{ fontFamily: FONTS.body, background: COLORS.surface, color: COLORS.onSurface, minHeight: "100vh" }}>
        <Navbar currentPage={page} setPage={setPage} />
        <main style={{ paddingTop: 72 }}>{renderPage()}</main>
        <Footer setPage={setPage} />
      </div>
    </CMSProvider>
  );
}
