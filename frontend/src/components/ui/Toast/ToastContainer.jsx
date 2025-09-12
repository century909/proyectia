import React from 'react';
import Toast from './Toast';
import './ToastContainer.scss';

const positions = {
  'top-right': 'toast-container--top-right',
  'top-left': 'toast-container--top-left',
  'bottom-right': 'toast-container--bottom-right',
  'bottom-left': 'toast-container--bottom-left',
};

const ToastContainer = ({ toasts, removeToast, position = 'top-right' }) => {
  const posClass = positions[position] || positions['top-right'];
  return (
    <div className={`toast-container ${posClass}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;