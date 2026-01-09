
import React from 'react';
import StatCard from '../../shared/StatCard';
import { DollarSign, TrendingUp, Layers, ShieldAlert } from 'lucide-react';
import { formatCompactCurrency } from '../../../utils/formatters';
import { useTheme } from '../../../context/ThemeContext';

interface ProgramPortfolioStatsProps {
    metrics: { totalBudget: number; totalSpent: number; activeCount: number; criticalCount: number };
    programCount: number;
}

export const ProgramPortfolioStats: React.FC<ProgramPortfolioStatsProps> = ({ metrics, programCount }) => {
    const theme = useTheme();
    return (
        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard 
                title="Total Investment" 
                value={formatCompactCurrency(metrics.totalBudget)} 
                icon={DollarSign} 
                subtext={`${programCount} Programs`}
            />
            <StatCard 
                title="Portfolio Burn" 
                value={formatCompactCurrency(metrics.totalSpent)} 
                icon={TrendingUp} 
                subtext={`${metrics.totalBudget > 0 ? ((metrics.totalSpent/metrics.totalBudget)*100).toFixed(1) : 0}% Consumed`}
            />
            <StatCard 
                title="Active Programs" 
                value={metrics.activeCount} 
                icon={Layers} 
            />
            <StatCard 
                title="Critical Health" 
                value={metrics.criticalCount} 
                icon={ShieldAlert} 
                trend={metrics.criticalCount > 0 ? 'down' : 'up'}
            />
        </div>
    );
};
