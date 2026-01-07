
import React from 'react';
import { Card } from '../ui/Card';
import { CustomBarChart } from '../charts/CustomBarChart';
import { formatCompactCurrency } from '../../utils/formatters';

export const ProgramVisuals: React.FC<{ projects: any[] }> = ({ projects }) => {
    const chartData = projects.map(p => ({ name: p.code, Budget: p.budget, Spent: p.spent }));
    const sortedProjects = [...projects].sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 h-[400px] flex flex-col">
                <h3 className="font-bold text-slate-800 mb-6">Financial Comparison</h3>
                <div className="flex-1 min-h-0">
                    <CustomBarChart data={chartData} xAxisKey="name" dataKey="Spent" height={300} barColor="#0ea5e9" formatTooltip={v => formatCompactCurrency(v)} />
                </div>
            </Card>
            <Card className="p-6 h-[400px] flex flex-col">
                <h3 className="font-bold text-slate-800 mb-6">Execution Summary</h3>
                <div className="flex-1 flex flex-col justify-start space-y-4 overflow-y-auto pr-2">
                    {sortedProjects.map(p => (
                        <div key={p.id}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-bold text-slate-700">{p.name}</span>
                                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${p.health === 'Good' ? 'bg-green-100 text-green-700' : p.health === 'Warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.health}</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-nexus-600 h-full transition-all" style={{ width: `${p.progress || 0}%` }}></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                                <span>{p.startDate}</span>
                                <span>{p.endDate}</span>
                            </div>
                        </div>
                    ))}
                    {sortedProjects.length === 0 && <div className="text-center text-slate-400 text-sm italic py-10">No projects linked to this program.</div>}
                </div>
            </Card>
        </div>
    );
};
