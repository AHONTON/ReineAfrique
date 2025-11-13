import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Heart, Users, Award } from "lucide-react";

// Import des images locales - adaptez selon vos images d'équipe/atelier
import about1 from "/images/about1.jpg";
import about2 from "/images/about2.jpg";
import about3 from "/images/about3.jpg";
import about4 from "/images/about4.jpg";

const AboutHeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: about1,
      title: "Notre Histoire",
      subtitle:
        "Une passion pour les tissus africains transmise de génération en génération",
      icon: Heart,
    },
    {
      image: about2,
      title: "Notre Équipe",
      subtitle: "Des artisans passionnés au service de votre créativité",
      icon: Users,
    },
    {
      image: about3,
      title: "Notre Savoir-Faire",
      subtitle: "Plus de 20 ans d'expertise dans les tissus traditionnels",
      icon: Award,
    },
    {
      image: about4,
      title: "Notre Engagement",
      subtitle: "Qualité, authenticité et respect des traditions africaines",
      icon: Heart,
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

  return (
    <div className="relative w-full h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-white md:px-8">
        <div className="w-full max-w-4xl text-center">
          {/* Icône animée */}
          <div className="flex justify-center mb-6 animate-fade-in">
            {(() => {
              const IconComponent = slides[currentSlide].icon;
              return (
                <div className="p-4 rounded-full bg-amber-500/20 backdrop-blur-sm">
                  <IconComponent size={48} className="text-amber-400" />
                </div>
              );
            })()}
          </div>

          <h1 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl animate-fade-in drop-shadow-lg">
            {slides[currentSlide].title}
          </h1>

          <p className="max-w-2xl mx-auto mb-8 text-lg md:text-xl lg:text-2xl animate-fade-in drop-shadow-md opacity-90">
            {slides[currentSlide].subtitle}
          </p>

          <div className="w-24 h-1 mx-auto mb-8 bg-gradient-to-r from-transparent via-amber-400 to-transparent"></div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#notre-histoire"
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-semibold rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 text-center min-w-[200px]"
            >
              En savoir plus
            </a>
            <a
              href="/contact"
              className="px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold rounded-full shadow-lg hover:bg-white hover:text-amber-600 hover:scale-105 transition-all duration-300 text-center min-w-[200px]"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>

      {/* Flèches de navigation */}
      <button
        onClick={prevSlide}
        aria-label="Diapositive précédente"
        className="absolute p-2 transition-all -translate-y-1/2 rounded-full left-2 md:left-4 top-1/2 bg-white/20 hover:bg-white/40 md:p-3 backdrop-blur-sm group"
      >
        <ChevronLeft
          className="text-white transition-transform group-hover:scale-110"
          size={28}
        />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Diapositive suivante"
        className="absolute p-2 transition-all -translate-y-1/2 rounded-full right-2 md:right-4 top-1/2 bg-white/20 hover:bg-white/40 md:p-3 backdrop-blur-sm group"
      >
        <ChevronRight
          className="text-white transition-transform group-hover:scale-110"
          size={28}
        />
      </button>

      {/* Indicateurs de diapositives */}
      <div className="absolute flex gap-2 -translate-x-1/2 bottom-6 left-1/2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Aller à la diapositive ${index + 1}`}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-amber-400 w-8 shadow-lg"
                : "bg-white/50 w-3 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* Animation CSS */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AboutHeroBanner;
