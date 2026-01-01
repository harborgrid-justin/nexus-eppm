
import React from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Gavel, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';

const PortfolioGovernance: React.FC = () => {
  const { governanceDecisions } = usePortfolioData();
  const theme = useTheme();

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Gavel className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Governance Board</h2>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            {/* Authority Matrix Sidebar */}
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm space-y-6`}>
                <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Authority Matrix</h3>
                <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-blue-900 text-sm">Investment Committee</h4>
                        <p className="text-xs text-blue-700 mt-1">Approves new investments > $1M. Meets Quarterly.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-800 text-sm">Steering Group</h4>
                        <p className="text-xs text-slate-600 mt-1">Program-level scope changes & risks. Meets Monthly.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-800 text-sm">Change Control Board</h4>
                        <p className="text-xs text-slate-600 mt-1">Technical & Budget variance > 10%. Meets Weekly.</p>
                    </div>
                </div>
            </div>

            {/* Decisions Log */}
            <div className={`lg:col-span-2 ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.background} flex justify-between items-center`}>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={18} className="text-nexus-500"/> Decision Registry</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className={theme.colors.surface}>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Decision Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Authority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Outcome</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')} ${theme.colors.surface}`}>
                            {governanceDecisions.map(d => (
                                <tr key={d.id} className={`hover:${theme.colors.background}`}>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{d.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-900">{d.title}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{d.notes}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{d.authorityId}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={
                                            d.decision === 'Approved' ? 'success' : 
                                            d.decision === 'Rejected' ? 'danger' : 'warning'
                                        }>
                                            {d.decision}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PortfolioGovernance;
