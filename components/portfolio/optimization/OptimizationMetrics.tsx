
import React, { useMemo } from 'react';
import StatCard from '../../shared/StatCard';
import { Project, Program, PortfolioScenario } from '../../../types';
import { Target, TrendingUp, AlertTriangle, Layers } from 'lucide-react';
import { formatCompactCurrency, formatPercentage } from '../../../utils/formatters';

interface OptimizationMetricsProps {
    projects: Project[];
    programs: Program[];
    scenarios: PortfolioScenario[];
}

export const OptimizationMetrics: React.FC<OptimizationMetricsProps> = ({ projects, programs, scenarios }) => {
    const metrics = useMemo(() => {
        const allComponents = [...projects, ...programs];
        const totalBudget = allComponents.reduce((sum, p) => sum + p.budget, 0);
        
        // Calculate dynamic ROI based on financial value score (1-10 scale mapped to 0-40% range for realism)
        const avgFinValue = allComponents.length > 0 
            ? allComponents.reduce((sum, p) => sum + p.financialValue, 0) / allComponents.length 
            : 0;
        const dynamicROI = avgFinValue * 4; 

        const totalRisk = allComponents.reduce((sum, p) => sum + p.riskScore, 0);
        const scenarioCount = scenarios.length;

        return {
            portfolioValue: totalBudget * 1.2, // Projected Net Value usually includes a multiplier for benefits
            roi: dynamicROI,
            risk: totalRisk,
            scenarios: scenarioCount
        };
    }, [projects, programs, scenarios]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard 
                title="Portfolio Value" 
                value={formatCompactCurrency(metrics.portfolioValue)} 
                icon={Target} 
                subtext="Projected Net Value" 
            />
            <StatCard 
                title="Avg ROI" 
                value={formatPercentage(metrics.roi, 1)} 
                icon={TrendingUp} 
                trend={metrics.roi > 15 ? 'up' : undefined} 
                subtext="Based on Value Scores"
            />
            <StatCard 
                title="Risk Exposure" 
                value={metrics.risk} 
                icon={AlertTriangle} 
                trend={metrics.risk > 50 ? 'down' : 'up'} 
                subtext="Aggregated Risk Heat"
            />
            <StatCard 
                title="Scenarios" 
                value={`${metrics.scenarios} Active`} 
                icon={Layers} 
                subtext="Modeling Sandboxes"
            />
        </div>
    );
};
