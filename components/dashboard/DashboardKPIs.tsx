
import React, { Suspense } from 'react';
import { TrendingUp, TrendingDown, AlertOctagon, DollarSign } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  summary: any;
}

export const DashboardKPIs: React.FC<Props> = ({ summary }) => {
  const theme = useTheme();
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
      <StatCard title="Total Portfolio Value" value={formatCompactCurrency(summary.totalBudget)} subtext={`Across ${summary.totalProjects} components`} icon={DollarSign} />
      <StatCard title="Budget Utilization" value={`${summary.budgetUtilization.toFixed(1)}%`} subtext="Actuals + Commitments" icon={TrendingUp} trend="up" />
      <StatCard title="Critical Issues" value={summary.totalCriticalIssues} subtext="Requires attention" icon={AlertOctagon} trend={summary.totalCriticalIssues > 0 ? 'down' : "up"} />
      <StatCard title="Schedule Health" value={`SPI ${summary.portfolioSpi.toFixed(2)}`} subtext={`${Math.abs(1 - summary.portfolioSpi) * 100 > 1 ? `${(Math.abs(1 - summary.portfolioSpi) * 100).toFixed(0)}% ${summary.portfolioSpi < 1 ? 'behind' : 'ahead'}` : 'On track'}`} icon={summary.portfolioSpi < 1 ? TrendingDown : TrendingUp} trend={summary.portfolioSpi < 1 ? "down" : "up"} />
    </div>
  );
};
