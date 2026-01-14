
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const theme = useTheme();
  
  return (
    <div 
      onClick={onClick}
      className={`
        ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm
        ${onClick ? `cursor-pointer hover:shadow-md hover:border-slate-300 transition-all duration-200` : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};
