
import React, { useState, useMemo } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Gavel, FileText, Plus, Edit2, Trash2, ShieldCheck, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';
import { GovernanceDecisionForm } from './GovernanceDecisionForm';
import { GovernanceDecision } from '../../types';
import { useData } from '../../context/DataContext';

const PortfolioGovernance: React.FC = () => {
  const { governanceDecisions } = usePortfolioData();
  const { state, dispatch } = useData();
  const theme = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDecision, setEditingDecision] = useState<GovernanceDecision | null>(null);

  const authorities = useMemo(() => {
    const roles = state.governanceRoles.map(r => r.role);
    const eps = state.eps.map(e => e.name);
    return Array.from(new Set(['Governance Board', 'Investment Committee', 'Steering Group', ...roles, ...eps]));
  }, [state.governanceRoles, state.eps]);

  const handleEdit = (decision: GovernanceDecision) => {
    setEditingDecision(decision);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Permanently delete this governance record? Baseline audit trails will be impacted.")) {
        dispatch({ type: 'GOVERNANCE_DELETE_DECISION', payload: id });
    }
  };

  const handleCreate = () => {
      setEditingDecision(null);
      setIsFormOpen(true);
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-2">
            <div>
                <h2 className={theme.typography.h2}>Enterprise Governance Board</h2>
                <p className={theme.typography.small}>Authoritative registry of investment decisions and strategic pivots.</p>
            </div>
            <Button size="md" icon={Plus} onClick={handleCreate} className="shadow-lg shadow-nexus-500/10">Log Board Action</Button>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            {/* Authority Matrix Sidebar */}
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-[2rem] border ${theme.colors.border} shadow-sm space-y-6 flex flex-col`}>
                <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest flex items-center gap-2 border-b pb-4">
                    <ShieldCheck size={16} className="text-nexus-600" /> Active Decision Matrix
                </h3>
                <div className="space-y-4 flex-1">
                    {state.governanceRoles.length > 0 ? state.governanceRoles.map(role => (
                        <div key={role.id} className={`p-4 ${theme.colors.background} rounded-2xl border ${theme.colors.border} hover:border-nexus-200 transition-all cursor-default group`}>
                            <h4 className="font-black text-slate-900 text-sm uppercase tracking-tight group-hover:text-nexus-700 transition-colors">{role.role}</h4>
                            <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{role.responsibilities}</p>
                            <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100">
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Authority: {role.authorityLevel}</span>
                                <Badge variant="info" className="scale-75 origin-right">{role.assigneeId}</Badge>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-slate-400 italic bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            No governance roles defined in System Administration.
                        </div>
                    )}
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl text-white relative overflow-hidden shadow-xl">
                    <h4 className="font-bold flex items-center gap-2 mb-2 text-xs">
                        <Info size={14} className="text-nexus-400"/> Regulatory Note
                    </h4>
                    <p className="text-[9px] text-slate-400 leading-relaxed uppercase tracking-tight">
                        Decisions logged here are immutable and linked to the global project baseline for audit compliance.
                    </p>
                </div>
            </div>

            {/* Decisions Log */}
            <div className={`lg:col-span-2 ${theme.colors.surface} rounded-[2rem] border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col min-h-[500px]`}>
                <div className={`p-6 border-b ${theme.colors.border} bg-slate-50/50 flex justify-between items-center`}>
                    <h3 className="font-black text-slate-800 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                        <FileText size={18} className="text-nexus-500"/> Authority Record Ledger
                    </h3>
                    <div className="text-right">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Actions: {governanceDecisions.length}</span>
                    </div>
                </div>
                <div className="flex-1 overflow-auto scrollbar-thin">
                    {governanceDecisions.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <EmptyGrid 
                                title="Decision Registry Null"
                                description="The board has not recorded any formal decisions for the current portfolio period. Governance oversight is required to secure the baseline."
                                icon={Gavel}
                                actionLabel="Record Board Action"
                                onAdd={handleCreate}
                            />
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                            <thead className="bg-white sticky top-0 z-10 shadow-sm">
                                <tr>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Decision Narrative</th>
                                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Acting Authority</th>
                                    <th className="px-6 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-slate-50 ${theme.colors.surface}`}>
                                {governanceDecisions.map(d => (
                                    <tr key={d.id} className={`nexus-table-row transition-all group`}>
                                        <td className="px-8 py-4 text-xs font-mono text-slate-400 font-black">{d.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{d.title}</div>
                                            <div className="text-[10px] text-slate-500 mt-1 line-clamp-1 italic font-medium">"{d.notes}"</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black uppercase text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200 shadow-sm">{d.authorityId}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant={
                                                d.decision === 'Approved' ? 'success' : 
                                                d.decision === 'Rejected' ? 'danger' : 'warning'
                                            }>
                                                {d.decision}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(d)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-nexus-600 transition-all border border-transparent hover:border-slate-200">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(d.id)} className="p-2 hover:bg-red-50 rounded-xl text-slate-500 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
        {isFormOpen && (
            <GovernanceDecisionForm 
                isOpen={isFormOpen} 
                onClose={() => setIsFormOpen(false)} 
                decision={editingDecision}
            />
        )}
    </div>
  );
};

export default PortfolioGovernance;
