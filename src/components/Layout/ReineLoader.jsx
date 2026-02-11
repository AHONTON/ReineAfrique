import { motion } from "framer-motion";

/**
 * Loader Neumorphism + branding Reine d'Afrique.
 * Soft UI avec Tailwind + Framer Motion.
 */
const ReineLoader = ({ compact = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center neu-bg ${
        compact ? "py-0" : "min-h-screen w-full fixed inset-0 z-[9999]"
      }`}
    >
      {/* Carte principale : convex neumorphic */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative rounded-[2rem] p-8 sm:p-10 neu-convex border border-white/30"
      >
        {/* Spinner : cercle inset avec anneaux en rotation */}
        <div className="relative mb-6 sm:mb-8 flex justify-center">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full neu-inset flex items-center justify-center">
            <motion.div
              className="absolute inset-[6px] sm:inset-2 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: "rgba(234, 88, 12, 0.9)",
                borderRightColor: "rgba(251, 191, 36, 0.6)",
                borderBottomColor: "transparent",
                borderLeftColor: "transparent",
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-[6px] sm:inset-2 rounded-full border-2 border-transparent"
              style={{
                borderTopColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: "rgba(251, 146, 60, 0.8)",
                borderLeftColor: "rgba(249, 115, 22, 0.5)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            />
            {/* Centre : bouton convex */}
            <motion.div
              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full neu-raised-sm border border-white/40"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Nom + slogan */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="text-center"
        >
          <h1
            className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-gray-800"
            style={{
              textShadow: "1px 1px 2px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.04)",
            }}
          >
            Reine d'Afrique
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-1.5 text-xs sm:text-sm font-medium text-amber-800/80"
          >
            L'élégance africaine
          </motion.p>
        </motion.div>

        {!compact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex justify-center gap-2"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-2 h-2 rounded-full neu-pressed border border-white/30"
                animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ReineLoader;
