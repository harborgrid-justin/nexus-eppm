
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height, 
  variant = 'rect' 
}) => {
  const theme = useTheme();
  
  const baseClasses = `animate-pulse bg-slate-200/80 ${theme.mode === 'dark' ? 'bg-slate-800' : ''}`;
  const roundedClasses = variant === 'circle' ? 'rounded-full' : variant === 'text' ? 'rounded' : 'rounded-xl';
  
  const style = {
    width: width,
    height: height,
  };

  return (
    <div 
      className={`${baseClasses} ${roundedClasses} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};
