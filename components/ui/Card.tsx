
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
        ${theme.components.card}
        ${onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};
