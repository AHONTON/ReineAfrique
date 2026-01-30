import Swal from 'sweetalert2';

// Système de queue pour éviter les alertes multiples
let isAlertOpen = false;
let alertQueue = [];

const processQueue = () => {
  if (alertQueue.length === 0 || isAlertOpen) {
    return;
  }
  
  const nextAlert = alertQueue.shift();
  isAlertOpen = true;
  
  nextAlert().then(() => {
    isAlertOpen = false;
    // Traiter la prochaine alerte après un court délai
    setTimeout(processQueue, 300);
  });
};

// Configuration centralisée de SweetAlert2 avec couleurs appropriées
const getConfig = (type) => {
  const baseConfig = {
    buttonsStyling: true,
    customClass: {
      popup: 'swal2-popup-custom',
      confirmButton: 'swal2-confirm',
      cancelButton: 'swal2-cancel',
    },
  };

  const typeConfigs = {
    success: {
      ...baseConfig,
      iconColor: '#10b981', // Vert
      confirmButtonColor: '#10b981',
      confirmButtonText: 'OK',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#ffffff',
      color: '#1f2937',
    },
    error: {
      ...baseConfig,
      iconColor: '#ef4444', // Rouge
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'OK',
      background: '#ffffff',
      color: '#1f2937',
    },
    warning: {
      ...baseConfig,
      iconColor: '#f59e0b', // Orange/Amber
      confirmButtonColor: '#f59e0b',
      confirmButtonText: 'OK',
      background: '#ffffff',
      color: '#1f2937',
    },
    info: {
      ...baseConfig,
      iconColor: '#3b82f6', // Bleu
      confirmButtonColor: '#3b82f6',
      confirmButtonText: 'OK',
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
      background: '#ffffff',
      color: '#1f2937',
    },
    question: {
      ...baseConfig,
      iconColor: '#f97316', // Orange
      confirmButtonColor: '#f97316',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
      showCancelButton: true,
      background: '#ffffff',
      color: '#1f2937',
    },
    loading: {
      ...baseConfig,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      showCancelButton: false,
      background: '#ffffff',
      color: '#1f2937',
    },
  };

  return typeConfigs[type] || baseConfig;
};

// Fonction helper pour vérifier si une alerte est ouverte
const isSwalVisible = () => {
  const container = Swal.getContainer();
  return container && container.classList.contains('swal2-show');
};

// Fonction helper pour créer une alerte avec queue
const createAlert = (type, message, title, customConfig = {}) => {
  return () => {
    // Fermer toute alerte existante
    if (isSwalVisible()) {
      Swal.close();
    }

    const config = {
      ...getConfig(type),
      icon: type === 'loading' ? undefined : type,
      title: title || (type === 'success' ? 'Succès' : type === 'error' ? 'Erreur' : type === 'warning' ? 'Attention' : type === 'info' ? 'Information' : 'Confirmation'),
      text: message,
      ...customConfig,
    };

    if (type === 'loading') {
      return Swal.fire(config).then(() => {
        Swal.showLoading();
      });
    }

    return Swal.fire(config);
  };
};

// Succès - Vert
export const showSuccess = (message, title = 'Succès') => {
  const alertFn = createAlert('success', message, title);
  
  if (isAlertOpen) {
    alertQueue.push(alertFn);
  } else {
    alertQueue.push(alertFn);
    processQueue();
  }
  
  return Promise.resolve();
};

// Erreur - Rouge
export const showError = (message, title = 'Erreur') => {
  const alertFn = createAlert('error', message, title);
  
  if (isAlertOpen) {
    alertQueue.push(alertFn);
  } else {
    alertQueue.push(alertFn);
    processQueue();
  }
  
  return Promise.resolve();
};

// Avertissement - Orange/Amber
export const showWarning = (message, title = 'Attention') => {
  const alertFn = createAlert('warning', message, title);
  
  if (isAlertOpen) {
    alertQueue.push(alertFn);
  } else {
    alertQueue.push(alertFn);
    processQueue();
  }
  
  return Promise.resolve();
};

// Information - Bleu
export const showInfo = (message, title = 'Information') => {
  const alertFn = createAlert('info', message, title);
  
  if (isAlertOpen) {
    alertQueue.push(alertFn);
  } else {
    alertQueue.push(alertFn);
    processQueue();
  }
  
  return Promise.resolve();
};

// Confirmation - Orange avec boutons Oui/Non
export const showConfirm = (message, title = 'Confirmation') => {
  return new Promise((resolve) => {
    const alertFn = () => {
      return Swal.fire({
        ...getConfig('question'),
        icon: 'question',
        title,
        text: message,
      }).then((result) => {
        isAlertOpen = false;
        processQueue();
        resolve({ value: result.isConfirmed });
      });
    };

    if (isAlertOpen) {
      alertQueue.push(alertFn);
    } else {
      isAlertOpen = true;
      alertFn();
    }
  });
};

// Loading - Sans icône, avec spinner
let loadingInstance = null;

export const showLoading = (message = 'Chargement...') => {
  // Fermer le loading existant s'il y en a un
  if (loadingInstance) {
    closeLoading();
  }

  loadingInstance = Swal.fire({
    ...getConfig('loading'),
    title: message,
    didOpen: () => {
      Swal.showLoading();
    },
    willClose: () => {
      loadingInstance = null;
    },
  });

  return loadingInstance;
};

// Fermer le loading
export const closeLoading = () => {
  if (loadingInstance) {
    Swal.close();
    loadingInstance = null;
  } else if (isSwalVisible()) {
    Swal.close();
  }
};
