import React from 'react';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ElementType;
  isSearch?: boolean;
  label?: string;
}

const InputComponent: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({ className = '', icon: Icon, isSearch, label, ...props }, ref) => {
  const IconToRender = isSearch ? Search : Icon;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      )}
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
    </div>
  );
};

export const Input = React.forwardRef(InputComponent);
Input.displayName = 'Input';