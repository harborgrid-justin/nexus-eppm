
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatCompactCurrency } from '../../../utils/formatters';

interface PivotViewProps {
    viewMode: 'Table' | 'Chart';
    pivotData: any;
    valField: string;
    rowField: string;
    colField: string;
}

export const PivotView: React.FC<PivotViewProps> = ({ viewMode, pivotData, valField, rowField, colField }) => {
    const theme = useTheme();
    const { rowKeys, colKeys, values, chartData } = pivotData;

    if (viewMode === 'Table') {
        return (
            <div className="h-full overflow-auto scrollbar-thin bg-white">
                <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] sticky left-0 z-20 bg-slate-50 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                {rowField} \ {colField}
                            </th>
                            {colKeys.map((c: string) => (
                                <th key={c} className="px-4 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-r border-slate-100 min-w-[120px]">
                                    {c}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 bg-white">
                        {rowKeys.map((r: string) => (
                            <tr key={r} className="group hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-sm font-black text-slate-800 uppercase tracking-tight sticky left-0 bg-white group-hover:bg-slate-50 border-r border-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                    {r}
                                </td>
                                {colKeys.map((c: string) => {
                                    const val = values[`${r}::${c}`] || 0;
                                    return (
                                        <td key={c} className="px-4 py-4 text-right border-r border-slate-50 font-mono text-sm text-slate-600 font-medium">
                                            {valField !== 'Count' ? formatCompactCurrency(val) : val}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="h-full p-8 bg-white flex flex-col">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 text-center">Visual Correlation Heatmap</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                        <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 'bold'}} />
                        <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{fontSize: 10, fontWeight: 'bold'}} />
                        <Tooltip 
                            formatter={(val: number) => valField !== 'Count' ? formatCompactCurrency(val) : val}
                            contentStyle={theme.charts.tooltip}
                        />
                        <Legend wrapperStyle={{paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase'}} />
                        {colKeys.map((key: string, index: number) => (
                            <Bar 
                                key={key} 
                                dataKey={key} 
                                stackId="a" 
                                fill={theme.charts.palette[index % theme.charts.palette.length]} 
                                radius={[index === colKeys.length - 1 ? 4 : 0, index === colKeys.length - 1 ? 4 : 0, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
