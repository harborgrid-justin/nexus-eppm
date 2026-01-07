
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

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  variant = 'status', 
  className = '',
  customColorClass
}) => {
  const theme = useTheme();
  const baseClasses = theme.components.badge.base;
  
  // Safe primitive conversion to prevent Error #31
  const displayStatus = (status === null || status === undefined) ? '-' : String(status);
  const s = displayStatus.toLowerCase();
  
  let colors = theme.colors.semantic.neutral.bg + ' ' + theme.colors.semantic.neutral.text + ' ' + theme.colors.semantic.neutral.border;

  if (customColorClass) {
      return (
        <span className={`${baseClasses} ${customColorClass} ${className}`}>
            {displayStatus}
        </span>
      );
  }

  // Helper to construct color string
  const getSemanticColor = (type: 'success' | 'warning' | 'danger' | 'info' | 'neutral') => {
      const t = theme.colors.semantic[type];
      return `${t.bg} ${t.text} ${t.border}`;
  };

  // Map status text to semantic theme tokens
  if (variant === 'health') {
      if (['good', 'healthy', 'on track'].includes(s)) colors = getSemanticColor('success');
      else if (['warning', 'at risk'].includes(s)) colors = getSemanticColor('warning');
      else if (['critical', 'poor', 'off track'].includes(s)) colors = getSemanticColor('danger');
  } else if (variant === 'priority') {
      if (['high', 'critical', 'urgent'].includes(s)) colors = getSemanticColor('danger');
      else if (['medium'].includes(s)) colors = getSemanticColor('warning');
      else if (['low'].includes(s)) colors = getSemanticColor('info');
  } else if (variant === 'success') {
      colors = getSemanticColor('success');
  } else if (variant === 'warning') {
      colors = getSemanticColor('warning');
  } else if (variant === 'danger') {
      colors = getSemanticColor('danger');
  } else if (variant === 'info') {
      colors = getSemanticColor('info');
  } else {
      // General Status
      if (['approved', 'active', 'completed', 'paid', 'met', 'resolved', 'success'].includes(s)) colors = getSemanticColor('success');
      else if (['pending', 'in progress', 'open', 'conditional', 'draft', 'review'].includes(s)) colors = getSemanticColor('warning');
      else if (['rejected', 'critical', 'blocked', 'failed', 'not met', 'blacklisted', 'error'].includes(s)) colors = getSemanticColor('danger');
      else if (['closed', 'archived', 'inactive'].includes(s)) colors = getSemanticColor('neutral');
      else if (['issued', 'sent'].includes(s)) colors = getSemanticColor('info');
  }

  return (
    <span className={`${baseClasses} ${colors} ${className}`}>
      {displayStatus}
    </span>
  );
};
