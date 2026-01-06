
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
       <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div><p className="text-[10px] font-bold text-slate-400 uppercase">Scope Creep</p><p className="text-xl font-bold">{phase2Metrics.scopeCreep.toFixed(1)}%</p></div>
          <div className="p-2 bg-orange-50 rounded-xl text-orange-500"><AlertOctagon size={22} /></div>
       </div>
       <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div><p className="text-[10px] font-bold text-slate-400 uppercase">Risk EMV</p><p className="text-xl font-bold">{formatCompactCurrency(riskProfile.exposure)}</p></div>
          <div className="p-2 bg-red-50 rounded-xl text-red-500"><ShieldCheck size={22} /></div>
       </div>
       <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div><p className="text-[10px] font-bold text-slate-400 uppercase">Solvency</p><p className="text-xl font-bold">{financials.solvency}</p></div>
          <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><Anchor size={22} /></div>
       </div>
       <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div><p className="text-[10px] font-bold text-slate-400 uppercase">SPI</p><p className="text-xl font-bold">{financials.evm.spi.toFixed(2)}</p></div>
          <div className="p-2 bg-purple-50 rounded-xl text-purple-500"><Zap size={22} /></div>
       </div>
    </div>
  </div>
);
