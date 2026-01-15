
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { PageHeader } from '../../common/PageHeader';
import { LucideIcon } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  isScrollable?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  subtitle,
  icon,
  actions,
  children,
  className = '',
  isScrollable = false
}) => {
  const theme = useTheme();

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding} ${theme.colors.background} ${className}`}>
      <PageHeader 
        title={title}
        subtitle={subtitle}
        icon={icon}
        actions={actions}
      />
      <div className={`flex-1 min-h-0 mt-6 flex flex-col ${isScrollable ? 'overflow-y-auto scrollbar-thin' : 'overflow-hidden'}`}>
        {children}
      </div>
    </div>
  );
};
