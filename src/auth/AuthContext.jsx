import { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../api/axios';
import toastService from '../utils/toastService';
import { STORAGE_KEYS } from '../config/constants';
import { AUTH_ENDPOINTS } from '../config/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Retourner un contexte par défaut si AuthProvider n'est pas disponible
    return {
      admin: null,
      loading: false,
      login: async () => ({ success: false }),
      logout: async () => {},
      isAuthenticated: false,
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const adminData = localStorage.getItem(STORAGE_KEYS.ADMIN_DATA);

    if (token && adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);
      }
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      // Requête POST de login (CSRF exclu pour cette route car on utilise des tokens Bearer)
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, { email, password });
      const { token, admin: adminData } = response.data;

      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.ADMIN_DATA, JSON.stringify(adminData));
      setAdmin(adminData);

      toastService.showSuccess('Connexion réussie !', 'Bienvenue');
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Erreur de connexion';
      toastService.showError(errorMessage, 'Échec de la connexion');
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = async () => {
    const { value: confirmed } = await Swal.fire({
      icon: 'question',
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      showCancelButton: true,
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui, me déconnecter',
      cancelButtonText: 'Annuler',
    });

    if (confirmed) {
      try {
        // Appeler l'endpoint de déconnexion si un token existe
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          try {
            await api.post(AUTH_ENDPOINTS.LOGOUT);
          } catch (err) {
            console.warn('Erreur lors de la déconnexion API:', err);
          }
        }
      } catch {
        // Ignorer les erreurs
      }

      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_DATA);
      setAdmin(null);
      toastService.showSuccess('Vous avez été déconnecté avec succès');
      window.location.href = '/admin/login';
    }
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
