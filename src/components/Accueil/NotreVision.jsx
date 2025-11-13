import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe2, Users, Star, HandHeart, Sparkles, ArrowRight } from "lucide-react";

// 🖼️ Import local images
import vision1 from "/images/vision1.jpg";
import vision2 from "/images/vision2.jpg";
import vision3 from "/images/vision3.jpg";
import vision4 from "/images/vision4.jpg";
import vision5 from "/images/vision5.jpg";

export default function NotreVision() {
  const visions = [
    {
      icon: Globe2,
      title: "Une identité sans frontières",
      description:
        "Chez Reine d'Afrique, nous croyons en la force du tissu africain comme symbole d'identité, de beauté et de culture.",
      image: vision1,
      color: "from-amber-500 to-orange-600",
    },
    {
      icon: HandHeart,
      title: "Valoriser les artisans africains",
      description:
        "Notre vision est de rendre les tissus africains accessibles à tous, tout en valorisant le travail des artisans et commerçants locaux.",
      image: vision2,
      color: "from-rose-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Créer un réseau de partage",
      description:
        "Nous aspirons à bâtir un réseau solide reliant artisans, créateurs et foyers à travers l'Afrique et le monde.",
      image: vision3,
      color: "from-amber-600 to-yellow-500",
    },
    {
      icon: Sparkles,
      title: "Mettre la culture en lumière",
      description:
        "Chaque tissu africain raconte une histoire, et nous voulons que cette histoire brille à travers le monde de la mode et du design.",
      image: vision4,
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Star,
      title: "Une passion qui relie",
      description:
        "Reine d'Afrique, c'est une passerelle entre les artisans, les marchés et les amoureux du style africain — pour que la culture se porte, se partage et se vive au quotidien.",
      image: vision5,
      color: "from-yellow-500 to-orange-600",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-white via-orange-50/20 to-amber-50/40 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 🌸 Effet décoratif de fond */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 right-10 w-60 h-60 bg-gradient-to-br from-orange-300 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-br from-amber-200 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* ✨ Titre principal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Notre Vision
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Chez <span className="font-semibold text-orange-700">Reine d’Afrique</span>, 
            nous croyons en la force du tissu africain comme symbole d’identité, de beauté et de culture.
          </p>
        </motion.div>

        {/* 🧡 Grille des cartes de vision */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visions.map((vision, index) => {
            const Icon = vision.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -6 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-xl border border-orange-100 transition overflow-hidden"
              >
                {/* Image */}
                <div className="relative w-full h-40 sm:h-48 overflow-hidden">
                  <motion.img
                    src={vision.image}
                    alt={vision.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50" />
                </div>

                {/* Contenu texte */}
                <div className="p-6 flex flex-col gap-3">
                  <div
                    className={`inline-flex w-10 h-10 bg-gradient-to-br ${vision.color} rounded-xl items-center justify-center shadow-md`}
                  >
                    <Icon className="text-white w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900">
                    {vision.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {vision.description}
                  </p>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className={`h-1 bg-gradient-to-r ${vision.color} rounded-full w-16 mt-2`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 🌍 Bouton de redirection animé */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          className="text-center mt-14"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/nos-articles"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              <span>Découvrir nos collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}