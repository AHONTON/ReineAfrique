import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Send,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Gift,
} from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        setEmail("");
        setTimeout(() => setIsSubmitted(false), 5000);
      }, 2000);
    }
  };

  const benefits = [
    { icon: Sparkles, text: "Nouvelles collections en avant-première" },
    { icon: TrendingUp, text: "Tendances africaines exclusives" },
    { icon: Gift, text: "Offres spéciales réservées" },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* --- Vidéo de fond --- */}
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        src="https://www.w3schools.com/howto/rain.mp4"
        className="absolute inset-0 w-full h-full object-cover z-0 brightness-50"
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "linear",
        }}
      />

      {/* --- Contenu principal --- */}
      <div className="relative max-w-6xl mx-auto z-10 flex flex-col gap-8">
        {/* --- Titre --- */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-5xl font-extrabold text-center text-white drop-shadow-lg"
        >
          <motion.span
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white"
          >
            Rejoignez la communauté Reine d’Afrique
          </motion.span>
        </motion.h2>

        {/* --- Carte principale --- */}
        <motion.div
          className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center backdrop-blur-sm bg-white/10 border border-white/20 p-8 rounded-2xl shadow-2xl overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          {/* Glow décoratif */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-transparent opacity-30 blur-3xl"></div>

          {/* --- Colonne gauche : bénéfices --- */}
          <motion.div className="flex flex-col gap-4 text-white relative z-10">
            <p className="text-base sm:text-lg leading-relaxed text-gray-100">
              Soyez les premiers à découvrir nos créations et profitez d’offres
              exclusives réservées à notre communauté d’abonnés.
            </p>

            <div className="flex flex-col gap-3 mt-2">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    variants={itemVariants}
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base">{benefit.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* --- Colonne droite : formulaire --- */}
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-4"
                  layout
                >
                  <div className="relative flex-1 group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-orange-400 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-white/30 bg-black/30 text-white placeholder-gray-300 focus:outline-none focus:border-orange-400 focus:bg-white/10 transition-all"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-md hover:shadow-orange-500/40 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <span>S’inscrire</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 120 }}
                  className="flex flex-col items-center justify-center py-10 text-white"
                >
                  <CheckCircle2 className="w-14 h-14 text-green-400 mb-3 animate-bounce" />
                  <h3 className="text-xl font-bold mb-1">
                    Merci pour votre inscription 🎉
                  </h3>
                  <p className="text-center text-gray-200">
                    Vérifiez votre boîte mail pour confirmer votre abonnement.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
