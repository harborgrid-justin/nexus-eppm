
import React, { InputHTMLAttributes, forwardRef } from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ElementType;
  isSearch?: boolean;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', icon: Icon, isSearch, label, ...props }, ref) => {
  const IconToRender = isSearch ? Search : Icon;
  const id = props.id || props.name;

  const inputElement = (
    <div className="relative w-full group">
      {IconToRender && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-nexus-500 transition-colors pointer-events-none">
          <IconToRender size={16} strokeWidth={2.5} />
        </div>
      )}
      <input
        ref={ref}
        id={id}
        className={`
          w-full bg-surface border-border border rounded-lg transition-all
          focus:outline-none focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 
          text-text-primary placeholder:text-text-tertiary font-medium
          disabled:bg-background disabled:text-text-tertiary
          h-10 text-sm
          ${IconToRender ? 'pl-11' : 'pl-4'} 
          pr-4 
          ${className}
        `}
        {...props}
      />
    </div>
  );

  if (label) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-text-primary mb-1">{label}</label>
        {inputElement}
      </div>
    );
  }
  
  return inputElement;
});

Input.displayName = 'Input';
