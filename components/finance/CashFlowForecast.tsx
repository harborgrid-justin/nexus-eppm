
import React from 'react';
import { Project } from '../../types/index';
import { useFinancials } from '../../hooks/useFinancials';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatCompactCurrency } from '../../utils/formatters';

interface CashFlowForecastProps {
  project: Project;
}

const CashFlowForecast: React.FC<CashFlowForecastProps> = ({ project }) => {
  const metrics = useFinancials(project);
  const theme = useTheme();

  if (!metrics) return null;

  return (
    <div className={`${theme.components.card} ${theme.layout.cardPadding} flex flex-col ${theme.density === 'compact' ? 'h-64' : 'h-96'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`${theme.typography.h3} flex items-center gap-2`}>
          <TrendingUp size={20} className="text-nexus-600" /> Cash Flow Projection
        </h3>
        <div className={`${theme.typography.small} ${theme.colors.background} px-3 py-1 rounded-full border ${theme.colors.border}`}>
            Avg Burn: {formatCompactCurrency(metrics.burnRate)}/mo
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.cashFlowForecast}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(val: number) => formatCompactCurrency(val)} contentStyle={theme.charts.tooltip} />
            <Legend />
            <Bar dataKey="committed" stackId="a" fill="#94a3b8" name="Committed" />
            <Bar dataKey="projectedSpend" stackId="a" fill={theme.charts.palette[0]} name="Forecast Spend" />
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CashFlowForecast;
