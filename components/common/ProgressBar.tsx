
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

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
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
  
  let barColor = theme.colors.primary; // Default to primary brand color
  
  if (colorClass) {
    barColor = colorClass;
  } else if (thresholds) {
    // Use semantic colors from theme
    if (percentage > 100) barColor = theme.colors.semantic.danger.bg.replace('bg-', 'bg-').replace('-50', '-600'); 
    else if (percentage > 90) barColor = 'bg-red-500'; 
    else if (percentage > 75) barColor = 'bg-amber-500';
    else barColor = 'bg-emerald-500';
  }

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2.5';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className={`flex justify-between ${theme.typography.label} mb-1.5 px-0.5`}>
          <span>Progress</span>
          <span className={theme.colors.text.primary}>{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full ${theme.colors.background} rounded-full overflow-hidden border ${theme.colors.border} shadow-inner ${heightClass}`}>
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out shadow-sm ${barColor}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        ></div>
      </div>
    </div>
  );
};
