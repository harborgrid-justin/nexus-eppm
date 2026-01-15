
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

  return (
    <div className="relative w-full group space-y-1.5">
      {label && (
        <label htmlFor={id} className={`block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1`}>
            {label}
        </label>
      )}
      
      <div className="relative">
          {IconToRender && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-nexus-600 transition-colors pointer-events-none">
              <IconToRender size={16} />
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={`
              w-full bg-white border border-slate-200 transition-all shadow-sm
              focus:outline-none focus:ring-4 focus:ring-[var(--color-focusRing)]/20 focus:border-[var(--color-focusRing)]
              text-slate-900 placeholder:text-slate-300 font-bold text-sm
              ${IconToRender ? 'pl-10' : 'px-4'} pr-4 ${className}
            `}
            style={{ 
                height: 'var(--input-height-lg)', 
                borderRadius: 'var(--input-radius)' 
            }}
            {...props}
          />
      </div>
    </div>
  );
});
Input.displayName = 'Input';
