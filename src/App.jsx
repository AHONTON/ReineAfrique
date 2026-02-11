import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import { CookieProvider } from "./contexts/CookieContext";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AlertProvider } from "./contexts/AlertContext";
import { CartProvider } from "./contexts/CartContext";
import LoadingScreen from "./components/Layout/LoadingScreen";
import ReineLoader from "./components/Layout/ReineLoader";
import PageTransition from "./components/Layout/PageTransition";
import ContactModal from "./components/ContactModal";
import CookieConsent from "./components/CookieConsent";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";

// Lazy loading des pages pour optimiser le chargement initial
const Accueil = lazy(() => import("./pages/Accueil"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));

// Pages Admin - Layout lazy loaded, mais pages internes non lazy pour éviter les flashes
const Login = lazy(() => import("./pages/admin/Login"));
const AdminLayout = lazy(() => import("./layouts/admin/AdminLayout"));
// Pages internes du dashboard - import direct pour éviter le flash blanc lors de la navigation
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Clients from "./pages/admin/Clients";
import Stock from "./pages/admin/Stock";
import Finance from "./pages/admin/Finance";
import Export from "./pages/admin/Export";
import ProtectedRoute from "./auth/ProtectedRoute";

// Fallback pour les routes publiques — même loader que l'écran d'accueil
const PublicFallback = () => <ReineLoader />;

function AppContent() {
  const location = useLocation();
  const { isLoading, stopLoading } = useLoading();
  const { resolvedTheme } = useTheme();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDark = resolvedTheme === 'dark';

  // Fallback pour AdminLayout — spinner type neumorphic
  const AdminLayoutFallback = (
    <div className={`admin-dashboard min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 fixed inset-0 flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shadow-[inset_4px_4px_10px_rgba(0,0,0,0.06),inset_-4px_-4px_10px_rgba(255,255,255,0.8)] dark:shadow-[inset_4px_4px_12px_rgba(0,0,0,0.3),inset_-2px_-2px_8px_rgba(255,255,255,0.05)]">
          <motion.div
            className="w-10 h-10 rounded-full border-2 border-transparent border-t-orange-500 border-r-amber-400 dark:border-t-orange-400 dark:border-r-amber-300"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400">Chargement...</span>
      </div>
    </div>
  );

  // Gérer le fond du body selon la route pour éviter le flash blanc
  // Appliquer immédiatement pour éviter tout flash
  useEffect(() => {
    if (isAdminRoute) {
      // Utiliser les classes CSS prévues pour une application immédiate
      document.body.classList.add('admin-route');
      if (isDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    } else {
      // Réinitialiser pour les routes publiques
      document.body.classList.remove('admin-route', 'dark');
      document.body.style.background = '';
      document.body.style.minHeight = '';
    }
    
    return () => {
      // Nettoyer au démontage seulement si on quitte les routes admin
      if (!isAdminRoute) {
        document.body.classList.remove('admin-route', 'dark');
        document.body.style.background = '';
        document.body.style.minHeight = '';
      }
    };
  }, [isAdminRoute, isDark]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} onComplete={stopLoading} />
      {!isLoading && (
        <PageTransition>
          <Suspense fallback={isAdminRoute ? AdminLayoutFallback : <PublicFallback />}>
            <Routes location={location}>
                {/* Routes publiques */}
                <Route path="/" element={<Accueil />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Routes Admin */}
                <Route path="/admin/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
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
            <CartProvider>
              <AlertProvider>
                <AppContent />
              </AlertProvider>
            </CartProvider>
            <CookieConsent />
            <PrivacyPolicyModal />
          </AuthProvider>
        </CookieProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
