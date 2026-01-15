
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
    if (percentage > 100) barColor = 'bg-red-600'; 
    else if (percentage > 90) barColor = 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]'; 
    else if (percentage > 75) barColor = 'bg-amber-500';
    else barColor = 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]';
  }

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-4' : 'h-2.5';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className={`flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1.5 px-0.5`}>
          <span>Aggregation</span>
          <span className="text-slate-900 font-mono">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner ${heightClass}`}>
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
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
