
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, icon: Icon, actions }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 shrink-0">
      <div className="flex items-center gap-2 max-w-full">
        {Icon && (
          <div className="p-1.5 bg-white border-border border rounded-md shadow-sm text-nexus-600 shrink-0">
             <Icon size={16} strokeWidth={2} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-text-primary leading-tight truncate">
            {title}
          </h1>
          {subtitle && <p className="text-[10px] text-text-secondary mt-0.5 truncate uppercase tracking-wide font-medium">{subtitle}</p>}
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
