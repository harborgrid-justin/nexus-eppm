
import React from 'react';
import { BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
  const theme = useTheme();
  return (
    <div className={`w-full flex flex-col items-center justify-center ${theme.colors.background} border-2 border-dashed ${theme.colors.border} rounded-lg p-6`} style={{ height }}>
      <BarChart2 size={32} className={`${theme.colors.text.tertiary} mb-2`} />
      {title && <h4 className={`font-bold ${theme.colors.text.secondary} mb-1`}>{title}</h4>}
      <p className={`text-xs ${theme.colors.text.secondary} text-center max-w-xs`}>{message}</p>
    </div>
  );
};
