
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface StatusBadgeProps {
  status: any;
  variant?: 'health' | 'status' | 'priority' | 'custom' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
  customColorClass?: string;
}

const StatusBadgeComponent: React.FC<StatusBadgeProps> = ({ 
  status, className = '', customColorClass
}) => {
  const theme = useTheme();
  const baseClasses = "inline-flex items-center px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all";
  
  const displayStatus = (status === null || status === undefined) ? 'UNSET' : String(status);
  const s = displayStatus.toLowerCase();
  
  if (customColorClass) return <span className={`${baseClasses} ${customColorClass} ${className}`}>{displayStatus}</span>;

  const getSemanticColor = (type: 'success' | 'warning' | 'danger' | 'info' | 'neutral') => {
      const t = theme.colors.semantic[type];
      return `${t.bg} ${t.text} ${t.border}`;
  };

  let colors = getSemanticColor('neutral');

  if (['active', 'open', 'in progress', 'running', 'good', 'healthy', 'on track', 'approved', 'pass', 'valid', 'issued', 'released', 'solvent'].includes(s)) {
      colors = getSemanticColor('success');
  } else if (['warning', 'at risk', 'behind', 'pending', 'review', 'in review', 'submitted', 'conditional', 'probationary', 'draft'].includes(s)) {
      colors = getSemanticColor('warning');
  } else if (['critical', 'poor', 'off track', 'non-compliant', 'rejected', 'failed', 'error', 'down', 'insolvent', 'blocked', 'blacklisted', 'closed', 'completed', 'archived', 'resolved', 'final'].includes(s)) {
      // Differentiating 'closed' as neutral/dark vs error
      if (['closed', 'completed', 'archived', 'resolved', 'final'].includes(s)) {
          colors = 'bg-slate-100 text-slate-500 border-slate-200';
      } else {
          colors = getSemanticColor('danger');
      }
  } else if (['info', 'new', 'allocation', 'planned'].includes(s)) {
      colors = getSemanticColor('info');
  }

  return (
    <span className={`${baseClasses} ${colors} ${className}`}>
      {displayStatus}
    </span>
  );
};

export const StatusBadge = React.memo(StatusBadgeComponent);
