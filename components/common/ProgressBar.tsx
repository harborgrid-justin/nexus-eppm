import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  thresholds?: boolean; // If true, changes color based on value (Green > Yellow > Red) or custom logic
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  colorClass?: string; // Override color
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
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  let barColor = 'bg-nexus-600';
  
  if (colorClass) {
    barColor = colorClass;
  } else if (thresholds) {
    // Default threshold logic: High usage = Red (e.g. Budget/Capacity)
    if (percentage > 100) barColor = 'bg-red-600';
    else if (percentage > 90) barColor = 'bg-red-500';
    else if (percentage > 75) barColor = 'bg-yellow-500';
    else barColor = 'bg-green-500';
  }

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1">
          <span className="font-medium text-slate-700">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass}`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
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
