
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ProgressBarProps {
  value: number;
  max?: number;
  thresholds?: boolean; 
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  colorClass?: string; 
}

const ProgressBarComponent: React.FC<ProgressBarProps> = ({ 
  value, 
  max = 100, 
  thresholds = false, 
  showLabel = false, 
  size = 'md',
  className = '',
  colorClass
}) => {
  const theme = useTheme();
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  let barColor = 'var(--color-primary)'; 
  
  if (colorClass) {
      // If a utility class is passed, we let it override via className logic below, but we set a default ref
      // However, to support tokens we prefer inline styles if not a class
      if (colorClass.startsWith('bg-')) {
          // It's a tailwind class, handled by className append usually, but here we need to be careful
          // For this refactor, we stick to inline styles for token usage
      } 
  } else if (thresholds) {
    if (percentage > 100) barColor = 'var(--priority-critical)'; 
    else if (percentage > 90) barColor = 'var(--priority-high)'; 
    else if (percentage > 75) barColor = 'var(--priority-medium)';
    else barColor = 'var(--status-active)';
  }

  const height = size === 'sm' ? '6px' : size === 'lg' ? '16px' : '10px';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className={`flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5 px-0.5`}>
            <span>Aggregation</span>
            <span className="text-slate-900 font-mono">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner`} style={{ height }}>
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass || ''}`}
          style={{ 
              width: `${percentage}%`,
              backgroundColor: !colorClass ? barColor : undefined
          }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        ></div>
      </div>
    </div>
  );
};

export const ProgressBar = React.memo(ProgressBarComponent);
