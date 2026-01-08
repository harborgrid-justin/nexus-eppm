
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
 * Implements the required 'professional light grey fill' (nexus-empty-pattern)
 * for empty data fields, providing an immediate CRUD path.
 */
export const FieldPlaceholder: React.FC<FieldPlaceholderProps> = ({ 
    label = 'No data defined', 
    className = '',
    onAdd,
    icon: Icon = Edit3
}) => {
  const theme = useTheme();

  return (
    <div className={`w-full h-24 nexus-empty-pattern border ${theme.colors.border} rounded-xl flex flex-col items-center justify-center p-4 group transition-all hover:border-slate-300 ${className}`}>
      <div className={`flex items-center gap-2 ${theme.colors.text.tertiary} group-hover:${theme.colors.text.secondary} transition-colors`}>
        <Icon size={16} className="opacity-50" />
        <span className={`${theme.typography.label} italic tracking-widest`}>{label}</span>
      </div>
      {onAdd && (
          <button 
              onClick={onAdd}
              className={`mt-3 flex items-center gap-1.5 px-3 py-1.5 ${theme.colors.surface} border ${theme.colors.border} rounded-lg text-[10px] font-black uppercase tracking-widest ${theme.colors.text.secondary} hover:${theme.colors.text.primary} hover:border-nexus-200 shadow-sm transition-all active:scale-95`}
          >
              <Plus size={12}/> Define Field
          </button>
      )}
    </div>
  );
};
