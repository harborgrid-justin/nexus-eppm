
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
  
  const baseClasses = "inline-flex items-center justify-center font-black uppercase tracking-[0.1em] transition-all duration-300 focus:outline-none focus:ring-4 active:scale-[0.96] rounded-xl";

  const variants = {
    primary: `${theme.colors.primary} hover:brightness-110 focus:ring-nexus-500/20 shadow-xl shadow-nexus-500/10 border border-white/5`,
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus:ring-slate-300 shadow-sm hover:shadow-md",
    outline: `bg-transparent text-slate-900 border-slate-300 border-2 hover:border-nexus-600 hover:text-nexus-700 transition-colors focus:ring-nexus-500/10`,
    ghost: `text-slate-500 hover:bg-slate-100 hover:text-slate-900 border-transparent transition-colors`,
    'ghost-white': "text-slate-400 hover:text-white hover:bg-white/10 border-transparent transition-colors",
    danger: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 focus:ring-red-500/20 shadow-md",
  };

  const sizes = {
    sm: "px-4 text-[10px]",
    md: "px-6 text-[11px]",
    lg: "px-10 text-[12px]"
  };

  const heightStyle = {
      sm: 'var(--input-height-sm)',
      md: 'var(--input-height-md)',
      lg: 'var(--input-height-lg)'
  }[size];

  return (
    <button 
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} 
        disabled={disabled || isLoading} 
        style={{ 
            height: heightStyle,
            opacity: (disabled || isLoading) ? 'var(--opacity-disabled)' : 1,
            cursor: (disabled || isLoading) ? 'not-allowed' : 'pointer'
        }}
        {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className={`${children ? 'mr-2' : ''} h-4 w-4 shrink-0 transition-transform group-hover:scale-110`} />
      ) : null}
      {children}
    </button>
  );
};
