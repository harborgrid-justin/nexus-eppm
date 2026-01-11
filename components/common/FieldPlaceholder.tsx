import React from 'react';
import { Plus, LucideIcon, Edit3 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface FieldPlaceholderProps {
  label?: string;
  className?: string;
  onAdd?: () => void; 
  icon?: LucideIcon;
}

/**
 * Standardized empty state for narrative fields.
 * Uses the nexus-empty-pattern (radial dots on light grey) defined in theme.css.
 */
export const FieldPlaceholder: React.FC<FieldPlaceholderProps> = ({ 
    label = 'No data defined', 
    className = '',
    onAdd,
    icon: Icon = Edit3
}) => {
  const theme = useTheme();

  return (
    <div className={`w-full h-24 nexus-empty-pattern border ${theme.colors.border} rounded-2xl flex flex-col items-center justify-center p-4 group transition-all hover:border-slate-300 hover:bg-slate-50/50 ${className}`}>
      <div className={`flex items-center gap-2 ${theme.colors.text.tertiary} group-hover:${theme.colors.text.secondary} transition-colors`}>
        <Icon size={16} className="opacity-40" />
        <span className="text-[10px] font-black uppercase tracking-[0.15em] italic">{label}</span>
      </div>
      {onAdd && (
          <button 
              onClick={onAdd}
              className={`mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-nexus-600 hover:border-nexus-200 shadow-sm transition-all active:scale-95`}
          >
              <Plus size={12}/> Initialize Field
          </button>
      )}
    </div>
  );
};