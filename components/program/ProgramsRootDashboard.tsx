
import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Layers, DollarSign, Activity, TrendingUp, ArrowRight,
  ShieldAlert, User, Plus, Target, PieChart, MoreHorizontal
} from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency } from '../../utils/formatters';
import { StatusBadge } from '../common/StatusBadge';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../ui/Button';
import { EmptyGrid } from '../common/EmptyGrid';
import { useNavigate } from 'react-router-dom';

interface ProgramsRootDashboardProps {
  onSelectProgram: (id: string) => void;
}

const ProgramsRootDashboard: React.FC<ProgramsRootDashboardProps> = ({ onSelectProgram }) => {
  const { state, dispatch } = useData();
  const theme = useTheme();
  const navigate = useNavigate();

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

  const handleCreateProgram = () => {
    // In a real scenario, this would open a modal or navigate to a create wizard
    const id = `PRG-${Date.now()}`;
    dispatch({ 
        type: 'ADD_PROGRAM', 
        payload: {
            id,
            name: 'New Strategic Initiative',
            managerId: 'Unassigned',
            description: 'Define program scope and strategic alignment...',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            budget: 0,
            benefits: '',
            status: 'Planned',
            health: 'Good',
            strategicImportance: 5,
            financialValue: 0,
            riskScore: 0,
            calculatedPriorityScore: 0,
            category: 'Strategic',
            businessCase: ''
        }
    });
    onSelectProgram(id);
  };

  return (
    <div className={`h-full overflow-y-auto p-6 space-y-8 animate-in fade-in duration-300`}>
        {/* Command Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <button 
                onClick={handleCreateProgram}
                className={`p-4 rounded-xl border border-dashed border-nexus-300 bg-nexus-50/50 hover:bg-nexus-50 transition-all flex items-center gap-4 group text-left`}
              >
                  <div className="w-10 h-10 rounded-full bg-white border border-nexus-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Layers className="text-nexus-600" size={18}/>
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 text-sm">Initialize Program</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Group related projects & outcomes</p>
                  </div>
              </button>

              <button 
                onClick={() => navigate('/portfolio?tab=framework')}
                className={`p-4 rounded-xl border border-dashed border-purple-300 bg-purple-50/50 hover:bg-purple-50 transition-all flex items-center gap-4 group text-left`}
              >
                  <div className="w-10 h-10 rounded-full bg-white border border-purple-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Target className="text-purple-600" size={18}/>
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 text-sm">Strategic Alignment</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Review organizational goals</p>
                  </div>
              </button>

              <button 
                onClick={() => navigate('/portfolio?tab=financials')}
                className={`p-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 transition-all flex items-center gap-4 group text-left`}
              >
                  <div className="w-10 h-10 rounded-full bg-white border border-emerald-200 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <DollarSign className="text-emerald-600" size={18}/>
                  </div>
                  <div>
                      <h4 className="font-bold text-slate-800 text-sm">Funding Review</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Manage capital allocation</p>
                  </div>
              </button>
        </div>

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
                subtext={`${metrics.totalBudget > 0 ? ((metrics.totalSpent/metrics.totalBudget)*100).toFixed(1) : 0}% Consumed`}
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
            
            {state.programs.length === 0 && (
                <div className="col-span-full">
                    <EmptyGrid 
                        title="Program Portfolio Null"
                        description="No cross-functional programs identified. Establish a program to aggregate strategic project delivery."
                        icon={Layers}
                        actionLabel="Establish Program"
                        onAdd={handleCreateProgram}
                    />
                </div>
            )}
        </div>
    </div>
  );
};

export default ProgramsRootDashboard;
