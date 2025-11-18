import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [focusedField, setFocusedField] = useState(null);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[\d\s\-\+\(\)]{8,}$/.test(phone);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    else if (formData.name.trim().length < 2) newErrors.name = 'Nom trop court';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    else if (!validateEmail(formData.email)) newErrors.email = 'Email invalide';
    if (formData.phone && !validatePhone(formData.phone)) newErrors.phone = 'Téléphone invalide';
    if (!formData.subject.trim()) newErrors.subject = 'Sujet requis';
    if (!formData.message.trim()) newErrors.message = 'Message requis';
    else if (formData.message.trim().length < 10) newErrors.message = 'Message trop court';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setStatus('loading');
    try {
      await axios.post('/api/contact/send', formData, { headers: { 'Content-Type': 'application/json' } });
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const contactInfo = [
    { icon: Mail, title: 'Email', content: 'contact@reinedafrique.com', link: 'mailto:contact@reinedafrique.com' },
    { icon: Phone, title: 'Téléphone', content: '+229 00 00 00 00', link: 'tel:+22900000000' },
    { icon: MapPin, title: 'Adresse', content: 'Cotonou, Bénin', link: 'https://maps.google.com' }
  ];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[#F5ECE2]">
      <motion.div className="max-w-7xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
        
        {/* HEADER */}
        <motion.div className="text-center mb-12 sm:mb-16" variants={itemVariants}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-[#E56A0D] tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
            Contactez-nous
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#E56A0D] max-w-2xl mx-auto">
            Notre équipe est disponible pour vous répondre avec professionnalisme.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">

          {/* CONTACT LEFT CARDS */}
          <motion.div className="space-y-6" variants={containerVariants}>
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={index}
                  href={info.link}
                  target="_blank"
                  className="block bg-white rounded-2xl shadow-md p-5 sm:p-6 border border-[#E56A0D]"
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.03 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#E56A0D] rounded-xl flex items-center justify-center shadow-lg">
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#E56A0D] uppercase tracking-wide">{info.title}</h3>
                      <p className="text-[#3A1F0B] font-medium text-sm sm:text-base">{info.content}</p>
                    </div>
                  </div>
                </motion.a>
              );
            })}

            {/* HOURS CARD */}
            <motion.div className="bg-[#E56A0D] text-white rounded-2xl p-5 sm:p-6 shadow-lg" variants={itemVariants}>
              <div className="flex items-center mb-3 sm:mb-4">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <h3 className="text-base sm:text-lg font-bold">Disponibilité</h3>
              </div>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-white/30"><span>Lundi - Vendredi</span><span className="font-bold">9h - 18h</span></div>
                <div className="flex justify-between py-1 border-b border-white/30"><span>Samedi</span><span className="font-bold">10h - 14h</span></div>
                <div className="flex justify-between py-1"><span>Dimanche</span><span className="font-bold">Fermé</span></div>
              </div>
            </motion.div>
          </motion.div>

          {/* CONTACT FORM */}
          <motion.div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-[#E56A0D]" variants={itemVariants}>
            <div className="space-y-4 sm:space-y-6">

              {/* NAME + EMAIL */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-sm sm:text-base font-bold text-[#E56A0D]">Nom complet *</label>
                  <motion.input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 transition-all ${
                      errors.name ? 'border-red-400' : focusedField === 'name' ? 'border-[#E56A0D]' : 'border-[#E56A0D]'
                    }`}
                    placeholder="Ex : Reine d’Afrique Client"
                  />
                  {errors.name && <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm sm:text-base font-bold text-[#E56A0D]">Email *</label>
                  <motion.input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 transition-all ${
                      errors.email ? 'border-red-400' : focusedField === 'email' ? 'border-[#E56A0D]' : 'border-[#E56A0D]'
                    }`}
                    placeholder="exemple@mail.com"
                  />
                  {errors.email && <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* PHONE + SUBJECT */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="text-sm sm:text-base font-bold text-[#E56A0D]">Téléphone (optionnel)</label>
                  <motion.input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-[#E56A0D] focus:border-[#E56A0D] transition-all"
                    placeholder="+229 XX XX XX XX"
                  />
                </div>
                <div>
                  <label className="text-sm sm:text-base font-bold text-[#E56A0D]">Sujet *</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-[#E56A0D] focus:border-[#E56A0D] transition-all"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="info">Demande d'information</option>
                    <option value="support">Support</option>
                    <option value="partnership">Partenariat</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
              </div>

              {/* MESSAGE */}
              <div>
                <label className="text-sm sm:text-base font-bold text-[#E56A0D]">Message *</label>
                <textarea
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-[#E56A0D] focus:border-[#E56A0D] transition-all resize-none text-sm sm:text-base"
                  placeholder="Votre message..."
                />
                {errors.message && <p className="text-xs sm:text-sm text-red-600 mt-1">{errors.message}</p>}
              </div>

              {/* SUCCESS / ERROR */}
              {status === 'success' && (
                <div className="bg-green-50 border border-green-300 p-3 sm:p-4 rounded-xl text-green-900 flex items-center text-sm sm:text-base">
                  <CheckCircle className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Message envoyé avec succès !
                </div>
              )}
              {status === 'error' && (
                <div className="bg-red-50 border border-red-300 p-3 sm:p-4 rounded-xl text-red-900 flex items-center text-sm sm:text-base">
                  <AlertCircle className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Une erreur s’est produite. Réessayez.
                </div>
              )}

              {/* SUBMIT */}
              <motion.button
                onClick={handleSubmit}
                disabled={status === 'loading'}
                className="w-full bg-[#E56A0D] text-white font-bold py-3 sm:py-4 rounded-xl shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 transition-all"
                whileHover={status !== 'loading' ? { scale: 1.03 } : {}}
                whileTap={status !== 'loading' ? { scale: 0.97 } : {}}
              >
                {status === 'loading' ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Loader className="w-5 h-5" />
                    </motion.div>
                    <span>Envoi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Envoyer</span>
                  </>
                )}
              </motion.button>

            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
