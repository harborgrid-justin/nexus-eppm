
import React from 'react';
import { GanttChartSquare, DollarSign, AlertTriangle, ShieldCheck, AlertOctagon, Anchor, Zap } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency, formatPercentage } from '../../utils/formatters';

interface IntegrationDashboardViewProps {
  summary: any;
  financials: any;
  riskProfile: any;
  qualityProfile: any;
  phase2Metrics: any;
}

export const IntegrationDashboardView: React.FC<IntegrationDashboardViewProps> = ({ 
  summary, financials, riskProfile, qualityProfile, phase2Metrics 
}) => (
  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard title="Overall Progress" value={formatPercentage(summary.overallProgress)} subtext={`${summary.completedTasks} / ${summary.totalTasks} tasks`} icon={GanttChartSquare} />
      <StatCard title="Budget Variance" value={formatCompactCurrency(financials.variance)} subtext="Current working delta" icon={DollarSign} trend={financials.variance >= 0 ? 'up' : 'down'} />
      <StatCard title="Open Risks" value={riskProfile.openRisks} subtext={`${riskProfile.highImpactRisks} critical threats`} icon={AlertTriangle} />
      <StatCard title="Quality Pass Rate" value={formatPercentage(qualityProfile.passRate)} subtext="Last 30 days avg" icon={ShieldCheck} trend={qualityProfile.passRate >= 95 ? 'up' : undefined} />
    </div>
  </div>
);
