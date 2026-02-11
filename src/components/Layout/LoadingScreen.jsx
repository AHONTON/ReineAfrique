import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";
import ReineLoader from "./ReineLoader";

const LoadingScreen = ({ isLoading, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [connectionStatus, setConnectionStatus] = useState("checking");

  useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") return;

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
    if (navigator.onLine) setConnectionStatus("online");
    else setConnectionStatus("offline");

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) return;

    const minDuration = 2800; // ~3 s, fluide
    const startTime = Date.now();
    let animationFrame;
    let loadComplete = false;

    const completeLoading = () => {
      if (loadComplete) return;
      loadComplete = true;
      setProgress(100);
      setTimeout(() => onComplete(), 350);
    };

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const baseProgress = Math.min((elapsed / minDuration) * 98, 98);
      const variation = Math.sin(elapsed / 400) * 3;
      const currentProgress = Math.min(baseProgress + variation, 98);
      setProgress(isOnline ? currentProgress : Math.min(currentProgress, 50));

      if (elapsed < minDuration) {
        animationFrame = requestAnimationFrame(updateProgress);
      } else {
        if (document.readyState === "complete") {
          completeLoading();
        } else {
          window.addEventListener("load", () => completeLoading(), { once: true });
          setTimeout(completeLoading, 800);
        }
      }
    };

    animationFrame = requestAnimationFrame(updateProgress);
    return () => animationFrame && cancelAnimationFrame(animationFrame);
  }, [isLoading, onComplete, isOnline]);

  const getStatusMessage = () => {
    if (connectionStatus === "checking") return "Vérification de la connexion...";
    if (connectionStatus === "offline") return "Mode hors ligne détecté";
    if (progress < 35) return "Chargement des ressources...";
    if (progress < 70) return "Préparation de l'interface...";
    if (progress < 95) return "Finalisation...";
    return "Presque prêt...";
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-amber-50/98 via-orange-50/95 to-amber-100/98"
        >
          {/* Fond animé fluide */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
                opacity: [0.5, 0.9, 0.5],
              }}
              transition={{
                backgroundPosition: { duration: 18, repeat: Infinity, repeatType: "reverse" },
                opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 90% 60% at 50% 30%, rgba(251, 191, 36, 0.15) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 85% 75%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)",
                backgroundSize: "200% 200%",
              }}
            />
          </div>

          {/* Contenu : spinner + nom (style ReineLoader) */}
          <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-6">
            <ReineLoader compact />

            {/* Statut connexion */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mt-6"
            >
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs text-gray-500">En ligne</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-600">Hors ligne</span>
                </>
              )}
            </motion.div>

            {/* Barre de progression fluide */}
            <div className="w-full mt-6 max-w-xs">
              <div className="h-1 bg-gray-200/80 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 20 }}
                />
              </div>
            </div>

            {/* Message + pourcentage */}
            <motion.p
              key={Math.floor(progress / 30)}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-xs sm:text-sm text-gray-500 text-center min-h-[20px]"
            >
              {getStatusMessage()}
            </motion.p>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-1 text-[10px] text-gray-400 tabular-nums"
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
