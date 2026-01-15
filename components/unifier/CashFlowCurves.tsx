
import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { TrendingUp, Activity } from 'lucide-react';

interface CashFlowCurvesProps {
    data: { date: string; baseline: number; actuals: number; forecast: number }[];
}

export const CashFlowCurves: React.FC<CashFlowCurvesProps> = ({ data }) => {
    const theme = useTheme();

    return (
        <div className={`${theme.components.card} flex flex-col h-full overflow-hidden bg-white rounded-[2.5rem] border-slate-200 shadow-sm`}>
            <div className={`p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-white gap-4`}>
                <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] flex items-center gap-2">
                        <TrendingUp size={18} className="text-nexus-600"/> Fiscal Burn Projection
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Multi-vector liquidity forecast</p>
                </div>
                <div className="flex gap-6 text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 shadow-inner">
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-slate-300 rounded-sm"></div> Baseline</span>
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-green-500 rounded-sm shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div> Actuals</span>
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-blue-500 rounded-sm shadow-[0_0_8px_rgba(14,165,233,0.4)]"></div> Forecast</span>
                </div>
            </div>
            <div className="flex-1 p-8 min-h-[350px]">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                            <XAxis dataKey="date" tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                            <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                            <Area type="monotone" dataKey="baseline" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="5 5" name="Planned Value" fillOpacity={1} />
                            <Area type="monotone" dataKey="actuals" fill="#dcfce7" stroke="#10b981" strokeWidth={3} name="Invoiced Actuals" fillOpacity={0.4} />
                            <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} name="EAC Projection" />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full nexus-empty-pattern rounded-[2rem] flex flex-col items-center justify-center text-slate-300">
                        <Activity size={48} className="mb-4 opacity-10"/>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Analyzing Financial Signals...</p>
                    </div>
                )}
            </div>
        </div>
    );
};
