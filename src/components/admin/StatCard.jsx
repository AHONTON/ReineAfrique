import { memo } from 'react';

// Constantes en dehors du composant
const colorClasses = {
  orange: 'bg-orange-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

// Subtil overlay dégradé pour conserver une texture sans créer d'effets "carreaux"
const patternStyles = {
  orange: {
    backgroundImage: 'linear-gradient(135deg, rgba(249,115,22,0.06), rgba(255,255,255,0))',
  },
  green: {
    backgroundImage: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(255,255,255,0))',
  },
  blue: {
    backgroundImage: 'linear-gradient(135deg, rgba(59,130,246,0.06), rgba(255,255,255,0))',
  },
  red: {
    backgroundImage: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(255,255,255,0))',
  },
  purple: {
    backgroundImage: 'linear-gradient(135deg, rgba(168,85,247,0.06), rgba(255,255,255,0))',
  },
};

const StatCard = memo(({ title, value, icon: Icon, color = 'orange', trend, loading = false }) => {

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all relative overflow-hidden">
      {/* Pattern de tissu africain en arrière-plan */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ ...(patternStyles[color] || patternStyles.orange), opacity: 0.12 }}
      />
      
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex-1 min-w-0">
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white break-words">{value}</p>
          {trend && (
            <p className={`text-xs sm:text-sm mt-2 ${trend.type === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`${colorClasses[color]} p-2 sm:p-3 rounded-lg flex-shrink-0 shadow-sm`}>
            <Icon className="text-white" size={20} />
          </div>
        )}
      </div>
    </div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
