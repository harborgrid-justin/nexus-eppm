
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ModalProps {
  isOpen: boolean; onClose: () => void; title: React.ReactNode;
  children: React.ReactNode; footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, onClose, title, children, footer, size = 'lg' 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) { document.body.style.overflow = 'hidden'; window.addEventListener('keydown', handleKeyDown); }
    return () => { document.body.style.overflow = 'unset'; window.removeEventListener('keydown', handleKeyDown); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl', xl: 'max-w-5xl', '2xl': 'max-w-7xl', 'full': 'max-w-full m-4 h-[calc(100vh-2rem)]' };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div ref={modalRef} className={`bg-white rounded-[2.5rem] shadow-2xl flex flex-col w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200`} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white">
          <div className="text-sm font-black uppercase tracking-widest text-slate-400">{title}</div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-full hover:bg-slate-50"><X size={22} /></button>
        </div>
        <div className="flex-1 p-10 overflow-y-auto bg-white scrollbar-thin">{children}</div>
        {footer && <div className="flex items-center justify-end gap-3 px-8 py-6 bg-slate-50 border-t border-slate-100">{footer}</div>}
      </div>
    </div>
  );
};
