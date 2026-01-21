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

  // Couleur dynamique : blanc sur fond transparent, foncé sur fond blanc
  const textColor = isScrolled ? "text-gray-800" : "text-white";
  const iconColor = isScrolled ? "text-amber-600" : "text-white";
  const dateColor = isScrolled ? "text-gray-600" : "text-white/90";
  
  // Ombre de texte pour améliorer la lisibilité sur fond transparent
  const textShadow = isScrolled ? "" : "drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]";

  return (
    <div className={`flex items-center justify-between w-full gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 ${className}`}>
      {/* Horloge à gauche */}
      <div className={`flex items-center gap-1 xs:gap-1.5 sm:gap-2 text-[10px] xs:text-xs sm:text-sm flex-shrink-0 ${textColor}`}>
        <ClockIcon className={`w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 ${iconColor} ${textShadow}`} />
        <span className={`font-semibold whitespace-nowrap ${textColor} ${textShadow}`}>{formatTime(time)}</span>
      </div>
      
      {/* Date à droite - responsive avec gestion des espacements - cachée sur desktop */}
      {showDate && (
        <>
          {/* Version mobile très courte - visible seulement si assez d'espace */}
          <span className={`text-[9px] xs:text-[10px] font-medium whitespace-nowrap ${dateColor} ${textShadow} hidden xs:inline md:hidden`}>
            {formatDateMobile(time)}
          </span>
          {/* Version courte pour tablette - cachée sur desktop (md+) */}
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
