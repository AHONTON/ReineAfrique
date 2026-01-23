import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { LogOut, User } from 'lucide-react';
import ThemeToggle from '../../components/admin/ThemeToggle';
import logo from '/images/logo.png';

const Header = () => {
  const { admin, logout } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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

  // Extraire le nom et prénom
  const fullName = admin?.name || admin?.firstName && admin?.lastName 
    ? `${admin.firstName} ${admin.lastName}` 
    : admin?.name || 'Admin';
  const firstName = admin?.firstName || fullName.split(' ')[0] || 'Admin';
  const lastName = admin?.lastName || fullName.split(' ').slice(1).join(' ') || '';

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 w-full">
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-3 md:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={logo}
            alt="Reine d'Afrique"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain flex-shrink-0"
          />
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
          
          {/* User Info */}
          <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex-1 sm:flex-initial min-w-0 shadow-sm">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white sm:w-5 sm:h-5" />
              </div>
              {/* Indicateur de statut */}
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white ${
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
            <span className="text-xs sm:text-sm font-semibold hidden xs:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
