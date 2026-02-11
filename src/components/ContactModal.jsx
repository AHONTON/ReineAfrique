import { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X, MessageCircle } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

const ContactModal = memo(({ phoneNumber = "+2290150035719" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = useCallback(() => {
    const message = encodeURIComponent(
      "Bonjour, je souhaite en savoir plus sur vos tissus africains."
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    setIsOpen(false);
  }, [phoneNumber]);

  const handleCall = useCallback(() => {
    window.open(`tel:${phoneNumber}`, "_self");
    setIsOpen(false);
  }, [phoneNumber]);

  return (
    <>
      {/* Bouton flottant */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed z-50 flex items-center justify-center text-white transition-transform bg-gradient-to-br from-orange-500 to-amber-600 rounded-full shadow-lg bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <Phone className="w-6 h-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed z-[70] bottom-20 right-3 sm:bottom-24 sm:right-4 md:right-6 w-[calc(100%-1.5rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-4 bg-gradient-to-r from-orange-500 to-amber-600">
                <h3 className="text-lg font-bold text-white font-serif">
                  Comment souhaitez-vous nous contacter ?
                </h3>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Options */}
              <div className="p-4 space-y-3">
                {/* Option WhatsApp - charte orange/ambre */}
                <motion.button
                  onClick={handleWhatsApp}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-4 p-4 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 hover:border-orange-400 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full group-hover:from-orange-600 group-hover:to-amber-600 transition-colors">
                    <WhatsAppIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-800">Discuter sur WhatsApp</p>
                    <p className="text-sm text-gray-600">Chat en direct</p>
                  </div>
                  <MessageCircle className="w-5 h-5 text-orange-600" />
                </motion.button>

                {/* Option Appel */}
                <motion.button
                  onClick={handleCall}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-4 p-4 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 hover:border-orange-400 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full group-hover:bg-orange-600 transition-colors">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-800">Appel direct</p>
                    <p className="text-sm text-gray-600">{phoneNumber}</p>
                  </div>
                  <Phone className="w-5 h-5 text-orange-600" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});

ContactModal.displayName = 'ContactModal';

export default ContactModal;
