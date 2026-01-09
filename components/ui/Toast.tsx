
import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
     switch (toast.type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-amber-200 bg-amber-50';
      case 'info': return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg w-80 animate-in slide-in-from-right-10 fade-in duration-300 ${getBorderColor()}`}>
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-slate-800">{toast.title}</h4>
        {toast.message && <p className="text-xs text-slate-600 mt-1 leading-relaxed">{toast.message}</p>}
      </div>
      <button onClick={() => onClose(toast.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
        <X size={14} />
      </button>
    </div>
  );
};
