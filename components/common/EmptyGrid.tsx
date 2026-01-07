
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

/**
 * Standardized Empty State for data tables and lists.
 * Implements the professional light grey radial fill and themed typography.
 */
export const EmptyGrid: React.FC<EmptyGridProps> = ({ 
  title, 
  description, 
  onAdd, 
  actionLabel = "Add Record",
  icon: Icon = Database
}) => {
  const theme = useTheme();

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-12 nexus-empty-pattern border-2 border-dashed ${theme.colors.border} rounded-xl m-4 animate-nexus-in`}>
      <div className={`w-16 h-16 ${theme.colors.surface} rounded-full flex items-center justify-center shadow-sm mb-4 border ${theme.colors.border} ${theme.colors.text.tertiary}`}>
        <Icon size={32} />
      </div>
      <h3 className={`${theme.typography.h3} ${theme.colors.text.primary} mb-1 text-center`}>
        {title}
      </h3>
      <p className={`${theme.typography.body} ${theme.colors.text.secondary} max-w-sm text-center mb-6`}>
        {description}
      </p>
      {onAdd && (
        <Button onClick={onAdd} icon={Plus} size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
