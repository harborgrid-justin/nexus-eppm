
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
  
  let barColor = colorClass || 'bg-nexus-600'; 
  
  if (!colorClass && thresholds) {
    if (percentage > 100) barColor = theme.colors.semantic.danger.solid; 
    else if (percentage > 90) barColor = theme.colors.semantic.danger.solid; 
    else if (percentage > 75) barColor = theme.colors.semantic.warning.solid;
    else barColor = theme.colors.semantic.success.solid;
  }

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2.5';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className={`flex justify-between text-xs font-bold ${theme.colors.text.secondary} mb-1.5 px-0.5`}>
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

export const ProgressBar = React.memo(ProgressBarComponent);
