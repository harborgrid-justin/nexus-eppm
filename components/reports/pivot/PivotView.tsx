
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
            <div className="h-full overflow-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className={`${theme.colors.background} sticky top-0 z-10`}>
                        <tr>
                            <th className={`px-6 py-4 text-left text-xs font-black ${theme.colors.text.secondary} uppercase tracking-widest border-r ${theme.colors.border} ${theme.colors.background} sticky left-0 shadow-sm`}>{rowField} \ {colField}</th>
                            {colKeys.map((c: string) => (
                                <th key={c} className={`px-6 py-4 text-right text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-wide whitespace-nowrap min-w-[120px]`}>{c}</th>
                            ))}
                            <th className={`px-6 py-4 text-right text-xs font-black ${theme.colors.text.primary} uppercase tracking-widest ${theme.colors.surface} border-l ${theme.colors.border}`}>Grand Total</th>
                        </tr>
                    </thead>
                    <tbody className={`${theme.colors.surface} divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                        {rowKeys.map((r: string) => {
                            let rowTotal = 0;
                            return (
                                <tr key={r} className={`hover:${theme.colors.background} transition-colors group`}>
                                    <td className={`px-6 py-3 text-sm font-bold ${theme.colors.text.primary} ${theme.colors.background} sticky left-0 border-r ${theme.colors.border} shadow-sm`}>{r}</td>
                                    {colKeys.map((c: string) => {
                                        const val = values[`${r}::${c}`] || 0;
                                        rowTotal += val;
                                        return (
                                            <td key={c} className={`px-6 py-3 text-right text-sm font-mono ${theme.colors.text.secondary} group-hover:${theme.colors.text.primary}`}>
                                                {valField === 'Count' ? val : val === 0 ? '-' : formatCompactCurrency(val)}
                                            </td>
                                        );
                                    })}
                                    <td className={`px-6 py-3 text-right text-sm font-mono font-bold ${theme.colors.text.primary} ${theme.colors.background} border-l ${theme.colors.border} shadow-sm`}>
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
        <div className="h-full p-6 animate-nexus-in">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                    <XAxis dataKey="name" stroke={theme.colors.text.secondary} />
                    <YAxis tickFormatter={(val) => valField === 'Count' ? val : formatCompactCurrency(val)} stroke={theme.colors.text.secondary} />
                    <Tooltip formatter={(val: number) => valField === 'Count' ? val : formatCompactCurrency(val)} contentStyle={theme.charts.tooltip} />
                    <Legend />
                    {colKeys.map((c: string, i: number) => (
                        <Bar key={c} dataKey={c} stackId="a" fill={theme.charts.palette[i % theme.charts.palette.length]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
