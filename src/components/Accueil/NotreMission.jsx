import React from "react";
import { motion } from "framer-motion";
import { Heart, TrendingUp } from "lucide-react";

export default function NotreMission() {
  const valeurs = [
    {
      icon: TrendingUp,
      title: "Soutenir l’économie locale",
      description:
        "Nous valorisons les artisans, créateurs et commerçants africains à travers une vitrine moderne dédiée à la promotion du textile local.",
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: Heart,
      title: "Célébrer l’élégance africaine",
      description:
        "Reine d’Afrique incarne la beauté, la créativité et la noblesse des pagnes et tissus africains, portés avec fierté et authenticité.",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section
      id="mission"
      className="relative bg-gradient-to-br from-white via-orange-50/30 to-amber-50/40 py-16 px-4 sm:px-6 lg:px-12 overflow-hidden"
    >
      {/* Fonds doux */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <div className="absolute top-32 right-4 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-amber-200 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-32 left-4 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-orange-300 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto z-10">
        {/* Titre principal animé */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold text-center text-black mb-8"
        >
          Notre Mission
        </motion.h2>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <p className="text-base sm:text-lg md:text-xl text-black leading-relaxed font-light text-center">
            Chez{" "}
            <span className="font-semibold text-orange-700">
              Reine d’Afrique
            </span>
            , nous croyons à une mode qui relie les traditions ancestrales à
            l’élégance contemporaine. Chaque pagne, chaque tissu raconte une
            histoire : celle du patrimoine africain.
          </p>
        </motion.div>

        {/* Valeurs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
          {valeurs.map((valeur, i) => {
            const Icon = valeur.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.3 }}
                className="p-6 sm:p-8 bg-white/80 backdrop-blur-sm rounded-3xl border border-orange-100 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex flex-col items-center text-center gap-4 sm:gap-5">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${valeur.color} rounded-xl flex items-center justify-center shadow-md`}
                  >
                    <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-semibold text-black">
                    {valeur.title}
                  </h3>
                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                    {valeur.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
