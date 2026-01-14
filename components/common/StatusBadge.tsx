
import React from 'react';
import { StatusVariant } from '../../types/ui';
import { useTheme } from '../../context/ThemeContext';

interface StatusBadgeProps {
  status: any;
  variant?: StatusVariant;
  className?: string;
  customColorClass?: string;
}

const StatusBadgeComponent: React.FC<StatusBadgeProps> = ({ 
  status, 
  className = '',
  customColorClass
}) => {
  const theme = useTheme();
  const baseClasses = "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border";
  
  const displayStatus = (status === null || status === undefined) ? '-' : String(status);
  const s = displayStatus.toLowerCase();
  
  if (customColorClass) {
      return (
        <span className={`${baseClasses} ${customColorClass} ${className}`}>
            {displayStatus}
        </span>
      );
  }

  const getSemanticColor = (type: 'success' | 'warning' | 'danger' | 'info' | 'neutral') => {
      const t = theme.colors.semantic[type];
      return `${t.bg} ${t.text} ${t.border}`;
  };

  let colors = getSemanticColor('neutral');

  if (['active', 'open', 'in progress', 'running', 'good', 'healthy', 'on track', 'approved', 'pass', 'valid', 'issued', 'released', 'solvent'].includes(s)) {
      colors = getSemanticColor('success');
  } else if (['warning', 'at risk', 'behind', 'pending', 'review', 'in review', 'submitted', 'conditional', 'probationary'].includes(s)) {
      colors = getSemanticColor('warning');
  } else if (['critical', 'poor', 'off track', 'non-compliant', 'rejected', 'failed', 'error', 'down', 'insolvent', 'blocked', 'blacklisted'].includes(s)) {
      colors = getSemanticColor('danger');
  } else if (['draft', 'planned', 'proposed', 'estimated'].includes(s)) {
      colors = 'bg-slate-50 text-slate-500 border-slate-200';
  } else if (['closed', 'completed', 'archived', 'resolved', 'final'].includes(s)) {
      colors = 'bg-slate-900 text-slate-200 border-slate-700 shadow-sm';
  } else if (['info', 'new', 'allocation'].includes(s)) {
      colors = getSemanticColor('info');
  }

  return (
    <span className={`${baseClasses} ${colors} ${className}`}>
      {displayStatus}
    </span>
  );
};

export const StatusBadge = React.memo(StatusBadgeComponent);
