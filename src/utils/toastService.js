// Petit service singleton pour permettre d'appeler des toasts en dehors de React
let handler = null;

const register = (fn) => {
  handler = fn;
};

const unregister = () => {
  handler = null;
};

const show = ({ type = 'info', message = '', title = '', timeout = 4000 }) => {
  if (handler) {
    handler({ type, message, title, timeout });
  } else {
    console.warn('Toast handler not registered yet:', { type, message, title });
  }
};

const showSuccess = (message, title, timeout) => show({ type: 'success', message, title, timeout });
const showError = (message, title, timeout) => show({ type: 'error', message, title, timeout });
const showInfo = (message, title, timeout) => show({ type: 'info', message, title, timeout });
const showWarning = (message, title, timeout) => show({ type: 'warning', message, title, timeout });

export default {
  register,
  unregister,
  show,
  showSuccess,
  showError,
  showInfo,
  showWarning,
};
