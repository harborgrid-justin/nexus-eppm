
import React from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, Line } from 'recharts';
import { Card } from '../../ui/Card';
import { Loader2, TrendingUp } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { formatCompactCurrency, formatCurrency } from '../../../utils/formatters';

interface CostForecastChartProps {
    chartData: any[];
    isPending: boolean;
}

export const CostForecastChart: React.FC<CostForecastChartProps> = ({ chartData, isPending }) => {
    const theme = useTheme();
    return (
        <Card className={`p-8 h-[450px] relative transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            {isPending && <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/20 backdrop-blur-[1px]"><Loader2 className="animate-spin text-nexus-600 mb-2" size={32}/><p className="text-[10px] font-black uppercase text-nexus-700 tracking-widest">Simulating EAC Curve...</p></div>}
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2 border-b border-slate-50 pb-4"><TrendingUp className="text-nexus-600" size={20}/> Risk-Adjusted S-Curve (PMB)</h3>
            <div className="flex-1 h-[320px]">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                            <XAxis dataKey="date" tick={{fontSize: 11, fontWeight: 'bold'}} />
                            <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{fontSize: 11, fontWeight: 'bold'}} />
                            <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={theme.charts.tooltip} />
                            <Area type="monotone" dataKey="PV" fill="#f1f5f9" stroke="#94a3b8" strokeWidth={2} name="Planned Value" />
                            <Line type="monotone" dataKey="EV" stroke={theme.charts.palette[1]} strokeWidth={3} dot={false} name="Earned Value" />
                            <Line type="monotone" dataKey="AC" stroke={theme.charts.palette[3]} strokeWidth={3} dot={false} name="Actual Cost" />
                            <Line type="monotone" dataKey="Forecast" stroke={theme.charts.palette[2]} strokeWidth={3} strokeDasharray="6 4" name="EAC Projection" dot={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">
                        Chart requires a defined project schedule and budget.
                    </div>
                )}
            </div>
        </Card>
    );
};
