
import React, { useMemo } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Flag, RefreshCw, FileCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { EmptyGrid } from '../common/EmptyGrid';

interface ProgramClosureProps {
  programId: string;
}

const ProgramClosure: React.FC<ProgramClosureProps> = ({ programId }) => {
  const { transitionItems, program } = useProgramData(programId);
  const theme = useTheme();

  const sustainmentPeriod = useMemo(() => {
      if (!program) return "TBD";
      const endDate = new Date(program.endDate);
      const endYear = endDate.getFullYear();
      return `FY${endYear + 1} - FY${endYear + 3}`;
  }, [program]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Flag className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Transition & Sustainment Planning</h2>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            {/* Operational Readiness */}
            <div className="lg:col-span-2">
                <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col h-full`}>
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2"><RefreshCw size={18} className="text-orange-500"/> Operational Readiness Checklist</h3>
                    </div>
                    {transitionItems.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-white">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Action Item</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Owner ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Due Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {transitionItems.map(item => (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm font-bold text-slate-700">{item.category}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{item.description}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{item.ownerId}</td>
                                            <td className="px-6 py-4 text-sm font-mono text-slate-500">{item.dueDate}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant={item.status === 'Complete' ? 'success' : item.status === 'In Progress' ? 'warning' : 'neutral'}>
                                                    {item.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6 h-full">
                            <EmptyGrid 
                                title="No Transition Items"
                                description="Define operational handover tasks."
                                icon={Flag}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Governance Sign-off */}
            <div className="space-y-6">
                <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm`}>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FileCheck size={18} className="text-nexus-600"/> Closure Governance</h3>
                    <ul className="space-y-3">
                        {[
                            { label: 'Benefit Owner Acceptance', status: 'Pending' },
                            { label: 'Financial Reconciliation', status: 'In Progress' },
                            { label: 'Lessons Learned Archive', status: 'Complete' },
                            { label: 'Steering Committee Sign-off', status: 'Not Started' }
                        ].map((g) => (
                            <li key={g.label} className="flex justify-between items-center text-sm">
                                <span className="text-slate-700">{g.label}</span>
                                <span className={`text-xs font-bold ${
                                    g.status === 'Complete' ? 'text-green-600' : 
                                    g.status === 'In Progress' ? 'text-yellow-600' : 'text-slate-400'
                                }`}>{g.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-6 bg-slate-800 text-white rounded-xl shadow-md">
                    <h3 className="font-bold mb-2">Sustainment Plan</h3>
                    <p className="text-xs text-slate-300 mb-4">Post-program value realization ownership.</p>
                    <div className="text-sm font-medium">
                        <p className="mb-1 text-slate-400 text-xs uppercase">Benefit Owner</p>
                        <p className="mb-3">Director of Operations</p>
                        <p className="mb-1 text-slate-400 text-xs uppercase">Measurement Period</p>
                        <p>{sustainmentPeriod}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProgramClosure;
