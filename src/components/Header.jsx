import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = ({ logoSrc }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "À propos", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Nos articles", path: "/articles" },
    { name: "Contact", path: "/contact" },
  ];

  // Variants Framer Motion pour les liens et le bouton
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-white/95 shadow-md backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img src={logoSrc} alt="Reine d'Afrique" className="h-10 md:h-12 object-contain" />
        </a>

        {/* Menu desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="font-medium text-gray-700 hover:text-amber-600 transition"
            >
              {link.name}
            </a>
          ))}
          <a
  href="https://wa.me/2290154142255"
  target="_blank"
  rel="noopener noreferrer"
  className="ml-4 px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
>
  Nous rejoindre
</a>

        </div>

        {/* Menu mobile toggle */}
        <button
          className="md:hidden text-amber-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Dropdown mobile animé */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-white shadow-lg border-t border-amber-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.ul
              className="flex flex-col items-center py-5 space-y-4"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium text-gray-700 hover:text-amber-600"
                  variants={itemVariants}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
  href="https://wa.me/2290154142255"
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => setMenuOpen(false)}
  className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-white font-semibold shadow-lg hover:scale-105 transition-transform duration-300"
  variants={itemVariants}
>
  Nous rejoindre
</motion.a>

            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;