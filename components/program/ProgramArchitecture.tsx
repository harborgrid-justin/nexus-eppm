import React, { useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Server, ShieldCheck, Database, Layers, CheckCircle, Plus, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArchitectureStandardForm } from './ArchitectureStandardForm';
import { EmptyGrid } from '../common/EmptyGrid';

interface ProgramArchitectureProps {
  programId: string;
}

const ProgramArchitecture: React.FC<ProgramArchitectureProps> = ({ programId }) => {
  const { architectureStandards, architectureReviews } = useProgramData(programId);
  const theme = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300 scrollbar-thin`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-nexus-600 text-white rounded-2xl shadow-xl shadow-nexus-500/20"><Server size={24}/></div>
                <div>
                    <h2 className={theme.typography.h1}>Architecture & Technical Governance</h2>
                    <p className={theme.typography.small}>Standards registry, application topology, and technical review gates.</p>
                </div>
            </div>
            <div className={`flex bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm`}>
                <span className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">Baseline v2.4</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={`${theme.colors.surface} rounded-[2rem] border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col min-h-[400px]`}>
                <div className={`p-6 border-b ${theme.colors.border} bg-slate-50/50 flex justify-between items-center`}>
                    <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <Layers size={18} className="text-blue-500"/> Enterprise Technology Baseline
                    </h3>
                    <Button size="sm" variant="ghost" icon={Plus} onClick={() => setIsFormOpen(true)}>Establish Standard</Button>
                </div>
                <div className="flex-1 overflow-auto p-6 space-y-4 scrollbar-thin">
                    {architectureStandards.length > 0 ? architectureStandards.map(std => (
                        <div key={std.id} className={`p-5 border ${theme.colors.border} rounded-2xl bg-white hover:border-nexus-300 transition-all group cursor-default shadow-sm`}>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-nexus-600 group-hover:bg-nexus-50 transition-colors`}>
                                        {std.category === 'Security' ? <ShieldCheck size={16}/> : 
                                         std.category === 'Data' ? <Database size={16}/> :
                                         <Server size={16}/>}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-sm text-slate-800 uppercase tracking-tight">{std.title}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{std.category} Domain</p>
                                    </div>
                                </div>
                                <span className={`text-[9px] uppercase font-black px-2 py-1 rounded border shadow-sm ${
                                    std.status === 'Baseline' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}>{std.status}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">{std.description}</p>
                        </div>
                    )) : (
                        <div className="h-full flex flex-col justify-center">
                            <EmptyGrid 
                                title="Technology Ledger Neutral"
                                description="No architectural standards or application policies have been registered for this program."
                                icon={Settings}
                                actionLabel="Provision Standard"
                                onAdd={() => setIsFormOpen(true)}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className={`${theme.colors.surface} rounded-[2.5rem] border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col min-h-[400px]`}>
                <div className={`p-6 border-b ${theme.colors.border} bg-slate-50/50`}>
                    <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle size={18} className="text-purple-500"/> Technical Review Gates (TRG)
                    </h3>
                </div>
                <div className="flex-1 overflow-auto scrollbar-thin">
                    {architectureReviews.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                            <thead className="bg-white sticky top-0 z-10 shadow-sm border-b">
                                <tr>
                                    <th className={theme.components.table.header + " pl-10"}>Milestone Review</th>
                                    <th className={theme.components.table.header}>Handshake Date</th>
                                    <th className={theme.components.table.header + " pr-10 text-right"}>Approval Posture</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-50">
                                {architectureReviews.map(rev => (
                                    <tr key={rev.id} className="nexus-table-row group">
                                        <td className="px-6 py-5 pl-10">
                                            <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{rev.gate}</div>
                                            <div className="text-[10px] text-slate-400 font-bold mt-1 line-clamp-1 italic">"{rev.notes}"</div>
                                        </td>
                                        <td className="px-6 py-5 text-xs font-black font-mono text-slate-400 uppercase tracking-tighter">{rev.date}</td>
                                        <td className="px-6 py-5 text-right pr-10">
                                            <Badge variant={rev.status === 'Completed' ? 'success' : 'neutral'}>
                                                {rev.status === 'Completed' ? 'Certified ✓' : 'Queued'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <div className="h-full flex flex-col justify-center p-12">
                            <EmptyGrid 
                                title="No TRB Reviews Logged"
                                description="The Technical Review Board (TRB) has not scheduled or completed any compliance gates for the current program phase."
                                icon={CheckCircle}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
        <ArchitectureStandardForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};

export default ProgramArchitecture;