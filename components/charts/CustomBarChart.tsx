
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface CustomBarChartProps {
  data: any[];
  xAxisKey: string;
  dataKey: string;
  height?: number;
  barColor?: string;
  className?: string;
  formatTooltip?: (val: number) => string;
}

export const CustomBarChart: React.FC<CustomBarChartProps> = ({ 
  data, 
  xAxisKey, 
  dataKey, 
  height = 300, 
  barColor,
  className = '',
  formatTooltip
}) => {
  const theme = useTheme();
  const effectiveBarColor = barColor || theme.charts.palette[0];

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => Number(d[dataKey]) || 0));
  // Add 10% buffer to top
  const domainMax = maxValue * 1.1; 

  return (
    <div className={`w-full flex flex-col ${className}`} style={{ height: height }}>
      {/* Chart Area */}
      <div className={`flex-1 flex items-end justify-between gap-2 relative border-b ${theme.colors.border.replace('border-', 'border-b-')} pb-2`}>
        {/* Y-Axis Guidelines (Simplified) */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
            <div className={`border-t border-dashed ${theme.colors.border} w-full h-0`}></div>
            <div className={`border-t border-dashed ${theme.colors.border} w-full h-0`}></div>
            <div className={`border-t border-dashed ${theme.colors.border} w-full h-0`}></div>
            <div className={`border-t border-dashed ${theme.colors.border} w-full h-0`}></div>
        </div>

        {data.map((item, index) => {
          const value = Number(item[dataKey]) || 0;
          const percentage = domainMax > 0 ? (value / domainMax) * 100 : 0;
          
          return (
            <div key={index} className="flex-1 h-full flex flex-col justify-end group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                {item[xAxisKey]}: {formatTooltip ? formatTooltip(value) : value}
                {/* Little triangle */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
              </div>

              {/* Bar */}
              <div 
                className="w-full rounded-t-md transition-all duration-500 ease-out hover:opacity-80"
                style={{ 
                  height: `${percentage}%`, 
                  backgroundColor: effectiveBarColor 
                }}
              ></div>
            </div>
          );
        })}
      </div>
      
      {/* X-Axis Labels */}
      <div className="flex justify-between gap-2 mt-2 h-6">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center text-[10px] text-slate-500 font-medium truncate">
            {item[xAxisKey]}
          </div>
        ))}
      </div>
    </div>
  );
};
