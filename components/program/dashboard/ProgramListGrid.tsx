
import React from 'react';
import { Activity, User, MoreHorizontal, ArrowRight, Layers } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { StatusBadge } from '../../common/StatusBadge';
import { ProgressBar } from '../../common/ProgressBar';
import { formatCompactCurrency } from '../../../utils/formatters';
import { Program, Project } from '../../../types';
import { EmptyGrid } from '../../common/EmptyGrid';

interface ProgramListGridProps {
    programs: Program[];
    projects: Project[];
    onSelectProgram: (id: string) => void;
    onCreateProgram: () => void;
}

export const ProgramListGrid: React.FC<ProgramListGridProps> = ({ programs, projects, onSelectProgram, onCreateProgram }) => {
    const theme = useTheme();

    if (programs.length === 0) {
        return (
            <div className="col-span-full">
                <EmptyGrid 
                    title="Program Portfolio Null"
                    description="No cross-functional programs identified. Establish a program to aggregate strategic project delivery."
                    icon={Layers}
                    actionLabel="Establish Program"
                    onAdd={onCreateProgram}
                />
            </div>
        );
    }

    return (
        <div>
            <h3 className={`${theme.typography.h3} mb-4 flex items-center gap-2`}>
                <Activity size={20} className="text-nexus-600"/> Active Programs
            </h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${theme.layout.gridGap}`}>
                {programs.map(program => {
                    const projectsInProgram = projects.filter(p => p.programId === program.id);
                    const totalBudget = program.budget;
                    const totalSpent = projectsInProgram.reduce((sum, p) => sum + p.spent, 0);
                    const percentComplete = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
                    
                    return (
                        <div 
                            key={program.id} 
                            onClick={() => onSelectProgram(program.id)}
                            className={`${theme.components.card} p-5 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full border border-slate-200 hover:border-nexus-300 relative`}
                        >
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-nexus-50 flex items-center justify-center text-nexus-600 group-hover:bg-nexus-100 transition-colors border border-nexus-100">
                                        <Layers size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 group-hover:text-nexus-700 transition-colors line-clamp-1">{program.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <User size={12}/> {program.managerId}
                                        </div>
                                    </div>
                                </div>
                                <StatusBadge status={program.health} variant="health"/>
                            </div>
                            
                            <p className="text-sm text-slate-600 mb-6 line-clamp-2 flex-1">{program.description}</p>
                            
                            <div className="space-y-4 mt-auto">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500 font-medium">Budget Performance</span>
                                        <span className="font-bold text-slate-900">{formatCompactCurrency(totalSpent)} / {formatCompactCurrency(totalBudget)}</span>
                                    </div>
                                    <ProgressBar 
                                        value={percentComplete} 
                                        size="sm" 
                                        colorClass={program.health === 'Critical' ? 'bg-red-500' : 'bg-nexus-600'}
                                    /> 
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <div className="px-2 py-1 bg-slate-100 rounded border border-slate-200">{projectsInProgram.length} Projects</div>
                                    </div>
                                    <button className="text-xs font-bold text-nexus-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        Open Workspace <ArrowRight size={12}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
