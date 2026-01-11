import React from 'react';
import { Plus, Database, LucideIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';

interface EmptyGridProps {
  title: string;
  description: string;
  onAdd?: () => void; 
  actionLabel?: string;
  icon?: LucideIcon;
}

export const EmptyGrid: React.FC<EmptyGridProps> = ({ 
  title, 
  description, 
  onAdd, 
  actionLabel = "Initialize Record",
  icon: Icon = Database
}) => {
  const theme = useTheme();

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-12 nexus-empty-pattern border-2 border-dashed ${theme.colors.border} rounded-3xl m-4 animate-nexus-in shadow-inner`}>
      <div className={`w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6 border ${theme.colors.border} ${theme.colors.text.tertiary} rotate-3 group-hover:rotate-0 transition-transform`}>
        <Icon size={32} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2 text-center uppercase tracking-tighter">
        {title}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm text-center mb-8 font-medium leading-relaxed">
        {description}
      </p>
      {onAdd && (
        <Button 
            onClick={onAdd} 
            icon={Plus} 
            size="lg" 
            className="shadow-xl shadow-nexus-500/20 px-8"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};