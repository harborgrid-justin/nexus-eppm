
import React from 'react';
import { Activity, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  program: any;
  projectCount: number;
  spent: number;
  total: number;
  riskCount: number;
}

export const ProgramKPIs: React.FC<Props> = ({ program, projectCount, spent, total, riskCount }) => {
    const theme = useTheme();
    return (
        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap} mb-6`}>
            <StatCard title="Health" value={program.health} subtext={`${projectCount} Active Projects`} icon={Activity} trend={program.health === 'Good' ? 'up' : 'down'} />
            <StatCard title="Budget Consumed" value={formatCompactCurrency(spent)} subtext={`of ${formatCompactCurrency(total)}`} icon={DollarSign} />
            <StatCard title="Risk Exposure" value={riskCount} subtext="High Severity Risks" icon={AlertTriangle} trend={riskCount > 5 ? 'down' : 'up'} />
            <StatCard title="Portfolio Burn" value={`${((spent/total)*100).toFixed(1)}%`} subtext="Utilization Rate" icon={TrendingUp} trend="up" />
        </div>
    );
};
