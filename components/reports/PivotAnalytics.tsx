
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Table, BarChart2, Download, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatCompactCurrency } from '../../utils/formatters';
import { usePivotAnalyticsLogic } from '../../hooks/domain/usePivotAnalyticsLogic';

const PivotAnalytics: React.FC = () => {
    const theme = useTheme();
    const {
        rowField, setRowField,
        colField, setColField,
        valField, setValField,
        viewMode, setViewMode,
        pivotData
    } = usePivotAnalyticsLogic();

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className={theme.typography.h2}>Ad-Hoc Analytics Engine</h2>
                    <p className={theme.typography.small}>Multidimensional analysis of portfolio performance.</p>
                </div>
                <div className="flex gap-2">
                    <div className={`flex ${theme.colors.background} p-1 rounded-lg border ${theme.colors.border}`}>
                        <button onClick={() => setViewMode('Table')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'Table' ? `${theme.colors.surface} shadow text-nexus-700` : `${theme.colors.text.secondary}`}`}><Table size={14} className="inline mr-1"/> Pivot</button>
                        <button onClick={() => setViewMode('Chart')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'Chart' ? `${theme.colors.surface} shadow text-nexus-700` : `${theme.colors.text.secondary}`}`}><BarChart2 size={14} className="inline mr-1"/> Visualize</button>
                    </div>
                    <Button variant="outline" size="sm" icon={Download}>Export</Button>
                </div>
            </div>

            {/* Config Panel */}
            <div className={`${theme.colors.surface} p-4 rounded-xl border ${theme.colors.border} shadow-sm mb-6 flex flex-wrap gap-6 items-center`}>
                <div className="flex flex-col gap-1">
                    <label className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest`}>Rows</label>
                    <select className={`${theme.colors.background} border ${theme.colors.border} rounded-lg py-1.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-nexus-500`} value={rowField} onChange={e => setRowField(e.target.value as any)}>
                        {['Category', 'Status', 'Health', 'Manager', 'EPS'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest`}>Columns</label>
                    <select className={`${theme.colors.background} border ${theme.colors.border} rounded-lg py-1.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-nexus-500`} value={colField} onChange={e => setColField(e.target.value as any)}>
                        {['Category', 'Status', 'Health', 'Manager', 'EPS'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest`}>Values</label>
                    <select className={`${theme.colors.background} border ${theme.colors.border} rounded-lg py-1.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-nexus-500`} value={valField} onChange={e => setValField(e.target.value as any)}>
                        {['Budget', 'Spent', 'Count'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                <div className="ml-auto">
                    <Button size="sm" variant="ghost" icon={RefreshCw}>Recalculate</Button>
                </div>
            </div>

            {/* Content */}
            <div className={`flex-1 ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                {viewMode === 'Table' ? (
                    <div className="h-full overflow-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className={`${theme.colors.background} sticky top-0 z-10`}>
                                <tr>
                                    <th className={`px-6 py-4 text-left text-xs font-black ${theme.colors.text.secondary} uppercase tracking-widest border-r ${theme.colors.border} ${theme.colors.background} sticky left-0`}>{rowField} \ {colField}</th>
                                    {pivotData.colKeys.map(c => (
                                        <th key={c} className={`px-6 py-4 text-right text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-wide whitespace-nowrap min-w-[120px]`}>{c}</th>
                                    ))}
                                    <th className={`px-6 py-4 text-right text-xs font-black ${theme.colors.text.primary} uppercase tracking-widest ${theme.colors.surface} border-l ${theme.colors.border}`}>Grand Total</th>
                                </tr>
                            </thead>
                            <tbody className={`${theme.colors.surface} divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                                {pivotData.rowKeys.map(r => {
                                    let rowTotal = 0;
                                    return (
                                        <tr key={r} className={`hover:${theme.colors.background}`}>
                                            <td className={`px-6 py-3 text-sm font-bold ${theme.colors.text.primary} ${theme.colors.background} sticky left-0 border-r ${theme.colors.border}`}>{r}</td>
                                            {pivotData.colKeys.map(c => {
                                                const val = pivotData.values[`${r}::${c}`] || 0;
                                                rowTotal += val;
                                                return (
                                                    <td key={c} className={`px-6 py-3 text-right text-sm font-mono ${theme.colors.text.secondary}`}>
                                                        {valField === 'Count' ? val : val === 0 ? '-' : formatCompactCurrency(val)}
                                                    </td>
                                                );
                                            })}
                                            <td className={`px-6 py-3 text-right text-sm font-mono font-bold ${theme.colors.text.primary} ${theme.colors.background} border-l ${theme.colors.border}`}>
                                                {valField === 'Count' ? rowTotal : formatCompactCurrency(rowTotal)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="h-full p-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pivotData.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                                <XAxis dataKey="name" stroke={theme.colors.text.secondary} />
                                <YAxis tickFormatter={(val) => valField === 'Count' ? val : formatCompactCurrency(val)} stroke={theme.colors.text.secondary} />
                                <Tooltip 
                                    formatter={(val: number) => valField === 'Count' ? val : formatCompactCurrency(val)} 
                                    contentStyle={theme.charts.tooltip}
                                />
                                <Legend />
                                {pivotData.colKeys.map((c, i) => (
                                    <Bar key={c} dataKey={c} stackId="a" fill={theme.charts.palette[i % theme.charts.palette.length]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};
