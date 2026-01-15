
import React, { useMemo } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Flag, RefreshCw, FileCheck, UserCheck, CheckCircle, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { EmptyGrid } from '../common/EmptyGrid';
import { useData } from '../../context/DataContext';

interface ProgramClosureProps {
  programId: string;
}

const ProgramClosure: React.FC<ProgramClosureProps> = ({ programId }) => {
  const { transitionItems, program } = useProgramData(programId);
  const { state } = useData();
  const theme = useTheme();

  const sustainmentPeriod = useMemo(() => {
      if (!program || !program.endDate) return "TBD";
      const endDate = new Date(program.endDate);
      if (isNaN(endDate.getTime())) return "DATE_UNRESOLVED";
      const endYear = endDate.getFullYear();
      return `FY${endYear + 1} - FY${endYear + 3}`;
  }, [program]);

  // Dynamically map signatories to enterprise governance roles
  const signatories = useMemo(() => {
      const roles = state.governanceRoles.filter(r => r.programId === programId || r.authorityLevel === 'High');
      return roles.map(r => ({
          label: `${r.role} Acceptance`,
          status: 'Pending',
          owner: r.assigneeId
      }));
  }, [state.governanceRoles, programId]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-10 animate-in fade-in duration-500 scrollbar-thin`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-nexus-900 text-white rounded-2xl shadow-xl border border-slate-700 shrink-0"><Flag size={24}/></div>
                <div>
                    <h2 className={`text-2xl font-black ${theme.colors.text.primary} tracking-tighter uppercase`}>Termination & Sustainment Handover</h2>
                    <p className={`text-sm ${theme.colors.text.secondary} font-medium mt-1 uppercase tracking-tight`}>Administrative closure protocol and asset transition governance.</p>
                </div>
            </div>
            <div className="flex gap-3">
                 <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-nexus-600 shadow-sm transition-all active:scale-95">Print Closure Report</button>
            </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            <div className="lg:col-span-2">
                <div className={`${theme.colors.surface} rounded-[2.5rem] border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col h-full bg-white`}>
                    <div className={`p-6 border-b ${theme.colors.border} bg-slate-50/50 flex justify-between items-center`}>
                        <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] flex items-center gap-3">
                            <RefreshCw size={16} className="text-orange-500"/> Readiness Checklist (Operational Transfer)
                        </h3>
                        <button className="text-[9px] font-black text-nexus-600 uppercase tracking-widest hover:underline">+ Add readiness task</button>
                    </div>
                    <div className="flex-1 overflow-auto scrollbar-thin min-h-[400px]">
                        {transitionItems.length > 0 ? (
                            <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                                <thead className="bg-white sticky top-0 z-10 border-b">
                                    <tr>
                                        <th className={theme.components.table.header + " pl-8 py-5"}>Domain</th>
                                        <th className={theme.components.table.header}>Handover Logic</th>
                                        <th className={theme.components.table.header}>Asset Principal</th>
                                        <th className={theme.components.table.header}>Maturity Date</th>
                                        <th className={theme.components.table.header + " text-right pr-8"}>Integrity</th>
                                    </tr>
                                </thead>
                                <tbody className={`bg-white divide-y divide-slate-50`}>
                                    {transitionItems.map(item => (
                                        <tr key={item.id} className="nexus-table-row transition-all group">
                                            <td className="px-6 py-5 pl-8">
                                                <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 shadow-inner">{item.category}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className={`text-sm font-black text-slate-800 group-hover:text-nexus-700 transition-colors uppercase tracking-tight`}>{item.description}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-[11px] font-black text-slate-600 uppercase tracking-tight">
                                                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-white text-[10px] font-black shadow-md">{item.ownerId.charAt(0)}</div>
                                                    {item.ownerId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 font-mono text-[11px] font-black text-slate-400 uppercase tracking-tighter">{item.dueDate}</td>
                                            <td className="px-6 py-5 text-right pr-8">
                                                <Badge variant={item.status === 'Complete' ? 'success' : item.status === 'In Progress' ? 'warning' : 'neutral'}>
                                                    {item.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    {[...Array(2)].map((_, i) => (
                                        <tr key={`pad-${i}`} className="nexus-empty-pattern opacity-10 h-16">
                                            <td colSpan={10}></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-full flex flex-col justify-center">
                                <EmptyGrid 
                                    title="Transition Registry Empty"
                                    description="No operational handover tasks identified in the strategic plan. Formal transition planning is required for sustainable benefit realization."
                                    icon={FileCheck}
                                    actionLabel="Define Readiness Items"
                                    onAdd={() => {}}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className={`${theme.colors.surface} p-8 rounded-[2.5rem] border ${theme.colors.border} shadow-sm flex flex-col bg-white`}>
                    <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-[0.2em] mb-10 flex items-center gap-3 border-b border-slate-50 pb-5">
                        <UserCheck size={18} className="text-nexus-600"/> Authorization Hierarchy
                    </h3>
                    <div className="space-y-6 flex-1">
                        {signatories.map((g) => (
                            <div key={g.label} className="flex justify-between items-start text-sm group animate-nexus-in">
                                <div className="min-w-0 flex-1 pr-6">
                                    <span className="text-slate-800 font-black uppercase text-[11px] block truncate tracking-tight group-hover:text-nexus-700 transition-colors">{g.label}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-0.5 block">Auth: {g.owner}</span>
                                </div>
                                <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl border shadow-sm transition-all cursor-pointer ${
                                    g.status === 'Complete' ? 'bg-green-50 text-green-700 border-green-200' : 
                                    g.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                    'bg-white text-slate-300 border-slate-100 hover:border-slate-300 group-hover:text-slate-500'
                                }`}>{g.status}</span>
                            </div>
                        ))}
                        {signatories.length === 0 && (
                            <div className="p-10 text-center text-slate-400 nexus-empty-pattern border-2 border-dashed border-slate-100 rounded-[2rem]">
                                <ShieldAlert size={32} className="mx-auto mb-4 opacity-20"/>
                                <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">No governance authorities identified for closure.</p>
                                <button className="mt-4 text-[9px] font-black text-nexus-600 uppercase hover:underline">+ Assign Role</button>
                            </div>
                        )}
                    </div>
                    <div className="mt-10 pt-8 border-t border-slate-50">
                         <button className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black shadow-2xl transition-all active:scale-95 border border-white/10">Execute Global Closure Request</button>
                    </div>
                </div>

                <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 p-32 bg-nexus-500/10 rounded-full blur-[100px] -mr-16 -mt-16 pointer-events-none group-hover:bg-nexus-500/20 transition-all"></div>
                    <div className="relative z-10">
                        <h3 className={`font-black text-[9px] uppercase tracking-[0.3em] mb-10 flex items-center gap-3 text-nexus-400`}>
                             <CheckCircle size={16} /> Asset Sustainment Strategy
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium uppercase tracking-tight mb-10 opacity-70">
                            Authorized post-program benefit realization ownership period and lifecycle maintenance parameters.
                        </p>
                        <div className="space-y-8">
                            <div className="group/item">
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1.5 group-hover/item:text-nexus-400 transition-colors">Lifecycle Custodian</p>
                                <p className="text-base font-black text-white uppercase tracking-tight group-hover/item:translate-x-1 transition-transform">DIRECTOR OF ENTERPRISE OPS</p>
                            </div>
                            <div className="group/item">
                                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1.5 group-hover/item:text-nexus-400 transition-colors">Measurement Horizon</p>
                                <p className="text-xl font-black font-mono tracking-tight text-green-400 group-hover/item:translate-x-1 transition-transform">{sustainmentPeriod}</p>
                            </div>
                        </div>
                    </div>
                    <Flag size={240} className="absolute -right-24 -bottom-24 opacity-5 text-white pointer-events-none rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProgramClosure;
