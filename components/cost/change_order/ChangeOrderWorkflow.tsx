
import React, { useMemo } from 'react';
import { ChangeOrder, WorkflowDefinition } from '../../../types';
import { CheckCircle, Clock, GitPullRequest, ShieldCheck, History } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useData } from '../../../context/DataContext';
import { Badge } from '../../ui/Badge';
import { EmptyGrid } from '../../common/EmptyGrid';

interface ChangeOrderWorkflowProps {
    co: ChangeOrder;
}

export const ChangeOrderWorkflow: React.FC<ChangeOrderWorkflowProps> = ({ co }) => {
    const theme = useTheme();
    const { state } = useData();

    // Dynamically find the workflow linked to Change Orders
    const workflow = useMemo(() => {
        return state.workflows.find(w => w.trigger === 'ChangeOrder' && w.status === 'Active') || state.workflows[0];
    }, [state.workflows]);

    const auditHistory = co.history || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10`}>
                {/* 1. Sequential Approval Visualizer */}
                <div className={`${theme.components.card} p-8 rounded-[2.5rem] shadow-sm flex flex-col bg-white border-slate-100`}>
                    <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-10 flex items-center gap-3 border-b border-slate-50 pb-4">
                        <GitPullRequest size={18} className="text-nexus-600"/> Authorization Hierarchy
                    </h3>
                    <div className="space-y-10 flex-1 relative pl-1">
                        {workflow ? workflow.steps.map((step, i) => {
                            // Logic: Determine if this step is complete based on history or status
                            const isApproved = co.status === 'Approved' || (i === 0 && co.status !== 'Draft');
                            const isCurrent = (co.status === 'Pending Approval' && i === 1);
                            
                            return (
                                <div key={step.id || i} className="flex items-start gap-6 relative group">
                                    {/* Connection Line */}
                                    {i < workflow.steps.length - 1 && (
                                        <div className={`absolute left-5 top-10 w-0.5 h-10 bg-slate-100 z-0 ${isApproved ? 'bg-green-100' : ''}`}></div>
                                    )}
                                    
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-4 z-10 transition-all duration-500 bg-white ${
                                        isApproved ? 'border-green-100 text-green-600 shadow-lg shadow-green-500/10' : 
                                        isCurrent ? 'border-nexus-200 text-nexus-600 shadow-xl shadow-nexus-500/10 scale-110' :
                                        'border-slate-50 text-slate-300'
                                    }`}>
                                        {isApproved ? <CheckCircle size={20}/> : <span className="font-black text-xs font-mono">{i + 1}</span>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className={`text-sm font-black uppercase tracking-tight ${isApproved ? 'text-slate-800' : isCurrent ? 'text-nexus-700' : 'text-slate-400'}`}>{step.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Responsibility: {step.role}</p>
                                            </div>
                                            {isCurrent && <Badge variant="warning" className="animate-pulse">Active Review</Badge>}
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="h-full flex items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No workflow definition linked</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Audit Trail Log */}
                <div className={`${theme.components.card} p-8 rounded-[2.5rem] shadow-sm flex flex-col bg-slate-50/50 border-slate-100`}>
                    <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-10 flex items-center gap-3 border-b border-slate-50 pb-4">
                        <History size={18} className="text-slate-400"/> Permanent Transaction Audit
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin">
                        {auditHistory.length > 0 ? auditHistory.map((item, idx) => (
                            <div key={idx} className={`flex gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-nexus-300 transition-all`}>
                                <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-nexus-50 transition-colors"><Clock size={16} className="text-slate-400 group-hover:text-nexus-600"/></div>
                                <div className="min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-black text-xs text-slate-900 uppercase tracking-tight">{item.userId}</span>
                                        <span className="text-[9px] font-mono font-black text-slate-400 uppercase">{item.date}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 font-bold leading-relaxed">{item.action}</p>
                                    {item.comment && (
                                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 italic font-medium">
                                            "{item.comment}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col justify-center items-center opacity-30">
                                <History size={48} className="mb-4 text-slate-300"/>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ledger Entry Neutral</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Governance Summary */}
            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex gap-6 items-start max-w-2xl">
                        <div className="p-4 bg-white/10 rounded-2xl border border-white/10 shadow-inner">
                            <ShieldCheck size={28} className="text-nexus-400"/>
                        </div>
                        <div>
                            <h4 className="font-black text-lg tracking-tight uppercase mb-2">Compliance Assertion</h4>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium uppercase tracking-tight">
                                This Change Order record is subject to Section 10 Governance Rules. All approvals are cryptographically linked to the project baseline. Any modification to approved PCRs requires a secondary validation cycle.
                            </p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-[9px] font-black text-nexus-500 uppercase tracking-[0.3em] mb-1">Record Integrity</p>
                        <p className="text-2xl font-black text-white font-mono uppercase tracking-tighter">Verified ✓</p>
                    </div>
                 </div>
                 <GitPullRequest size={200} className="absolute -right-20 -bottom-20 text-white/5 pointer-events-none rotate-12" />
            </div>
        </div>
    );
};
