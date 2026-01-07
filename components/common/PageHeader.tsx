
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
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-2 shrink-0 ${theme.layout.headerBorder} pb-4`}>
      <div className="flex items-center gap-3 max-w-full">
        {Icon && (
          <div className={`p-2 ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm text-nexus-600 shrink-0`}>
             <Icon size={20} strokeWidth={2.5} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className={`${theme.typography.h1} leading-tight truncate`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`${theme.typography.label} ${theme.colors.text.tertiary} mt-0.5 truncate`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex gap-2 items-center w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-hide shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
