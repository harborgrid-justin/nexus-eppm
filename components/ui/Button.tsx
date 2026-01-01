
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
  const theme = useTheme();
  
  const variants = {
    primary: `${theme.colors.primary} text-white ${theme.colors.primaryHover} focus:ring-nexus-500 shadow-sm hover:shadow-md`,
    secondary: "bg-slate-900 text-white hover:bg-black focus:ring-slate-500 shadow-sm",
    outline: `bg-white ${theme.colors.text.primary} ${theme.colors.border} hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm focus:ring-slate-300`,
    ghost: `${theme.colors.text.secondary} hover:bg-slate-100 hover:${theme.colors.text.primary} focus:ring-slate-200 border border-transparent`,
    'ghost-white': "text-slate-400 hover:text-white hover:bg-slate-800 focus:ring-slate-700",
    danger: `${theme.colors.semantic.danger.bg} ${theme.colors.semantic.danger.text} border ${theme.colors.semantic.danger.border} hover:bg-red-100 focus:ring-red-500 shadow-sm`,
  };

  return (
    <button 
      className={`${theme.components.button.base} ${variants[variant]} ${theme.components.button.sizes[size]} ${className}`}
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
