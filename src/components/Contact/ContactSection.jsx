import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [focusedField, setFocusedField] = useState(null);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^[\d\s\-\+\(\)]{8,}$/.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }
    
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setStatus('loading');
    
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contact@entreprise.com',
      link: 'mailto:contact@entreprise.com',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      content: '+33 1 23 45 67 89',
      link: 'tel:+33123456789',
      color: 'from-orange-600 to-red-500'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      content: '123 Avenue des Champs-Élysées, 75008 Paris',
      link: 'https://maps.google.com',
      color: 'from-red-500 to-orange-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 bg-clip-text text-transparent">
              Contactez-nous
            </span>
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Notre équipe est à votre écoute pour répondre à toutes vos questions. 
            N'hésitez pas à nous contacter !
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <motion.div 
            className="lg:col-span-1 space-y-6"
            variants={containerVariants}
          >
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.a
                  key={index}
                  href={info.link}
                  target={info.link.startsWith('http') ? '_blank' : undefined}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block bg-white rounded-2xl shadow-lg p-6 border border-gray-100 group"
                  variants={cardVariants}
                  whileHover={{ 
                    y: -8, 
                    shadow: "0 20px 40px rgba(0,0,0,0.1)",
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <motion.div 
                        className={`w-14 h-14 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center shadow-lg`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: 5,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-orange-600 uppercase tracking-wide mb-1">
                        {info.title}
                      </h3>
                      <p className="text-gray-900 font-medium">
                        {info.content}
                      </p>
                    </div>
                  </div>
                </motion.a>
              );
            })}

            {/* Hours */}
            <motion.div 
              className="bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white"
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 mr-2" />
                <h3 className="text-lg font-bold">Heures d'ouverture</h3>
              </div>
              <div className="space-y-3 text-sm">
                <motion.div 
                  className="flex justify-between py-2 border-b border-white/20"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <span>Lundi - Vendredi</span>
                  <span className="font-bold">9h - 18h</span>
                </motion.div>
                <motion.div 
                  className="flex justify-between py-2 border-b border-white/20"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <span>Samedi</span>
                  <span className="font-bold">10h - 16h</span>
                </motion.div>
                <motion.div 
                  className="flex justify-between py-2"
                  whileHover={{ x: 5, transition: { duration: 0.2 } }}
                >
                  <span>Dimanche</span>
                  <span className="font-bold">Fermé</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-6" onKeyPress={handleKeyPress}>
                {/* Name and Email */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <label 
                      htmlFor="name" 
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Nom complet <span className="text-orange-500">*</span>
                    </label>
                    <motion.input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
                        errors.name 
                          ? 'border-red-400 bg-red-50' 
                          : focusedField === 'name'
                          ? 'border-orange-500 bg-orange-50/30'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                      placeholder="Jean Dupont"
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      whileFocus={{ scale: 1.01 }}
                    />
                    {errors.name && (
                      <motion.p 
                        id="name-error" 
                        className="mt-2 text-sm text-red-600 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                  >
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Email <span className="text-orange-500">*</span>
                    </label>
                    <motion.input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
                        errors.email 
                          ? 'border-red-400 bg-red-50' 
                          : focusedField === 'email'
                          ? 'border-orange-500 bg-orange-50/30'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                      placeholder="jean.dupont@email.com"
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      whileFocus={{ scale: 1.01 }}
                    />
                    {errors.email && (
                      <motion.p 
                        id="email-error" 
                        className="mt-2 text-sm text-red-600 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.email}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* Phone and Subject */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <label 
                      htmlFor="phone" 
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Téléphone (optionnel)
                    </label>
                    <motion.input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
                        errors.phone 
                          ? 'border-red-400 bg-red-50' 
                          : focusedField === 'phone'
                          ? 'border-orange-500 bg-orange-50/30'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                      placeholder="+33 1 23 45 67 89"
                      aria-invalid={errors.phone ? 'true' : 'false'}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                      whileFocus={{ scale: 1.01 }}
                    />
                    {errors.phone && (
                      <motion.p 
                        id="phone-error" 
                        className="mt-2 text-sm text-red-600 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.phone}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                  >
                    <label 
                      htmlFor="subject" 
                      className="block text-sm font-bold text-gray-700 mb-2"
                    >
                      Sujet <span className="text-orange-500">*</span>
                    </label>
                    <motion.select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none ${
                        errors.subject 
                          ? 'border-red-400 bg-red-50' 
                          : focusedField === 'subject'
                          ? 'border-orange-500 bg-orange-50/30'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                      aria-invalid={errors.subject ? 'true' : 'false'}
                      aria-describedby={errors.subject ? 'subject-error' : undefined}
                      whileFocus={{ scale: 1.01 }}
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="info">Demande d'information</option>
                      <option value="support">Support technique</option>
                      <option value="partnership">Partenariat</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Autre</option>
                    </motion.select>
                    {errors.subject && (
                      <motion.p 
                        id="subject-error" 
                        className="mt-2 text-sm text-red-600 flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.subject}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <label 
                    htmlFor="message" 
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Message <span className="text-orange-500">*</span>
                  </label>
                  <motion.textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    rows="5"
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-none resize-none ${
                      errors.message 
                        ? 'border-red-400 bg-red-50' 
                        : focusedField === 'message'
                        ? 'border-orange-500 bg-orange-50/30'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                    placeholder="Décrivez votre demande en détail..."
                    aria-invalid={errors.message ? 'true' : 'false'}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    whileFocus={{ scale: 1.01 }}
                  />
                  {errors.message && (
                    <motion.p 
                      id="message-error" 
                      className="mt-2 text-sm text-red-600 flex items-center"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.message}
                    </motion.p>
                  )}
                </motion.div>

                {/* Success Message */}
                {status === 'success' && (
                  <motion.div 
                    className="bg-green-50 border-2 border-green-300 rounded-xl p-4 flex items-center space-x-3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-green-900">Message envoyé avec succès !</h4>
                      <p className="text-sm text-green-700">Nous vous répondrons dans les plus brefs délais.</p>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  whileHover={status !== 'loading' ? { 
                    scale: 1.02,
                    boxShadow: "0 20px 40px rgba(249, 115, 22, 0.4)"
                  } : {}}
                  whileTap={status !== 'loading' ? { scale: 0.98 } : {}}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  {status === 'loading' ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader className="w-5 h-5" />
                      </motion.div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Envoyer le message</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}