import React from 'react';
import { Card } from '../ui/Card';
import { CustomBarChart } from '../charts/CustomBarChart';
import { formatCompactCurrency } from '../../utils/formatters';

export const ProgramVisuals: React.FC<{ projects: any[] }> = ({ projects }) => {
    const chartData = projects.map(p => ({ name: p.code, Budget: p.budget, Spent: p.spent }));

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
                <div className="flex-1 bg-slate-50 border-2 border-dashed rounded-xl flex items-center justify-center text-slate-300">Detailed Program Gantt Engine Loading...</div>
            </Card>
        </div>
    );
};