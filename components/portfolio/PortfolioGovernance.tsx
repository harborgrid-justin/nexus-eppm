
import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Gavel, FileText, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';
import { GovernanceDecisionForm } from './GovernanceDecisionForm';

const PortfolioGovernance: React.FC = () => {
  const { governanceDecisions } = usePortfolioData();
  const theme = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <Gavel className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Governance Board</h2>
            </div>
            <Button size="sm" icon={Plus} onClick={() => setIsFormOpen(true)}>Log Decision</Button>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            {/* Authority Matrix Sidebar */}
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm space-y-6`}>
                <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Authority Matrix</h3>
                <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                        <h4 className="font-bold text-blue-900 text-sm">Investment Committee</h4>
                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">Approves new investments > $1M. Meets Quarterly for strategic alignment review.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-800 text-sm">Steering Group</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">Program-level scope changes and high-impact risks. Meets Monthly.</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-800 text-sm">Change Control Board</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">Technical & Budget variance > 10% from baseline. Meets Weekly.</p>
                    </div>
                </div>
            </div>

            {/* Decisions Log */}
            <div className={`lg:col-span-2 ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col min-h-[300px]`}>
                <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.background} flex justify-between items-center`}>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2 text-[10px] uppercase tracking-widest"><FileText size={18} className="text-nexus-500"/> Decision Registry</h3>
                </div>
                <div className="flex-1 overflow-auto">
                    {governanceDecisions.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <EmptyGrid 
                                title="No Governance Records"
                                description="The board has not recorded any formal decisions for the current portfolio period."
                                icon={Gavel}
                                actionLabel="Log First Decision"
                                onAdd={() => setIsFormOpen(true)}
                            />
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className={theme.colors.surface}>
                                <tr>
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Decision Item</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Authority</th>
                                    <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Outcome</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')} ${theme.colors.surface}`}>
                                {governanceDecisions.map(d => (
                                    <tr key={d.id} className={`hover:${theme.colors.background} transition-colors`}>
                                        <td className="px-6 py-4 text-sm font-mono text-slate-600 font-bold">{d.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900">{d.title}</div>
                                            <div className="text-xs text-slate-500 mt-0.5 line-clamp-1 italic">"{d.notes}"</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-tight">{d.authorityId}</td>
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
                    )}
                </div>
            </div>
        </div>
        <GovernanceDecisionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};

export default PortfolioGovernance;
