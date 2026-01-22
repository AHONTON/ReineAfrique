import Swal from 'sweetalert2';

// Configuration centralisée de SweetAlert2
const defaultConfig = {
  confirmButtonColor: '#f97316', // Orange
  cancelButtonColor: '#6b7280', // Gris
  confirmButtonText: 'Confirmer',
  cancelButtonText: 'Annuler',
  buttonsStyling: true,
  customClass: {
    confirmButton: 'swal2-confirm',
    cancelButton: 'swal2-cancel',
  },
};

// Succès
export const showSuccess = (message, title = 'Succès') => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'success',
    title,
    text: message,
    timer: 3000,
    showConfirmButton: false,
  });
};

// Erreur
export const showError = (message, title = 'Erreur') => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'error',
    title,
    text: message,
  });
};

// Avertissement
export const showWarning = (message, title = 'Attention') => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title,
    text: message,
  });
};

// Information
export const showInfo = (message, title = 'Information') => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'info',
    title,
    text: message,
  });
};

// Confirmation
export const showConfirm = (message, title = 'Confirmation') => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'question',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Non',
  });
};

// Loading
export const showLoading = (message = 'Chargement...') => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Fermer le loading
export const closeLoading = () => {
  Swal.close();
};
