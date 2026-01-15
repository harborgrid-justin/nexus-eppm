
import React from 'react';
import { Activity, User, MoreHorizontal, ArrowRight, Layers, Target, DollarSign, TrendingUp } from 'lucide-react';
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
            <div className="col-span-full h-[500px] flex">
                <EmptyGrid 
                    title="Strategic Portfolio isolated"
                    description="The organizational executive layer requires defined programs to begin aggregating capital performance. Provision your first program to activate the strategic ledger."
                    icon={Target}
                    actionLabel="Initialize Enterprise Program"
                    onAdd={onCreateProgram}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-nexus-in">
            <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                    <Activity size={18} className="text-nexus-600"/> Multi-tenant Delivery Streams
                </h3>
                <span className="text-[10px] font-black text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full shadow-inner">{programs.length} Records Committed</span>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${theme.layout.gridGap} pb-20`}>
                {programs.map(program => {
                    const projectsInProgram = projects.filter(p => p.programId === program.id);
                    const totalBudget = program.budget;
                    const totalSpent = projectsInProgram.reduce((sum, p) => sum + (p.spent || 0), 0);
                    const percentComplete = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
                    
                    return (
                        <div 
                            key={program.id} 
                            onClick={() => onSelectProgram(program.id)}
                            className={`${theme.components.card} p-10 hover:shadow-2xl hover:border-nexus-400 transition-all cursor-pointer group flex flex-col h-full border border-slate-200 relative rounded-[3rem] bg-white overflow-hidden`}
                        >
                            <div className="absolute top-0 right-0 p-32 bg-nexus-500/5 rounded-full blur-[100px] -mr-16 -mt-16 group-hover:bg-nexus-500/10 transition-colors"></div>
                            
                            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all z-10 translate-x-4 group-hover:translate-x-0">
                                <div className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 shadow-sm border border-slate-100 bg-white">
                                    <MoreHorizontal size={20} />
                                </div>
                            </div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-[1.5rem] bg-slate-900 border border-slate-800 flex items-center justify-center text-white group-hover:bg-nexus-600 group-hover:scale-110 transition-all shadow-2xl">
                                        <Layers size={28} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-black text-slate-900 group-hover:text-nexus-700 transition-colors text-xl uppercase tracking-tighter truncate leading-tight">{program.name}</h3>
                                        <div className="flex items-center gap-2 mt-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <User size={12} className="opacity-60"/> {program.managerId}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="text-sm text-slate-500 mb-10 line-clamp-2 flex-1 font-medium leading-relaxed relative z-10">"{program.description}"</p>
                            
                            <div className="space-y-8 mt-auto relative z-10">
                                <div className="p-6 bg-slate-50/80 rounded-3xl border border-slate-100 shadow-inner">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                                        <span className="text-slate-400 flex items-center gap-2"><DollarSign size={12} className="text-green-600"/> Fiscal Deployment</span>
                                        <span className={`font-mono font-black ${program.health === 'Critical' ? 'text-red-600' : 'text-slate-900'}`}>{percentComplete.toFixed(0)}%</span>
                                    </div>
                                    <ProgressBar 
                                        value={percentComplete} 
                                        size="sm" 
                                        colorClass={program.health === 'Critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-nexus-600 shadow-[0_0_8px_rgba(14,165,233,0.4)]'}
                                    /> 
                                    <div className="flex justify-between mt-4 text-[12px] font-mono font-black text-slate-800 tracking-tighter">
                                        <span className="group-hover:text-nexus-700 transition-colors">{formatCompactCurrency(totalSpent)}</span>
                                        <span className="text-slate-300">/</span>
                                        <span className="text-slate-400 font-bold">{formatCompactCurrency(totalBudget)}</span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                        <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm font-black group-hover:border-nexus-200 transition-colors">{projectsInProgram.length} Projects</div>
                                        <StatusBadge status={program.health} variant="health" className="scale-110 shadow-sm" />
                                    </div>
                                    <button onClick={() => onSelectProgram(program.id)} className="text-[10px] font-black text-nexus-600 uppercase tracking-[0.3em] flex items-center gap-3 group-hover:translate-x-2 transition-all">
                                        <TrendingUp size={16}/> HUB <ArrowRight size={16}/>
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
