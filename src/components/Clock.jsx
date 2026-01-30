import { useState, useEffect, memo } from "react";
import { Clock as ClockIcon } from "lucide-react";

const Clock = memo(({ isScrolled = false, className = "", showDate = true }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateShort = (date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateMobile = (date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  // Détecter si on est en mode desktop (largeur >= 1024px)
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Couleur dynamique : noir bien visible sur desktop, adaptatif sur mobile
  const textColor = isDesktop ? "text-black" : (isScrolled ? "text-gray-800" : "text-white");
  const iconColor = isDesktop ? "text-black" : (isScrolled ? "text-amber-600" : "text-white");
  const dateColor = isDesktop ? "text-gray-800" : (isScrolled ? "text-gray-600" : "text-white/90");
  
  // Ombre de texte renforcée pour améliorer la lisibilité sur fond transparent (seulement mobile)
  const textShadow = isDesktop || isScrolled
    ? "" 
    : "drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]";
  
  // Style pour améliorer la visibilité de l'heure - noir bien visible sur desktop
  const timeStyle = isDesktop 
    ? "font-bold text-black" 
    : (isScrolled ? "font-bold text-gray-900" : "font-bold text-white");

  return (
    <div className={`flex items-center justify-between w-full gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 ${className}`}>
      {/* Horloge - TOUJOURS visible sur tous les écrans */}
      <div className={`flex items-center gap-1 xs:gap-1.5 sm:gap-2 flex-shrink-0 ${!isScrolled && !isDesktop ? 'bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg' : ''} ${isDesktop ? 'bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm' : ''}`}>
        <ClockIcon className={`w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 ${iconColor} ${textShadow}`} />
        <span className={`text-[11px] xs:text-xs sm:text-sm md:text-base lg:text-lg whitespace-nowrap ${timeStyle} ${textShadow}`}>
          {formatTime(time)}
        </span>
      </div>
      
      {/* Date à droite - visible sur mobile/tablette, cachée sur desktop (md+) */}
      {showDate && (
        <>
          {/* Version mobile très courte - visible seulement sur mobile (xs à sm) */}
          <span className={`text-[9px] xs:text-[10px] font-medium whitespace-nowrap ${dateColor} ${textShadow} hidden xs:inline md:hidden`}>
            {formatDateMobile(time)}
          </span>
          {/* Version courte pour tablette - visible sur sm, cachée sur md+ */}
          <span className={`text-[10px] sm:text-xs font-medium whitespace-nowrap ${dateColor} ${textShadow} hidden sm:inline md:hidden`}>
            {formatDateShort(time)}
          </span>
        </>
      )}
    </div>
  );
});

Clock.displayName = 'Clock';

export default Clock;
