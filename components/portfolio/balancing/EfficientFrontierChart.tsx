import React from 'react';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { useTheme } from '../../../context/ThemeContext';
import { formatCompactCurrency } from '../../../utils/formatters';

interface EfficientFrontierChartProps {
    data: any[];
    budget: number;
    onBudgetChange: (val: number) => void;
}

export const EfficientFrontierChart: React.FC<EfficientFrontierChartProps> = ({ data, budget, onBudgetChange }) => {
    const theme = useTheme();

    // Calculate cumulative data for frontier logic
    let cumulativeCost = 0;
    let cumulativeValue = 0;
    const chartData = data.map(d => {
        cumulativeCost += d.budget;
        cumulativeValue += d.value;
        return {
            name: d.name,
            cost: d.budget,
            value: d.value,
            cumulativeCost,
            cumulativeValue
        };
    });

    return (
        <div className={`${theme.components.card} p-10 rounded-[2.5rem] h-[450px] flex flex-col shadow-sm bg-white border-slate-100`}>
            <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-5">
                <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Optimization Frontier</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Aggregated Value vs. Capital Boundary</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-inner group">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">CAP:</span>
                    <input 
                        type="number" 
                        value={budget} 
                        onChange={(e) => onBudgetChange(Number(e.target.value))}
                        className="w-24 bg-white border border-slate-200 rounded-lg py-1 px-3 text-right font-mono font-black text-xs text-nexus-700 outline-none focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 transition-all"
                    />
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                        <XAxis dataKey="name" tick={false} axisLine={false} label={{ value: 'Project Ranking (Value / Cost Index)', position: 'bottom', offset: 0, style: { fontSize: 10, fontStyle: 'bold', fill: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' } }}/>
                        <YAxis yAxisId="left" tickFormatter={(val) => formatCompactCurrency(val)} tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} />
                        <YAxis yAxisId="right" orientation="right" tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} label={{ value: 'Realization Yield', angle: 90, position: 'insideRight', style: {fontSize: 10, fill: '#94a3b8'} }}/>
                        <Tooltip contentStyle={theme.charts.tooltip} />
                        <Legend wrapperStyle={{paddingTop: '30px', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase'}} />
                        <Bar yAxisId="left" dataKey="cost" fill="#cbd5e1" barSize={12} radius={[2,2,0,0]} name="Allotted Cost" />
                        <Line yAxisId="left" type="monotone" dataKey="cumulativeCost" stroke="#ef4444" strokeWidth={3} dot={false} name="Consumption Trail" />
                        <Line yAxisId="right" type="monotone" dataKey="cumulativeValue" stroke="#22c55e" strokeWidth={3} dot={false} name="Benefit Harvest" />
                        <ReferenceLine yAxisId="left" y={budget} stroke="#f59e0b" strokeWidth={2} strokeDasharray="8 4" label={{ value: 'BUDGET_CAP', position: 'top', fontSize: 9, fontWeight: 'black', fill: '#f59e0b', offset: 10 }} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};