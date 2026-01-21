import { useState } from "react";
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
    <section className="relative px-4 py-16 overflow-hidden sm:px-6 lg:px-8">
      {/* --- Fond animé --- */}
      <motion.div
        className="absolute inset-0 z-0 w-full h-full bg-gradient-to-br from-orange-900 via-amber-900 to-red-900"
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
      >
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.4) 0%, transparent 50%)",
            backgroundSize: "200% 200%",
          }}
        />
      </motion.div>

      {/* --- Contenu principal --- */}
      <div className="relative z-10 flex flex-col max-w-6xl gap-8 mx-auto">
        {/* --- Titre --- */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-extrabold text-center text-white sm:text-5xl drop-shadow-lg"
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
          className="relative grid items-center grid-cols-1 gap-8 p-8 overflow-hidden border shadow-2xl md:grid-cols-2 backdrop-blur-sm bg-white/10 border-white/20 rounded-2xl"
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
          <motion.div className="relative z-10 flex flex-col gap-4 text-white">
            <p className="text-base leading-relaxed text-gray-100 sm:text-lg">
              Soyez les premiers à découvrir nos créations et profitez d’offres
              exclusives réservées à notre communauté d’abonnés.
            </p>

            <div className="flex flex-col gap-3 mt-2">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-2 transition-colors rounded-lg hover:bg-white/10"
                    variants={itemVariants}
                  >
                    <div className="flex items-center justify-center rounded-lg shadow-md w-9 h-9 bg-gradient-to-br from-orange-400 to-pink-500">
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
                  className="flex flex-col gap-4 sm:flex-row"
                  layout
                >
                  <div className="relative flex-1 group">
                    <Mail className="absolute w-5 h-5 text-gray-300 transition-colors -translate-y-1/2 left-4 top-1/2 group-focus-within:text-orange-400" />
                    <motion.input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      whileFocus={{ scale: 1.02 }}
                      className="w-full py-3 pl-12 pr-4 text-white placeholder-gray-300 transition-all border-2 rounded-xl border-white/30 bg-black/30 focus:outline-none focus:border-orange-400 focus:bg-white/10 focus:ring-2 focus:ring-orange-400/50"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex items-center justify-center gap-2 px-6 py-3 overflow-hidden font-semibold text-white shadow-md bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl hover:shadow-orange-500/40 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <motion.div
                      className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-r from-yellow-400/30 to-transparent group-hover:opacity-100"
                    />
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white rounded-full border-t-transparent"
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
                  <CheckCircle2 className="mb-3 text-green-400 w-14 h-14 animate-bounce" />
                  <h3 className="mb-1 text-xl font-bold">
                    Merci pour votre inscription
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