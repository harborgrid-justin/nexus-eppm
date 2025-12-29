
import React from 'react';
import { getHealthColorClass } from '../../utils/formatters';

export type StatusVariant = 'health' | 'status' | 'priority' | 'custom';

interface StatusBadgeProps {
  status: string;
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
  let colorClass = 'bg-slate-100 text-slate-800 border-slate-200';

  if (variant === 'health') {
    colorClass = getHealthColorClass(status);
  } else if (variant === 'priority') {
    switch (status?.toLowerCase()) {
      case 'high': case 'critical': colorClass = 'bg-red-100 text-red-800 border-red-200'; break;
      case 'medium': colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200'; break;
      case 'low': colorClass = 'bg-blue-100 text-blue-800 border-blue-200'; break;
    }
  } else if (variant === 'custom' && customColorClass) {
    colorClass = customColorClass;
  } else {
    // Default Status logic
    switch (status?.toLowerCase()) {
      case 'approved': case 'active': case 'completed': case 'paid': case 'met':
        colorClass = 'bg-green-100 text-green-800 border-green-200'; break;
      case 'pending': case 'in progress': case 'open': case 'conditional':
        colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200'; break;
      case 'rejected': case 'critical': case 'blocked': case 'failed': case 'not met':
        colorClass = 'bg-red-100 text-red-800 border-red-200'; break;
      case 'closed': case 'draft':
        colorClass = 'bg-slate-100 text-slate-600 border-slate-200'; break;
    }
  }

  return (
    <span className={`inline-flex items-center justify-center px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-[10px] md:text-xs font-bold border uppercase tracking-wider shadow-sm ${colorClass} ${className}`}>
      {status}
    </span>
  );
};
