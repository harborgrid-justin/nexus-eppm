
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ size?: string | number; className?: string }>;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon: Icon, actions }) => {
  const theme = useTheme();
  
  return (
    <div className={`${theme.layout.header} mb-6`}>
      <div>
        <h1 className={theme.typography.h1}>
          {Icon && <Icon className="text-nexus-600" size={24} />}
          {title}
        </h1>
        {subtitle && <p className={theme.typography.small}>{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex gap-2 items-center">
          {actions}
        </div>
      )}
    </div>
  );
};
