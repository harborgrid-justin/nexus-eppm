
import React, { ButtonHTMLAttributes } from 'react';
import { Loader2, LucideIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'ghost-white';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  icon: Icon,
  className = '',
  disabled,
  ...props 
}) => {
  const { density } = useTheme();
  
  const baseClasses = "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] rounded-lg";

  const variants = {
    primary: "bg-primary text-text-inverted hover:bg-primary-dark focus:ring-nexus-500 shadow-sm hover:shadow-md",
    secondary: "bg-slate-900 text-white hover:bg-black focus:ring-slate-500 shadow-sm",
    outline: "bg-white text-text-primary border-border border hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm focus:ring-slate-300",
    ghost: "text-text-secondary hover:bg-slate-100 hover:text-text-primary focus:ring-slate-200 border border-transparent",
    'ghost-white': "text-slate-400 hover:text-white hover:bg-slate-800 focus:ring-slate-700",
    danger: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 focus:ring-red-500 shadow-sm",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: density === 'compact' ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className={`${children ? 'mr-2' : ''} h-4 w-4 shrink-0`} />
      ) : null}
      {children}
    </button>
  );
};
