import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
};

const Toast = ({ id: _id, type = 'info', message = '', title, timeout = 4000, onClose }) => {
  useEffect(() => {
    const t = setTimeout(() => {
      onClose();
    }, timeout);
    return () => clearTimeout(t);
  }, [timeout, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full max-w-sm rounded-lg border p-3 shadow-md flex items-start gap-3 ${colorMap[type] || colorMap.info}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {/* icône simple */}
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/60">
          {type === 'success' && (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 13.2L4.8 10l-1.2 1.2L8 15.6 17.2 6.4 16 5.2 8 13.2z" fill="#059669" />
            </svg>
          )}
          {type === 'error' && (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.4 10l3.6-3.6-1.4-1.4L10 8.6 6.4 5 5 6.4 8.6 10 5 13.6 6.4 15 10 11.4l3.6 3.6 1.4-1.4L11.4 10z" fill="#DC2626" />
            </svg>
          )}
          {type === 'info' && (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9" stroke="#2563EB" strokeWidth="1.5" />
              <path d="M9 8h2v6H9V8zm0-3h2v2H9V5z" fill="#2563EB" />
            </svg>
          )}
          {type === 'warning' && (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 4h2v6H9z" fill="#B45309" />
              <path d="M10 16a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" fill="#B45309" />
              <path d="M10 2l8.66 15H1.34L10 2z" stroke="#F59E0B" strokeWidth="1" fill="#FDE68A" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex-1">
        {title && <div className="font-semibold text-sm mb-0.5">{title}</div>}
        <div className="text-sm leading-snug">{message}</div>
      </div>
      <button onClick={onClose} aria-label="Fermer" className="text-gray-500 hover:text-gray-700 ml-2">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
