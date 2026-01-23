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
} from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '/images/logo.png';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/commandes', icon: ShoppingCart, label: 'Commandes' },
  { path: '/admin/clients', icon: Users, label: 'Clients' },
  { path: '/admin/stock', icon: Package, label: 'Stock' },
  { path: '/admin/finances', icon: TrendingUp, label: 'Finances' },
  { path: '/admin/exports', icon: Download, label: 'Exports' },
];

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

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
          <div className="p-4 sm:p-6 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative flex-shrink-0">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                  <img
                    src={logo}
                    alt="Reine d'Afrique"
                    className="w-full h-full object-contain"
                  />
                  {/* Silhouette du continent africain en overlay orange */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-80">
                    <svg
                      viewBox="0 0 200 200"
                      className="w-full h-full text-orange-500"
                      fill="currentColor"
                    >
                      {/* Forme simplifiée du continent africain */}
                      <path d="M100 20 L85 35 L75 45 L70 60 L65 75 L60 90 L55 105 L50 120 L48 135 L50 150 L55 165 L60 175 L65 180 L70 175 L75 170 L80 165 L85 160 L90 155 L95 150 L100 145 L105 150 L110 155 L115 160 L120 165 L125 170 L130 175 L135 180 L140 175 L145 165 L150 150 L152 135 L150 120 L145 105 L140 90 L135 75 L130 60 L125 45 L115 35 Z" />
                    </svg>
                  </div>
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
            {menuItems.map((item, index) => (
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
          <div className="p-4 border-t border-gray-700 relative">
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
            <div className="relative z-10 text-xs text-gray-400 text-center">
              © 2024 Reine d'Afrique
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
