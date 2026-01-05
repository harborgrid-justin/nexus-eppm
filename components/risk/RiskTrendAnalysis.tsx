
import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingDown, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { formatCompactCurrency } from '../../utils/formatters';

export const RiskTrendAnalysis: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();

  const data = useMemo(() => {
      // Build cumulative exposure trend based on dateIdentified
      const risksWithDate = state.risks
        .filter(r => r.dateIdentified && r.emv)
        .map(r => ({ ...r, date: new Date(r.dateIdentified!) }))
        .sort((a,b) => a.date.getTime() - b.date.getTime());

      if (risksWithDate.length === 0) return [];

      let cumulativeExposure = 0;
      return risksWithDate.map(r => {
          cumulativeExposure += (r.emv || 0);
          return {
              date: r.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
              exposure: cumulativeExposure,
              name: r.description
          };
      });
  }, [state.risks]);

  return (
    <div className={`${theme.components.card} ${theme.layout.cardPadding} h-64 flex flex-col`}>
        <h3 className={`${theme.typography.h3} mb-4 flex items-center gap-2`}>
            <TrendingDown size={18} className="text-blue-500"/> Cumulative Risk Exposure (EMV)
        </h3>
        <div className="flex-1 min-h-0">
            {data.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                        <XAxis dataKey="date" tick={{fontSize: 10, fill: theme.colors.text.secondary}} />
                        <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{fontSize: 10, fill: theme.colors.text.secondary}} />
                        <Tooltip 
                            contentStyle={theme.charts.tooltip} 
                            formatter={(val: number) => formatCompactCurrency(val)}
                        />
                        <Area type="monotone" dataKey="exposure" stroke={theme.charts.palette[0]} fill={theme.colors.semantic.info.bg} strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className={`flex h-full flex-col items-center justify-center ${theme.colors.text.tertiary} text-xs`}>
                    <AlertCircle size={24} className="mb-2 opacity-50"/>
                    <p>Insufficient historical data to plot trend.</p>
                </div>
            )}
        </div>
    </div>
  );
};
