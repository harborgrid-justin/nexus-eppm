import React from 'react';
import { StatusVariant } from '../../types/ui';
import { useTheme } from '../../context/ThemeContext';

export type { StatusVariant };

interface StatusBadgeProps {
  status: any;
  variant?: StatusVariant;
  className?: string;
  customColorClass?: string;
}

const StatusBadgeComponent: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'status', 
  className = '',
  customColorClass
}) => {
  const theme = useTheme();
  const baseClasses = theme.components.badge.base;
  
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

  if (['draft', 'planned', 'proposed', 'estimated'].includes(s)) {
      colors = 'bg-slate-100 text-slate-600 border-slate-200';
  } else if (['active', 'open', 'in progress', 'running', 'good', 'healthy', 'on track', 'compliant', 'approved', 'pass', 'valid', 'issued', 'released'].includes(s)) {
      colors = getSemanticColor('success');
  } else if (['closed', 'completed', 'archived', 'resolved', 'final'].includes(s)) {
      colors = 'bg-slate-800 text-slate-200 border-slate-700';
  } else if (['warning', 'at risk', 'behind', 'pending', 'review', 'in review', 'submitted', 'conditional', 'probationary'].includes(s)) {
      colors = getSemanticColor('warning');
  } else if (['critical', 'poor', 'off track', 'non-compliant', 'rejected', 'failed', 'error', 'down', 'insolvent', 'blocked', 'blacklisted'].includes(s)) {
      colors = getSemanticColor('danger');
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