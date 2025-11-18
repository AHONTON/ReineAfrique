import { motion } from "framer-motion";
import { Phone } from "lucide-react";

/**
 * ContactBaner Component
 * Bannière compacte avec overlay vidéo pour Reine d'Afrique
 * Design épuré pour superposition sur vidéo background
 */
const ContactBaner = () => {
  const phoneNumber = "+22901234567";

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
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
    <div className="relative w-full">
      {/* Overlay sombre pour contraste avec vidéo */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3A1F0B]/85 via-[#3A1F0B]/70 to-[#3A1F0B]/85 backdrop-blur-sm"></div>

      {/* Contenu de la bannière */}
      <motion.div
        className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            {/* Colonne gauche - Message */}
            <motion.div variants={itemVariants} className="text-left">
              <div className="inline-block px-4 py-2 rounded-full bg-[#E56A0D]/20 border border-[#E56A0D]/40 mb-4">
                <span className="text-[#F2B632] text-sm font-semibold uppercase tracking-wide">
                  Contactez-nous
                </span>
              </div>

              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
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

              {/* Indicateurs de confiance */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3C7A55] animate-pulse"></div>
                  <span className="text-white/80 text-sm font-medium">
                    Réponse immédiate
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F2B632] animate-pulse"></div>
                  <span className="text-white/80 text-sm font-medium">
                    Conseil gratuit
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#E56A0D] animate-pulse"></div>
                  <span className="text-white/80 text-sm font-medium">
                    500+ clients satisfaits
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Colonne droite - CTA */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center md:items-end"
            >
              {/* Carte CTA compacte */}
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
                
                {/* Icône téléphone animée */}
                <div className="flex justify-center mb-5">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#E56A0D] to-[#B42C1B] flex items-center justify-center shadow-lg">
                      <Phone className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    {/* Effet de pulsation */}
                    <div className="absolute inset-0 w-16 h-16 rounded-xl bg-[#E56A0D] opacity-30 animate-ping"></div>
                  </motion.div>
                </div>

                {/* Titre CTA */}
                <h3
                  className="text-2xl font-bold text-[#3A1F0B] text-center mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Appelez-nous maintenant
                </h3>

                {/* Numéro visible */}
                <div className="text-center mb-5">
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

                {/* Bouton d'appel principal */}
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
                    className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
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

      {/* Bordure décorative africaine en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#3C7A55] via-[#F2B632] via-[#E56A0D] to-[#B42C1B]"></div>
    </div>
  );
};

export default ContactBaner;