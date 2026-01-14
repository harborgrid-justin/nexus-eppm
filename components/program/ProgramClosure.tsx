import React, { useMemo } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Flag, RefreshCw, FileCheck, CheckCircle, UserCheck } from 'lucide-react';
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
      if (!program) return "TBD";
      const endDate = new Date(program.endDate);
      if (isNaN(endDate.getTime())) return "PROJECTED END NOT SET";
      const endYear = endDate.getFullYear();
      return `FY${endYear + 1} - FY${endYear + 3}`;
  }, [program]);

  // Derive signatory status from governance roles
  const signatories = useMemo(() => {
      const roles = state.governanceRoles.filter(r => r.programId === programId || !r.programId);
      return roles.map(r => ({
          label: `${r.role} Acceptance`,
          status: 'Pending',
          owner: r.assigneeId
      }));
  }, [state.governanceRoles, programId]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300 scrollbar-thin`}>
        <div className="flex items-center gap-2 mb-2">
            <Flag className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Transition & Sustainment Planning</h2>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            {/* Operational Readiness */}
            <div className="lg:col-span-2">
                <div className={`${theme.colors.surface} rounded-[2rem] border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col h-full`}>
                    <div className={`p-6 border-b ${theme.colors.border} bg-slate-50/50 flex justify-between items-center`}>
                        <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2">
                            <RefreshCw size={16} className="text-orange-500"/> Operational Readiness Checklist
                        </h3>
                    </div>
                    <div className="flex-1 overflow-auto">
                        {transitionItems.length > 0 ? (
                            <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                                <thead className="bg-white sticky top-0 z-10 border-b">
                                    <tr>
                                        <th className={theme.components.table.header + " pl-8"}>Classification</th>
                                        <th className={theme.components.table.header}>Action Item</th>
                                        <th className={theme.components.table.header}>Post-Closure Owner</th>
                                        <th className={theme.components.table.header}>Target Date</th>
                                        <th className={theme.components.table.header + " text-center pr-8"}>Status</th>
                                    </tr>
                                </thead>
                                <tbody className={`bg-white divide-y divide-slate-50`}>
                                    {transitionItems.map(item => (
                                        <tr key={item.id} className="nexus-table-row group">
                                            <td className="px-6 py-4 pl-8">
                                                <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">{item.category}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className={`text-sm font-bold text-slate-800 group-hover:text-nexus-700 transition-colors`}>{item.description}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px]">{item.ownerId.charAt(0)}</div>
                                                    {item.ownerId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-[11px] font-black text-slate-400">{item.dueDate}</td>
                                            <td className="px-6 py-4 text-center pr-8">
                                                <Badge variant={item.status === 'Complete' ? 'success' : item.status === 'In Progress' ? 'warning' : 'neutral'}>
                                                    {item.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 h-full flex flex-col justify-center">
                                <EmptyGrid 
                                    title="Transition Ledger Neutral"
                                    description="No operational handover tasks have been identified. Formal transition planning is required for benefit sustainment."
                                    icon={Flag}
                                    actionLabel="Define Readiness Items"
                                    onAdd={() => {}}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Governance Sign-off */}
            <div className="space-y-6">
                <div className={`${theme.colors.surface} p-8 rounded-[2rem] border ${theme.colors.border} shadow-sm flex flex-col`}>
                    <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-8 flex items-center gap-2 border-b pb-4">
                        <UserCheck size={18} className="text-nexus-600"/> Governance Sign-off
                    </h3>
                    <div className="space-y-5 flex-1">
                        {signatories.map((g) => (
                            <div key={g.label} className="flex justify-between items-start text-sm group">
                                <div>
                                    <span className="text-slate-700 font-bold block">{g.label}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Owner: {g.owner}</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border transition-all ${
                                    g.status === 'Complete' ? 'bg-green-50 text-green-700 border-green-200' : 
                                    g.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                    'bg-slate-50 text-slate-400 border-slate-200 group-hover:border-slate-300'
                                }`}>{g.status}</span>
                            </div>
                        ))}
                        {signatories.length === 0 && (
                            <p className="text-xs text-slate-400 italic text-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                                No governance roles identified for program closure authorization.
                            </p>
                        )}
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-50">
                         <button className="w-full py-3 bg-nexus-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-nexus-700 shadow-lg shadow-nexus-500/20 active:scale-95 transition-all">Initiate Closure Request</button>
                    </div>
                </div>

                <div className="p-8 bg-slate-900 text-white rounded-[2rem] shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <h3 className="font-black text-[10px] uppercase tracking-widest text-nexus-400 mb-6 flex items-center gap-2">
                             <FileCheck size={16} /> Sustainment Strategy
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium uppercase tracking-tight mb-8">
                            Post-program benefit realization ownership period.
                        </p>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Benefit Owner</p>
                                <p className="text-base font-bold group-hover:text-nexus-400 transition-colors">DIRECTOR OF OPERATIONS</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Measurement Lifecycle</p>
                                <p className="text-lg font-black font-mono tracking-tight">{sustainmentPeriod}</p>
                            </div>
                        </div>
                    </div>
                    <Flag size={200} className="absolute -right-16 -bottom-16 opacity-5 text-white pointer-events-none group-hover:scale-110 transition-transform duration-700 rotate-12" />
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProgramClosure;