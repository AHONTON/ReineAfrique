/**
 * Utilitaires de formatage centralisés
 */

import { CURRENCY } from '../config/constants';

/**
 * Formate un montant en devise XOF
 * @param {number} amount - Montant à formater
 * @returns {string} Montant formaté
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat(CURRENCY.LOCALE, CURRENCY.OPTIONS).format(amount || 0);
};

/**
 * Formate une date au format français
 * @param {string|Date} date - Date à formater
 * @returns {string} Date formatée
 */
export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formate une date avec l'heure
 * @param {string|Date} date - Date à formater
 * @returns {string} Date et heure formatées
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formate une date au format ISO pour les inputs
 * @param {string|Date} date - Date à formater
 * @returns {string} Date au format YYYY-MM-DD
 */
export const formatDateInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};
