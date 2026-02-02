import axios from 'axios';
import { closeLoading } from '../utils/swal';
import toastService from '../utils/toastService';
import { API_CONFIG, STORAGE_KEYS } from '../config/constants';

// Configuration de l'instance Axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: API_CONFIG.HEADERS,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // Important pour Sanctum
});

// Intercepteur de requête : Ajoute le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse : Gère les erreurs globales
// Flag pour éviter les alertes multiples pour la même erreur
let lastErrorShown = null;
let errorTimeout = null;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Erreur 401/403 : Token invalide ou expiré
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Éviter les boucles infinies
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        // Nettoyer le token
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);

        // Rediriger vers login (une seule fois)
        if (window.location.pathname !== '/admin/login') {
          // Fermer toute alerte existante
          closeLoading();

          // Utiliser le toastService pour notifications non-bloquantes
          toastService.showError('Votre session a expiré. Veuillez vous reconnecter.', 'Session expirée', 4500);

          // Petit délai avant redirection pour laisser voir l'alerte
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 1500);
        }
      }
      return Promise.reject(error);
    }

    // Ne pas afficher d'alerte pour les erreurs 404/Network sur les requêtes GET
    // (l'API peut ne pas être disponible en développement)
    const isGetRequest = !error.config || error.config.method?.toLowerCase() === 'get';
    const is404OrNetwork = 
      error.response?.status === 404 || 
      error.code === 'ERR_NETWORK' || 
      error.message === 'Network Error' ||
      error.code === 'ECONNABORTED'; // Timeout

    if (is404OrNetwork && isGetRequest) {
      // Log pour le débogage mais ne pas afficher d'alerte
      console.warn('⚠️ Erreur réseau/404 sur requête GET:', {
        url: error.config?.url,
        status: error.response?.status,
        code: error.code,
        message: error.message,
      });
      return Promise.reject(error);
    }

    // Gestion des autres erreurs (POST, PUT, DELETE, etc.)
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Une erreur est survenue';

    // Ne pas afficher d'erreur pour les erreurs 422 (validation) car elles sont gérées par les composants
    // Ne pas afficher d'erreur pour les requêtes GET (sauf erreurs serveur 500+)
    const isValidationError = error.response?.status === 422;
    
    if (isValidationError || (isGetRequest && error.response?.status < 500)) {
      // Laisser les composants gérer ces erreurs
      return Promise.reject(error);
    }

    // Éviter les répétitions d'alertes pour la même erreur
    const errorKey = `${error.response?.status || 'network'}-${errorMessage}`;
    const now = Date.now();
    
    // Si c'est la même erreur et qu'elle a été affichée il y a moins de 2 secondes, ignorer
    if (lastErrorShown?.key === errorKey && (now - lastErrorShown.time) < 2000) {
      return Promise.reject(error);
    }

    // Marquer cette erreur comme affichée
    lastErrorShown = { key: errorKey, time: now };
    
    // Nettoyer le flag après 3 secondes
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }
    errorTimeout = setTimeout(() => {
      lastErrorShown = null;
    }, 3000);

    // Afficher l'erreur seulement pour les erreurs serveur (500+) ou les erreurs non-GET non-422
    if (!isGetRequest && !isValidationError) {
      toastService.showError(errorMessage, 'Erreur');
    } else if (error.response?.status >= 500) {
      toastService.showError(errorMessage, 'Erreur serveur');
    }

    return Promise.reject(error);
  }
);

export default api;
