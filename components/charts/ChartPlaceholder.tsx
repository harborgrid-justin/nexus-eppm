import React from 'react';
import { BarChart2 } from 'lucide-react';

interface ChartPlaceholderProps {
  title?: string;
  height?: number;
  message?: string;
}

export const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ 
  title, 
  height = 300,
  message = "Advanced visualization temporarily disabled." 
}) => {
  return (
    <div className="w-full flex flex-col items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-6" style={{ height }}>
      <BarChart2 size={32} className="text-slate-300 mb-2" />
      {title && <h4 className="font-bold text-slate-500 mb-1">{title}</h4>}
      <p className="text-xs text-slate-400 text-center max-w-xs">{message}</p>
    </div>
  );
};