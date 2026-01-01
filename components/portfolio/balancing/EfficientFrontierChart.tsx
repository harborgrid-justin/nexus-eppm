
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

    // Calculate cumulative data
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
        <div className={`${theme.components.card} ${theme.layout.cardPadding} h-[400px]`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Efficient Frontier (Cumulative)</h3>
                <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-500">Budget Cutoff:</span>
                    <input 
                        type="number" 
                        value={budget} 
                        onChange={(e) => onBudgetChange(Number(e.target.value))}
                        className="w-24 p-1 border rounded text-right font-mono"
                    />
                </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={false} label={{ value: 'Projects (Ranked by Value/Cost)', position: 'bottom' }}/>
                    <YAxis yAxisId="left" tickFormatter={(val) => formatCompactCurrency(val)} label={{ value: 'Cum. Cost', angle: -90, position: 'insideLeft' }}/>
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Cum. Value', angle: 90, position: 'insideRight' }}/>
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="cost" fill="#cbd5e1" barSize={20} name="Project Cost" />
                    <Line yAxisId="left" type="monotone" dataKey="cumulativeCost" stroke="#ef4444" strokeWidth={2} dot={false} name="Cum. Cost" />
                    <Line yAxisId="right" type="monotone" dataKey="cumulativeValue" stroke="#22c55e" strokeWidth={2} dot={false} name="Cum. Value" />
                    <ReferenceLine yAxisId="left" y={budget} stroke="orange" strokeDasharray="3 3" label="Budget Limit" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};
