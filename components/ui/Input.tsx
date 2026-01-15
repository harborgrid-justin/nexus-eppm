
import React, { InputHTMLAttributes, forwardRef } from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ElementType;
  isSearch?: boolean;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', icon: Icon, isSearch, label, ...props }, ref) => {
  const theme = useTheme();
  const IconToRender = isSearch ? Search : Icon;
  const id = props.id || props.name;

  const inputElement = (
    <div className="relative w-full group">
      {IconToRender && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-nexus-600 transition-colors pointer-events-none">
          <IconToRender size={16} />
        </div>
      )}
      <input
        ref={ref}
        id={id}
        className={`
          w-full ${theme.colors.surface} border-2 border-slate-200 rounded-xl transition-all
          focus:outline-none focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 
          ${theme.colors.text.primary} placeholder:text-slate-300 font-bold text-sm h-11
          ${IconToRender ? 'pl-11' : 'px-4'} pr-4 ${className}
        `}
        {...props}
      />
    </div>
  );

  if (label) {
    return (
      <div className="space-y-1.5">
        <label htmlFor={id} className={`block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1`}>{label}</label>
        {inputElement}
      </div>
    );
  }
  return inputElement;
});
Input.displayName = 'Input';
