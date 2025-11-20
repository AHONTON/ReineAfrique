import React, { useState } from "react";
import { motion } from "framer-motion";
import { Facebook, Phone, ChevronRight, Sparkles } from "lucide-react";

// Logo TikTok custom
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const Footer = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "Accueil", href: "/Découverte/accueil" },
      { name: "Nos Valeurs", href: "/#valeurs" },
      { name: "Notre Mission", href: "/Découverte/notre-mission" },
      { name: "Notre Vision", href: "/Découverte/notre-vision" },
    ],
    about: [
      { name: "A propos", href: "/a-propos/a-propos" },
      { name: "Qui sommes-nous ?", href: "/a-propos/qui-sommes-nous" },
      { name: "Notre Histoire", href: "/a-propos/histoire" },
      { name: "Nos Collection", href: "/a-propos/nos-collections" },
    ],
    support: [
      { name: "Contact", href: "/contact" },
      { name: "FAQ", href: "/faq" },
      { name: "Nous rejoindre", href: "/nous-rejoindre" },
      { name: "Confidentialité", href: "/confidentialite" },
    ],
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com/reineafrique",
      label: "Facebook",
      color: "hover:bg-blue-600",
    },
    {
      icon: TikTokIcon,
      href: "https://tiktok.com/@reineafrique",
      label: "TikTok",
      color: "hover:bg-black",
      isCustom: true,
    },
    {
      icon: Phone,
      href: "https://wa.me/2290150035719",
      label: "WhatsApp",
      color: "hover:bg-green-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="relative w-full overflow-hidden text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animation décorative */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-5">
        <motion.div
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500 via-transparent to-amber-500"
          style={{ backgroundSize: "200% 200%" }}
        />
      </div>

      {/* Contenu principal */}
      <div className="relative w-full px-6 pt-10 pb-6 sm:pt-14 md:px-10 lg:px-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between w-full gap-8 mb-12 lg:items-start lg:flex-row"
        >
          {/* Gauche : Logo + Texte + Réseaux sociaux */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center gap-4 text-center lg:items-start lg:text-left lg:max-w-md"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => (window.location.href = "/")} // redirection vers l'accueil
            >
              <div className="flex items-center justify-center overflow-hidden shadow-lg w-14 h-14 rounded-xl">
                <img
                  src="/images/logo.png"
                  alt="Reine d'Afrique"
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold">
                  Reine d'Afrique
                </h3>
                <p className="text-sm text-orange-400">
                  Le tissu qui vous rend unique
                </p>
              </div>
            </motion.div>

            <p className="mt-2 text-sm text-gray-400">
              Découvrez l'authenticité des tissus africains et plongez dans un
              univers de couleurs, de motifs et de traditions séculaires.
            </p>

            <div className="flex gap-4 mt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.15, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all duration-300 ${social.color} shadow-lg`}
                    aria-label={social.label}
                  >
                    {social.isCustom ? <Icon /> : <Icon className="w-6 h-6" />}
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Droite : cartes de liens */}
          <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-3 place-items-center">
            {Object.entries(footerLinks).map(([key, section]) => (
              <motion.div
                key={key}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="w-full max-w-sm p-6 border shadow-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border-white/20 rounded-2xl"
              >
                <h4 className="mb-4 text-lg font-bold capitalize">
                  {key === "shop"
                    ? "Découverte"
                    : key === "about"
                    ? "Liens utiles"
                    : "Support"}
                </h4>
                <ul className="space-y-2.5">
                  {section.map((link, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ x: 5 }}
                      onHoverStart={() => setHoveredLink(`${key}-${index}`)}
                      onHoverEnd={() => setHoveredLink(null)}
                    >
                      <a
                        href={link.href}
                        className="flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-orange-400"
                      >
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            hoveredLink === `${key}-${index}`
                              ? "translate-x-1"
                              : ""
                          }`}
                        />
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bas du footer */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center justify-between gap-4 pt-8 border-t border-white/10 sm:flex-row"
        >
          <p className="text-sm text-center text-gray-400 sm:text-left">
            © {currentYear} Reine d'Afrique. Tous droits réservés.
          </p>

          <p className="text-sm text-gray-400">L'élégance africaine</p>

          <div className="flex gap-4 text-xs">
            <a
              href="/confidentialite"
              className="text-gray-400 transition-colors hover:text-orange-400"
            >
              Politique de confidentialité
            </a>
            <span className="text-gray-600">|</span>
            <a
              href="/cgv"
              className="text-gray-400 transition-colors hover:text-orange-400"
            >
              Afrique
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
