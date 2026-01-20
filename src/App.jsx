import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import LoadingScreen from "./components/Layout/LoadingScreen";
import PageTransition from "./components/Layout/PageTransition";
import Accueil from "./pages/Accueil";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
// import d'autres pages si besoin

function AppContent() {
  const location = useLocation();
  const { isLoading, stopLoading } = useLoading();

  return (
    <>
      <LoadingScreen isLoading={isLoading} onComplete={stopLoading} />
      <AnimatePresence mode="wait">
        {!isLoading && (
          <PageTransition key={location.pathname}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Accueil />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </PageTransition>
        )}
      </AnimatePresence>
    </>
  );
}

function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
}

export default App;
