import React from "react";

// Import des images locales
import card1 from "../assets/images/card1.jpg";
import card2 from "../assets/images/card2.jpg";
import card3 from "../assets/images/card3.jpg";
import card4 from "../assets/images/card4.jpg";

const FeatureCards = () => {
  const cards = [
    {
      image: card1,
      title: "Tissus Authentiques",
      description: "Sélection rigoureuse de tissus wax et pagnes traditionnels de qualité supérieure"
    },
    {
      image: card2,
      title: "Livraison Express",
      description: "Recevez vos commandes rapidement partout en Afrique avec notre service de livraison fiable"
    },
    {
      image: card3,
      title: "Conseils Personnalisés",
      description: "Notre équipe d'experts vous guide dans le choix de vos tissus selon vos projets"
    },
    {
      image: card4,
      title: "Design Unique",
      description: "Chaque création est pensée pour refléter l’élégance et la richesse de la culture africaine"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{card.title}</h3>
              <p className="text-gray-600 leading-relaxed">{card.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;
