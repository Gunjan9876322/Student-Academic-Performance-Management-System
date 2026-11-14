import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type || 'info'}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald" />}
          {toast.type === 'error' && <AlertCircle size={18} className="text-rose" />}
          {(!toast.type || toast.type === 'info') && <Info size={18} className="text-indigo" />}

          <span style={{ flex: 1 }}>{toast.message}</span>

          <button
            type="button"
            className="btn-ghost btn-sm"
            style={{ padding: '2px', marginLeft: '6px' }}
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss toast"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
