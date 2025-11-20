import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Heart,
} from "lucide-react";

const HistoryImpactSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const slides = [
    {
      id: 0,
      icon: BookOpen,
      title: "Notre Histoire",
      content:
        "Née de l'amour pour les tissus africains, Reine d'Afrique est le fruit d'un engagement : faire découvrir au monde la diversité et la qualité exceptionnelle de ces étoffes. Depuis nos débuts, nous collaborons avec des artisans, des tisserands et des revendeurs locaux pour offrir à chacun la possibilité de s'habiller avec élégance, culture et fierté.",
      color: "from-amber-500 to-amber-600",
      bgPattern: "bg-gradient-to-br from-amber-50 to-white",
    },
    {
      id: 1,
      icon: TrendingUp,
      title: "Notre Impact",
      content:
        "Chaque vente chez Reine d'Afrique contribue à valoriser le travail artisanal africain et à soutenir l'économie locale. En choisissant nos tissus, vous participez à une chaîne vertueuse qui relie créateurs, commerçants et consommateurs autour d'une même passion : l'élégance africaine.",
      color: "from-amber-600 to-amber-700",
      bgPattern: "bg-gradient-to-br from-white to-amber-50",
    },
    {
      id: 2,
      icon: Heart,
      title: "Notre Engagement",
      values: [
        {
          label: "Authentique",
          description: "fidèle à nos racines culturelles",
        },
        {
          label: "Équitable",
          description: "en soutenant les artisans et les commerçants locaux",
        },
        {
          label: "Accessible",
          description: "pour permettre à chacun d'exprimer sa beauté",
        },
      ],
      color: "from-amber-700 to-amber-800",
      bgPattern: "bg-gradient-to-br from-amber-50 to-white",
    },
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    }),
  };

  const handleNext = () => {
    setDirection(1);
    nextSlide();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevSlide();
  };

  const currentSlide = slides[activeSlide];
  const IconComponent = currentSlide.icon;

  return (
    <section id="histoire" className="relative py-4 overflow-hidden md:py-6">
      <div className="container px-4 mx-auto md:px-6 lg:px-8 max-w-7xl">
        {/* Slider Container */}
        <div className="relative min-h-[450px] md:min-h-[350px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className={`${currentSlide.bgPattern} rounded-3xl p-6 md:p-10 lg:p-12`}
            >
              <div className="max-w-4xl mx-auto">
                {/* Title */}
                <div className="flex flex-col items-center mb-6 text-center">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-3 text-2xl font-bold text-black md:text-3xl lg:text-4xl"
                  >
                    {currentSlide.title}
                  </motion.h2>

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 60 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className={`h-1 bg-gradient-to-r ${currentSlide.color} rounded-full`}
                  />
                </div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-center"
                >
                  {currentSlide.values ? (
                    <div className="space-y-5">
                      <p className="max-w-2xl mx-auto mb-6 text-base leading-relaxed text-black md:text-lg">
                        Nous croyons en une mode porteuse de sens :
                      </p>
                      <div className="grid max-w-4xl gap-4 mx-auto md:grid-cols-3">
                        {currentSlide.values.map((value, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: 0.5 + idx * 0.1,
                            }}
                            className="p-4 transition-all bg-white border rounded-2xl border-amber-100 hover:border-amber-300"
                          >
                            <h3 className="mb-1 text-lg font-bold text-amber-700">
                              {value.label}
                            </h3>
                            <p className="text-sm text-black">
                              {value.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="max-w-3xl mx-auto mt-6 text-base font-semibold leading-relaxed text-black md:text-lg"
                      >
                        Notre engagement est clair : faire vivre la culture
                        textile africaine, tout en créant des opportunités
                        durables.
                      </motion.p>
                    </div>
                  ) : (
                    <p className="max-w-3xl mx-auto text-base leading-relaxed text-black md:text-lg lg:text-xl">
                      {currentSlide.content}
                    </p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            aria-label="Slide précédent"
            className="absolute z-10 p-3 transition-all -translate-y-1/2 bg-white border rounded-full shadow left-2 md:left-4 top-1/2 hover:bg-amber-50 text-amber-600 md:p-4 border-amber-200"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            aria-label="Slide suivant"
            className="absolute z-10 p-3 transition-all -translate-y-1/2 bg-white border rounded-full shadow right-2 md:right-4 top-1/2 hover:bg-amber-50 text-amber-600 md:p-4 border-amber-200"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => {
                setDirection(index > activeSlide ? 1 : -1);
                setActiveSlide(index);
              }}
              aria-label={`Aller au slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full ${
                index === activeSlide
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 w-10 h-2"
                  : "bg-amber-200 hover:bg-amber-300 w-2 h-2"
              }`}
            />
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col items-center justify-center gap-3 mt-6 sm:flex-row">
          {slides.map((slide, index) => {
            const Icon = slide.icon;
            return (
              <button
                key={slide.id}
                onClick={() => {
                  setDirection(index > activeSlide ? 1 : -1);
                  setActiveSlide(index);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                  index === activeSlide
                    ? `bg-gradient-to-r ${slide.color} text-white shadow`
                    : "bg-white text-gray-700 hover:bg-amber-50 border border-amber-100"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm md:text-base">{slide.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HistoryImpactSection;
