import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "D'où proviennent vos tissus ?",
      answer:
        "Nos tissus proviennent directement d'artisans, de créateurs et de fournisseurs africains sélectionnés pour leur savoir-faire et la qualité de leurs étoffes.",
    },
    {
      question: "Est-ce que Reine d'Afrique fabrique les tissus ?",
      answer:
        "Non. Reine d'Afrique ne conçoit pas les tissus : nous faisons leur promotion, leur valorisation et leur commercialisation.",
    },
    {
      question: "Comment puis-je passer commande ?",
      answer:
        "Vous choisissez le tissu souhaité, vous nous contactez en ligne, et notre service commercial vous prendra en charge. Notre équipe vous accompagne à chaque étape si vous avez besoin d'aide.",
    },
    {
      question: "Quels types de tissus proposez-vous ?",
      answer:
        "Nous proposons une variété de tissus africains authentiques : motif Chiganvy, Super Hollandais, Vlisco, Grand Super Wax, Kanté (Ghana) 100% coton, motif Avogan, Avoxhivan, ainsi que des tissus pour hommes.",
    },
    {
      question: "Comment se déroule la livraison ?",
      answer:
        "Nous offrons une livraison rapide et sécurisée. Vous recevez un numéro de suivi dès que votre commande est expédiée.",
    },
    {
      question: "Puis-je retourner un tissu ?",
      answer:
        "Oui, les retours sont possibles sous certaines conditions (non utilisé, non coupé, non lavé). Contactez notre service client pour plus de détails.",
    },
    {
      question: "Proposez-vous des réductions ou promotions ?",
      answer:
        "Oui, nous proposons ponctuellement des offres spéciales et des promotions. Abonnez-vous pour être informé(e) en priorité.",
    },
    {
      question: "Puis-je commander en gros ?",
      answer:
        "Oui, Reine d'Afrique accepte les commandes en gros pour les créateurs, couturières, boutiques ou événements. Contactez-nous pour un devis personnalisé.",
    },
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      id="faq"
      className="relative min-h-screen px-4 py-3 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 sm:px-6 md:py-4 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center md:mb-16"
        >
          <h1 className="mb-3 text-2xl font-bold text-gray-800 sm:text-3xl md:text-4xl lg:text-5xl">
            FAQ
          </h1>
          <div className="w-16 h-1 mx-auto mb-3 bg-gradient-to-r from-orange-500 via-red-600 to-amber-600 md:mb-4" />
          <p className="max-w-3xl mx-auto text-sm leading-relaxed text-gray-600 sm:text-base md:text-lg">
            Questions fréquentes sur Reine d'Afrique
          </p>
        </motion.div>

        {/* FAQ Cards */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-2">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative overflow-hidden transition-all bg-white border border-gray-200 shadow-md cursor-pointer rounded-2xl hover:shadow-lg hover:border-gray-400"
              onClick={() => toggleAccordion(index)}
            >
              {/* Question */}
              <div className="flex items-center justify-between px-5 py-4 md:py-5 md:px-6">
                <h3 className="text-sm font-semibold text-gray-800 md:text-base lg:text-base">
                  {item.question}
                </h3>
                <span
                  className={`text-xl md:text-2xl font-light text-orange-600 transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : ""
                  }`}
                >
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>

              {/* Answer */}
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="px-5 pb-4 overflow-hidden md:px-6 md:pb-5"
                  >
                    <p className="text-xs leading-relaxed text-gray-700 md:text-sm lg:text-sm">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 md:mt-14"
        >
          <div className="overflow-hidden text-white border-2 shadow-xl bg-gradient-to-r from-orange-500 via-red-600 to-amber-600 rounded-2xl border-amber-700">
            <div className="p-6 text-center md:p-10">
              <h2 className="mb-2 text-lg font-bold md:text-xl lg:text-2xl">
                Vous avez une autre question ?
              </h2>
              <p className="max-w-2xl mx-auto mb-4 text-xs leading-relaxed md:text-sm lg:text-base text-orange-50 md:mb-6">
                Notre équipe est à votre disposition pour répondre à toutes vos
                questions sur nos tissus africains.
              </p>
              <a
                href="/contact"
                className="inline-block w-full px-6 py-3 text-sm font-semibold text-orange-700 transition-all bg-white border-2 shadow-lg md:px-10 md:text-base border-amber-700 rounded-xl hover:bg-orange-50 hover:scale-105 hover:shadow-xl sm:w-auto"
              >
                Contactez-nous
              </a>
            </div>
          </div>
        </motion.div>

        {/* Floating WhatsApp Button */}
        <a
          href="https://wa.me/2290150035719"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed z-50 flex items-center justify-center text-white transition-transform bg-green-500 rounded-full shadow-lg bottom-6 right-6 w-14 h-14 hover:scale-110"
        >
          <Phone className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};

export default Faq;
