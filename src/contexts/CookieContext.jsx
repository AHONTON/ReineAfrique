import { createContext, useContext, useState, useEffect } from "react";

const CookieContext = createContext();

export const useCookie = () => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error("useCookie must be used within CookieProvider");
  }
  return context;
};

export const CookieProvider = ({ children }) => {
  const [cookieConsent, setCookieConsent] = useState(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Charger le consentement depuis localStorage au montage
  useEffect(() => {
    try {
      const savedConsent = localStorage.getItem("cookieConsent");
      if (savedConsent) {
        setCookieConsent(savedConsent);
        setShowCookieBanner(false);
      } else {
        // Afficher la bannière après un court délai pour une meilleure UX
        const timer = setTimeout(() => {
          setShowCookieBanner(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      // Si localStorage n'est pas disponible, afficher la bannière
      if (import.meta.env.DEV) {
        console.warn("localStorage non disponible:", error);
      }
      setShowCookieBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    setCookieConsent("accepted");
    try {
      localStorage.setItem("cookieConsent", "accepted");
      localStorage.setItem("cookieConsentDate", new Date().toISOString());
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Impossible d'enregistrer le consentement:", error);
      }
    }
    setShowCookieBanner(false);
    
    // Initialiser les cookies acceptés
    initializeCookies();
  };

  const rejectCookies = () => {
    setCookieConsent("rejected");
    try {
      localStorage.setItem("cookieConsent", "rejected");
      localStorage.setItem("cookieConsentDate", new Date().toISOString());
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Impossible d'enregistrer le refus:", error);
      }
    }
    setShowCookieBanner(false);
    
    // Ne pas initialiser les cookies
    removeCookies();
  };

  const initializeCookies = () => {
    // Ici vous pouvez initialiser vos services de tracking, analytics, etc.
    // Exemple : Google Analytics, Facebook Pixel, etc.
    if (typeof window !== "undefined") {
      // Exemple d'initialisation (à adapter selon vos besoins)
      // Les services de tracking peuvent être initialisés ici
      if (import.meta.env.DEV) {
        // Log uniquement en développement
        console.log("Cookies acceptés - Services de tracking initialisés");
      }
    }
  };

  const removeCookies = () => {
    // Supprimer les cookies de tracking si l'utilisateur refuse
    if (typeof window !== "undefined") {
      // Supprimer les cookies de tracking
      const cookiesToRemove = [
        "_ga",
        "_gid",
        "_gat",
        "_fbp",
        "_fbc",
        // Ajoutez d'autres cookies de tracking si nécessaire
      ];

      cookiesToRemove.forEach((cookieName) => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      });

      // Supprimer les données localStorage liées au tracking
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("_ga") || key.startsWith("_fb")) {
            localStorage.removeItem(key);
          }
        });
      } catch {
        // Ignorer si localStorage n'est pas accessible
      }

      if (import.meta.env.DEV) {
        // Log uniquement en développement
        console.log("Cookies refusés - Services de tracking désactivés");
      }
    }
  };

  const openPrivacyModal = () => {
    setShowPrivacyModal(true);
  };

  const closePrivacyModal = () => {
    setShowPrivacyModal(false);
  };

  return (
    <CookieContext.Provider
      value={{
        cookieConsent,
        showCookieBanner,
        showPrivacyModal,
        acceptCookies,
        rejectCookies,
        openPrivacyModal,
        closePrivacyModal,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};
