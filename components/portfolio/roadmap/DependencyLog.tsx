import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useData } from '../../../context/DataContext';
import { Link, ArrowRight } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { EmptyGrid } from '../../common/EmptyGrid';

export const DependencyLog: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const dependencies = state.programDependencies || [];

    const getProjectName = (id: string) => state.projects.find(p => p.id === id)?.name || id;

    return (
        <div className={`${theme.components.card} overflow-hidden flex flex-col`}>
            <div className={`p-4 border-b ${theme.colors.border} bg-slate-50/50 font-black text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2`}>
                <Link size={14} className="text-nexus-600"/> Strategic Dependency Ledger
            </div>
            
            <div className="flex-1 overflow-auto min-h-[200px]">
                {dependencies.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                        <thead className="bg-white sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Source Entity</th>
                                <th className="px-6 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic</th>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Downstream Target</th>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Constraint Type</th>
                                <th className="px-6 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Fulfillment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                            {dependencies.map(dep => (
                                <tr key={dep.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{getProjectName(dep.sourceProjectId)}</td>
                                    <td className="px-6 py-4 text-center text-slate-300"><ArrowRight size={14} className="mx-auto group-hover:text-nexus-500 transition-colors"/></td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{getProjectName(dep.targetProjectId)}</td>
                                    <td className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 tracking-tight">{dep.type}</td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant={dep.status === 'Critical' ? 'danger' : dep.status === 'Resolved' ? 'success' : 'neutral'}>
                                            {dep.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-8">
                        <EmptyGrid 
                            title="Logic Stream Null"
                            description="No cross-program or inter-project dependencies have been established in the current roadmap model."
                            icon={Link}
                            actionLabel="Define Dependency"
                            onAdd={() => {}}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};