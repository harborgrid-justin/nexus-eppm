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

  // Safeguard against Error #31 for string/number children
  const content = (typeof children === 'string' || typeof children === 'number') 
    ? String(children) 
    : children;

  return (
    <span className={`${theme.components.badge.base} ${colors.bg} ${colors.text} ${colors.border} ${className}`}>
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {content}
    </span>
  );
};