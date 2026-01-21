import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import LoadingScreen from "./components/Layout/LoadingScreen";
import PageTransition from "./components/Layout/PageTransition";
import ContactModal from "./components/ContactModal";

// Lazy loading des pages pour optimiser le chargement initial
const Accueil = lazy(() => import("./pages/Accueil"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));

function AppContent() {
  const location = useLocation();
  const { isLoading, stopLoading } = useLoading();

  return (
    <>
      <LoadingScreen isLoading={isLoading} onComplete={stopLoading} />
      <AnimatePresence mode="wait">
        {!isLoading && (
          <PageTransition key={location.pathname}>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Accueil />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          </PageTransition>
        )}
      </AnimatePresence>
      {/* Contact Modal flottant disponible sur toutes les pages */}
      {!isLoading && <ContactModal phoneNumber="+2290150035719" />}
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
