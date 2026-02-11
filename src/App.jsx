import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { LoadingProvider, useLoading } from "./contexts/LoadingContext";
import { CookieProvider } from "./contexts/CookieContext";
import { AuthProvider } from "./auth/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AlertProvider } from "./contexts/AlertContext";
import { CartProvider } from "./contexts/CartContext";
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

// Fallback pour les routes publiques
const PublicFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const { isLoading, stopLoading } = useLoading();
  const { resolvedTheme } = useTheme();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDark = resolvedTheme === 'dark';

  // Fallback pour AdminLayout - correspond exactement au fond du dashboard
  const AdminLayoutFallback = (
    <div className={`admin-dashboard min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 fixed inset-0`}>
      <div className="lg:pl-64 w-full min-h-screen">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
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
