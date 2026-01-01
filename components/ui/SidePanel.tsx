
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export const SidePanel: React.FC<SidePanelProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  width = 'max-w-3xl' 
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
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

  return (
    <div 
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300" 
        onClick={onClose}
      />

      {/* Panel Container */}
      <div className={`absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none`}>
        <div 
            ref={panelRef}
            className={`pointer-events-auto w-screen ${width} transform transition-transform duration-300 ease-out ${theme.colors.surface} shadow-2xl flex flex-col h-full border-l ${theme.colors.border} ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            {/* Header */}
            <div className={`flex items-center justify-between px-8 py-5 border-b ${theme.colors.border.replace('border-', 'border-b-')} ${theme.colors.surface} flex-shrink-0`}>
                <div className={`${theme.typography.h3} text-slate-900`}>{title}</div>
                <button 
                    onClick={onClose}
                    className="p-2 text-slate-400 transition-all rounded-full hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-nexus-500"
                    aria-label="Close panel"
                >
                    <X size={22} />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 scrollbar-thin">
                <div className="p-8">
                    {children}
                </div>
            </div>

            {/* Footer */}
            {footer && (
                <div className={`flex items-center justify-end gap-3 px-8 py-5 ${theme.colors.surface} border-t ${theme.colors.border.replace('border-', 'border-t-')} flex-shrink-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]`}>
                    {footer}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
