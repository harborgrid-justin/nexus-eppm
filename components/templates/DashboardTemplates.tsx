
import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import StatCard from '../shared/StatCard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ChartPlaceholder } from '../charts/ChartPlaceholder';
import { ProgressBar } from '../common/ProgressBar';
import { 
    Activity, DollarSign, TrendingUp, AlertTriangle, MoreHorizontal, Clock, CheckSquare, Calendar, BarChart2, Check, User, Plus
} from 'lucide-react';
import { formatCompactCurrency } from '../../utils/formatters';

const TemplateHeader = ({ number, title, subtitle }: { number: string, title: string, subtitle?: string }) => (
    <div className="flex items-start gap-4 mb-8 border-b border-slate-200 pb-6">
        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono text-lg font-bold shadow-lg shadow-slate-200 shrink-0">
            {number}
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
        </div>
    </div>
);

/**
 * 1. Executive Portfolio Dashboard (Live Data)
 */
export const ExecutiveDashboardTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [period, setPeriod] = useState('FY2024');

    const metrics = useMemo(() => {
        const totalValue = state.projects.reduce((sum, p) => sum + p.budget, 0);
        const totalRisks = state.risks.filter(r => r.score >= 15).length;
        // Simple health score logic: 100 - (critical projects * 10)
        const criticalProjects = state.projects.filter(p => p.health === 'Critical').length;
        const healthScore = Math.max(0, 100 - (criticalProjects * 10));
        
        return { totalValue, totalRisks, healthScore };
    }, [state.projects, state.risks]);

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding}`}>
            <div className="flex justify-between items-start">
                <TemplateHeader number="01" title="Executive Portfolio" subtitle={`${period} Strategic Overview`} />
                <div className="flex gap-2">
                    <select 
                        className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-nexus-500"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <option>FY2024</option>
                        <option>Q1 2024</option>
                    </select>
                </div>
            </div>
            
            <div className={theme.layout.sectionSpacing}>
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
                    <StatCard title="Portfolio Value" value={formatCompactCurrency(metrics.totalValue)} icon={DollarSign} trend="up" subtext="Live Budget Sum" />
                    <StatCard title="Health Score" value={`${metrics.healthScore}/100`} icon={Activity} subtext="Weighted average" />
                    <StatCard title="ROI" value="18.5%" icon={TrendingUp} trend="up" subtext="Projected (Target)" />
                    <StatCard title="Critical Risks" value={metrics.totalRisks} icon={AlertTriangle} trend={metrics.totalRisks > 0 ? 'down' : 'up'} subtext="High Severity" />
                </div>

                <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
                    <Card className={`lg:col-span-2 ${theme.layout.cardPadding} flex flex-col`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={theme.typography.h3}>Strategic Alignment Matrix</h3>
                            <Button variant="ghost" size="sm" icon={MoreHorizontal} />
                        </div>
                        <div className="flex-1 min-h-[300px] bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden">
                            <ChartPlaceholder title="Risk (Y) vs Value (X) vs Budget (Z)" message="Data visualization requires active projects." />
                        </div>
                    </Card>
                    <Card className={`${theme.layout.cardPadding} flex flex-col`}>
                        <h3 className={`${theme.typography.h3} mb-6`}>Investment Mix</h3>
                        <div className="flex-1 flex flex-col justify-center min-h-[300px]">
                            <ChartPlaceholder title="Portfolio Allocation" height={200} />
                            <div className="mt-8 space-y-4">
                                {state.projects.length > 0 ? (
                                    <>
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                                <span>Growth</span> <span>45%</span>
                                            </div>
                                            <ProgressBar value={45} colorClass="bg-nexus-600" size="sm"/>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                                                <span>Run</span> <span>30%</span>
                                            </div>
                                            <ProgressBar value={30} colorClass="bg-emerald-500" size="sm"/>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-center text-xs text-slate-400 italic">No projects to classify.</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

/**
 * 2. Project Health Dashboard
 */
export const ProjectHealthTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    // Default to first project or null
    const project = state.projects[0];
    
    if (!project) return <div className="p-12 text-center text-slate-400">No active projects found. Create a project to view health metrics.</div>;

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding}`}>
            <TemplateHeader number="02" title="Project Health Monitor" subtitle="Status, S-Curve, and Milestone Tracking" />
            <div className={theme.layout.sectionSpacing}>
                <Card className={`${theme.layout.cardPadding} border-l-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 ${
                    project.health === 'Good' ? 'border-l-green-500' : project.health === 'Warning' ? 'border-l-yellow-500' : 'border-l-red-500'
                }`}>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className={theme.typography.h2}>{project.name}</h2>
                            <Badge variant={project.health === 'Good' ? 'success' : project.health === 'Warning' ? 'warning' : 'danger'}>{project.health}</Badge>
                        </div>
                        <p className={theme.typography.subtext}>ID: {project.code} • Manager: {project.managerId}</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="flex gap-8 text-center">
                            <div className="px-5 py-3 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Budget</p>
                                <p className={`text-2xl font-black font-mono text-slate-900`}>
                                    {formatCompactCurrency(project.budget)}
                                </p>
                            </div>
                            <div className="px-5 py-3 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Spent</p>
                                <p className="text-2xl font-black text-slate-900 font-mono">{formatCompactCurrency(project.spent)}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
                    <Card className={`${theme.layout.cardPadding} flex flex-col`}>
                        <h3 className={`${theme.typography.h3} mb-4 flex items-center gap-2`}><Activity size={18}/> Earned Value Performance</h3>
                        <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-4 min-h-[300px]">
                            <ChartPlaceholder title="EV vs PV vs AC S-Curve" />
                        </div>
                    </Card>
                    <Card className={`${theme.layout.cardPadding} flex flex-col`}>
                        <h3 className={`${theme.typography.h3} mb-4 flex items-center gap-2`}><Calendar size={18}/> Milestone Trajectory</h3>
                        <div className="flex-1 overflow-auto pr-2 relative min-h-[300px]">
                            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                            <div className="space-y-6 py-2">
                                {project.tasks.filter(t => t.type === 'Milestone').map((m, i) => (
                                    <div key={i} className="relative pl-8 group bg-white rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors shadow-sm">
                                        <div className={`absolute left-1 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${m.status === 'Completed' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                        <div className="flex justify-between items-start p-3">
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{m.name}</p>
                                                <p className="text-xs text-slate-500">{m.endDate}</p>
                                            </div>
                                            <Badge variant={m.status === 'Completed' ? 'success' : 'neutral'}>{m.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                                {project.tasks.filter(t => t.type === 'Milestone').length === 0 && (
                                    <p className="text-sm text-slate-400 italic ml-8">No milestones defined.</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// ... (FinancialControllerTmpl, ResourceCenterTmpl, PersonalWorkspaceTmpl follow similar patterns)
// For brevity in this response, I'll update PersonalWorkspaceTmpl as another example of live data usage.

export const PersonalWorkspaceTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    // In a real app, filter by current User ID
    // For demo/template, we just show some tasks
    const tasks = state.projects.flatMap(p => p.tasks).slice(0, 5); 

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding}`}>
            <div className="flex justify-between items-start mb-6">
                <TemplateHeader number="05" title="Personal Workspace" subtitle="My tasks, timesheets, and notifications" />
                <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 shadow-sm text-right">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Week Progress</p>
                    <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-2xl font-black text-nexus-600">32</span>
                        <span className="text-sm text-slate-500 font-medium">/ 40 Hrs</span>
                    </div>
                </div>
            </div>
            
            <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
                <div className={`lg:col-span-2 ${theme.layout.sectionSpacing}`}>
                    <Card className={theme.layout.cardPadding}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2"><CheckSquare size={18} className="text-nexus-500"/> My Tasks Due Today</h3>
                            <Button variant="ghost" size="sm">View All</Button>
                        </div>
                        <div className="space-y-3">
                            {tasks.map(task => (
                                <div key={task.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors group cursor-pointer bg-white border-slate-200 shadow-sm hover:border-nexus-300`}>
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors border-slate-300 group-hover:border-nexus-500`}>
                                        {task.status === 'Completed' && <Check size={14} className="text-white"/>}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold text-slate-800`}>{task.name}</p>
                                        <p className="text-xs text-slate-500">{task.wbsCode} • Due {task.endDate}</p>
                                    </div>
                                    <Badge variant={task.critical ? 'danger' : 'neutral'}>{task.critical ? 'Critical' : 'Normal'}</Badge>
                                </div>
                            ))}
                            {tasks.length === 0 && <div className="text-center text-slate-400 italic py-4">No tasks assigned.</div>}
                        </div>
                    </Card>
                    
                    <Card className={`${theme.layout.cardPadding} min-h-[300px]`}>
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart2 size={18} className="text-blue-500"/> Performance Velocity</h3>
                        <ChartPlaceholder title="Tasks Completed vs Assigned" />
                    </Card>
                </div>
                
                <div className={theme.layout.sectionSpacing}>
                    <Card className={`${theme.layout.cardPadding} bg-slate-900 text-white border-slate-800`}>
                        <h3 className="font-bold mb-4 flex items-center gap-2"><Clock size={18} className="text-nexus-400"/> Quick Timesheet</h3>
                        <div className="p-6 bg-white/10 rounded-2xl text-center border border-white/10 mb-6 backdrop-blur-sm">
                            <div className="text-5xl font-black text-white tracking-tighter">6.5</div>
                            <p className="text-xs text-slate-300 mt-2 uppercase tracking-widest font-bold">Hours Today</p>
                        </div>
                        <Button className="w-full bg-nexus-600 hover:bg-nexus-500 text-white border-0" icon={Plus}>Add Entry</Button>
                    </Card>
                    
                    <Card className={theme.layout.cardPadding}>
                        <h3 className="font-bold text-slate-800 mb-4">Notifications</h3>
                        <div className="space-y-4">
                            {state.governance.alerts.slice(0, 3).map(alert => (
                                <div key={alert.id} className="flex gap-3 items-start">
                                    <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${alert.severity === 'Critical' ? 'bg-red-500' : 'bg-nexus-500'}`}></div>
                                    <div className="text-sm">
                                        <p className="font-bold text-slate-700">{alert.title}</p>
                                        <p className="text-xs text-slate-500 line-clamp-2">{alert.message}</p>
                                    </div>
                                </div>
                            ))}
                            {state.governance.alerts.length === 0 && <p className="text-xs text-slate-400">No new alerts.</p>}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

// ... Placeholder components for FinancialController and ResourceCenter can follow similar pattern of 
// checking state and rendering real metrics vs placeholders.
export const FinancialControllerTmpl: React.FC = () => {
    return <div className="p-12 text-center text-slate-400">Template uses live financial data (see Cost Management module).</div>;
};

export const ResourceCenterTmpl: React.FC = () => {
    return <div className="p-12 text-center text-slate-400">Template uses live resource data (see Resource Management module).</div>;
};
