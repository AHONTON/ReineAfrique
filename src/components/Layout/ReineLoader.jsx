import { motion } from "framer-motion";

/**
 * Spinner + branding Reine d'Afrique — utilisé pour LoadingScreen et Suspense fallback.
 * Design fluide et moderne, sans logique de progression.
 */
const ReineLoader = ({ compact = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        compact ? "py-0" : "min-h-screen w-full fixed inset-0 z-[9999] bg-gradient-to-br from-amber-50/95 via-orange-50/90 to-amber-100/95"
      }`}
    >
      {!compact && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(251, 191, 36, 0.12) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(249, 115, 22, 0.08) 0%, transparent 50%)",
            }}
          />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center">
        {/* Spinner moderne : double anneau fluide */}
        <motion.div
          className="relative mb-6 sm:mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            {/* Anneau externe */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: "rgb(249, 115, 22)",
                borderRightColor: "rgb(251, 191, 36)",
                borderBottomColor: "rgb(251, 191, 36)",
                borderLeftColor: "rgba(249, 115, 22, 0.3)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
            {/* Anneau interne (sens inverse) */}
            <motion.div
              className="absolute inset-2 sm:inset-3 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: "rgba(251, 146, 60, 0.6)",
                borderRightColor: "transparent",
                borderBottomColor: "rgba(249, 115, 22, 0.4)",
                borderLeftColor: "rgb(251, 191, 36)",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            {/* Centre : logo ou point */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-200"
                animate={{ scale: [1, 1.2, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Nom de l'entreprise */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 tracking-tight">
            Reine d'Afrique
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-1 text-xs sm:text-sm text-amber-700/90 font-medium"
          >
            L'élégance africaine
          </motion.p>
        </motion.div>

        {!compact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex gap-1"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-amber-400"
                animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReineLoader;
