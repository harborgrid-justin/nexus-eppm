
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'neutral', children, icon: Icon, className = '' }) => {
  const theme = useTheme();
  const colors = theme.colors.semantic[variant];
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${colors.bg} ${colors.text} ${colors.border} ${className}`}>
      {Icon && <Icon className="w-3 h-3 mr-1.5" />}
      {children}
    </span>
  );
};
