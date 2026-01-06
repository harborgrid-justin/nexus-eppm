import React from 'react';
import { StatusVariant } from '../../types/ui';

export type { StatusVariant };

interface StatusBadgeProps {
  status: any;
  variant?: StatusVariant;
  className?: string;
  customColorClass?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'status', 
  className = '',
  customColorClass
}) => {
  const baseClasses = "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold border uppercase tracking-wider";
  
  // Safe primitive conversion to prevent Error #31
  const displayStatus = (status === null || status === undefined) ? '-' : String(status);
  const s = displayStatus.toLowerCase();
  
  let colors = 'bg-slate-100 text-slate-700 border-slate-200';

  if (customColorClass) {
      return (
        <span className={`${baseClasses} ${customColorClass} ${className}`}>
            {displayStatus}
        </span>
      );
  }

  // Map status text to semantic theme tokens
  if (variant === 'health') {
      if (['good', 'healthy', 'on track'].includes(s)) colors = 'bg-green-50 text-green-700 border-green-200';
      else if (['warning', 'at risk'].includes(s)) colors = 'bg-amber-50 text-amber-700 border-amber-200';
      else if (['critical', 'poor', 'off track'].includes(s)) colors = 'bg-red-50 text-red-700 border-red-200';
  } else if (variant === 'priority') {
      if (['high', 'critical', 'urgent'].includes(s)) colors = 'bg-red-50 text-red-700 border-red-200';
      else if (['medium'].includes(s)) colors = 'bg-amber-50 text-amber-700 border-amber-200';
      else if (['low'].includes(s)) colors = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (variant === 'success') {
      colors = 'bg-green-50 text-green-700 border-green-200';
  } else if (variant === 'warning') {
      colors = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (variant === 'danger') {
      colors = 'bg-red-50 text-red-700 border-red-200';
  } else if (variant === 'info') {
      colors = 'bg-blue-50 text-blue-700 border-blue-200';
  } else {
      // General Status
      if (['approved', 'active', 'completed', 'paid', 'met', 'resolved', 'success'].includes(s)) colors = 'bg-green-50 text-green-700 border-green-200';
      else if (['pending', 'in progress', 'open', 'conditional', 'draft', 'review'].includes(s)) colors = 'bg-amber-50 text-amber-700 border-amber-200';
      else if (['rejected', 'critical', 'blocked', 'failed', 'not met', 'blacklisted', 'error'].includes(s)) colors = 'bg-red-50 text-red-700 border-red-200';
      else if (['closed', 'archived', 'inactive'].includes(s)) colors = 'bg-slate-100 text-slate-700 border-slate-200';
      else if (['issued', 'sent'].includes(s)) colors = 'bg-blue-50 text-blue-700 border-blue-200';
  }

  return (
    <span className={`${baseClasses} ${colors} ${className}`}>
      {displayStatus}
    </span>
  );
};