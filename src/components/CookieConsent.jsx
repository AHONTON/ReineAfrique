import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, CheckCircle2 } from "lucide-react";
import { useCookie } from "../contexts/CookieContext";
import { useLoading } from "../contexts/LoadingContext";

const CookieConsent = () => {
  const { showCookieBanner, acceptCookies, rejectCookies, openPrivacyModal } = useCookie();
  const { isLoading } = useLoading();
  
  // Ne pas afficher la bannière pendant le chargement initial
  if (isLoading) return null;

  return (
    <AnimatePresence>
      {showCookieBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 opacity-50" />
              
              <div className="relative p-6 sm:p-8 md:p-10">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  {/* Icône */}
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Cookie className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                  </motion.div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-serif">
                          Nous utilisons des cookies
                        </h3>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                          Ce site utilise des cookies pour améliorer votre expérience de navigation, 
                          analyser le trafic du site et personnaliser le contenu. En continuant à utiliser 
                          ce site, vous acceptez notre utilisation des cookies.
                        </p>
                      </div>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="flex flex-wrap gap-4 mb-6 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>Données sécurisées</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Conforme RGPD</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <motion.button
                        onClick={acceptCookies}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 sm:flex-none px-6 sm:px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Accepter et continuer
                      </motion.button>
                      
                      <motion.button
                        onClick={rejectCookies}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 sm:flex-none px-6 sm:px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
                      >
                        Refuser
                      </motion.button>

                      <motion.button
                        onClick={openPrivacyModal}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 sm:flex-none px-6 sm:px-8 py-3 text-amber-600 font-semibold rounded-xl hover:bg-amber-50 transition-all duration-300 border border-amber-200"
                      >
                        En savoir plus
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
