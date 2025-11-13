import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

// Import des images locales
import tissu1 from "/images/tissu1.jpg";
import tissu2 from "/images/tissu2.jpg";
import tissu3 from "/images/tissu3.jpg";
import tissu4 from "/images/tissu4.jpg";

const HeroBanner = ({ whatsappNumber = "22990154142255" }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: tissu1,
      title: "Tissus Africains Authentiques",
      subtitle: "Découvrez l'élégance et la richesse des motifs africains",
    },
    {
      image: tissu2,
      title: "Wax et Pagne Traditionnel",
      subtitle: "Les plus beaux tissus pour vos créations",
    },
    {
      image: tissu3,
      title: "Collection Premium",
      subtitle: "Des tissus de qualité supérieure pour tous vos projets",
    },
    {
      image: tissu4,
      title: "Tradition et Modernité",
      subtitle: "L'héritage africain au service de votre style",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      "Bonjour, je souhaite en savoir plus sur vos tissus africains."
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-white">
        <h1 className="mb-4 text-4xl font-bold text-center md:text-6xl animate-fade-in drop-shadow-lg">
          {slides[currentSlide].title}
        </h1>
        <p className="mb-8 text-xl text-center md:text-2xl animate-fade-in drop-shadow-md">
          {slides[currentSlide].subtitle}
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="/about"
            className="px-8 py-3 font-semibold text-center text-white transition-transform duration-300 rounded-full shadow-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:scale-105"
          >
            Nous découvrir
          </a>
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 px-8 py-3 font-semibold transition-transform duration-300 bg-white rounded-full shadow-lg text-amber-600 hover:scale-105"
          >
            <MessageCircle size={20} />
            Discuter en ligne
          </button>
        </div>
      </div>

      {/* Flèches navigation */}
      <button
        onClick={prevSlide}
        className="absolute p-2 transition-all -translate-y-1/2 rounded-full left-4 top-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm"
      >
        <ChevronLeft className="text-white" size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute p-2 transition-all -translate-y-1/2 rounded-full right-4 top-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm"
      >
        <ChevronRight className="text-white" size={32} />
      </button>

      {/* Indicateurs */}
      <div className="absolute flex gap-2 -translate-x-1/2 bottom-6 left-1/2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
