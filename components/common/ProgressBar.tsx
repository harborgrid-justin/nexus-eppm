import React from 'react';

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
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  let barColor = colorClass || 'bg-primary'; 
  
  if (!colorClass && thresholds) {
    if (percentage > 100) barColor = 'bg-error'; 
    else if (percentage > 90) barColor = 'bg-red-500'; 
    else if (percentage > 75) barColor = 'bg-warning';
    else barColor = 'bg-success';
  }

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2.5';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs font-bold text-text-secondary mb-1.5 px-0.5">
          <span>Progress</span>
          <span className="text-text-primary">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-background rounded-full overflow-hidden border border-border shadow-inner ${heightClass}`}>
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