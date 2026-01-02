
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Layers, DollarSign, Activity, TrendingUp, ArrowRight,
  ShieldAlert, User
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';

interface ProgramsRootDashboardProps {
  onSelectProgram: (id: string) => void;
}

const ProgramsRootDashboard: React.FC<ProgramsRootDashboardProps> = ({ onSelectProgram }) => {
  const { state } = useData();
  const theme = useTheme();

  const metrics = useMemo(() => {
    const totalBudget = state.programs.reduce((acc, p) => acc + p.budget, 0);
    
    let totalSpent = 0;
    state.programs.forEach(prog => {
       const childProjects = state.projects.filter(p => p.programId === prog.id);
       totalSpent += childProjects.reduce((s, p) => s + p.spent, 0);
    });

    const activeCount = state.programs.filter(p => p.status === 'Active').length;
    const criticalCount = state.programs.filter(p => p.health === 'Critical').length;
    
    return { totalBudget, totalSpent, activeCount, criticalCount };
  }, [state.programs, state.projects]);

  return (
    <div className={`h-full overflow-y-auto p-6 space-y-8 animate-in fade-in duration-300`}>
        {/* Aggregate Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard 
                title="Total Investment" 
                value={formatCompactCurrency(metrics.totalBudget)} 
                icon={DollarSign} 
                subtext={`${state.programs.length} Programs`}
            />
            <StatCard 
                title="Portfolio Burn" 
                value={formatCompactCurrency(metrics.totalSpent)} 
                icon={TrendingUp} 
                subtext={`${((metrics.totalSpent/metrics.totalBudget)*100).toFixed(1)}% Consumed`}
            />
            <StatCard 
                title="Active Programs" 
                value={metrics.activeCount} 
                icon={Layers} 
            />
            <StatCard 
                title="Critical Health" 
                value={metrics.criticalCount} 
                icon={ShieldAlert} 
                trend={metrics.criticalCount > 0 ? 'down' : 'up'}
            />
        </div>

        {/* Program Cards Grid */}
        <div>
            <h3 className={`${theme.typography.h3} mb-4 flex items-center gap-2`}>
                <Activity size={20} className="text-nexus-600"/> Active Programs
            </h3>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${theme.layout.gridGap}`}>
                {state.programs.map(program => {
                    const projectsInProgram = state.projects.filter(p => p.programId === program.id);
                    const totalBudget = program.budget;
                    const totalSpent = projectsInProgram.reduce((sum, p) => sum + p.spent, 0);
                    const percentComplete = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
                    
                    return (
                        <div 
                            key={program.id} 
                            onClick={() => onSelectProgram(program.id)}
                            className={`${theme.components.card} p-5 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-nexus-50 flex items-center justify-center text-nexus-600 group-hover:bg-nexus-100 transition-colors">
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
            
            {state.programs.length === 0 && (
                <div className="col-span-full text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
                    <Layers size={48} className="mx-auto mb-4 opacity-50"/>
                    <p>No active programs found.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ProgramsRootDashboard;
