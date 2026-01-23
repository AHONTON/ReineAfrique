import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import { CookieProvider } from "./contexts/CookieContext";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import LoadingScreen from "./components/Layout/LoadingScreen";
import PageTransition from "./components/Layout/PageTransition";
import ContactModal from "./components/ContactModal";
import CookieConsent from "./components/CookieConsent";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";

// Lazy loading des pages pour optimiser le chargement initial
const Accueil = lazy(() => import("./pages/Accueil"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));

// Pages Admin
const Login = lazy(() => import("./pages/admin/Login"));
const AdminLayout = lazy(() => import("./layouts/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Clients = lazy(() => import("./pages/admin/Clients"));
const Stock = lazy(() => import("./pages/admin/Stock"));
const Finance = lazy(() => import("./pages/admin/Finance"));
const Export = lazy(() => import("./pages/admin/Export"));

function AppContent() {
  const location = useLocation();
  const { isLoading, stopLoading } = useLoading();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <LoadingScreen isLoading={isLoading} onComplete={stopLoading} />
      <AnimatePresence mode="wait">
        {!isLoading && (
          <PageTransition key={location.pathname}>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>}>
              <Routes location={location} key={location.pathname}>
                {/* Routes publiques */}
                <Route path="/" element={<Accueil />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Routes Admin */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="commandes" element={<Orders />} />
                  <Route path="clients" element={<Clients />} />
                  <Route path="stock" element={<Stock />} />
                  <Route path="finances" element={<Finance />} />
                  <Route path="exports" element={<Export />} />
                </Route>
              </Routes>
            </Suspense>
          </PageTransition>
        )}
      </AnimatePresence>
      {/* Contact Modal flottant disponible sur toutes les pages publiques uniquement */}
      {!isLoading && !isAdminRoute && <ContactModal phoneNumber="+2290150035719" />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <CookieProvider>
          <AuthProvider>
            <AppContent />
            <CookieConsent />
            <PrivacyPolicyModal />
          </AuthProvider>
        </CookieProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
