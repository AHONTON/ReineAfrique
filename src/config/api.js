/**
 * Configuration centralisée des endpoints API
 */

import { API_CONFIG } from './constants';

// Base URL de l'API
export const API_BASE_URL = API_CONFIG.BASE_URL;

// Endpoints d'authentification
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
};

// Endpoints publics (Shop)
export const SHOP_ENDPOINTS = {
  PRODUCTS: '/shop/products',
  GET_PRODUCT: (id) => `/shop/products/${id}`,
  CATEGORIES: '/shop/categories',
  ORDERS: '/shop/orders',
};

// Endpoints du dashboard
export const DASHBOARD_ENDPOINTS = {
  STATS: '/admin/dashboard/stats',
  SALES: '/admin/dashboard/sales',
  DISTRIBUTION: '/admin/dashboard/distribution',
};

// Endpoints des commandes
export const ORDER_ENDPOINTS = {
  LIST: '/admin/orders',
  CREATE: '/admin/orders',
  UPDATE_STATUS: (orderId) => `/admin/orders/${orderId}/status`,
};

// Endpoints des clients
export const CLIENT_ENDPOINTS = {
  LIST: '/admin/clients',
  SHOW: (clientId) => `/admin/clients/${clientId}`,
  CREATE: '/admin/clients',
  UPDATE: (clientId) => `/admin/clients/${clientId}`,
  DELETE: (clientId) => `/admin/clients/${clientId}`,
  /** Optionnel : vérification WhatsApp (backend peut ne pas l’implémenter) */
  CHECK_WHATSAPP: (clientId) => `/admin/clients/${clientId}/check-whatsapp`,
};

// Endpoints des catégories
export const CATEGORY_ENDPOINTS = {
  LIST: '/admin/categories',
  CREATE: '/admin/categories',
  UPDATE: (categoryId) => `/admin/categories/${categoryId}`,
  DELETE: (categoryId) => `/admin/categories/${categoryId}`,
};

// Endpoints des produits
export const PRODUCT_ENDPOINTS = {
  LIST: '/admin/products',
  CREATE: '/admin/products',
  UPDATE: (productId) => `/admin/products/${productId}`,
  DELETE: (productId) => `/admin/products/${productId}`,
};

// Endpoints des finances
export const FINANCE_ENDPOINTS = {
  STATS: '/admin/finance/stats',
  TRANSACTIONS: '/admin/finance/transactions',
  REVENUE: '/admin/finance/revenue',
};

// Endpoints des exports
export const EXPORT_ENDPOINTS = {
  EXPORT: (type, format) => `/admin/export/${type}?format=${format}`,
};

// Helper pour construire les URLs complètes
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
