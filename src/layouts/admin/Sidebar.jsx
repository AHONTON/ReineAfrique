import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Download,
  Menu,
  X,
  Clock as ClockIcon,
} from 'lucide-react';
import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import logo from '/images/logo.png';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Tableau de Bord' },
  { path: '/admin/clients', icon: Users, label: 'Clients' },
  { path: '/admin/stock', icon: Package, label: 'Produits' },
  { path: '/admin/commandes', icon: ShoppingCart, label: 'Commandes' },
  { path: '/admin/finances', icon: TrendingUp, label: 'Mes revenues' },
  { path: '/admin/exports', icon: Download, label: 'Mes Fichiers' },
];

const Sidebar = memo(() => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) {
        setIsMobileOpen(false);
      }
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Mise à jour de l'heure chaque seconde
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }, []);

  const formatDate = useCallback((date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, []);

  const formattedTime = useMemo(() => formatTime(currentTime), [currentTime, formatTime]);
  const formattedDate = useMemo(() => formatDate(currentTime), [currentTime, formatDate]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all active:scale-95"
        aria-label="Ouvrir le menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && !isDesktop && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-gradient-to-b dark:bg-gradient-to-b from-[#3b2417] via-[#2b1b10] to-[#111827] dark:from-[#332116] dark:via-[#24140e] dark:to-[#0b0b0b] text-white shadow-2xl lg:shadow-xl overflow-hidden transition-colors duration-300 ${
          isDesktop ? '' : (isMobileOpen ? '' : '-translate-x-full')
        }`}
        style={{
          transition: isDesktop ? 'none' : 'transform 0.3s ease-in-out'
        }}
      >
        {/* Subtil overlay décoratif (remplace motifs en carreaux) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange-900/12 to-transparent dark:from-orange-900/6 dark:to-transparent">
            <div
              className="w-full h-full dark:opacity-80"
              style={{
                background: 'linear-gradient(180deg, rgba(249,115,22,0.04), transparent)'
              }}
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-700 dark:border-gray-600 flex items-center justify-between h-[73px] sm:h-[81px] md:h-[89px]">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative flex-shrink-0">
                <div className="relative flex items-center justify-center w-10 h-10 p-1 bg-white rounded-lg sm:w-12 sm:h-12 dark:bg-gray-800">
                  <img
                    src={logo}
                    alt="Reine d'Afrique"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold truncate sm:text-lg">Reine d'Afrique</h1>
                <p className="text-xs text-gray-400">Admin Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="flex-shrink-0 text-gray-400 lg:hidden hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer Pattern */}
          <div className="relative p-4 border-t border-gray-700 dark:border-gray-600">
            {/* Pattern décoratif */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-16 opacity-18 dark:opacity-30"
              style={{
                background: 'linear-gradient(180deg, rgba(249,115,22,0.06), rgba(154,52,18,0.02))',
              }}
            />
            <div className="relative z-10 space-y-2">
              {/* Date et Heure */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-300 dark:text-gray-400">
                <ClockIcon className="w-3.5 h-3.5 text-orange-400" />
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-medium">{formattedTime}</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">{formattedDate}</span>
                </div>
              </div>
              {/* Copyright */}
              <div className="text-xs text-center text-gray-400 dark:text-gray-500">
                © {new Date().getFullYear()} Reine d'Afrique
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
