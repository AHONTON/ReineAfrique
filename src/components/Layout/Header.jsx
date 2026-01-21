import { useState, useEffect, memo } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Clock from "../Clock";

const Header = memo(({ logoSrc }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "À propos", path: "/about" },
    { name: "Blog", path: "/blog" },
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
      <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative">
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 min-w-0">
          <Link to="/" className="flex items-center">
            <motion.img
              src={logoSrc}
              alt="Reine d'Afrique"
              className="object-contain h-10 md:h-12"
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            />
          </Link>
        </motion.div>

        {/* Horloge et Date - Centrées et responsive avec espacement pour éviter le menu */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-auto max-w-[140px] xs:max-w-[180px] sm:max-w-[240px] md:max-w-[300px] lg:max-w-[360px] xl:max-w-[400px] pointer-events-auto px-1 sm:px-2">
            <Clock isScrolled={scrolled} showDate={true} />
          </div>
        </div>

        {/* Menu desktop */}
        <div className="items-center hidden space-x-4 lg:space-x-6 md:flex flex-1 justify-end min-w-0 ml-2">
          {navLinks.map((link) => (
            <motion.div key={link.name} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link
                to={link.path}
                className="relative font-medium text-base text-gray-700 transition-colors duration-300 hover:text-amber-600 group"
              >
                {link.name}
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                />
              </Link>
            </motion.div>
          ))}
          <motion.a
            href="https://wa.me/+2290150035719"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-6 py-2.5 ml-4 font-semibold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:shadow-xl overflow-hidden group flex items-center gap-2"
          >
            <motion.img
              src={logoSrc}
              alt="Reine d'Afrique"
              className="w-5 h-5 relative z-10 object-contain"
              whileHover={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
            />
            <span className="relative z-10">Nous rejoindre</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-500 opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        </div>

        {/* Menu mobile toggle */}
        <motion.button
          className="md:hidden text-amber-700 focus:outline-none p-2 rounded-lg hover:bg-amber-50 transition-colors flex-shrink-0 ml-2 z-20 relative"
          onClick={() => setMenuOpen(!menuOpen)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={28} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={28} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Dropdown mobile animé */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="bg-white border-t shadow-lg md:hidden border-amber-100"
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
              {/* Horloge dans le menu mobile */}
              <motion.div variants={itemVariants} className="pb-2 border-b border-amber-100 w-full flex justify-center">
                <Clock isScrolled={true} />
              </motion.div>
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={itemVariants}>
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="relative text-lg font-medium text-gray-700 hover:text-amber-600 transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-amber-50 block"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href="https://wa.me/+2290150035719"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 mt-2 font-semibold text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:shadow-xl flex items-center justify-center gap-2"
                variants={itemVariants}
              >
                <motion.img
                  src={logoSrc}
                  alt="Reine d'Afrique"
                  className="w-5 h-5 object-contain"
                  whileHover={{ rotate: [0, -5, 5, -5, 0] }}
                  transition={{ duration: 0.5 }}
                />
                Nous rejoindre
              </motion.a>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
