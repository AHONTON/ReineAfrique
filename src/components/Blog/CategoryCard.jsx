import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const categories = [
  { id: 1, name: "Wax Classique", image: "/images/c1.jpg" },
  { id: 2, name: "Wax Premium", image: "/images/c2.jpg" },
  { id: 3, name: "Super Wax Luxe", image: "/images/c3.jpg" },
  { id: 4, name: "Chiganvy Design", image: "/images/c4.jpg" },
  { id: 5, name: "Grand Super", image: "/images/c5.jpg" },
  { id: 6, name: "Tissus Brodés", image: "/images/c6.jpg" },
  { id: 7, name: "Tissus Unis", image: "/images/c7.jpg" },
  { id: 8, name: "Tissus Mixtes", image: "/images/c8.jpg" },
];

const CategoryCard = ({ category, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Bonjour, je souhaite commander: ${category.name}`
    );
    window.open(`https://wa.me/+2290150035719?text=${msg}`, "_blank");
  };

  return (
    <motion.article
      className="relative group cursor-pointer"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: "easeOut",
      }}
    >
      <motion.div
        className="relative h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden shadow-md"
        whileHover={!isMobile ? { y: -6 } : {}}
        transition={{ duration: 0.3 }}
      >
        {/* IMAGE */}
        <motion.img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.12 : 1 }}
          transition={{ duration: 0.5 }}
          loading="lazy"
        />

        {/* OVERLAY GRADIENT */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent"></div>

        {/* CONTENT */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-center">
          <motion.h3
            className="text-white font-serif text-base sm:text-lg md:text-xl mb-3 font-semibold"
            animate={{ y: isHovered ? -4 : 0 }}
            transition={{ duration: 0.25 }}
          >
            {category.name}
          </motion.h3>

          {/* CTA */}
          <motion.button
            onClick={handleWhatsAppClick}
            className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg hover:shadow-xl relative overflow-hidden group"
            animate={{
              scale: isHovered ? 1.2 : 1,
              y: isHovered ? -2 : 4,
            }}
            whileTap={{ scale: 0.85 }}
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            <ShoppingCart className="w-5 h-5 text-white relative z-10" />
          </motion.button>
        </div>

        {/* BORDER ANIMÉ */}
        <motion.div
          className="absolute inset-0 border-2 border-orange-500 rounded-xl pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.article>
  );
};

export default function CategoriesSection() {
  return (
    <section
      id="nos_collections"
      className="py-14 sm:py-18 md:py-22 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <motion.header
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-1 bg-gradient-to-r from-orange-500 to-amber-600 mx-auto mb-5"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
          />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-900 tracking-tight">
            Nos Tissus
          </h2>

          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto mt-3 leading-relaxed">
            Découvrez notre collection raffinée de tissus africains.
          </p>
        </motion.header>

        {/* GRID RESPONSIVE */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {/* FOOTER DECORATION */}
        <motion.div
          className="flex justify-center items-center gap-3 mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-orange-500" />
          <div className="w-2 h-2 bg-orange-500 rotate-45" />
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-orange-500" />
        </motion.div>
      </div>
    </section>
  );
}
