
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ChartPlaceholder } from '../charts/ChartPlaceholder';
import { ProgressBar } from '../common/ProgressBar';
import { 
    Activity, DollarSign, TrendingUp, AlertTriangle, MoreHorizontal, Clock, CheckSquare, PieChart, Target, ArrowUpRight, Plus, Layers, Calendar, BarChart2, Filter, RefreshCw, ChevronDown, Check, Briefcase, User 
} from 'lucide-react';

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
 * 1. Executive Portfolio Dashboard
 */
export const ExecutiveDashboardTmpl: React.FC = () => {
    const theme = useTheme();
    const [period, setPeriod] = useState('FY2024');
    const [isLoading, setIsLoading] = useState(false);

    const refreshData = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    };

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
                        <option>Q2 2024</option>
                    </select>
                    <Button variant="outline" size="sm" icon={RefreshCw} onClick={refreshData} isLoading={isLoading}>Refresh</Button>
                    <Button variant="primary" size="sm">Export Report</Button>
                </div>
            </div>
            
            <div className={theme.layout.sectionSpacing}>
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
                    <StatCard title="Portfolio Value" value="$142M" icon={DollarSign} trend="up" subtext="12% vs last year" />
                    <StatCard title="Health Score" value="92/100" icon={Activity} subtext="Weighted average" />
                    <StatCard title="ROI" value="18.5%" icon={TrendingUp} trend="up" subtext="Annualized return" />
                    <StatCard title="Active Risks" value="3" icon={AlertTriangle} trend="down" subtext="Critical severity" />
                </div>

                <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
                    <Card className={`lg:col-span-2 ${theme.layout.cardPadding} flex flex-col`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={theme.typography.h3}>Strategic Alignment Matrix</h3>
                            <Button variant="ghost" size="sm" icon={MoreHorizontal} />
                        </div>
                        <div className="flex-1 min-h-[300px] bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden">
                            {isLoading && <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center backdrop-blur-sm">Updating...</div>}
                            <ChartPlaceholder title="Risk (Y) vs Value (X) vs Budget (Z)" />
                        </div>
                    </Card>
                    <Card className={`${theme.layout.cardPadding} flex flex-col`}>
                        <h3 className={`${theme.typography.h3} mb-6`}>Investment Mix</h3>
                        <div className="flex-1 flex flex-col justify-center min-h-[300px]">
                            <ChartPlaceholder title="Portfolio Allocation" height={200} />
                            <div className="mt-8 space-y-4">
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
    const [projectStatus, setProjectStatus] = useState<'On Track' | 'At Risk' | 'Critical'>('On Track');
    
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding}`}>
            <TemplateHeader number="02" title="Project Health Monitor" subtitle="Status, S-Curve, and Milestone Tracking" />
            <div className={theme.layout.sectionSpacing}>
                <Card className={`${theme.layout.cardPadding} border-l-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 ${
                    projectStatus === 'On Track' ? 'border-l-green-500' : projectStatus === 'At Risk' ? 'border-l-yellow-500' : 'border-l-red-500'
                }`}>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className={theme.typography.h2}>Project Alpha</h2>
                            <Badge variant={projectStatus === 'On Track' ? 'success' : projectStatus === 'At Risk' ? 'warning' : 'danger'}>{projectStatus}</Badge>
                        </div>
                        <p className={theme.typography.subtext}>ID: P-2024-001 • Manager: Mike Ross</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <select 
                            className="text-sm border border-slate-200 rounded p-2 bg-slate-50"
                            value={projectStatus}
                            onChange={(e) => setProjectStatus(e.target.value as any)}
                        >
                            <option>On Track</option>
                            <option>At Risk</option>
                            <option>Critical</option>
                        </select>
                        <div className="flex gap-8 text-center">
                            <div className="px-5 py-3 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">CPI</p>
                                <p className={`text-2xl font-black font-mono ${projectStatus === 'Critical' ? 'text-red-500' : 'text-green-600'}`}>
                                    {projectStatus === 'Critical' ? '0.85' : '1.02'}
                                </p>
                            </div>
                            <div className="px-5 py-3 bg-slate-50 rounded-xl border border-slate-200">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">SPI</p>
                                <p className="text-2xl font-black text-yellow-600 font-mono">0.98</p>
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
                                {[
                                    { name: 'Kickoff', date: 'Jan 15', status: 'Complete' },
                                    { name: 'Design Review', date: 'Apr 10', status: 'Delayed' },
                                    { name: 'Execution', date: 'May 01', status: 'Pending' }
                                ].map((m, i) => (
                                    <div key={i} className="relative pl-8 group bg-white rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors shadow-sm">
                                        <div className={`absolute left-1 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${m.status === 'Complete' ? 'bg-green-500' : m.status === 'Delayed' ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                                        <div className="flex justify-between items-start p-3">
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{m.name}</p>
                                                <p className="text-xs text-slate-500">{m.date}</p>
                                            </div>
                                            <Badge variant={m.status === 'Complete' ? 'success' : m.status === 'Delayed' ? 'danger' : 'neutral'}>{m.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

/**
 * 3. Financial Controller Dashboard
 */
export const FinancialControllerTmpl: React.FC = () => {
    const theme = useTheme();
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding}`}>
            <TemplateHeader number="03" title="Financial Controller" subtitle="Cash flow, variance, and ledger analysis" />
            <div className={theme.layout.sectionSpacing}>
                <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
                    <StatCard title="CapEx Budget" value="$50.0M" icon={DollarSign} subtext="Fiscal Year 2024" />
                    <StatCard title="Committed Spend" value="$32.4M" icon={CheckSquare} subtext="POs Issued" />
                    <StatCard title="Actuals Invoiced" value="$18.2M" icon={TrendingUp} subtext="Paid to Date" />
                </div>
                <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
                    <Card className={`lg:col-span-2 ${theme.layout.cardPadding} min-h-[350px]`}>
                        <h3 className={`${theme.typography.h3} mb-4`}>Cash Flow Waterfall</h3>
                        <ChartPlaceholder title="Monthly Variance Analysis" />
                    </Card>
                    <Card className={`${theme.layout.cardPadding} min-h-[350px]`}>
                        <h3 className={`${theme.typography.h3} mb-4`}>Cost by Category</h3>
                        <ChartPlaceholder title="Spend Categories" />
                    </Card>
                </div>
                
                <Card className="overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">General Ledger</h3>
                        <Button size="sm" variant="ghost" icon={ArrowUpRight}>View All</Button>
                    </div>
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Account</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Budget</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Actual</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Variance</th>
                                <th className="w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {[1,2,3].map(i => (
                                <React.Fragment key={i}>
                                    <tr className="hover:bg-slate-50 cursor-pointer" onClick={() => setExpandedRow(expandedRow === i ? null : i)}>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">GL-10{i}00</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-800">Cost Center {i}</td>
                                        <td className="px-6 py-4 text-sm text-right text-slate-600">$1,000,000</td>
                                        <td className="px-6 py-4 text-sm text-right text-slate-600">$850,000</td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-green-600">$150,000</td>
                                        <td className="px-4 py-4 text-slate-400">
                                            <ChevronDown size={16} className={`transition-transform ${expandedRow === i ? 'rotate-180' : ''}`} />
                                        </td>
                                    </tr>
                                    {expandedRow === i && (
                                        <tr className="bg-slate-50/50">
                                            <td colSpan={6} className="px-6 py-4">
                                                <div className="text-xs text-slate-500">
                                                    <p className="font-bold mb-2 uppercase">Transaction History</p>
                                                    <div className="space-y-1 pl-4 border-l-2 border-slate-200">
                                                        <div className="flex justify-between"><span>Inv-001 (Acme Corp)</span> <span>$250,000</span></div>
                                                        <div className="flex justify-between"><span>Inv-002 (Globex)</span> <span>$600,000</span></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </Card>
            </div>
        </div>
    );
};

/**
 * 4. Resource Center
 */
export const ResourceCenterTmpl: React.FC = () => {
    const theme = useTheme();
    const [viewMode, setViewMode] = useState<'heatmap' | 'chart'>('heatmap');
    
    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding}`}>
            <TemplateHeader number="04" title="Resource Command Center" subtitle="Capacity planning and utilization heatmaps" />
            <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
                <Card className={`lg:col-span-2 ${theme.layout.cardPadding} flex flex-col`}>
                    <div className="flex justify-between mb-6">
                        <h3 className={theme.typography.h3}>Enterprise Capacity</h3>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button onClick={() => setViewMode('heatmap')} className={`px-3 py-1 text-xs font-bold rounded ${viewMode === 'heatmap' ? 'bg-white shadow text-nexus-600' : 'text-slate-500'}`}>Heatmap</button>
                            <button onClick={() => setViewMode('chart')} className={`px-3 py-1 text-xs font-bold rounded ${viewMode === 'chart' ? 'bg-white shadow text-nexus-600' : 'text-slate-500'}`}>Chart</button>
                        </div>
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-center justify-center min-h-[300px]">
                        {viewMode === 'heatmap' ? (
                            <div className="w-full grid grid-cols-12 gap-1">
                                {[...Array(48)].map((_,i) => <div key={i} className={`h-8 rounded ${Math.random() > 0.7 ? 'bg-red-200' : 'bg-green-200'}`} title={`Utilization: ${Math.floor(Math.random()*100)}%`}></div>)}
                            </div>
                        ) : (
                            <ChartPlaceholder title="Resource Load vs Capacity (6 Months)" />
                        )}
                    </div>
                </Card>
                <div className={`${theme.layout.sectionSpacing} flex flex-col`}>
                    <Card className={`${theme.layout.cardPadding} text-center`}>
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center justify-center gap-2"><Target size={18}/> Utilization</h4>
                        <div className="relative inline-flex items-center justify-center">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="351.86" strokeDashoffset="35.186" className="text-nexus-600" />
                            </svg>
                            <span className="absolute text-3xl font-black text-slate-900">88%</span>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">Enterprise Load</p>
                    </Card>
                    <Card className={`${theme.layout.cardPadding} bg-red-50 border-red-100`}>
                        <h4 className="font-bold mb-3 text-red-900 flex items-center gap-2"><AlertTriangle size={16}/> Critical Shortages</h4>
                        <ul className="space-y-2">
                            <li className="flex justify-between text-sm text-red-800 border-b border-red-200 pb-1"><span>Senior Architects</span> <span>-120h</span></li>
                            <li className="flex justify-between text-sm text-red-800"><span>Civil Engineers</span> <span>-40h</span></li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    );
};

/**
 * 5. Personal Workspace
 */
export const PersonalWorkspaceTmpl: React.FC = () => {
    const theme = useTheme();
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Review Design Specs for Phase 1', project: 'Project Alpha', due: '5:00 PM', priority: 'High', completed: false },
        { id: 2, title: 'Submit Timesheet', project: 'Admin', due: 'Tomorrow', priority: 'Medium', completed: false }
    ]);

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

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
                                <div key={task.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-colors group cursor-pointer ${task.completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-sm hover:border-nexus-300'}`} onClick={() => toggleTask(task.id)}>
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-nexus-500 border-nexus-500' : 'border-slate-300 group-hover:border-nexus-500'}`}>
                                        {task.completed && <Check size={14} className="text-white"/>}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-bold ${task.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{task.title}</p>
                                        <p className="text-xs text-slate-500">{task.project} • Due {task.due}</p>
                                    </div>
                                    <Badge variant={task.priority === 'High' ? 'danger' : 'neutral'}>{task.priority}</Badge>
                                </div>
                            ))}
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
                            <div className="flex gap-3 items-start">
                                <div className="w-2 h-2 mt-2 bg-nexus-500 rounded-full shrink-0"></div>
                                <div className="text-sm">
                                    <p className="font-bold text-slate-700">Approvals Pending</p>
                                    <p className="text-xs text-slate-500">3 change orders require your review.</p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-2 h-2 mt-2 bg-green-500 rounded-full shrink-0"></div>
                                <div className="text-sm">
                                    <p className="font-bold text-slate-700">Project Update</p>
                                    <p className="text-xs text-slate-500">Project Alpha status changed to Active.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
