
import React from 'react';

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
  const baseClasses = `animate-pulse bg-slate-200 dark:bg-slate-800`;
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
