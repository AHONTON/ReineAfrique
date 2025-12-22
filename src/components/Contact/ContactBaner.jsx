import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const ContactBaner = () => {
  const phoneNumber = "+2290150035719";

  /* --- SLIDER BACKGROUND (3 IMAGES) --- */
  const images = ["/images/r2.jpg", "/images/c8.jpg", "/images/card4.jpg"];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  /* --- ANIMATION VARIANTS --- */
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* --- BACKGROUND IMAGES SLIDER --- */}
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] ${
            index === i ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* --- OVERLAY SOMBRE --- */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3A1F0B]/70 via-[#3A1F0B]/55 to-[#3A1F0B]/70 backdrop-blur-[2px]"></div>

      {/* --- CONTENU PRINCIPAL --- */}
      <motion.div
        className="relative z-10 px-4 py-12 sm:py-16 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid items-center gap-8 md:grid-cols-2">
            {/* TEXTE GAUCHE */}
            <motion.div variants={itemVariants} className="text-left">
              <h2
                className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Besoin de tissus africains{" "}
                <span className="text-[#F2B632]">authentiques ?</span>
              </h2>

              <p
                className="text-base sm:text-lg text-[#F5E9D3]/90 leading-relaxed mb-6"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Nos experts vous conseillent et vous accompagnent dans le choix
                de vos tissus premium. Un simple appel suffit.
              </p>

              {/* Indicateurs */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3C7A55] animate-pulse"></div>
                  <span className="text-sm font-medium text-white/80">
                    Réponse immédiate
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F2B632] animate-pulse"></div>
                  <span className="text-sm font-medium text-white/80">
                    Conseil gratuit
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E56A0D] animate-pulse"></div>
                  <span className="text-sm font-medium text-white/80">
                    500+ clients satisfaits
                  </span>
                </div>
              </div>
            </motion.div>

            {/* CTA DROITE */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center md:items-end"
            >
              <div className="w-full max-w-md p-6 shadow-2xl bg-white/95 backdrop-blur-md rounded-2xl sm:p-8">
                {/* Icone */}
                <div className="flex justify-center mb-5">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#E56A0D] to-[#B42C1B] flex items-center justify-center shadow-lg">
                      <Phone className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="absolute inset-0 w-16 h-16 rounded-xl bg-[#E56A0D] opacity-30 animate-ping"></div>
                  </motion.div>
                </div>

                {/* Titre */}
                <h3
                  className="text-2xl font-bold text-[#3A1F0B] text-center mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Appelez-nous maintenant
                </h3>

                {/* Numéro */}
                <div className="mb-5 text-center">
                  <p className="text-xs text-[#3A1F0B]/60 uppercase tracking-wide mb-1 font-semibold">
                    Téléphone direct
                  </p>
                  <a
                    href={`tel:${phoneNumber}`}
                    className="text-[#E56A0D] text-xl font-bold hover:text-[#3A1F0B] transition-colors"
                  >
                    {phoneNumber}
                  </a>
                </div>

                {/* Bouton */}
                <motion.a
                  href={`tel:${phoneNumber}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 rounded-full bg-[#E56A0D] hover:bg-[#3A1F0B] 
                             text-white font-bold text-base shadow-xl 
                             transition-all duration-300 flex items-center justify-center gap-3 group"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <Phone
                    className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
                    strokeWidth={2.5}
                  />
                  Lancer l'appel
                </motion.a>

                {/* Horaires */}
                <div className="mt-5 pt-5 border-t border-[#3A1F0B]/10 text-center">
                  <p className="text-xs text-[#3A1F0B]/60 font-medium">
                    📞 Disponible Lun - Sam • 9h00 - 18h00
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bordure décorative */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#3C7A55] via-[#F2B632] via-[#E56A0D] to-[#B42C1B] z-20"></div>
    </div>
  );
};

export default ContactBaner;
