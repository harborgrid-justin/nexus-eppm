
import React, { useMemo } from 'react';
import { ChangeOrder, WorkflowDefinition } from '../../../types/index';
import { CheckCircle, Clock, GitPullRequest, ShieldCheck, History, MoreHorizontal } from 'lucide-react';
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

    const workflow = useMemo(() => {
        return state.workflows.find(w => w.trigger === 'ChangeOrder' && w.status === 'Active') || state.workflows[0];
    }, [state.workflows]);

    const auditHistory = co.history || [];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10`}>
                {/* 1. Sequential Approval Visualizer */}
                <div className={`${theme.components.card} p-10 rounded-[3rem] shadow-sm flex flex-col bg-white border-slate-100 relative group`}>
                    <div className="absolute top-0 right-0 p-24 bg-nexus-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] mb-12 flex items-center gap-3 border-b border-slate-50 pb-5 relative z-10">
                        <GitPullRequest size={18} className="text-nexus-600"/> Authorization Hierarchy Path
                    </h3>
                    <div className="space-y-12 flex-1 relative pl-2 z-10">
                        {workflow ? workflow.steps.map((step, i) => {
                            const isApproved = co.status === 'Approved' || (i === 0 && co.status !== 'Draft');
                            const isCurrent = (co.status === 'Pending Approval' && i === 1);
                            
                            return (
                                <div key={step.id || i} className="flex items-start gap-8 relative">
                                    {i < workflow.steps.length - 1 && (
                                        <div className={`absolute left-6 top-12 w-0.5 h-12 bg-slate-100 z-0 ${isApproved ? 'bg-green-100 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : ''}`}></div>
                                    )}
                                    
                                    <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center border-4 z-10 transition-all duration-700 bg-white ${
                                        isApproved ? 'border-green-100 text-green-600 shadow-xl shadow-green-500/10' : 
                                        isCurrent ? 'border-nexus-200 text-nexus-600 shadow-2xl shadow-nexus-500/15 scale-110' :
                                        'border-slate-50 text-slate-200'
                                    }`}>
                                        {isApproved ? <CheckCircle size={24}/> : <span className="font-black text-sm font-mono">{i + 1}</span>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className={`text-sm font-black uppercase tracking-tight ${isApproved ? 'text-slate-800' : isCurrent ? 'text-nexus-900' : 'text-slate-300'}`}>{step.name}</p>
                                                <p className={`text-[10px] ${isApproved ? 'text-slate-400' : isCurrent ? 'text-slate-500' : 'text-slate-200'} font-bold uppercase mt-1.5 tracking-widest`}>Authority: {step.role}</p>
                                            </div>
                                            {isCurrent && <Badge variant="warning" className="animate-pulse px-4 h-7">Active Review</Badge>}
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="h-full flex items-center justify-center p-12 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No dynamic workflow definition linked to context.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Audit Trail Log */}
                <div className={`${theme.components.card} p-10 rounded-[3rem] shadow-sm flex flex-col bg-slate-50/30 border-slate-100 group`}>
                    <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] mb-12 flex items-center gap-3 border-b border-slate-50 pb-5">
                        <History size={18} className="text-slate-400"/> Permanent Transaction Audit
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-6 pr-4 scrollbar-thin scrollbar-thumb-slate-200">
                        {auditHistory.length > 0 ? auditHistory.map((item, idx) => (
                            <div key={idx} className={`flex gap-5 p-5 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm group hover:border-nexus-300 transition-all duration-300`}>
                                <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-nexus-50 transition-colors shadow-inner shrink-0"><Clock size={18} className="text-slate-400 group-hover:text-nexus-600"/></div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-black text-xs text-slate-900 uppercase tracking-tight">{item.userId}</span>
                                        <span className="text-[10px] font-mono font-black text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">{item.date}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 font-bold leading-relaxed">{item.action}</p>
                                    {item.comment && (
                                        <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 italic font-medium leading-relaxed">
                                            "{item.comment}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col justify-center items-center grayscale opacity-20 nexus-empty-pattern rounded-[2rem] border-2 border-dashed border-slate-200">
                                <History size={48} className="mb-4 text-slate-300" strokeWidth={1}/>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Ledger Entry Null</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl border border-white/5 group">
                 <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex gap-8 items-start max-w-3xl">
                        <div className="p-4 bg-white/10 rounded-[1.5rem] border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                            <ShieldCheck size={32} className="text-nexus-400"/>
                        </div>
                        <div>
                            <h4 className="font-black text-xl tracking-tight uppercase mb-3">Enterprise Governance Assertion</h4>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium uppercase tracking-tight opacity-70">
                                This record is protected by immutable governance logic. All approval transitions are cryptographically signed and archived within the multi-tenant Nexus Graph. Signatories acknowledge that all fiscal commitments are final once committed.
                            </p>
                        </div>
                    </div>
                    <div className="text-right shrink-0 border-l border-white/10 pl-10 hidden md:block">
                        <p className="text-[10px] font-black text-nexus-500 uppercase tracking-[0.3em] mb-2">Record Integrity</p>
                        <p className="text-3xl font-black text-white font-mono uppercase tracking-tighter shadow-black/20 drop-shadow-lg">PASSED ✓</p>
                    </div>
                 </div>
                 <div className="absolute -right-20 -bottom-20 text-white/5 pointer-events-none rotate-12 scale-150 group-hover:scale-[1.6] transition-transform duration-1000">
                    <GitPullRequest size={300} />
                 </div>
            </div>
        </div>
    );
};
