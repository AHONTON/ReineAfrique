import { createContext, useContext, useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from '../api/axios';
import { showError, showSuccess } from '../utils/swal';

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
    const token = localStorage.getItem('authToken');
    const adminData = localStorage.getItem('adminData');

    if (token && adminData) {
      try {
        setAdmin(JSON.parse(adminData));
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('adminData');
      }
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, admin: adminData } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('adminData', JSON.stringify(adminData));
      setAdmin(adminData);

      showSuccess('Connexion réussie !', 'Bienvenue');
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Erreur de connexion';
      showError(errorMessage, 'Échec de la connexion');
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
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminData');
      setAdmin(null);
      showSuccess('Vous avez été déconnecté avec succès');
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
