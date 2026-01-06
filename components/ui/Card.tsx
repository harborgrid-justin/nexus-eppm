
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-surface border border-border rounded-lg shadow-sm transition-all duration-200
        ${onClick ? `cursor-pointer hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]` : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};
