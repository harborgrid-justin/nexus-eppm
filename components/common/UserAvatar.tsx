
import React from 'react';
import { formatInitials } from '../../utils/formatters';

interface UserAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ name, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };
  return (
    <div className={`rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {formatInitials(name)}
    </div>
  );
};
