
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon: Icon, actions }) => {
  const theme = useTheme();
  
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8`}>
      <div className="flex items-start gap-3 md:gap-4 max-w-full">
        {Icon && (
          <div className={`p-2 md:p-3 ${theme.colors.surface} ${theme.colors.border} border rounded-xl shadow-sm text-nexus-600 shrink-0`}>
             <Icon size={20} className="md:w-6 md:h-6" strokeWidth={2.25} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className={`${theme.typography.h1} leading-tight md:leading-none break-words`}>
            {title}
          </h1>
          {subtitle && <p className={`${theme.typography.small} mt-1 md:mt-2 max-w-2xl text-pretty`}>{subtitle}</p>}
        </div>
      </div>
      {actions && (
        <div className="flex gap-2.5 items-center w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
