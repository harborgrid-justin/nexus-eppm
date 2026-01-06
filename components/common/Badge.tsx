
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, icon: Icon, className = '' }) => {
  const baseClasses = "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold border uppercase tracking-wider";
  
  const variants = {
      success: 'bg-green-50 text-green-700 border-green-200',
      warning: 'bg-amber-50 text-amber-700 border-amber-200',
      danger: 'bg-red-50 text-red-700 border-red-200',
      info: 'bg-blue-50 text-blue-700 border-blue-200',
      neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {children}
    </span>
  );
};
