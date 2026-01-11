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
    <div className={`flex-1 flex flex-col items-center justify-center p-12 nexus-empty-pattern border-2 border-dashed ${theme.colors.border} rounded-[2.5rem] m-6 animate-nexus-in shadow-inner overflow-hidden relative`}>
      {/* Visual Accent */}
      <div className="absolute -right-20 -bottom-20 opacity-5 rotate-12 pointer-events-none">
          <Icon size={300} />
      </div>

      <div className={`w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-8 border ${theme.colors.border} ${theme.colors.text.tertiary} rotate-3 hover:rotate-0 transition-transform duration-500 relative z-10`}>
        <Icon size={40} strokeWidth={1} />
      </div>
      
      <h3 className="text-2xl font-black text-slate-900 mb-2 text-center uppercase tracking-tighter relative z-10">
        {title}
      </h3>
      <p className="text-sm text-slate-500 max-w-sm text-center mb-10 font-medium leading-relaxed relative z-10">
        {description}
      </p>
      
      {onAdd && (
        <Button 
            onClick={onAdd} 
            icon={Plus} 
            size="lg" 
            className="shadow-2xl shadow-nexus-500/20 px-10 relative z-10 font-black uppercase tracking-widest text-xs h-12"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};