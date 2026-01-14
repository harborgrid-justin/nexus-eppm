import React from 'react';
import { Card } from '../ui/Card';
import { CustomBarChart } from '../charts/CustomBarChart';
import { formatCompactCurrency } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import { EmptyGrid } from '../common/EmptyGrid';
import { BarChart2, Calendar } from 'lucide-react';

export const ProgramVisuals: React.FC<{ projects: any[] }> = ({ projects }) => {
    const theme = useTheme();
    const chartData = projects.map(p => ({ 
        name: p.code || 'N/A', 
        Budget: p.budget || 0, 
        Spent: p.spent || 0 
    }));
    
    const sortedProjects = [...projects].sort((a,b) => 
        new Date(a.startDate || Date.now()).getTime() - new Date(b.startDate || Date.now()).getTime()
    );

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <Card className={`${theme.layout.cardPadding} h-[400px] flex flex-col`}>
                <h3 className={`font-black text-[10px] uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2`}>
                    <BarChart2 size={14} className="text-nexus-600"/> Financial Comparison Matrix
                </h3>
                <div className="flex-1 min-h-0">
                    {projects.length > 0 ? (
                        <CustomBarChart 
                            data={chartData} 
                            xAxisKey="name" 
                            dataKey="Spent" 
                            height={300} 
                            barColor="#0ea5e9" 
                            formatTooltip={v => formatCompactCurrency(v)} 
                        />
                    ) : (
                        <EmptyGrid title="No Data for Charts" description="Linked projects are required to generate financial visuals." icon={BarChart2} />
                    )}
                </div>
            </Card>
            <Card className={`${theme.layout.cardPadding} h-[400px] flex flex-col`}>
                <h3 className={`font-black text-[10px] uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2`}>
                    <Calendar size={14} className="text-nexus-600"/> Execution Summary Feed
                </h3>
                <div className="flex-1 flex flex-col justify-start space-y-4 overflow-y-auto pr-2 scrollbar-thin">
                    {sortedProjects.length > 0 ? sortedProjects.map(p => (
                        <div key={p.id} className="group cursor-pointer">
                            <div className="flex justify-between text-xs mb-1.5">
                                <span className={`font-bold text-slate-700 group-hover:text-nexus-600 transition-colors`}>{p.name}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                                    p.health === 'Good' ? 'bg-green-50 text-green-700 border-green-200' : 
                                    p.health === 'Warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                                    'bg-red-50 text-red-700 border-red-200'
                                }`}>{p.health}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                                <div className="bg-nexus-600 h-full transition-all duration-700 shadow-sm" style={{ width: `${(p.spent/p.budget*100) || 0}%` }}></div>
                            </div>
                            <div className={`flex justify-between text-[9px] text-slate-400 mt-1.5 font-mono uppercase tracking-tighter`}>
                                <span>{p.startDate}</span>
                                <span>{p.endDate}</span>
                            </div>
                        </div>
                    )) : (
                        <div className="h-full">
                            <EmptyGrid title="Registry Isolated" description="Align component projects to this program to see execution trends." icon={Calendar} />
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};