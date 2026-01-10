import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useData } from '../../../context/DataContext';
import { Link, ArrowRight, Trash2 } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { EmptyGrid } from '../../common/EmptyGrid';

interface DependencyLogProps {
    onAdd: () => void;
}

export const DependencyLog: React.FC<DependencyLogProps> = ({ onAdd }) => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const dependencies = state.programDependencies || [];

    const getProjectName = (id: string) => state.projects.find(p => p.id === id)?.name || id;

    const handleDelete = (id: string) => {
        if(confirm("Permanently delete this strategic dependency?")) {
            dispatch({ type: 'DELETE_PROGRAM_DEPENDENCY', payload: id });
        }
    };

    return (
        <div className={`${theme.components.card} overflow-hidden flex flex-col shadow-lg border-slate-200`}>
            <div className={`p-4 border-b ${theme.colors.border} bg-slate-50/50 font-black text-[11px] text-slate-500 uppercase tracking-widest flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <Link size={14} className="text-nexus-600"/> Strategic Dependency Ledger
                </div>
                {dependencies.length > 0 && (
                    <button onClick={onAdd} className="text-nexus-600 hover:text-nexus-800 text-[10px] font-black uppercase tracking-widest">
                        + Define Dependency
                    </button>
                )}
            </div>
            
            <div className="flex-1 overflow-auto min-h-[250px]">
                {dependencies.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                        <thead className="bg-white sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Source Entity</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Downstream Target</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Constraint Type</th>
                                <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Fulfillment</th>
                                <th className="px-6 py-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 bg-white">
                            {dependencies.map(dep => (
                                <tr key={dep.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-slate-700">{getProjectName(dep.sourceProjectId)}</div>
                                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{dep.sourceProjectId}</div>
                                    </td>
                                    <td className="px-6 py-5 text-center text-slate-300">
                                        <div className="p-2 bg-slate-50 rounded-full inline-flex border border-slate-100 shadow-inner group-hover:bg-nexus-50 group-hover:border-nexus-100 transition-colors">
                                            <ArrowRight size={14} className="group-hover:text-nexus-600 transition-colors"/>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-bold text-slate-700">{getProjectName(dep.targetProjectId)}</div>
                                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{dep.targetProjectId}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-[10px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 inline-block tracking-tight">
                                            {dep.type}
                                        </div>
                                        <div className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">{dep.description}</div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <Badge variant={dep.status === 'Critical' ? 'danger' : dep.status === 'Resolved' ? 'success' : 'neutral'}>
                                            {dep.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button onClick={() => handleDelete(dep.id)} className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12">
                        <EmptyGrid 
                            title="Logic Stream Null"
                            description="No cross-program or inter-project dependencies have been established in the current roadmap model."
                            icon={Link}
                            actionLabel="Define Dependency"
                            onAdd={onAdd}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};