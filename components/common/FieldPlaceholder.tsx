import React from 'react';
import { Plus, LucideIcon, Edit3 } from 'lucide-react';
import { Button } from '../ui/Button';

interface FieldPlaceholderProps {
  label?: string;
  className?: string;
  onAdd?: () => void;
  icon?: LucideIcon;
}

/**
 * Implements the required 'professional light grey fill' (nexus-empty-pattern)
 * for empty data fields, providing an immediate CRUD path.
 */
export const FieldPlaceholder: React.FC<FieldPlaceholderProps> = ({ 
    label = 'No data defined', 
    className = '',
    onAdd,
    icon: Icon = Edit3
}) => (
  <div className={`w-full h-24 nexus-empty-pattern border border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 group transition-all hover:border-slate-300 ${className}`}>
    <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-500 transition-colors">
      <Icon size={16} className="opacity-50" />
      <span className="text-xs font-bold uppercase tracking-widest italic">{label}</span>
    </div>
    {onAdd && (
        <button 
            onClick={onAdd}
            className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-nexus-600 hover:border-nexus-200 shadow-sm transition-all active:scale-95"
        >
            <Plus size={12}/> Define Field
        </button>
    )}
  </div>
);