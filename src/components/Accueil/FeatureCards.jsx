import { motion } from "framer-motion";

const FeatureCards = () => {
  const cards = [
    {
      image: "/images/card1.jpg",
      title: "Tissus Authentiques",
      description:
        "Sélection rigoureuse de tissus wax et pagnes traditionnels de qualité supérieure",
    },
    {
      image: "/images/card2.jpg",
      title: "Livraison Express",
      description:
        "Recevez vos commandes rapidement partout en Afrique avec notre service de livraison fiable",
    },
    {
      image: "/images/card3.jpg",
      title: "Conseils Personnalisés",
      description:
        "Notre équipe d'experts vous guide dans le choix de vos tissus selon vos projets",
    },
    {
      image: "/images/card4.jpg",
      title: "Design Unique",
      description:
        "Chaque création est pensée pour refléter l’élégance et la richesse de la culture africaine",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <motion.div
        className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.02 }}
            className="overflow-hidden bg-white shadow-lg rounded-2xl hover:shadow-2xl group cursor-pointer"
          >
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <motion.img
                src={card.image}
                alt={card.title}
                className="object-cover w-full h-full"
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="p-6">
              <motion.h3
                className="mb-3 text-lg sm:text-xl md:text-2xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors duration-300 font-serif"
                whileHover={{ x: 5 }}
              >
                {card.title}
              </motion.h3>
              <p className="leading-relaxed text-gray-600 text-sm sm:text-base font-normal">
                {card.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeatureCards;
