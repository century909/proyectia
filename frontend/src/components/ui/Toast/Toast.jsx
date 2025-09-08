import React from 'react';
import './Toast.scss';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'toast--success';
      case 'error':
        return 'toast--error';
      case 'warning':
        return 'toast--warning';
      default:
        return 'toast--info';
    }
  };

  return (
    <div className={`toast ${getTypeClass()} animate-fade-in-right`}>
      <div className="toast__content">
        <span className="toast__message">{message}</span>
        <button className="toast__close" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;