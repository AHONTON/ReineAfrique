import { motion } from "framer-motion";
import { Heart, Sparkles, Globe2 } from "lucide-react";

const valeurs = [
  {
    icon: <Heart className="w-10 h-10 text-rose-500" />,
    titre: "Authenticité",
    texte:
      "Nous valorisons le savoir-faire africain à travers des tissus d’exception, tissés avec passion et tradition.",
  },
  {
    icon: <Sparkles className="w-10 h-10 text-yellow-400" />,
    titre: "Élégance",
    texte:
      "Reine d’Afrique incarne la beauté et la noblesse des tissus africains, en harmonisant modernité et héritage culturel.",
  },
  {
    icon: <Globe2 className="w-10 h-10 text-green-500" />,
    titre: "Impact & Promotion",
    texte:
      "Nous soutenons la commercialisation durable et équitable des pagnes africains, promouvant la culture au-delà des frontières.",
  },
];

const ValeursSection = () => {
  return (
    <section id="valeurs" className="relative py-16 bg-gradient-to-b from-[#fff8f3] to-[#fdf3ec] overflow-hidden">
      {/* Décor en arrière-plan */}
      <motion.div
        className="absolute -top-20 -right-20 w-64 h-64 bg-rose-200 rounded-full blur-3xl opacity-30"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Titre principal */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 font-serif"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Nos Valeurs
        </motion.h2>

        <motion.p
          className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Chez <span className="text-rose-500 font-semibold">Reine d'Afrique</span>, chaque tissu est une
          histoire, chaque motif un symbole, et chaque couleur une célébration de l'élégance africaine.
        </motion.p>

        {/* Cartes des valeurs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {valeurs.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg p-8 flex flex-col items-center text-center transition-all duration-300 border border-gray-100 hover:border-rose-200"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 font-serif">
                {item.titre}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.texte}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValeursSection;
