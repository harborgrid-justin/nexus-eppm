
import React from 'react';
import StatCard from '../../shared/StatCard';
import { DollarSign, Layers, ShieldAlert, Activity } from 'lucide-react';
import { formatCompactCurrency } from '../../../utils/formatters';
import { useTheme } from '../../../context/ThemeContext';

interface ProgramPortfolioStatsProps {
    metrics: { totalBudget: number; totalSpent: number; activeCount: number; criticalCount: number };
    programCount: number;
}

export const ProgramPortfolioStats: React.FC<ProgramPortfolioStatsProps> = ({ metrics, programCount }) => {
    const theme = useTheme();
    const utilization = metrics.totalBudget > 0 ? (metrics.totalSpent / metrics.totalBudget) * 100 : 0;
    
    return (
        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap} animate-nexus-in`}>
            <StatCard 
                title="Fiscal Allotment" 
                value={formatCompactCurrency(metrics.totalBudget)} 
                icon={DollarSign} 
                subtext={`Authorized for ${programCount} Programs`}
            />
            <StatCard 
                title="Consolidated Burn" 
                value={`${utilization.toFixed(1)}%`} 
                icon={Activity} 
                trend={utilization > 90 ? 'down' : 'up'}
                subtext={`Spent: ${formatCompactCurrency(metrics.totalSpent)}`}
            />
            <StatCard 
                title="Operational Nodes" 
                value={metrics.activeCount} 
                icon={Layers} 
                subtext="Active execution streams"
            />
            <StatCard 
                title="Strategic Drift" 
                value={metrics.criticalCount} 
                icon={ShieldAlert} 
                trend={metrics.criticalCount > 0 ? 'down' : 'up'}
                subtext="Variance alerts detected"
            />
        </div>
    );
};
