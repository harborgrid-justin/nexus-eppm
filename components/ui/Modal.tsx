
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = 'lg' 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-7xl',
    'full': 'max-w-full m-4 h-[calc(100vh-2rem)]'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-[2px] animate-in fade-in duration-300">
      <div 
        ref={modalRef}
        className={`${theme.colors.surface} ${theme.layout.borderRadius} shadow-2xl flex flex-col w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 border ${theme.colors.border}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-8 py-5 border-b ${theme.colors.border.replace('border-', 'border-b-')} ${theme.colors.surface}`}>
          <div className={`${theme.typography.h3} ${theme.colors.text.primary}`}>{title}</div>
          <button 
            onClick={onClose}
            className={`p-2 ${theme.colors.text.tertiary} transition-all rounded-full hover:${theme.colors.text.primary} hover:${theme.colors.background} focus:outline-none focus:ring-2 focus:ring-nexus-500`}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className={`flex-1 p-8 overflow-y-auto ${theme.colors.surface} scrollbar-thin`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`flex items-center justify-end gap-3 px-8 py-5 ${theme.colors.background} border-t ${theme.colors.border.replace('border-', 'border-t-')}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
