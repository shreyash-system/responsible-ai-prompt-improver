import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { type = 'info', message } = toast;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-success" />;
      case 'error':
        return <AlertCircle size={16} className="text-danger" />;
      default:
        return <Info size={16} className="text-info" />;
    }
  };

  return (
    <div className={`toast-notification toast-${type} animate-slide-up`}>
      <div className="toast-content">
        {getIcon()}
        <span className="toast-message">{message}</span>
      </div>
      <button type="button" className="toast-close" onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
}
