
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
  const displayStatus = (status === null || status === undefined) ? 'UNSET' : String(status);
  const s = displayStatus.toLowerCase();
  
  if (customColorClass) return <span className={`inline-flex items-center px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all ${customColorClass} ${className}`}>{displayStatus}</span>;

  let style: React.CSSProperties = {
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-textSecondary)',
      borderColor: 'var(--color-border)',
  };

  // Map to new Semantic Tokens
  if (['active', 'open', 'in progress', 'running', 'good', 'healthy', 'on track', 'approved', 'pass', 'valid', 'issued', 'released', 'solvent'].includes(s)) {
      style = { backgroundColor: 'var(--status-active)', color: '#fff', borderColor: 'transparent' };
  } else if (['warning', 'at risk', 'behind', 'pending', 'review', 'in review', 'submitted', 'conditional', 'probationary'].includes(s)) {
      style = { backgroundColor: 'var(--status-review)', color: '#fff', borderColor: 'transparent' };
  } else if (['critical', 'poor', 'off track', 'non-compliant', 'rejected', 'failed', 'error', 'down', 'insolvent', 'blocked', 'blacklisted', 'high'].includes(s)) {
      style = { backgroundColor: 'var(--priority-critical)', color: '#fff', borderColor: 'transparent' };
  } else if (['closed', 'completed', 'archived', 'resolved', 'final'].includes(s)) {
      style = { backgroundColor: 'var(--status-completed)', color: '#fff', borderColor: 'transparent' };
  } else if (['info', 'new', 'allocation', 'planned', 'draft'].includes(s)) {
      style = { backgroundColor: 'var(--status-planned)', color: '#fff', borderColor: 'transparent' };
  } else if (['medium'].includes(s)) {
      style = { backgroundColor: 'var(--priority-medium)', color: '#fff', borderColor: 'transparent' };
  } else if (['low'].includes(s)) {
      style = { backgroundColor: 'var(--priority-low)', color: '#fff', borderColor: 'transparent' };
  }

  return (
    <span 
        className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm transition-all ${className}`}
        style={style}
    >
      {displayStatus}
    </span>
  );
};

export const StatusBadge = React.memo(StatusBadgeComponent);
