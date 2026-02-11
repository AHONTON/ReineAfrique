import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiShoppingBag, FiStar } from 'react-icons/fi';

const slides = [
  {
    id: 1,
    image: "/images/tissu1.jpg",
    title: "L'Élégance du Textile Africain",
    subtitle: "Découvrez nos tissus authentiques de première qualité",
    accent: "Nouvelle Collection",
    color: "from-amber-600 to-orange-500"
  },
  {
    id: 2,
    image: "/images/tissu2.jpg",
    title: "Promotions Exclusives",
    subtitle: "Jusqu'à -20% sur les tissus Bazin Riche",
    accent: "Offre Limitée",
    color: "from-purple-600 to-indigo-500"
  },
  {
    id: 3,
    image: "/images/tissu4.jpg",
    title: "Sublimez Votre Style",
    subtitle: "Des motifs uniques pour des créations inoubliables",
    accent: "Tendance",
    color: "from-emerald-600 to-teal-500"
  }
];

const ShopBanner = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-3xl mb-12 group shadow-2xl mx-auto max-w-[98%]">
      <AnimatePresence mode='wait'>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image with Gradient Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center px-4 md:px-16 lg:px-24">
            <div className="max-w-4xl text-center text-white space-y-8 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20"
              >
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="fill-current w-4 h-4" />
                  ))}
                </div>
                <div className="w-px h-4 bg-white/30"></div>
                <span className={`text-sm font-bold uppercase tracking-wider text-amber-300`}>
                  {slides[current].accent}
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold leading-tight drop-shadow-2xl"
              >
                {slides[current].title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-lg md:text-2xl text-gray-100 font-light max-w-2xl leading-relaxed"
              >
                {slides[current].subtitle}
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/blog')}
                className={`flex items-center px-8 py-3 bg-white text-gray-900 rounded-full font-bold shadow-xl transition-all hover:bg-amber-50 gap-2 mt-4`}
              >
                <FiArrowRight className="w-5 h-5" />
                <span>Visiter notre Blog</span>
                <FiArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ShopBanner;
