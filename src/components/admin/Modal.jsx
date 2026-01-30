import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { memo } from 'react';

const Modal = memo(({ isOpen, onClose, title, children, size = 'md' }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 12 }}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[92vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-700`}
                onClick={(e) => e.stopPropagation()}
              >
              {/* Header */}
                <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 gap-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white leading-snug">{title}</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Fermer"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
                <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
});

Modal.displayName = 'Modal';

export default Modal;
