
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

interface PanelContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  header?: React.ReactNode;
}

export const PanelContainer: React.FC<PanelContainerProps> = ({ 
  children, 
  className = '', 
  noPadding = false,
  header
}) => {
  const theme = useTheme();
  
  return (
    <div className={`flex flex-col flex-1 min-h-0 ${theme.colors.surface} rounded-[1.5rem] border ${theme.colors.border} shadow-sm overflow-hidden ${className}`}>
      {header && (
        <div className={`flex-shrink-0 border-b ${theme.colors.border} bg-slate-50/50 z-10`}>
          {header}
        </div>
      )}
      <div className={`flex-1 overflow-hidden relative flex flex-col ${noPadding ? '' : 'p-0'}`}>
        {children}
      </div>
    </div>
  );
};
