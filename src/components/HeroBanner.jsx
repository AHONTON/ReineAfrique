import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

// Import des images locales
import tissu1 from "../assets/images/tissu1.jpg";
import tissu2 from "../assets/images/tissu2.jpg";
import tissu3 from "../assets/images/tissu3.jpg";
import tissu4 from "../assets/images/tissu4.jpg";

const HeroBanner = ({ whatsappNumber = "22990154142255" }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: tissu1,
      title: "Tissus Africains Authentiques",
      subtitle: "Découvrez l'élégance et la richesse des motifs africains"
    },
    {
      image: tissu2,
      title: "Wax et Pagne Traditionnel",
      subtitle: "Les plus beaux tissus pour vos créations"
    },
    {
      image: tissu3,
      title: "Collection Premium",
      subtitle: "Des tissus de qualité supérieure pour tous vos projets"
    },
    {
      image: tissu4,
      title: "Tradition et Modernité",
      subtitle: "L'héritage africain au service de votre style"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleWhatsApp = () => {
    const message = encodeURIComponent("Bonjour, je souhaite en savoir plus sur vos tissus africains.");
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
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 animate-fade-in drop-shadow-lg">
          {slides[currentSlide].title}
        </h1>
        <p className="text-xl md:text-2xl text-center mb-8 animate-fade-in drop-shadow-md">
          {slides[currentSlide].subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/about"
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 text-center"
          >
            Nous découvrir
          </a>
          <button
            onClick={handleWhatsApp}
            className="px-8 py-3 bg-white text-amber-600 font-semibold rounded-full shadow-lg hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            Discuter en ligne
          </button>
        </div>
      </div>

      {/* Flèches navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 transition-all backdrop-blur-sm"
      >
        <ChevronLeft className="text-white" size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 transition-all backdrop-blur-sm"
      >
        <ChevronRight className="text-white" size={32} />
      </button>

      {/* Indicateurs */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
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
