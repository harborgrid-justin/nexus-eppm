import React from 'react';

interface CustomLineChartProps {
  data: any[];
  xAxisKey: string;
  dataKeys: { key: string; color: string }[];
  height?: number;
}

export const CustomLineChart: React.FC<CustomLineChartProps> = ({ 
  data, 
  xAxisKey, 
  dataKeys, 
  height = 300 
}) => {
  if (!data || data.length === 0) return null;

  const allValues = data.flatMap(d => dataKeys.map(k => Number(d[k.key]) || 0));
  const maxValue = Math.max(...allValues) * 1.1 || 100;
  const padding = 20;

  const getPoints = (key: string) => {
    return data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((Number(d[key]) || 0) / maxValue) * 100;
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="w-full flex flex-col" style={{ height }}>
      <div className="flex-1 relative border-l border-b border-slate-200 ml-6 mb-6">
        {/* Y-Axis Labels */}
        <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-[10px] text-slate-400">
            <span>{Math.round(maxValue)}</span>
            <span>{Math.round(maxValue / 2)}</span>
            <span>0</span>
        </div>

        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="0" y1="0" x2="100" y2="0" stroke="#f1f5f9" strokeWidth="0.5" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#f1f5f9" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="100" y2="100" stroke="#f1f5f9" strokeWidth="0.5" />

            {dataKeys.map((dk, i) => (
                <polyline
                    key={dk.key}
                    fill="none"
                    stroke={dk.color}
                    strokeWidth="2"
                    points={getPoints(dk.key)}
                    vectorEffect="non-scaling-stroke"
                />
            ))}
        </svg>
        
        {/* X-Axis Labels */}
        <div className="absolute top-full left-0 right-0 flex justify-between mt-2">
            {data.map((d, i) => (
                <span key={i} className="text-[10px] text-slate-400 -translate-x-1/2" style={{ left: `${(i / (data.length - 1)) * 100}%` }}>
                    {d[xAxisKey]}
                </span>
            ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-2">
          {dataKeys.map(dk => (
              <div key={dk.key} className="flex items-center gap-1 text-xs text-slate-600">
                  <div className="w-3 h-1" style={{ backgroundColor: dk.color }}></div>
                  {dk.key}
              </div>
          ))}
      </div>
    </div>
  );
};