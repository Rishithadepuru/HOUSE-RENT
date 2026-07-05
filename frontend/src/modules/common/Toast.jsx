import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle style={{ color: 'var(--success)' }} />;
      case 'warning':
        return <AlertTriangle style={{ color: 'var(--warning)' }} />;
      case 'error':
        return <AlertCircle style={{ color: 'var(--danger)' }} />;
      default:
        return <Info style={{ color: 'var(--primary)' }} />;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        padding: '16px 20px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: 'var(--shadow-xl)',
        animation: 'slideIn 0.3s ease-out',
        minWidth: '280px',
        maxWidth: '450px',
        borderLeft: `5px solid ${
          type === 'success'
            ? 'var(--success)'
            : type === 'warning'
            ? 'var(--warning)'
            : type === 'error'
            ? 'var(--danger)'
            : 'var(--primary)'
        }`,
      }}
    >
      {getIcon()}
      <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>{message}</div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
        }}
      >
        <X size={16} />
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
