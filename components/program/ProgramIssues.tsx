
import React from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { AlertOctagon, ArrowUpRight, Folder, Shield, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';

interface ProgramIssuesProps {
  programId: string;
}

const ProgramIssues: React.FC<ProgramIssuesProps> = ({ programId }) => {
  const { programIssues, projects } = useProgramData(programId);
  const theme = useTheme();

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <AlertOctagon className="text-red-500" size={24}/>
            <h2 className={theme.typography.h2}>Program Issues & Escalations</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Issue List */}
            <div className="lg:col-span-2 space-y-4">
                {programIssues.map(issue => (
                    <div key={issue.id} className={`${theme.colors.surface} p-5 rounded-xl border-l-4 shadow-sm ${
                        issue.priority === 'Critical' ? 'border-l-red-500' : 'border-l-yellow-500'
                    } border-y border-r border-slate-200`}>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">{issue.title}</h3>
                                <p className="text-xs text-slate-500 font-mono mt-1">{issue.id} • Owner: {issue.owner}</p>
                            </div>
                            <Badge variant={issue.status === 'Escalated' ? 'danger' : 'warning'}>{issue.status}</Badge>
                        </div>
                        
                        <p className="text-slate-700 text-sm mb-4">{issue.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Shield size={16}/> <strong>Resolution:</strong> {issue.resolutionPath}
                            </div>
                        </div>

                        {/* Impacted Projects */}
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Blocking Projects:</p>
                            <div className="flex flex-wrap gap-2">
                                {issue.impactedProjectIds.map(pid => {
                                    const proj = projects.find(p => p.id === pid);
                                    return (
                                        <div key={pid} className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 border border-red-100 rounded-md text-sm">
                                            <Folder size={14}/> {proj?.name || pid}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Governance Sidebar */}
            <div className="space-y-6">
                <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm`}>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ArrowUpRight size={18} className="text-nexus-600"/> Escalation Path
                    </h3>
                    <div className="relative pl-4 border-l-2 border-slate-200 space-y-6">
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                            <h4 className="text-sm font-bold text-slate-700">Project Manager</h4>
                            <p className="text-xs text-slate-500">Initial logging & local resolution attempt.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                            <h4 className="text-sm font-bold text-blue-700">Program Manager</h4>
                            <p className="text-xs text-slate-500">Cross-project conflict resolution.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                            <h4 className="text-sm font-bold text-red-700">Steering Committee</h4>
                            <p className="text-xs text-slate-500">Critical scope/budget/timeline decisions.</p>
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
                    <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2"><CheckCircle size={16}/> Resolved This Month</h4>
                    <ul className="list-disc list-inside text-sm text-green-800 space-y-1">
                        <li>Vendor License Dispute</li>
                        <li>Q3 Budget Shortfall</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProgramIssues;
