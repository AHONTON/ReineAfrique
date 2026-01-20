import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const BlogBanner = () => {
  const images = [
    "/images/r1.jpg",
    "/images/r2.jpg",
    "/images/r3.jpg",
    "/images/r4.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative overflow-hidden bg-neutral-950 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
      {/* Images animées en arrière-plan */}
      <div className="absolute inset-0">
        {images.map((img, index) => (
          <motion.img
            key={index}
            src={img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: currentIndex === index ? 0.5 : 0,
              scale: currentIndex === index ? 1 : 1.1,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Overlay gradient moderne */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

      {/* Contenu principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] flex items-center justify-center">
        <div className="max-w-4xl text-center">
          {/* Titre principal */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4 font-serif"
          >
            L'univers des{" "}
            <span className="block sm:inline text-orange-400 mt-2 sm:mt-0">
              Tissus Africains
            </span>
          </motion.h1>

          {/* Ligne décorative */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-16 sm:w-20 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mb-4 sm:mb-6"
          />

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4 font-light"
          >
            Tendances, conseils de style et histoires culturelles de l'artisanat
            africain authentique.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Contactez-nous
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.a>
          </motion.div>

          {/* Indicateurs de slide */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center gap-2 mt-8 sm:mt-12"
          >
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? "w-8 bg-orange-500"
                    : "w-1.5 bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Image ${index + 1}`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlogBanner;
