import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const location = useLocation();
  const hasLoadedRef = useRef(false);

  // Détecter tous les types d'accès au site
  useEffect(() => {
    // Détecter si c'est un nouvel accès (rechargement, navigation directe, recherche)
    // Utiliser l'API Navigation Timing moderne au lieu de performance.navigation (dépréciée)
    const navigationEntries = performance.getEntriesByType('navigation');
    const navigationType = navigationEntries.length > 0 ? navigationEntries[0]?.type : null;
    const isNewAccess = 
      !hasLoadedRef.current ||
      navigationType === 'reload' || // Rechargement
      navigationType === 'navigate' || // Navigation normale
      document.referrer === "" || // Accès direct
      (() => {
        try {
          return !sessionStorage.getItem('hasVisited');
        } catch {
          return true; // Si sessionStorage n'est pas disponible, considérer comme nouvel accès
        }
      })();

    if (isNewAccess) {
      setIsLoading(true);
      try {
        sessionStorage.setItem('hasVisited', 'true');
      } catch {
        // Ignorer si sessionStorage n'est pas disponible
      }
    }

    hasLoadedRef.current = true;
  }, []);

  // Chargement initial de l'application
  useEffect(() => {
    if (!isLoading) return;

    const startTime = Date.now();
    const minDuration = 5000; // 5 secondes minimum

    const checkAndComplete = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);

      if (remaining > 0) {
        setTimeout(() => {
          setIsLoading(false);
        }, remaining);
      } else {
        setIsLoading(false);
      }
    };

    // Vérifier si les ressources sont déjà chargées
    if (document.readyState === "complete") {
      checkAndComplete();
    } else {
      // Attendre le chargement complet
      const handleLoad = () => {
        checkAndComplete();
      };

      window.addEventListener("load", handleLoad);

      // Fallback : si le load event ne se déclenche pas, attendre quand même 5 secondes
      const fallbackTimer = setTimeout(() => {
        setIsLoading(false);
      }, minDuration);

      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(fallbackTimer);
      };
    }
  }, [isLoading]);

  // Chargement lors des changements de page
  useEffect(() => {
    // Ne pas afficher le loader de page si on est déjà en train de charger initialement
    if (isLoading) return;
    
    // Ne pas afficher le loader pour les routes admin (navigation interne)
    const isAdminRoute = location.pathname.startsWith('/admin');
    if (isAdminRoute) {
      setIsPageLoading(false);
      return;
    }

    setIsPageLoading(true);

    // Simuler un chargement de page (plus rapide pour éviter les problèmes)
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname, isLoading]);

  // Réinitialiser le loader à chaque nouvel accès (F5, recherche, lien direct)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleBeforeUnload = () => {
      // Marquer pour afficher le loader au prochain chargement
      try {
        sessionStorage.setItem('shouldShowLoader', 'true');
      } catch {
        // Ignorer si sessionStorage n'est pas disponible
      }
    };

    const handleVisibilityChange = () => {
      // Si l'utilisateur revient après un long moment, réinitialiser
      try {
        if (document.hidden) {
          const lastActiveTime = Date.now();
          sessionStorage.setItem('lastActiveTime', lastActiveTime.toString());
        } else {
          const lastActiveTime = parseInt(sessionStorage.getItem('lastActiveTime') || '0', 10);
          const timeSinceLastActive = Date.now() - lastActiveTime;
          
          // Si plus de 30 minutes, réinitialiser le loader
          if (timeSinceLastActive > 30 * 60 * 1000) {
            sessionStorage.setItem('shouldShowLoader', 'true');
          }
        }
      } catch {
        // Ignorer si sessionStorage n'est pas disponible
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Vérifier si on doit afficher le loader
    try {
      if (sessionStorage.getItem('shouldShowLoader') === 'true') {
        setIsLoading(true);
        sessionStorage.removeItem('shouldShowLoader');
      }
    } catch {
      // Ignorer si sessionStorage n'est pas disponible
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        isPageLoading,
        startLoading,
        stopLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
