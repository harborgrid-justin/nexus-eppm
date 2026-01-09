
import React, { useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Server, ShieldCheck, Database, Layers, CheckCircle, Clock, Plus } from 'lucide-react';
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
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Server className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Architecture & Technical Standards</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Standards Library */}
            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Layers size={18} className="text-blue-500"/> Standards Baseline</h3>
                    <Button size="sm" icon={Plus} onClick={() => setIsFormOpen(true)}>Define Standard</Button>
                </div>
                <div className="flex-1 overflow-auto p-4 space-y-3">
                    {architectureStandards.map(std => (
                        <div key={std.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow">
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    {std.category === 'Security' ? <ShieldCheck size={16} className="text-nexus-500"/> : 
                                     std.category === 'Data' ? <Database size={16} className="text-green-500"/> :
                                     <Server size={16} className="text-slate-500"/>}
                                    <h4 className="font-bold text-sm text-slate-900">{std.title}</h4>
                                </div>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                    std.status === 'Baseline' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>{std.status}</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-2 pl-6">{std.description}</p>
                        </div>
                    ))}
                    {architectureStandards.length === 0 && (
                        <div className="h-full flex flex-col justify-center">
                            <EmptyGrid 
                                title="No Standards Defined"
                                description="Establish architectural baselines."
                                icon={Layers}
                                onAdd={() => setIsFormOpen(true)}
                                actionLabel="Define Standard"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Architectural Reviews */}
            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><CheckCircle size={18} className="text-purple-500"/> Review Gates</h3>
                </div>
                <div className="flex-1 overflow-auto">
                    {architectureReviews.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Milestone / Gate</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {architectureReviews.map(rev => (
                                    <tr key={rev.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-900">{rev.gate}</div>
                                            <div className="text-xs text-slate-500 italic mt-1">{rev.notes}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">{rev.date}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={rev.status === 'Completed' ? 'success' : 'neutral'}>
                                                {rev.status === 'Completed' ? <CheckCircle size={12} className="mr-1"/> : <Clock size={12} className="mr-1"/>}
                                                {rev.status}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                         <div className="h-full flex flex-col justify-center">
                            <EmptyGrid 
                                title="No Reviews Scheduled"
                                description="Plan architectural review gates."
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
