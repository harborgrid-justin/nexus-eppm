
import React from 'react';
import { TrendingUp, TrendingDown, AlertOctagon, DollarSign, PieChart, Activity } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  summary: {
      totalBudget: number;
      budgetUtilization: number;
      totalCriticalIssues: number;
      portfolioSpi: number;
      totalProjects: number;
  };
}

export const DashboardKPIs: React.FC<Props> = ({ summary }) => {
  const theme = useTheme();
  const isHealthy = summary.portfolioSpi >= 0.95;
  const spiVariance = Math.abs(1 - summary.portfolioSpi) * 100;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap} animate-nexus-in`}>
      <StatCard 
        title="Portfolio CapEx Basis" 
        value={formatCompactCurrency(summary.totalBudget)} 
        subtext={`Authorized for ${summary.totalProjects} components`} 
        icon={DollarSign} 
      />
      <StatCard 
        title="Budget Utilization" 
        value={`${summary.budgetUtilization.toFixed(1)}%`} 
        subtext="Consolidated fiscal burn" 
        icon={TrendingUp} 
        trend={summary.budgetUtilization > 90 ? 'down' : 'up'} 
      />
      <StatCard 
        title="Governance Alerts" 
        value={summary.totalCriticalIssues} 
        subtext="Active blocker escalations" 
        icon={AlertOctagon} 
        trend={summary.totalCriticalIssues > 0 ? 'down' : "up"} 
      />
      <StatCard 
        title="Integrated SPI" 
        value={`0${summary.portfolioSpi.toFixed(2)}`} 
        subtext={`${spiVariance.toFixed(0)}% ${isHealthy ? 'Ahead' : 'Drift'}`} 
        icon={isHealthy ? Activity : TrendingDown} 
        trend={isHealthy ? "up" : "down"} 
      />
    </div>
  );
};
