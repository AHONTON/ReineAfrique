/**
 * Constantes centralisées pour l'application
 */

// Configuration API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Statuts de commande
export const ORDER_STATUS = {
  EN_DISCUSSION: 'en_discussion',
  CONFIRMEE: 'confirmee',
  EN_PREPARATION: 'en_preparation',
  LIVREE: 'livree',
  ANNULEE: 'annulee',
  EN_ATTENTE: 'en_attente',
  VALIDE: 'valide',
  REFUSE: 'refuse',
};

export const DELIVERY_STATUS = {
  EN_COURS: 'en_cours',
  LIVRE: 'livre',
  NON_LIVRE: 'non_livre',
};

export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.EN_DISCUSSION]: {
    label: 'En discussion',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  [ORDER_STATUS.EN_ATTENTE]: {
    label: 'En attente de validation',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  },
  [ORDER_STATUS.VALIDE]: {
    label: 'Validé',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  [ORDER_STATUS.REFUSE]: {
    label: 'Refusé',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
  [ORDER_STATUS.CONFIRMEE]: {
    label: 'Confirmée',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  [ORDER_STATUS.EN_PREPARATION]: {
    label: 'En préparation',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  },
  [ORDER_STATUS.LIVREE]: {
    label: 'Livrée',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  [ORDER_STATUS.ANNULEE]: {
    label: 'Annulée',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
};

// Types de transactions
export const TRANSACTION_TYPE = {
  VENTE: 'vente',
  DEPENSE: 'depense',
};

export const TRANSACTION_TYPE_CONFIG = {
  [TRANSACTION_TYPE.VENTE]: {
    label: 'Vente',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  [TRANSACTION_TYPE.DEPENSE]: {
    label: 'Dépense',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
};

// Périodes pour les filtres
export const PERIODS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  CUSTOM: 'custom',
};

export const PERIOD_LABELS = {
  [PERIODS.DAY]: 'Jour',
  [PERIODS.WEEK]: 'Semaine',
  [PERIODS.MONTH]: 'Mois',
  [PERIODS.CUSTOM]: 'Période personnalisée',
};

// Formats d'export
export const EXPORT_FORMATS = {
  CSV: 'csv',
  XLSX: 'xlsx',
};

export const EXPORT_TYPES = {
  CLIENTS: 'clients',
  ORDERS: 'orders',
  FINANCE: 'finance',
  STOCK: 'stock',
};

// Couleurs pour les graphiques
export const CHART_COLORS = [
  '#f97316', // Orange
  '#ea580c', // Orange foncé
  '#c2410c', // Orange très foncé
  '#9a3412', // Marron
  '#7c2d12', // Marron foncé
];

// Configuration de devise
export const CURRENCY = {
  CODE: 'XOF',
  LOCALE: 'fr-FR',
  OPTIONS: {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  },
};

// Stock faible (seuil)
export const LOW_STOCK_THRESHOLD = 10;

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  BLOG: '/blog',
  CONTACT: '/contact',
  ADMIN_LOGIN: '/admin/login',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_ORDERS: '/admin/commandes',
  ADMIN_CLIENTS: '/admin/clients',
  ADMIN_STOCK: '/admin/stock',
  ADMIN_FINANCE: '/admin/finances',
  ADMIN_EXPORT: '/admin/exports',
};

// LocalStorage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  ADMIN_DATA: 'adminData',
};
