import { motion } from "framer-motion";

const BlogBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-orange-900 to-red-900">
      {/* Vidéo en arrière‑plan */}
      <video
        className="absolute inset-0 object-cover w-full h-full opacity-30"
        src="https://www.pexels.com/video/video-of-couple-wearing-traditional-clothes-6200792/download?force=true"
        autoPlay
        muted
        loop
      />

      {/* Overlay pour lisibilité */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Motifs décoratifs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 bg-red-600 rounded-full w-96 h-96 filter blur-3xl"></div>
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-80 h-80 bg-amber-600 filter blur-3xl"></div>
      </div>

      {/* Motifs géométriques africains */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="pattern"
            x="0"
            y="0"
            width="100"
            height="100"
            patternUnits="userSpaceOnUse"
          >
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="white" />
            <circle
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>

      {/* Contenu */}
      <div className="relative px-4 py-12 sm:px-6 lg:px-8 sm:py-16 md:py-20">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
          >
            Découvrez l’univers des
            <span className="block mt-2 text-transparent bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text">
              Tissus Africains
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="max-w‑3xl px-4 mx-auto mb-8 text-base leading‑relaxed text-orange‑100 sm:text-lg md:text-xl"
          >
            Tendances, conseils de style, histoires culturelles et tout ce qui
            fait la richesse de l’artisanat africain authentique.
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w‑24 h‑1 mx-auto mb‑8 rounded-full sm:w‑32 bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 md:mb‑10"
          ></motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt‑6"
          >
            <a
              href="/contact"
              className="inline-block px-6 py-3 text-base font-semibold text-orange‑700 transition-all duration-300 bg-white border-2 rounded-xl hover:bg-orange‑50 md:px‑8 md:py‑4 md:text-lg border-amber‑800"
            >
              Contactez‑nous
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlogBanner;
