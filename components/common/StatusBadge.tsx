
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { StatusVariant } from '../../types/ui';

export type { StatusVariant };

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
  const theme = useTheme();
  const s = status?.toLowerCase();
  
  // Default to neutral
  let colors = theme.colors.semantic.neutral;

  if (customColorClass) {
      // Escape hatch if needed
      return (
        <span className={`${theme.components.badge.base} ${customColorClass} ${className}`}>
            {status}
        </span>
      );
  }

  // Map status text to semantic theme tokens
  if (variant === 'health') {
      if (['good', 'healthy', 'on track'].includes(s)) colors = theme.colors.semantic.success;
      else if (['warning', 'at risk'].includes(s)) colors = theme.colors.semantic.warning;
      else if (['critical', 'poor', 'off track'].includes(s)) colors = theme.colors.semantic.danger;
  } else if (variant === 'priority') {
      if (['high', 'critical', 'urgent'].includes(s)) colors = theme.colors.semantic.danger;
      else if (['medium'].includes(s)) colors = theme.colors.semantic.warning;
      else if (['low'].includes(s)) colors = theme.colors.semantic.info;
  } else if (variant === 'success') {
      colors = theme.colors.semantic.success;
  } else if (variant === 'warning') {
      colors = theme.colors.semantic.warning;
  } else if (variant === 'danger') {
      colors = theme.colors.semantic.danger;
  } else if (variant === 'info') {
      colors = theme.colors.semantic.info;
  } else {
      // General Status
      if (['approved', 'active', 'completed', 'paid', 'met', 'resolved', 'success'].includes(s)) colors = theme.colors.semantic.success;
      else if (['pending', 'in progress', 'open', 'conditional', 'draft', 'review'].includes(s)) colors = theme.colors.semantic.warning;
      else if (['rejected', 'critical', 'blocked', 'failed', 'not met', 'blacklisted', 'error'].includes(s)) colors = theme.colors.semantic.danger;
      else if (['closed', 'archived', 'inactive'].includes(s)) colors = theme.colors.semantic.neutral;
      else if (['issued', 'sent'].includes(s)) colors = theme.colors.semantic.info;
  }

  return (
    <span className={`${theme.components.badge.base} ${colors.bg} ${colors.text} ${colors.border} ${className}`}>
      {status}
    </span>
  );
};
