
import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

export const RiskTrendAnalysis: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();

  const data = useMemo(() => {
      // Simulate historical trend from current risk set
      const totalExposure = state.risks.reduce((sum, r) => sum + (r.emv || 0), 0);
      
      return [
          { month: 'Jan', exposure: totalExposure * 1.2 },
          { month: 'Feb', exposure: totalExposure * 1.15 },
          { month: 'Mar', exposure: totalExposure * 1.1 },
          { month: 'Apr', exposure: totalExposure * 0.95 },
          { month: 'May', exposure: totalExposure * 1.05 },
          { month: 'Jun', exposure: totalExposure }, // Current
      ];
  }, [state.risks]);

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
