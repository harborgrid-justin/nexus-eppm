
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useData } from '../../../context/DataContext';
import { Card } from '../../ui/Card';
import { Badge } from '../../ui/Badge';
import { ChartPlaceholder } from '../../charts/ChartPlaceholder';
import { Activity, Calendar } from 'lucide-react';
import { formatCompactCurrency } from '../../../utils/formatters';

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

export const ProjectHealthTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const project = state.projects[0];
    
    if (!project) return <div className="p-12 text-center text-slate-400">No active projects found.</div>;

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding}`}>
            <TemplateHeader number="02" title="Project Health Monitor" subtitle="Status, S-Curve, and Milestone Tracking" />
            <div className={theme.layout.sectionSpacing}>
                <Card className={`${theme.layout.cardPadding} border-l-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-300 ${project.health === 'Good' ? 'border-l-green-500' : project.health === 'Warning' ? 'border-l-yellow-500' : 'border-l-red-500'}`}>
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
                                <p className={`text-2xl font-black font-mono text-slate-900`}>{formatCompactCurrency(project.budget)}</p>
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
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
