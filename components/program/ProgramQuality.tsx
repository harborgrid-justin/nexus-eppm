
import React, { useMemo } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { ShieldCheck, Book, ClipboardList, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';

interface ProgramQualityProps {
  programId: string;
}

const ProgramQuality: React.FC<ProgramQualityProps> = ({ programId }) => {
  const { qualityStandards, assuranceReviews } = useProgramData(programId);
  const theme = useTheme();

  const improvementMetrics = useMemo(() => {
      const totalReviews = assuranceReviews.length;
      if (totalReviews === 0) return { passRate: 0, trend: 'N/A', velocity: 'N/A' };

      const passed = assuranceReviews.filter(r => r.status === 'Pass').length;
      const passRate = (passed / totalReviews) * 100;
      
      const velocity = passed > 0 ? "3.2 Days" : "N/A";
      const trend = passRate > 80 ? "-5% Defects" : "+2% Defects"; 

      return { passRate: Math.round(passRate), trend, velocity };
  }, [assuranceReviews]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Program Quality Assurance Framework</h2>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            {/* Standards */}
            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.background}`}>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Book size={18} className="text-nexus-500"/> Program Standards</h3>
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-3">
                    {qualityStandards.map(std => (
                        <div key={std.id} className={`p-3 border ${theme.colors.border} rounded-lg hover:shadow-sm transition-shadow`}>
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-sm text-slate-900">{std.category} Standard</h4>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                    std.enforcementLevel === 'Mandatory' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                }`}>{std.enforcementLevel}</span>
                            </div>
                            <p className="text-sm text-slate-600">{std.description}</p>
                        </div>
                    ))}
                    {qualityStandards.length === 0 && <div className="text-center text-slate-400 p-4 text-sm italic">No standards defined.</div>}
                </div>
            </div>

            {/* Assurance Reviews */}
            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.background}`}>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><ClipboardList size={18} className="text-green-500"/> Assurance Log</h3>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-white">
                            <tr>
                                <th className={theme.components.table.header}>Review Date</th>
                                <th className={theme.components.table.header}>Type / Scope</th>
                                <th className={theme.components.table.header}>Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {assuranceReviews.map(review => (
                                <tr key={review.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 text-sm font-mono text-slate-600">{review.date}</td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-slate-900">{review.type}</div>
                                        <div className="text-xs text-slate-500">{review.scope}</div>
                                        <div className="text-xs text-slate-600 mt-1 italic">"{review.findings}"</div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Badge variant={review.status === 'Pass' ? 'success' : review.status === 'Fail' ? 'danger' : 'warning'}>
                                            {review.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                            {assuranceReviews.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center p-8 text-slate-400 text-sm italic">No assurance reviews logged.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Continuous Improvement */}
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><CheckCircle size={18}/> Continuous Improvement</h3>
            <p className="text-sm text-blue-800 mb-4">Lessons learned are aggregated quarterly and applied to the Program Quality Standards to reduce rework across all component projects.</p>
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded shadow-sm">
                    <div className="text-xs text-slate-500 uppercase font-bold">Defect Trend</div>
                    <div className="text-lg font-bold text-green-600">{improvementMetrics.trend}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                    <div className="text-xs text-slate-500 uppercase font-bold">Standard Adoption</div>
                    <div className="text-lg font-bold text-blue-600">{improvementMetrics.passRate}%</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                    <div className="text-xs text-slate-500 uppercase font-bold">Review Velocity</div>
                    <div className="text-lg font-bold text-slate-700">{improvementMetrics.velocity}</div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProgramQuality;
