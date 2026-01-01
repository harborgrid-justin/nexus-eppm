import React from 'react';
import { useResourcePlanning } from '../../hooks/useResourcePlanning';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ResourceUtilizationTrend: React.FC = () => {
  const { utilizationTrend } = useResourcePlanning();
  const theme = useTheme();

  return (
    <div className={`${theme.components.card} ${theme.layout.cardPadding} h-full flex flex-col`}>
        <h3 className={`${theme.typography.h3} mb-6 flex items-center gap-2`}>
            <Activity size={18} className="text-green-600"/> Utilization Trend (6 Mo)
        </h3>
        <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={utilizationTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                    <XAxis dataKey="month" />
                    <YAxis unit="%" domain={[0, 100]} />
                    <Tooltip contentStyle={theme.charts.tooltip} />
                    <Area type="monotone" dataKey="util" stroke={theme.charts.palette[1]} fill={theme.colors.semantic.success.bg} strokeWidth={2} name="Avg Utilization" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};