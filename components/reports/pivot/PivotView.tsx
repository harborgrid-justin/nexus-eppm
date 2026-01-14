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
                    <thead className={`${theme.colors.background}/95 sticky top-0 z-10 backdrop-blur-md`}>
                        <tr>
                            <th className={`px-8 py-5 text-left text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-[0.2em] border-r ${theme.colors.border} ${theme.colors.background} sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]`}>{rowField} / {colField}</th>
                            {colKeys.map((c: string) => (
                                <th key={c} className={`px-6 py-5 text-right text-[10px] font-black ${theme.colors.text.secondary} uppercase tracking-widest whitespace-nowrap min-w-[140px] border-r ${theme.colors.border}`}>{c}</th>
                            ))}
                            <th className={`px-8 py-5 text-right text-[10px] font-black ${theme.colors.text.primary} uppercase tracking-[0.2em] ${theme.colors.surface} border-l ${theme.colors.border} bg-slate-50`}>Total Sum</th>
                        </tr>
                    </thead>
                    <tbody className={`${theme.colors.surface} divide-y divide-slate-50`}>
                        {rowKeys.map((r: string) => {
                            let rowTotal = 0;
                            return (
                                <tr key={r} className={`hover:${theme.colors.background}/50 transition-colors group`}>
                                    <td className={`px-8 py-4 text-sm font-black ${theme.colors.text.primary} ${theme.colors.surface} sticky left-0 border-r ${theme.colors.border} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] group-hover:bg-slate-50 transition-colors uppercase tracking-tight`}>{r}</td>
                                    {colKeys.map((c: string) => {
                                        const val = values[`${r}::${c}`] || 0;
                                        rowTotal += val;
                                        return (
                                            <td key={c} className={`px-6 py-4 text-right text-sm font-mono font-bold ${theme.colors.text.secondary} group-hover:${theme.colors.text.primary} border-r border-slate-50`}>
                                                {valField === 'Count' ? val : val === 0 ? <span className="opacity-20">-</span> : formatCompactCurrency(val)}
                                            </td>
                                        );
                                    })}
                                    <td className={`px-8 py-4 text-right text-sm font-mono font-black ${theme.colors.text.primary} ${theme.colors.background}/30 border-l ${theme.colors.border} bg-slate-50/30`}>
                                        {valField === 'Count' ? rowTotal : formatCompactCurrency(rowTotal)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="h-full p-10 animate-nexus-in bg-white">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                    <XAxis dataKey="name" stroke={theme.colors.text.tertiary} tick={{fontSize: 10, fontWeight: 'bold'}} />
                    <YAxis tickFormatter={(val) => valField === 'Count' ? val : formatCompactCurrency(val)} stroke={theme.colors.text.tertiary} tick={{fontSize: 10, fontWeight: 'bold'}} />
                    <Tooltip formatter={(val: number) => valField === 'Count' ? val : formatCompactCurrency(val)} contentStyle={theme.charts.tooltip} />
                    <Legend wrapperStyle={{paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'black', letterSpacing: '0.1em'}} />
                    {colKeys.map((c: string, i: number) => (
                        <Bar key={c} dataKey={c} stackId="a" fill={theme.charts.palette[i % theme.charts.palette.length]} radius={i === colKeys.length - 1 ? [6,6,0,0] : [0,0,0,0]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};