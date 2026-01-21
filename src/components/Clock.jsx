import { useState, useEffect, memo } from "react";
import { Clock as ClockIcon } from "lucide-react";

const Clock = memo(() => {
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

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white">
      <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 text-white" />
      <div className="flex flex-col items-center sm:items-start">
        <span className="font-semibold whitespace-nowrap text-white">{formatTime(time)}</span>
        <span className="hidden xl:inline text-xs text-white/90">
          {formatDate(time)}
        </span>
      </div>
    </div>
  );
});

Clock.displayName = 'Clock';

export default Clock;
