
import React from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Gavel, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';

const PortfolioGovernance: React.FC = () => {
  const { governanceDecisions } = usePortfolioData();
  const theme = useTheme();

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Gavel className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Governance Board</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Authority Matrix Sidebar */}
            <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm space-y-6`}>
                <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Authority Matrix</h3>
                <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="font-bold text-blue-900 text-sm">Investment Committee</h4>
                        <p className="text-xs text-blue-700 mt-1">Approves new investments {'>'} $1M. Meets Quarterly.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-900 text-sm">Steering Group</h4>
                        <p className="text-xs text-slate-600 mt-1">Approves scope changes {'>'} 10%. Meets Monthly.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-900 text-sm">Architecture Board</h4>
                        <p className="text-xs text-slate-600 mt-1">Technical standards compliance. Ad-hoc.</p>
                    </div>
                </div>
            </div>

            {/* Decision Log */}
            <div className="lg:col-span-2">
                <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><FileText size={18} className="text-nexus-500"/> Decision Log</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Decision Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Authority</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {governanceDecisions.map(dec => (
                                    <tr key={dec.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900">{dec.title}</div>
                                            <div className="text-xs text-slate-500 mt-1">{dec.notes}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{dec.authority}</td>
                                        <td className="px-6 py-4 text-sm font-mono text-slate-500">{dec.date}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={
                                                dec.decision === 'Approved' ? 'success' : 
                                                dec.decision === 'Rejected' ? 'danger' : 
                                                dec.decision === 'Deferred' ? 'warning' : 'neutral'
                                            }>{dec.decision}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PortfolioGovernance;
