
import React, { InputHTMLAttributes, forwardRef } from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ElementType;
  isSearch?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', icon: Icon, isSearch, ...props }, ref) => {
  const theme = useTheme();
  const IconToRender = isSearch ? Search : Icon;

  return (
    <div className="relative w-full group">
      {IconToRender && (
        <div className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme.colors.text.tertiary} group-focus-within:text-nexus-500 transition-colors pointer-events-none`}>
          <IconToRender size={16} strokeWidth={2.5} />
        </div>
      )}
      <input
        ref={ref}
        className={`
          w-full ${theme.colors.surface} ${theme.colors.border} border rounded-lg transition-all
          focus:outline-none focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 
          ${theme.colors.text.primary} placeholder:${theme.colors.text.tertiary} font-medium
          disabled:${theme.colors.background} disabled:${theme.colors.text.tertiary}
          ${theme.layout.inputHeight}
          ${IconToRender ? 'pl-11' : 'pl-4'} 
          pr-4 
          ${className}
        `}
        {...props}
      />
    </div>
  );
};

Input.displayName = 'Input';
