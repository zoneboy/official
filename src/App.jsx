import { useState } from "react";
import { COLORS, FONTS } from "./styles/tokens";
import { Navbar, Footer } from "./components";
import { HomePage, AboutPage, EventsPage, BlogPage, ContactPage } from "./pages";

export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home":    return <HomePage setPage={setPage} />;
      case "about":   return <AboutPage />;
      case "events":  return <EventsPage />;
      case "blog":    return <BlogPage />;
      case "contact": return <ContactPage />;
      default:        return <HomePage setPage={setPage} />;
    }
  };

  return (
    <div style={{ fontFamily: FONTS.body, background: COLORS.surface, color: COLORS.onSurface, minHeight: "100vh" }}>
      <Navbar currentPage={page} setPage={setPage} />
      <main style={{ paddingTop: 72 }}>
        {renderPage()}
      </main>
      <Footer setPage={setPage} />
    </div>
  );
}
