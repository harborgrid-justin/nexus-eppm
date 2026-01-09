
import React, { useMemo } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useData } from '../../../context/DataContext';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ChartPlaceholder } from '../../charts/ChartPlaceholder';
import { CheckSquare, BarChart2, Clock, Plus, Check } from 'lucide-react';

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

export const PersonalWorkspaceTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const { user } = useAuth();
    
    const { tasks, hoursToday } = useMemo(() => {
        if (!user) return { tasks: [], hoursToday: 0 };
        
        const userTasks = state.projects.flatMap(p => 
            p.tasks.filter(t => t.assignments.some(a => a.resourceId === user.id) && t.status !== 'Completed')
        ).slice(0, 5);

        let totalHours = 0;
        const today = new Date();
        const dayOfWeek = (today.getDay() + 6) % 7; 
        
        state.timesheets.filter(ts => ts.resourceId === user.id).forEach(ts => {
             ts.rows.forEach(r => totalHours += (r.hours[dayOfWeek] || 0));
        });

        return { tasks: userTasks, hoursToday: totalHours };
    }, [state.projects, state.timesheets, user]);

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
                            <div className="text-5xl font-black text-white tracking-tighter">{hoursToday.toFixed(1)}</div>
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
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
