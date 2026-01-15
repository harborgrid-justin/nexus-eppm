
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
    <div className={`flex-1 flex flex-col items-center justify-center p-12 nexus-empty-pattern border-2 border-dashed ${theme.colors.border} rounded-[2.5rem] m-6 animate-nexus-in shadow-inner overflow-hidden relative min-h-[400px]`}>
      <div className="absolute -right-20 -bottom-20 opacity-[0.03] rotate-12 pointer-events-none select-none">
          <Icon size={400} />
      </div>

      <div className={`w-24 h-24 ${theme.colors.surface} rounded-3xl flex items-center justify-center shadow-xl mb-8 border border-slate-200 ${theme.colors.text.tertiary} rotate-3 hover:rotate-0 transition-transform duration-500 relative z-10 bg-white`}>
        <Icon size={40} strokeWidth={1} />
      </div>
      
      <div className="relative z-10 max-w-sm text-center">
          <h3 className={`text-xl font-black text-slate-900 mb-3 uppercase tracking-tighter`}>
            {title}
          </h3>
          <p className={`text-sm ${theme.colors.text.secondary} mb-10 font-medium leading-relaxed`}>
            {description}
          </p>
          
          {onAdd && (
            <Button 
                onClick={onAdd} 
                icon={Plus} 
                size="lg" 
                className="shadow-2xl shadow-nexus-500/20 px-10 font-black uppercase tracking-widest text-xs h-12"
            >
              {actionLabel}
            </Button>
          )}
      </div>
    </div>
  );
};
