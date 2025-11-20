import { motion } from "framer-motion";

// Import du logo local
import logo from "/images/logo.png";

const AboutSection = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const fadeInScale = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section id="qui_sommes_nous" className="py-4 md:py-6 bg-gradient-to-b from-white to-amber-50/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center mb-4 md:mb-6"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Qui sommes-nous ?
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-10">
          {/* Logo à gauche */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInScale}
            className="flex-shrink-0"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <img
                src={logo}
                alt="Logo Reine d'Afrique"
                className="w-full h-full object-contain"
              />
            </div>
          </motion.div>

          {/* Texte à droite */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex-1 max-w-2xl"
          >
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl">
              <div className="space-y-4">
                <p className="text-gray-700 text-base md:text-lg leading-relaxed text-justify">
                  <span className="font-bold text-amber-600 text-xl md:text-2xl">
                    Reine d'Afrique
                  </span>{" "}
                  est une marque moderne et engagée dédiée à la promotion et à
                  la vente des tissus africains. Nous mettons en valeur la
                  richesse du patrimoine textile du continent à travers des
                  collections soigneusement sélectionnées auprès d'artisans et
                  de créateurs locaux.
                </p>

                <p className="text-gray-700 text-base md:text-lg leading-relaxed text-justify">
                  Notre mission :{" "}
                  <span className="font-semibold text-amber-700">
                    faire rayonner la beauté authentique des tissus africains
                  </span>{" "}
                  tout en soutenant ceux qui les fabriquent avec passion.
                </p>
              </div>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4"
              >
                <a
                  href="/blog"
                  className="inline-block w-full sm:w-auto text-center bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  aria-label="Découvrir nos collections de tissus africains"
                >
                  Découvrir nos collections
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
