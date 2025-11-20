import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
  Loader,
  Clock,
} from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [focusedField, setFocusedField] = useState(null);

  // VALIDATION
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[\d\s\-\+\(\)]{8,}$/.test(phone);

  const validateForm = () => {
    const err = {};
    if (!formData.name.trim()) err.name = "Le nom est requis";
    if (!validateEmail(formData.email)) err.email = "Email invalide";
    if (formData.phone && !validatePhone(formData.phone))
      err.phone = "Téléphone invalide";
    if (!formData.subject) err.subject = "Sujet requis";
    if (!formData.message.trim() || formData.message.length < 10)
      err.message = "Message trop court";
    return err;
  };

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // SUBMIT
  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setStatus("loading");

    try {
      const res = await axios.post("/api/contact/send", formData);
      if (res.status === 200) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (err) {
      console.log(err);
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 4000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "contact@reinedafrique.com",
      link: "mailto:contact@reinedafrique.com",
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: "+229 50 03 57 19",
      link: "tel:+2290150035719",
    },
    {
      icon: MapPin,
      title: "Adresse",
      content: "Cotonou, Bénin",
      link: "https://maps.google.com",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-16 bg-gradient-to-br from-orange-50 to-orange-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* HEADER */}
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-orange-400 md:text-3xl"
          >
            Contactez-nous
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-lg mx-auto text-sm text-gray-800 md:text-base"
          >
            Notre équipe est disponible pour vous répondre rapidement.
          </motion.p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* FORMULAIRE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 bg-white rounded-2xl"
          >
            <h2 className="mb-6 text-xl font-bold text-gray-800">
              Envoyez-nous un message
            </h2>

            <div className="space-y-5">
              {/* INPUT GROUP */}
              {[
                { label: "Nom complet", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Téléphone (optionnel)", name: "phone", type: "tel" },
              ].map(({ label, name, type }) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <label className="text-sm font-semibold text-gray-800">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(name)}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3 transition border rounded-lg bg-orange-50 border-black/20 focus:border-orange-400 focus:outline-none"
                  />
                  {errors[name] && (
                    <p className="mt-1 text-xs text-red-600">{errors[name]}</p>
                  )}
                </motion.div>
              ))}

              {/* SUJET */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <label className="text-sm font-semibold text-gray-800">Sujet *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 transition border rounded-lg bg-orange-50 border-black/20 focus:border-orange-400 focus:outline-none"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="info">Demande d'information</option>
                  <option value="support">Support</option>
                  <option value="partnership">Partenariat</option>
                </select>
                {errors.subject && (
                  <p className="mt-1 text-xs text-red-600">{errors.subject}</p>
                )}
              </motion.div>

              {/* MESSAGE */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <label className="text-sm font-semibold text-black">Message *</label>
                <textarea
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 transition border rounded-lg resize-none bg-orange-50 border-black/20 focus:border-orange-400 focus:outline-none"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                )}
              </motion.div>

              {/* SUCCESS & ERROR */}
              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center p-4 text-green-900 bg-green-100 border border-green-400 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Message envoyé !
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center p-4 text-red-900 bg-red-100 border border-red-400 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Une erreur est survenue.
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SUBMIT BUTTON */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleSubmit}
                disabled={status === "loading"}
                className="w-full py-4 font-semibold text-white transition bg-orange-400 rounded-lg shadow-md"
              >
                {status === "loading" ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Envoi…</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Send className="w-5 h-5" />
                    <span>Envoyer le message</span>
                  </div>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* SIDEBAR */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* CARTE INFOS */}
            <motion.div whileHover={{ scale: 1.01 }} className="p-6 bg-white rounded-xl">
              <h2 className="mb-5 text-xl font-bold text-gray-800">Nos coordonnées</h2>

              <div className="space-y-4">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      key={i}
                      href={info.link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex p-4 bg-orange-50 rounded-xl"
                    >
                      <div className="flex items-center justify-center w-12 h-12 mr-4 text-white bg-gradient-to-br from-orange-400 to-orange-700 rounded-xl">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xs text-gray-800">{info.title}</h3>
                        <p className="font-medium text-gray-800">{info.content}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* HORAIRES */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="p-6 text-white bg-gradient-to-br from-orange-400 to-orange-700 rounded-2xl"
            >
              <div className="flex items-center mb-5">
                <Clock className="w-6 h-6 mr-3" />
                <h3 className="text-xl font-bold">Horaires</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-white/30">
                  <span>Lundi - Vendredi</span>
                  <span className="font-bold">9h - 18h</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/30">
                  <span>Samedi</span>
                  <span className="font-bold">10h - 14h</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Dimanche</span>
                  <span className="font-bold">Fermé</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
