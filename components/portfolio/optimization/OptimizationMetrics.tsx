
import React from 'react';
import StatCard from '../../shared/StatCard';
import { Project } from '../../../types';
import { Target, TrendingUp, AlertTriangle, Layers } from 'lucide-react';
import { formatCompactCurrency } from '../../../utils/formatters';

interface OptimizationMetricsProps {
    projects: Project[];
}

export const OptimizationMetrics: React.FC<OptimizationMetricsProps> = ({ projects }) => {
    const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
    const avgROI = 18.5; // Mock
    const riskExposure = projects.reduce((sum, p) => sum + p.riskScore, 0);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Portfolio Value" value={formatCompactCurrency(totalBudget * 1.5)} icon={Target} subtext="Projected Net Value" />
            <StatCard title="Avg ROI" value={`${avgROI}%`} icon={TrendingUp} trend="up" />
            <StatCard title="Risk Exposure" value={riskExposure} icon={AlertTriangle} trend="down" />
            <StatCard title="Scenarios" value="3 Active" icon={Layers} />
        </div>
    );
};
