import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface CustomPieChartProps {
  data: { name: string; value: number; color?: string }[];
  height?: number;
}

export const CustomPieChart: React.FC<CustomPieChartProps> = ({ data, height = 300 }) => {
  const theme = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400" style={{ height }}>
        <p className="text-xs">No data to display</p>
      </div>
    );
  }
  
  let cumulativeAngle = 0;

  // SVG Config
  const size = 100;
  const radius = 50;
  const center = 50;

  const slices = data.map((slice, index) => {
    const startAngle = cumulativeAngle;
    const fraction = slice.value / total;
    cumulativeAngle += fraction;
    const endAngle = cumulativeAngle;

    // Convert angles to coordinates (0 is at 3 o'clock, go clockwise)
    // We rotate -90deg in SVG transform to start at 12 o'clock
    const startX = center + radius * Math.cos(2 * Math.PI * startAngle);
    const startY = center + radius * Math.sin(2 * Math.PI * startAngle);
    const endX = center + radius * Math.cos(2 * Math.PI * endAngle);
    const endY = center + radius * Math.sin(2 * Math.PI * endAngle);

    // SVG Path Command
    const largeArcFlag = fraction > 0.5 ? 1 : 0;
    const pathData = [
      `M ${center} ${center}`, // Move to center
      `L ${startX} ${startY}`, // Line to start
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc to end
      `Z` // Close path
    ].join(' ');

    const sliceColor = slice.color || theme.charts.palette[index % theme.charts.palette.length];

    return {
      ...slice,
      pathData,
      fraction,
      color: sliceColor
    };
  });

  return (
    <div className="flex flex-col items-center justify-center" style={{ height }}>
      <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full max-w-[250px] max-h-[250px] -rotate-90">
          {slices.map((slice, i) => (
            <path
              key={i}
              d={slice.pathData}
              fill={slice.color}
              className="hover:opacity-90 transition-opacity cursor-pointer"
            >
              <title>{`${slice.name}: ${slice.value} (${(slice.fraction * 100).toFixed(1)}%)`}</title>
            </path>
          ))}
          {/* Inner Circle for Donut Effect */}
          <circle cx="50" cy="50" r="35" fill="white" />
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {slices.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-xs text-slate-600 font-medium">
              {item.name} <span className="text-slate-400">({item.value})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};