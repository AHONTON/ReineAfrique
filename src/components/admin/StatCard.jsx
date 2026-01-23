import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color = 'orange', trend, loading = false }) => {
  const colorClasses = {
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
      >
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        </div>
      </motion.div>
    );
  }

  // Patterns africains selon la couleur
  const patternStyles = {
    orange: {
      backgroundImage: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 8px,
        rgba(251, 115, 22, 0.08) 8px,
        rgba(251, 115, 22, 0.08) 16px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 8px,
        rgba(234, 88, 12, 0.08) 8px,
        rgba(234, 88, 12, 0.08) 16px
      )`,
    },
    green: {
      backgroundImage: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 8px,
        rgba(34, 197, 94, 0.08) 8px,
        rgba(34, 197, 94, 0.08) 16px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 8px,
        rgba(22, 163, 74, 0.08) 8px,
        rgba(22, 163, 74, 0.08) 16px
      )`,
    },
    blue: {
      backgroundImage: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 8px,
        rgba(59, 130, 246, 0.08) 8px,
        rgba(59, 130, 246, 0.08) 16px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 8px,
        rgba(37, 99, 235, 0.08) 8px,
        rgba(37, 99, 235, 0.08) 16px
      )`,
    },
    red: {
      backgroundImage: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 8px,
        rgba(239, 68, 68, 0.08) 8px,
        rgba(239, 68, 68, 0.08) 16px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 8px,
        rgba(220, 38, 38, 0.08) 8px,
        rgba(220, 38, 38, 0.08) 16px
      )`,
    },
    purple: {
      backgroundImage: `repeating-linear-gradient(
        45deg,
        transparent,
        transparent 8px,
        rgba(168, 85, 247, 0.08) 8px,
        rgba(168, 85, 247, 0.08) 16px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 8px,
        rgba(147, 51, 234, 0.08) 8px,
        rgba(147, 51, 234, 0.08) 16px
      )`,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-lg p-4 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-xl transition-all relative overflow-hidden"
    >
      {/* Pattern de tissu africain en arrière-plan */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={patternStyles[color] || patternStyles.orange}
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
    </motion.div>
  );
};

export default StatCard;
