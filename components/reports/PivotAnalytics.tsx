
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Table, BarChart2, Download, Filter, RefreshCw, LayoutTemplate } from 'lucide-react';
import { Button } from '../ui/Button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatCompactCurrency } from '../../utils/formatters';

type PivotField = 'Category' | 'Status' | 'Health' | 'Manager' | 'EPS';
type AggregateField = 'Budget' | 'Spent' | 'Count';

const PivotAnalytics: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    
    const [rowField, setRowField] = useState<PivotField>('Category');
    const [colField, setColField] = useState<PivotField>('Status');
    const [valField, setValField] = useState<AggregateField>('Budget');
    const [viewMode, setViewMode] = useState<'Table' | 'Chart'>('Table');

    // Dynamic Pivot Logic
    const pivotData = useMemo(() => {
        const rows = new Set<string>();
        const cols = new Set<string>();
        const values: Record<string, number> = {};

        state.projects.forEach(p => {
            // Safe Accessors
            const rVal = p.category || 'Unassigned'; // Map 'Category'
            const cVal = p.status || 'Draft'; // Map 'Status' (simplified for demo)
            
            // For real dynamic mapping, we'd use a switch/case based on rowField/colField state
            // Keeping it simple for the scaffold:
            const getFieldVal = (field: PivotField, item: any) => {
                switch(field) {
                    case 'Category': return item.category || 'Unassigned';
                    case 'Status': return item.status || 'Draft';
                    case 'Health': return item.health || 'Unknown';
                    case 'Manager': return item.managerId || 'Unassigned';
                    case 'EPS': return item.epsId || 'Root';
                    default: return 'N/A';
                }
            };
            
            const r = getFieldVal(rowField, p);
            const c = getFieldVal(colField, p);
            
            rows.add(r);
            cols.add(c);
            
            const key = `${r}::${c}`;
            const val = valField === 'Count' ? 1 : (valField === 'Budget' ? p.budget : p.spent);
            values[key] = (values[key] || 0) + val;
        });

        const rowKeys = Array.from(rows).sort();
        const colKeys = Array.from(cols).sort();
        
        // Prepare Chart Data
        const chartData = rowKeys.map(r => {
            const item: any = { name: r };
            colKeys.forEach(c => {
                item[c] = values[`${r}::${c}`] || 0;
            });
            return item;
        });

        return { rowKeys, colKeys, values, chartData };
    }, [state.projects, rowField, colField, valField]);

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className={theme.typography.h2}>Ad-Hoc Analytics Engine</h2>
                    <p className={theme.typography.small}>Multidimensional analysis of portfolio performance.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button onClick={() => setViewMode('Table')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'Table' ? 'bg-white shadow text-nexus-700' : 'text-slate-500'}`}><Table size={14} className="inline mr-1"/> Pivot</button>
                        <button onClick={() => setViewMode('Chart')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${viewMode === 'Chart' ? 'bg-white shadow text-nexus-700' : 'text-slate-500'}`}><BarChart2 size={14} className="inline mr-1"/> Visualize</button>
                    </div>
                    <Button variant="outline" size="sm" icon={Download}>Export</Button>
                </div>
            </div>

            {/* Config Panel */}
            <div className={`${theme.colors.surface} p-4 rounded-xl border ${theme.colors.border} shadow-sm mb-6 flex flex-wrap gap-6 items-center`}>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows</label>
                    <select className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-nexus-500" value={rowField} onChange={e => setRowField(e.target.value as any)}>
                        {['Category', 'Status', 'Health', 'Manager', 'EPS'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Columns</label>
                    <select className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-nexus-500" value={colField} onChange={e => setColField(e.target.value as any)}>
                        {['Category', 'Status', 'Health', 'Manager', 'EPS'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Values</label>
                    <select className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-nexus-500" value={valField} onChange={e => setValField(e.target.value as any)}>
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
                            <thead className="bg-slate-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest border-r border-slate-200 bg-slate-50 sticky left-0">{rowField} \ {colField}</th>
                                    {pivotData.colKeys.map(c => (
                                        <th key={c} className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wide whitespace-nowrap min-w-[120px]">{c}</th>
                                    ))}
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-900 uppercase tracking-widest bg-slate-100">Grand Total</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {pivotData.rowKeys.map(r => {
                                    let rowTotal = 0;
                                    return (
                                        <tr key={r} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 text-sm font-bold text-slate-800 bg-slate-50/50 sticky left-0 border-r border-slate-100">{r}</td>
                                            {pivotData.colKeys.map(c => {
                                                const val = pivotData.values[`${r}::${c}`] || 0;
                                                rowTotal += val;
                                                return (
                                                    <td key={c} className="px-6 py-3 text-right text-sm font-mono text-slate-600">
                                                        {valField === 'Count' ? val : val === 0 ? '-' : formatCompactCurrency(val)}
                                                    </td>
                                                );
                                            })}
                                            <td className="px-6 py-3 text-right text-sm font-mono font-bold text-slate-900 bg-slate-50/50">
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
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(val) => valField === 'Count' ? val : formatCompactCurrency(val)} />
                                <Tooltip formatter={(val: number) => valField === 'Count' ? val : formatCompactCurrency(val)} />
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

export default PivotAnalytics;
