
import React from 'react';
import { formatInitials } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, size = 'md', className = '' }) => {
  const theme = useTheme();
  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
  };
  return (
    <div className={`rounded-full ${theme.colors.background} ${theme.colors.text.tertiary} border ${theme.colors.border} font-black flex items-center justify-center uppercase ${sizeClasses[size]} ${className}`}>
      {formatInitials(name)}
    </div>
  );
};
