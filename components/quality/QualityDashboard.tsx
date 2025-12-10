import React from 'react';
import { ShieldCheck, Bug, CheckCircle, BarChart, AlertTriangle } from 'lucide-react';
import { useProjectState } from '../../hooks/useProjectState';
import StatCard from '../shared/StatCard';

interface QualityDashboardProps {
  qualityProfile: ReturnType<typeof useProjectState>['qualityProfile'];
}

const QualityDashboard: React.FC<QualityDashboardProps> = ({ qualityProfile }) => {
  if (!qualityProfile) return <div className="p-4">Loading quality data...</div>;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Overall Quality Score" value={`${qualityProfile.passRate.toFixed(1)}%`} icon={ShieldCheck} trend="up" />
            <StatCard title="Open Non-Conformances" value={5} icon={AlertTriangle} trend="down" />
            <StatCard title="Total Inspections" value={qualityProfile.totalReports} icon={CheckCircle} />
            <StatCard title="Open Defects" value={12} icon={Bug} trend="down" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Defect Analysis by Category (Pareto)</h3>
                <div className="h-64 flex items-center justify-center text-slate-400">
                    <BarChart size={48} className="opacity-50" />
                    <p className="ml-4">Pareto Chart Component Scaffold</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Inspection Pass/Fail Trend</h3>
                 <div className="h-64 flex items-center justify-center text-slate-400">
                    <BarChart size={48} className="opacity-50" />
                    <p className="ml-4">Trend Chart Component Scaffold</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default QualityDashboard;