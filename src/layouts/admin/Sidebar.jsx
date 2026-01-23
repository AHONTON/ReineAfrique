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
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/commandes', icon: ShoppingCart, label: 'Commandes' },
  { path: '/admin/clients', icon: Users, label: 'Clients' },
  { path: '/admin/stock', icon: Package, label: 'Stock' },
  { path: '/admin/finances', icon: TrendingUp, label: 'Finances' },
  { path: '/admin/exports', icon: Download, label: 'Exports' },
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
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-white shadow-2xl lg:shadow-xl overflow-hidden transition-colors duration-300 ${
          isDesktop ? '' : (isMobileOpen ? '' : '-translate-x-full')
        }`}
        style={{
          transition: isDesktop ? 'none' : 'transform 0.3s ease-in-out'
        }}
      >
        {/* Pattern de tissu africain en arrière-plan */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-orange-900/20 to-transparent">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(251, 115, 22, 0.1) 10px,
                  rgba(251, 115, 22, 0.1) 20px
                ),
                repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 10px,
                  rgba(154, 52, 18, 0.1) 10px,
                  rgba(154, 52, 18, 0.1) 20px
                )`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col h-full relative z-10">
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-gray-700 dark:border-gray-600 flex items-center justify-between h-[73px] sm:h-[81px] md:h-[89px]">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative flex-shrink-0">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-gray-800 rounded-lg p-1 flex items-center justify-center">
                  <img
                    src={logo}
                    alt="Reine d'Afrique"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold truncate">Reine d'Afrique</h1>
                <p className="text-xs text-gray-400">Admin Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white flex-shrink-0"
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
          <div className="p-4 border-t border-gray-700 dark:border-gray-600 relative">
            {/* Pattern décoratif */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-16 opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(251, 115, 22, 0.3) 2px,
                  rgba(251, 115, 22, 0.3) 4px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(154, 52, 18, 0.3) 2px,
                  rgba(154, 52, 18, 0.3) 4px
                )`,
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
              <div className="text-xs text-gray-400 dark:text-gray-500 text-center">
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
