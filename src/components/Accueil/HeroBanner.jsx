import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import des images locales
import tissu1 from "/images/tissu1.jpg";
import tissu2 from "/images/tissu2.jpg";
import tissu3 from "/images/tissu3.jpg";
import tissu4 from "/images/tissu4.jpg";

const HeroBanner = ({ whatsappNumber = "+2290150035719" }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: tissu1,
      title: "Tissus Africains Authentiques",
      subtitle: "Découvrez l'élégance et la richesse des motifs africains",
    },
    {
      image: tissu2,
      title: "Wax et Pagne Traditionnel",
      subtitle: "Les plus beaux tissus pour vos créations",
    },
    {
      image: tissu3,
      title: "Collection Premium",
      subtitle: "Des tissus de qualité supérieure pour tous vos projets",
    },
    {
      image: tissu4,
      title: "Tradition et Modernité",
      subtitle: "L'héritage africain au service de votre style",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Bonjour, je souhaite en savoir plus sur vos tissus africains."
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        {slides.map((slide, index) => (
          index === currentSlide && (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <motion.img
                src={slide.image}
                alt={slide.title}
                className="object-cover w-full h-full"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
            </motion.div>
          )
        ))}
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-white z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.h1
              className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center font-serif drop-shadow-2xl leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {slides[currentSlide].title}
            </motion.h1>
            <motion.p
              className="mb-8 text-lg sm:text-xl md:text-2xl lg:text-2xl drop-shadow-lg max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {slides[currentSlide].subtitle}
            </motion.p>
            <motion.div
              className="flex flex-col gap-4 sm:flex-row justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.a
                href="/about"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 font-semibold text-center text-white transition-all duration-300 rounded-full shadow-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:shadow-2xl hover:from-amber-600 hover:to-amber-500"
              >
                Nous découvrir
              </motion.a>
              <motion.button
                onClick={handleWhatsApp}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-8 py-3.5 font-semibold transition-all duration-300 bg-white rounded-full shadow-xl text-amber-600 hover:shadow-2xl hover:bg-amber-50"
              >
                <MessageCircle size={20} />
                Discuter en ligne
              </motion.button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Flèches navigation */}
      <motion.button
        onClick={prevSlide}
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        className="absolute z-20 p-3 transition-all -translate-y-1/2 rounded-full left-4 top-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md shadow-lg border border-white/30"
      >
        <ChevronLeft className="text-white" size={28} />
      </motion.button>
      <motion.button
        onClick={nextSlide}
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        className="absolute z-20 p-3 transition-all -translate-y-1/2 rounded-full right-4 top-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md shadow-lg border border-white/30"
      >
        <ChevronRight className="text-white" size={28} />
      </motion.button>

      {/* Indicateurs */}
      <div className="absolute z-20 flex gap-2 -translate-x-1/2 bottom-6 left-1/2">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50 w-3 hover:bg-white/70"
            }`}
            animate={{
              width: index === currentSlide ? 32 : 12,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
