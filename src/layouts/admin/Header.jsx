import { useState, useEffect, useMemo, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useOrderNotifications } from '../../contexts/OrderNotificationsContext';
import { LogOut, ShoppingCart, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../../components/admin/ThemeToggle';
import { formatCurrency } from '../../utils/formatters';

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffH < 24) return `Il y a ${diffH} h`;
  if (diffD < 7) return `Il y a ${diffD} j`;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const Header = memo(() => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useOrderNotifications();
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  // Extraire le nom et prénom avec useMemo pour éviter les recalculs
  const { fullName, firstName, lastName } = useMemo(() => {
    const name = admin?.name || (admin?.firstName && admin?.lastName 
      ? `${admin.firstName} ${admin.lastName}` 
      : admin?.name || 'Admin');
    const first = admin?.firstName || name.split(' ')[0] || 'Admin';
    const last = admin?.lastName || name.split(' ').slice(1).join(' ') || '';
    return { fullName: name, firstName: first, lastName: last };
  }, [admin?.name, admin?.firstName, admin?.lastName]);

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 w-full">
      <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 min-h-[73px] sm:min-h-[81px] md:min-h-[89px] min-w-0">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <motion.div
            animate={{
              y: [0, -5, 0],
              rotate: [0, -5, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </motion.div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
              Bonjour, {firstName} !
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">Bienvenue sur votre tableau de bord</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications commandes */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((o) => !o)}
              className="relative p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              title="Notifications de commandes"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white dark:border-gray-900">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-[320px] sm:w-[380px] max-h-[400px] overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col"
                >
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Nouvelles commandes
                    </h3>
                    {notifications.length > 0 && (
                      <button
                        type="button"
                        onClick={() => { markAllAsRead(); setNotifOpen(false); }}
                        className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto flex-1 max-h-[320px]">
                    {loading && notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Chargement…
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Aucune nouvelle commande
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                        {notifications.map((n) => (
                          <li key={n.id}>
                            <button
                              type="button"
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                              onClick={() => {
                                markAsRead(n.id);
                                setNotifOpen(false);
                                navigate('/admin/commandes');
                              }}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {n.client}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                                  {formatTimeAgo(n.createdAt)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-0.5">
                                <span className="text-xs text-gray-600 dark:text-gray-300">
                                  {n.total != null ? formatCurrency(n.total) : '—'}
                                </span>
                                <span className="text-xs text-orange-500">{n.status}</span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
                    <button
                      type="button"
                      onClick={() => { setNotifOpen(false); navigate('/admin/commandes'); }}
                      className="w-full py-2 text-sm font-medium text-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
                    >
                      Voir toutes les commandes
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* User Info */}
          <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex-1 sm:flex-initial min-w-0 shadow-sm">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-600 ring-2 ring-orange-500/20 bg-gradient-to-br from-orange-500 to-orange-600">
                {(admin?.avatar || admin?.photo || admin?.image) ? (
                  <img
                    src={admin.avatar || admin.photo || admin.image}
                    alt={fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = e.target.parentElement.querySelector('.avatar-fallback');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`avatar-fallback w-full h-full rounded-full flex items-center justify-center ${(admin?.avatar || admin?.photo || admin?.image) ? 'hidden' : ''}`}>
                  <span className="text-white text-xs sm:text-sm font-bold">
                    {firstName.charAt(0).toUpperCase()}{lastName ? lastName.charAt(0).toUpperCase() : firstName.charAt(1)?.toUpperCase() || ''}
                  </span>
                </div>
              </div>
              {/* Indicateur de statut */}
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${
                  isOnline ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={isOnline ? 'En ligne' : 'Hors ligne'}
              />
            </div>
            <div className="min-w-0 flex-1 sm:flex-initial">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {fullName}
                </p>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ${
                    isOnline
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}
                >
                  {isOnline ? 'En ligne' : 'Hors ligne'}
                </span>
              </div>
              {admin?.email && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate hidden sm:block">
                  {admin.email}
                </p>
              )}
            </div>
          </div>

          {/* Logout Button - Toujours visible */}
          <button
            onClick={logout}
            className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all flex-shrink-0 shadow-md hover:shadow-lg active:scale-95"
            title="Déconnexion"
          >
            <LogOut size={18} className="sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-semibold hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
