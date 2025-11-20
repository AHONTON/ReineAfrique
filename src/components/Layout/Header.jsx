import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
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
      <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={logoSrc}
            alt="Reine d'Afrique"
            className="object-contain h-10 md:h-12"
          />
        </Link>

        {/* Menu desktop */}
        <div className="items-center hidden space-x-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="font-medium text-gray-700 transition hover:text-amber-600"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="https://wa.me/229010150035719"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2 ml-4 font-semibold text-white transition-transform duration-300 rounded-full shadow-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:scale-105"
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
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={itemVariants}>
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-medium text-gray-700 hover:text-amber-600"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href="https://wa.me/229010150035719"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="px-6 py-2 mt-2 font-semibold text-white transition-transform duration-300 rounded-full shadow-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:scale-105"
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
