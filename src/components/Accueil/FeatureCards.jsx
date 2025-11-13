import React from "react";

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

  return (
    <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className="overflow-hidden transition-shadow duration-300 bg-white shadow-lg rounded-2xl hover:shadow-2xl group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <h3 className="mb-3 text-2xl font-bold text-gray-800">
                {card.title}
              </h3>
              <p className="leading-relaxed text-gray-600">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;
