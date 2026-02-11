import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReineLoader from "./ReineLoader";

const LoadingScreen = ({ isLoading, onComplete }) => {
  useEffect(() => {
    if (!isLoading) return;

    const minDuration = 2800;
    const startTime = Date.now();
    let loadComplete = false;

    const completeLoading = () => {
      if (loadComplete) return;
      loadComplete = true;
      setTimeout(() => onComplete(), 350);
    };

    const checkComplete = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed < minDuration) {
        setTimeout(checkComplete, 100);
        return;
      }
      if (document.readyState === "complete") {
        completeLoading();
      } else {
        window.addEventListener("load", () => completeLoading(), { once: true });
        setTimeout(completeLoading, 800);
      }
    };

    const t = setTimeout(checkComplete, minDuration);
    return () => clearTimeout(t);
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center neu-bg"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 flex flex-col items-center"
          >
            <ReineLoader compact />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
