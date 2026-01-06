
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
    <div className="w-full flex flex-col items-center justify-center bg-background border-2 border-dashed border-border rounded-lg p-6" style={{ height }}>
      <BarChart2 size={32} className="text-text-tertiary mb-2" />
      {title && <h4 className="font-bold text-text-secondary mb-1">{title}</h4>}
      <p className="text-xs text-text-secondary text-center max-w-xs">{message}</p>
    </div>
  );
};
