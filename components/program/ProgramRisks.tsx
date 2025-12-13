
import React, { useMemo } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { useData } from '../../context/DataContext';
import { ShieldAlert, TrendingUp, AlertOctagon, Layers } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';

interface ProgramRisksProps {
  programId: string;
}

const ProgramRisks: React.FC<ProgramRisksProps> = ({ programId }) => {
  const { programRisks, projects } = useProgramData(programId);
  const { state } = useData();
  const theme = useTheme();

  // Aggregate project risks
  const escalatedRisks = useMemo(() => {
      const allRisks = state.risks.filter(r => projects.some(p => p.id === r.projectId));
      return allRisks.filter(r => r.score >= 15); // High severity threshold
  }, [state.risks, projects]);

  const totalExposure = useMemo(() => {
      return programRisks.reduce((acc, r) => acc + r.score, 0) + escalatedRisks.reduce((acc, r) => acc + r.score, 0);
  }, [programRisks, escalatedRisks]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Program Risk Management</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Systemic Risks" value={programRisks.length} subtext="Program-level threats" icon={Layers} />
            <StatCard title="Escalated Risks" value={escalatedRisks.length} subtext="High impact from projects" icon={AlertOctagon} trend="down" />
            <StatCard title="Total Exposure" value={totalExposure} subtext="Aggregated risk score" icon={TrendingUp} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Program Risk Register */}
            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-slate-800">Program Risk Register (Systemic)</h3>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase w-1/2">Risk</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Score</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {programRisks.map(risk => (
                                <tr key={risk.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                        {risk.description}
                                        <div className="text-xs text-slate-500 mt-1">Mitigation: {risk.mitigationPlan}</div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{risk.category}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-block w-8 text-center rounded font-bold text-white text-xs py-0.5 ${risk.score >= 12 ? 'bg-red-500' : 'bg-yellow-500'}`}>
                                            {risk.score}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3"><Badge variant="neutral">{risk.status}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Escalated Project Risks */}
            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className="p-4 border-b border-slate-200 bg-red-50">
                    <h3 className="font-bold text-red-900">Escalated Project Risks</h3>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Project</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase w-1/2">Risk Description</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {escalatedRisks.map(risk => {
                                const proj = projects.find(p => p.id === risk.projectId);
                                return (
                                    <tr key={risk.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 text-sm text-slate-600">{proj?.name || risk.projectId}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{risk.description}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-block w-8 text-center rounded font-bold text-white text-xs py-0.5 bg-red-600">
                                                {risk.score}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {escalatedRisks.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-4 py-8 text-center text-slate-500 italic">No escalated risks at this time.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProgramRisks;
