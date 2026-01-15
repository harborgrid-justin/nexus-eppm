
import React from 'react';
import { Activity, User, MoreHorizontal, ArrowRight, Layers, Target } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { StatusBadge } from '../../common/StatusBadge';
import { ProgressBar } from '../../common/ProgressBar';
import { formatCompactCurrency } from '../../../utils/formatters';
import { Program, Project } from '../../../types/index';
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
            <div className="col-span-full h-[400px]">
                <EmptyGrid 
                    title="Strategic Portfolio Null"
                    description="No cross-functional programs identified. Establish a program to aggregate strategic project delivery and track organizational benefits."
                    icon={Target}
                    actionLabel="Establish Strategic Program"
                    onAdd={onCreateProgram}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Activity size={16} className="text-nexus-600"/> Active Executive Programs
                </h3>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{programs.length} Records Committed</span>
            </div>
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
                            className={`${theme.components.card} p-8 hover:shadow-2xl hover:border-nexus-400 transition-all cursor-pointer group flex flex-col h-full border border-slate-200 relative rounded-[2.5rem] bg-white`}
                        >
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <div className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
                                    <MoreHorizontal size={18} />
                                </div>
                            </div>

                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-nexus-600 group-hover:scale-110 transition-all shadow-xl">
                                        <Layers size={24} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-black text-slate-900 group-hover:text-nexus-700 transition-colors text-lg uppercase tracking-tight truncate">{program.name}</h3>
                                        <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <User size={12} className="opacity-60"/> {program.managerId}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-sm text-slate-500 mb-8 line-clamp-2 flex-1 font-medium leading-relaxed">{program.description}</p>
                            
                            <div className="space-y-6 mt-auto">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2.5">
                                        <span className="text-slate-400">Fiscal Deployment</span>
                                        <span className={`font-mono font-black ${program.health === 'Critical' ? 'text-red-600' : 'text-slate-900'}`}>{percentComplete.toFixed(0)}%</span>
                                    </div>
                                    <ProgressBar 
                                        value={percentComplete} 
                                        size="sm" 
                                        colorClass={program.health === 'Critical' ? 'bg-red-500' : 'bg-nexus-600'}
                                    /> 
                                    <div className="flex justify-between mt-3 text-[11px] font-mono font-black text-slate-700">
                                        <span>{formatCompactCurrency(totalSpent)}</span>
                                        <span className="text-slate-300">/</span>
                                        <span className="text-slate-400">{formatCompactCurrency(totalBudget)}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                        <div className="px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">{projectsInProgram.length} Projects</div>
                                        <StatusBadge status={program.health} variant="health" className="scale-90" />
                                    </div>
                                    <button className="text-[10px] font-black text-nexus-600 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:translate-x-1 transition-all">
                                        OPEN HUB <ArrowRight size={14}/>
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
