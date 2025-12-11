import React, { InputHTMLAttributes, forwardRef } from 'react';
import { Search } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ElementType;
  isSearch?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className = '', icon: Icon, isSearch, ...props }, ref) => {
  const IconToRender = isSearch ? Search : Icon;

  return (
    <div className="relative">
      {IconToRender && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <IconToRender size={16} />
        </div>
      )}
      <input
        ref={ref}
        className={`w-full bg-white border border-slate-300 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nexus-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-500 placeholder:text-slate-400 ${IconToRender ? 'pl-10' : 'pl-3'} pr-3 ${className}`}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';