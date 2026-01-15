
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidePanelProps {
  isOpen: boolean; onClose: () => void; title: React.ReactNode;
  children: React.ReactNode; footer?: React.ReactNode; width?: string;
}

export const SidePanel: React.FC<SidePanelProps> = ({ 
  isOpen, onClose, title, children, footer, width = 'max-w-3xl' 
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) { document.body.style.overflow = 'hidden'; window.addEventListener('keydown', handleKeyDown); }
    return () => { document.body.style.overflow = 'unset'; window.removeEventListener('keydown', handleKeyDown); };
  }, [isOpen, onClose]);

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={onClose}/>
      <div className={`absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none`}>
        <div ref={panelRef} className={`pointer-events-auto w-screen ${width} transform transition-transform duration-500 ease-out bg-white shadow-2xl flex flex-col h-full border-l border-slate-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white shrink-0">
                <div className="text-sm font-black uppercase tracking-widest text-slate-400">{title}</div>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-full hover:bg-slate-50"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto bg-white scrollbar-thin">
                <div className="p-10">{children}</div>
            </div>
            {footer && <div className="flex items-center justify-end gap-3 px-8 py-6 bg-slate-50 border-t border-slate-100 shadow-inner shrink-0 z-10">{footer}</div>}
        </div>
      </div>
    </div>
  );
};
