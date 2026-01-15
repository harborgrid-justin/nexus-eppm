
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
  
  const baseClasses = "inline-flex items-center justify-center font-black uppercase tracking-[0.1em] transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.96] rounded-xl";

  const variants = {
    primary: `${theme.colors.primary} hover:brightness-110 focus:ring-nexus-500/20 shadow-xl shadow-nexus-500/10 border border-white/5`,
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300 shadow-sm hover:shadow-md",
    outline: `bg-transparent ${theme.colors.text.primary} border-slate-300 border-2 hover:border-nexus-600 hover:text-nexus-700 transition-colors focus:ring-nexus-500/10`,
    ghost: `${theme.colors.text.secondary} hover:bg-slate-100 hover:text-slate-900 border-transparent transition-colors`,
    'ghost-white': "text-slate-400 hover:text-white hover:bg-white/10 border-transparent transition-colors",
    danger: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 focus:ring-red-500/20 shadow-md",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-2.5 text-[11px]",
    lg: "px-10 py-4 text-[12px]"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className={`${children ? 'mr-2' : ''} h-4 w-4 shrink-0 transition-transform group-hover:scale-110`} />
      ) : null}
      {children}
    </button>
  );
};
