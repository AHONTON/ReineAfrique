import axios from 'axios';
import { showError } from '../utils/swal';

// Configuration de l'instance Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Intercepteur de requête : Ajoute le token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
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
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminData');

        // Rediriger vers login
        if (window.location.pathname !== '/admin/login') {
          await showError(
            'Votre session a expiré. Veuillez vous reconnecter.',
            'Session expirée'
          );
          window.location.href = '/admin/login';
        }
      }
      return Promise.reject(error);
    }

    // Gestion des autres erreurs
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      'Une erreur est survenue';

    // Ne pas afficher d'alerte pour les erreurs 404/Network si c'est une requête GET (API peut ne pas être disponible)
    if (error.response?.status === 404 || error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      // Silencieux pour les erreurs réseau/404 lors du développement
      console.warn('API non disponible:', errorMessage);
    } else if (error.response?.status !== 404 || error.config.method !== 'get') {
      showError(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
