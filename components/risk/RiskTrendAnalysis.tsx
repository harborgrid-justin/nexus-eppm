import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const RiskTrendAnalysis: React.FC = () => {
  const theme = useTheme();
  const data = [
      { month: 'Jan', exposure: 120000 },
      { month: 'Feb', exposure: 115000 },
      { month: 'Mar', exposure: 98000 },
      { month: 'Apr', exposure: 85000 },
      { month: 'May', exposure: 92000 },
      { month: 'Jun', exposure: 78000 },
  ];

  return (
    <div className={`${theme.components.card} ${theme.layout.cardPadding} h-64 flex flex-col`}>
        <h3 className={`${theme.typography.h3} mb-4 flex items-center gap-2`}>
            <TrendingDown size={18} className="text-blue-500"/> Exposure Burndown (EMV)
        </h3>
        <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip contentStyle={theme.charts.tooltip} />
                    <Area type="monotone" dataKey="exposure" stroke={theme.charts.palette[0]} fill={theme.colors.semantic.info.bg} strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};