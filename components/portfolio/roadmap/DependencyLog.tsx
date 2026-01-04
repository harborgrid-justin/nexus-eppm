import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useData } from '../../../context/DataContext';
import { Link, ArrowRight } from 'lucide-react';
import { Badge } from '../../ui/Badge';

export const DependencyLog: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const dependencies = state.programDependencies || [];

    const getProjectName = (id: string) => state.projects.find(p => p.id === id)?.name || id;

    return (
        <div className={`${theme.components.card} overflow-hidden`}>
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs text-slate-500 uppercase flex items-center gap-2">
                <Link size={14}/> Strategic Dependencies
            </div>
            
            <div className="max-h-60 overflow-y-auto">
                {dependencies.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-500 uppercase">Source</th>
                                <th className="px-4 py-2 text-center text-[10px] font-bold text-slate-500 uppercase">Flow</th>
                                <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-500 uppercase">Target</th>
                                <th className="px-4 py-2 text-left text-[10px] font-bold text-slate-500 uppercase">Type</th>
                                <th className="px-4 py-2 text-center text-[10px] font-bold text-slate-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {dependencies.map(dep => (
                                <tr key={dep.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-2 text-xs font-medium text-slate-700">{getProjectName(dep.sourceProjectId)}</td>
                                    <td className="px-4 py-2 text-center text-slate-300"><ArrowRight size={14} className="mx-auto"/></td>
                                    <td className="px-4 py-2 text-xs font-medium text-slate-700">{getProjectName(dep.targetProjectId)}</td>
                                    <td className="px-4 py-2 text-xs text-slate-500">{dep.type}</td>
                                    <td className="px-4 py-2 text-center">
                                        <Badge variant={dep.status === 'Critical' ? 'danger' : dep.status === 'Resolved' ? 'success' : 'neutral'}>
                                            {dep.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-8 text-center text-slate-400 italic text-sm">
                        No active cross-stream dependencies detected in the portfolio.
                    </div>
                )}
            </div>
        </div>
    );
};