import { motion } from "framer-motion";
import { Gem, Sparkles, Handshake, Truck, Heart } from "lucide-react";

const Choix = () => {
  const raisons = [
    {
      Icon: Gem,
      titre: "Authenticité garantie",
      description:
        "Tous nos tissus sont 100 % d'origine africaine, soigneusement sélectionnés auprès d'artisans locaux réputés.",
    },
    {
      Icon: Sparkles,
      titre: "Qualité et élégance",
      description:
        "Tissus haut de gamme aux motifs uniques et couleurs éclatantes, alliant tradition et modernité.",
    },
    {
      Icon: Handshake,
      titre: "Engagement envers les artisans",
      description:
        "Nous soutenons activement les artisans africains en valorisant leur travail et en favorisant une rémunération équitable.",
    },
    {
      Icon: Truck,
      titre: "Service fiable et réactif",
      description:
        "Livraison rapide, suivi transparent et service client à l'écoute. Ton expérience est notre priorité.",
    },
    {
      Icon: Heart,
      titre: "Passion et engagement",
      description:
        "Une passion pour la culture et l'élégance africaine. Nous travaillons avec le cœur chaque jour.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="px-4 py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h2 className="mb-3 text-3xl font-bold text-gray-800 sm:text-4xl">
            Pourquoi nous choisir ?
          </h2>
          <p className="max-w-2xl mx-auto text-base text-gray-600">
            Chez{" "}
            <span className="font-semibold text-orange-600">
              Reine d'Afrique
            </span>
            , nous croyons que chaque tissu raconte une histoire. Voici pourquoi
            des centaines de passionnés nous font déjà confiance.
          </p>
        </motion.div>

        {/* Cartes des raisons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {raisons.map((raison, index) => {
            const IconComponent = raison.Icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -5 }}
                className="transition-all duration-300 bg-white shadow-lg card hover:shadow-xl"
              >
                <div className="p-5 card-body">
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                      className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500"
                    >
                      <IconComponent
                        className="w-6 h-6 text-white"
                        strokeWidth={2}
                      />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-bold text-gray-800">
                        {raison.titre}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600">
                        {raison.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 text-center"
        >
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <motion.a
              href="/blog"
              className="relative inline-block w-full px-8 py-4 font-semibold text-center text-white transition-all duration-300 rounded-full shadow-lg sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-xl overflow-hidden group"
              aria-label="Découvrir nos tissus africains"
              whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Découvrir nos tissus africains</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Choix;
