
import React from 'react';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { TrendingUp } from 'lucide-react';

interface CashFlowCurvesProps {
    data: { date: string; baseline: number; actuals: number; forecast: number }[];
}

export const CashFlowCurves: React.FC<CashFlowCurvesProps> = ({ data }) => {
    const theme = useTheme();

    return (
        <div className={`${theme.components.card} flex flex-col h-full overflow-hidden`}>
            <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center bg-white`}>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp size={18} className="text-nexus-600"/> Cash Flow Analysis
                </h3>
                <div className="flex gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-300 rounded-sm"></div> Baseline</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Actuals</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Forecast</span>
                </div>
            </div>
            <div className="flex-1 p-4 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                        <XAxis dataKey="date" tick={{fontSize: 12}} />
                        <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{fontSize: 12}} />
                        <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={theme.charts.tooltip} />
                        <Legend />
                        <Area type="monotone" dataKey="baseline" fill="#e2e8f0" stroke="#94a3b8" strokeDasharray="5 5" name="Baseline" fillOpacity={0.4} />
                        <Area type="monotone" dataKey="actuals" fill="#dcfce7" stroke="#22c55e" strokeWidth={2} name="Actuals" />
                        <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={2} dot={false} name="Forecast" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
