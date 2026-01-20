import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

const LoadingScreen = ({ isLoading, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [connectionStatus, setConnectionStatus] = useState("checking");

  useEffect(() => {
    // Détection de l'état de connexion
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    const handleOnline = () => {
      setIsOnline(true);
      setConnectionStatus("online");
    };

    const handleOffline = () => {
      setIsOnline(false);
      setConnectionStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Vérification initiale
    if (navigator.onLine) {
      setConnectionStatus("online");
    } else {
      setConnectionStatus("offline");
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    const minDuration = 5000; // 5 secondes minimum
    const startTime = Date.now();
    let animationFrame;
    let loadComplete = false;

    const completeLoading = () => {
      if (loadComplete) return;
      loadComplete = true;
      setProgress(100);
      setTimeout(() => {
        onComplete();
      }, 300);
    };

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const baseProgress = Math.min((elapsed / minDuration) * 100, 100);

      // Simulation de chargement avec variations
      const variation = Math.sin(elapsed / 500) * 5;
      const currentProgress = Math.min(baseProgress + variation, 100);

      setProgress(currentProgress);

      // Si on est hors ligne, ralentir la progression
      if (!isOnline && currentProgress > 50) {
        setProgress(50);
      }

      if (elapsed < minDuration) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        // Vérifier si les ressources sont chargées
        if (document.readyState === "complete") {
          completeLoading();
        } else {
          const handleLoad = () => {
            completeLoading();
          };
          window.addEventListener("load", handleLoad, { once: true });
          
          // Fallback : compléter après 6 secondes maximum même si pas chargé
          setTimeout(() => {
            completeLoading();
          }, 1000);
        }
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isLoading, onComplete, isOnline]);

  const getStatusMessage = () => {
    if (connectionStatus === "checking") {
      return "Vérification de la connexion...";
    }
    if (connectionStatus === "offline") {
      return "Mode hors ligne détecté";
    }
    if (progress < 30) {
      return "Chargement des ressources...";
    }
    if (progress < 60) {
      return "Préparation de l'interface...";
    }
    if (progress < 90) {
      return "Finalisation...";
    }
    return "Presque prêt...";
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
        >
          {/* Animation de fond */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)",
                backgroundSize: "200% 200%",
              }}
            />
          </div>

          {/* Contenu principal */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="relative">
                <motion.img
                  src="/images/logo.png"
                  alt="Reine d'Afrique"
                  className="w-32 h-32 mx-auto object-contain"
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  className="absolute inset-0 border-4 border-amber-400 rounded-full"
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    },
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                />
              </div>
            </motion.div>

            {/* Titre */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2 text-center"
            >
              Reine d'Afrique
            </motion.h1>

            {/* Statut de connexion */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center gap-2 mb-8"
            >
              {isOnline ? (
                <>
                  <Wifi className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">En ligne</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-red-600">Hors ligne</span>
                </>
              )}
            </motion.div>

            {/* Barre de progression */}
            <div className="w-full mb-4">
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>
            </div>

            {/* Message de statut */}
            <motion.p
              key={progress}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm sm:text-base text-gray-600 mb-6 text-center min-h-[24px]"
            >
              {getStatusMessage()}
            </motion.p>

            {/* Indicateur de chargement */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear",
              }}
              className="text-amber-600"
            >
              <Loader2 className="w-6 h-6" />
            </motion.div>

            {/* Pourcentage */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-xs text-gray-500"
            >
              {Math.round(progress)}%
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
