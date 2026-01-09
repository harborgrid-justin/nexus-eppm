
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastMessage, ToastType } from '../components/ui/Toast';

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showToast = (title: string, message?: string, type: ToastType = 'info', duration = 4000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type, duration }]);
  };

  return (
    <ToastContext.Provider value={{
      showToast,
      success: (t, m) => showToast(t, m, 'success'),
      error: (t, m) => showToast(t, m, 'error'),
      warning: (t, m) => showToast(t, m, 'warning'),
      info: (t, m) => showToast(t, m, 'info'),
    }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
