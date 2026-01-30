import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import ToastContainer from '../components/Toast/ToastContainer';
import toastService from '../utils/toastService';

const AlertContext = createContext(null);

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    setToasts((t) => [...t, { id: Date.now() + Math.random(), ...toast }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  useEffect(() => {
    // Enregistrer le handler dans le service global pour les appels hors-React
    toastService.register(({ type, message, title, timeout = 4000 }) => {
      addToast({ type, message, title, timeout });
    });

    return () => {
      toastService.unregister();
    };
  }, [addToast]);

  const value = {
    showSuccess: (message, title) => addToast({ type: 'success', message, title }),
    showError: (message, title) => addToast({ type: 'error', message, title }),
    showInfo: (message, title) => addToast({ type: 'info', message, title }),
    showWarning: (message, title) => addToast({ type: 'warning', message, title }),
    removeToast,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AlertContext.Provider>
  );
};

export default AlertContext;
