import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ toasts = [], onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-auto max-w-sm">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={() => onRemove(t.id)} />
      ))}
    </div>
  );
};

export default ToastContainer;
