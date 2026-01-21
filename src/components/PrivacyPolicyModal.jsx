import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import { useCookie } from "../contexts/CookieContext";

const PrivacyPolicyModal = () => {
  const { showPrivacyModal, closePrivacyModal, acceptCookies } = useCookie();

  const handleAccept = () => {
    acceptCookies();
    closePrivacyModal();
  };

  return (
    <AnimatePresence>
      {showPrivacyModal && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePrivacyModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white font-serif">
                    Politique de Confidentialité
                  </h2>
                </div>
                <motion.button
                  onClick={closePrivacyModal}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="prose prose-lg max-w-none">
                  {/* Introduction */}
                  <section className="mb-8">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Reine d'Afrique ("nous", "notre", "nos") s'engage à protéger et respecter votre vie privée. 
                      Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et 
                      protégeons vos informations personnelles conformément au Règlement Général sur la Protection 
                      des Données (RGPD) et aux lois applicables.
                    </p>
                  </section>

                  {/* 1. Données collectées */}
                  <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-6 h-6 text-amber-600" />
                      <h3 className="text-xl font-bold text-gray-900 font-serif">
                        1. Données que nous collectons
                      </h3>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Données personnelles :</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>Nom et prénom</li>
                        <li>Adresse e-mail</li>
                        <li>Numéro de téléphone</li>
                        <li>Adresse postale (pour les commandes)</li>
                        <li>Informations de paiement (traitées de manière sécurisée)</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Données techniques :</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                        <li>Adresse IP</li>
                        <li>Type de navigateur et version</li>
                        <li>Système d'exploitation</li>
                        <li>Pages visitées et durée de visite</li>
                        <li>Données de navigation (cookies)</li>
                      </ul>
                    </div>
                  </section>

                  {/* 2. Utilisation des données */}
                  <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Eye className="w-6 h-6 text-amber-600" />
                      <h3 className="text-xl font-bold text-gray-900 font-serif">
                        2. Utilisation de vos données
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Nous utilisons vos données personnelles pour :
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>Traiter et gérer vos commandes</li>
                      <li>Vous contacter concernant vos commandes ou demandes</li>
                      <li>Améliorer nos services et votre expérience utilisateur</li>
                      <li>Vous envoyer des communications marketing (avec votre consentement)</li>
                      <li>Respecter nos obligations légales</li>
                      <li>Prévenir la fraude et assurer la sécurité</li>
                    </ul>
                  </section>

                  {/* 3. Cookies */}
                  <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="w-6 h-6 text-amber-600" />
                      <h3 className="text-xl font-bold text-gray-900 font-serif">
                        3. Utilisation des cookies
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Nous utilisons différents types de cookies :
                    </p>
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Cookies essentiels :</h4>
                        <p className="text-gray-700 text-sm">
                          Nécessaires au fonctionnement du site (panier, authentification, sécurité).
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Cookies analytiques :</h4>
                        <p className="text-gray-700 text-sm">
                          Nous aident à comprendre comment vous utilisez notre site pour l'améliorer.
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Cookies de préférences :</h4>
                        <p className="text-gray-700 text-sm">
                          Mémorisent vos préférences (langue, région, etc.).
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mt-4 text-sm">
                      Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de votre navigateur 
                      ou en utilisant notre bannière de consentement.
                    </p>
                  </section>

                  {/* 4. Partage des données */}
                  <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-6 h-6 text-amber-600" />
                      <h3 className="text-xl font-bold text-gray-900 font-serif">
                        4. Partage de vos données
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations avec :
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li><strong>Prestataires de services :</strong> pour le traitement des paiements, la livraison, etc.</li>
                      <li><strong>Autorités légales :</strong> si requis par la loi</li>
                      <li><strong>Partenaires de confiance :</strong> uniquement avec votre consentement explicite</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed mt-3 text-sm">
                      Tous nos partenaires sont tenus de respecter la confidentialité de vos données.
                    </p>
                  </section>

                  {/* 5. Sécurité */}
                  <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="w-6 h-6 text-amber-600" />
                      <h3 className="text-xl font-bold text-gray-900 font-serif">
                        5. Sécurité de vos données
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour 
                      protéger vos données personnelles contre tout accès non autorisé, perte, destruction ou altération. 
                      Cela inclut le chiffrement SSL/TLS, des contrôles d'accès stricts et des audits de sécurité réguliers.
                    </p>
                  </section>

                  {/* 6. Vos droits */}
                  <section className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle2 className="w-6 h-6 text-amber-600" />
                      <h3 className="text-xl font-bold text-gray-900 font-serif">
                        6. Vos droits
                      </h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Conformément au RGPD, vous disposez des droits suivants :
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="font-semibold text-gray-900">Droit d'accès</p>
                        <p className="text-sm text-gray-700">Consulter vos données personnelles</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="font-semibold text-gray-900">Droit de rectification</p>
                        <p className="text-sm text-gray-700">Corriger vos informations</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="font-semibold text-gray-900">Droit à l'effacement</p>
                        <p className="text-sm text-gray-700">Supprimer vos données</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="font-semibold text-gray-900">Droit d'opposition</p>
                        <p className="text-sm text-gray-700">Vous opposer au traitement</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="font-semibold text-gray-900">Droit à la portabilité</p>
                        <p className="text-sm text-gray-700">Récupérer vos données</p>
                      </div>
                      <div className="bg-amber-50 rounded-lg p-3">
                        <p className="font-semibold text-gray-900">Droit de limitation</p>
                        <p className="text-sm text-gray-700">Limiter le traitement</p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mt-4 text-sm">
                      Pour exercer ces droits, contactez-nous à :{" "}
                      <a href="mailto:contact@reineafrique.com" className="text-amber-600 hover:underline font-semibold">
                        contact@reineafrique.com
                      </a>
                    </p>
                  </section>

                  {/* 7. Conservation */}
                  <section className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 font-serif mb-4">
                      7. Durée de conservation
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Nous conservons vos données personnelles uniquement aussi longtemps que nécessaire pour les 
                      finalités pour lesquelles elles ont été collectées, ou conformément aux obligations légales. 
                      Les données de commande sont conservées pendant 10 ans (obligation comptable), tandis que les 
                      données de marketing sont conservées jusqu'à ce que vous retiriez votre consentement.
                    </p>
                  </section>

                  {/* 8. Contact */}
                  <section className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 font-serif mb-4">
                      8. Contact
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
                      vous pouvez nous contacter :
                    </p>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Email :</strong> contact@reineafrique.com</p>
                      <p><strong>Téléphone :</strong> +229 01 50 03 57 19</p>
                      <p><strong>Adresse :</strong> Bénin</p>
                    </div>
                  </section>

                  {/* 9. Modifications */}
                  <section>
                    <h3 className="text-xl font-bold text-gray-900 font-serif mb-4">
                      9. Modifications de cette politique
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                      Toute modification sera publiée sur cette page avec une date de mise à jour révisée. 
                      Nous vous encourageons à consulter régulièrement cette page pour rester informé de nos pratiques.
                    </p>
                  </section>
                </div>
              </div>

              {/* Footer avec bouton d'acceptation */}
              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600 text-center sm:text-left">
                  En continuant, vous acceptez notre politique de confidentialité
                </p>
                <motion.button
                  onClick={handleAccept}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  J'accepte
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PrivacyPolicyModal;
