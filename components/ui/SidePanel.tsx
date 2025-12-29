
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string; // e.g. "max-w-2xl"
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
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] transition-opacity" 
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none`}>
        <div 
            ref={panelRef}
            className={`pointer-events-auto w-screen ${width} transform transition-transform duration-300 ease-in-out bg-white shadow-2xl flex flex-col h-full border-l border-slate-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white flex-shrink-0">
                <div className="text-lg font-bold text-slate-900">{title}</div>
                <button 
                    onClick={onClose}
                    className="p-2 text-slate-400 transition-colors rounded-full hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-nexus-500"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50">
                <div className="p-6">
                    {children}
                </div>
            </div>

            {/* Footer */}
            {footer && (
                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-slate-200 flex-shrink-0 z-10">
                    {footer}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
