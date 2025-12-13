
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Search } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon: Icon = Search, 
  action 
}) => {
  const theme = useTheme();

  return (
    <div className={`flex flex-col items-center justify-center text-center p-12 h-full ${theme.colors.surface} rounded-xl border border-dashed ${theme.colors.border}`}>
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-slate-500 text-sm max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
};
