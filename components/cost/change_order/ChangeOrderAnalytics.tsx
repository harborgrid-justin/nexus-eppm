
import React, { useMemo } from 'react';
import { ChangeOrder } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatCompactCurrency, formatCurrency } from '../../../utils/formatters';

interface ChangeOrderAnalyticsProps {
    orders: ChangeOrder[];
}

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444'];

export const ChangeOrderAnalytics: React.FC<ChangeOrderAnalyticsProps> = ({ orders }) => {
    const theme = useTheme();
    
    const categoryData = useMemo(() => {
        const counts: Record<string, number> = {};
        orders.forEach(co => counts[co.category] = (counts[co.category] || 0) + 1);
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [orders]);

    const trendData = useMemo(() => {
        const sorted = [...orders].sort((a,b) => new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime());
        let cumulative = 0;
        return sorted.map(co => {
            cumulative += co.amount;
            return {
                date: new Date(co.dateSubmitted).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                amount: co.amount,
                cumulative: cumulative,
                name: co.title
            };
        });
    }, [orders]);

    if (orders.length === 0) {
        return (
            <div className={`h-full flex items-center justify-center ${theme.colors.text.tertiary} bg-slate-50 rounded-xl border border-dashed border-slate-200 m-4`}>
                <p>No change orders available for analysis.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto pb-6 px-6">
            <div className={`bg-white p-6 rounded-xl border ${theme.colors.border} h-[400px] shadow-sm`}>
                <h3 className={theme.typography.h3}>Change Volume by Category</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {categoryData.map((e, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            <div className={`bg-white p-6 rounded-xl border ${theme.colors.border} h-[400px] shadow-sm flex flex-col`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={theme.typography.h3}>Cumulative Cost Impact</h3>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        Total: {formatCompactCurrency(trendData[trendData.length - 1]?.cumulative || 0)}
                    </span>
                </div>
                <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                            <XAxis dataKey="date" tick={{fontSize: 12}} />
                            <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{fontSize: 12}} />
                            <Tooltip 
                                formatter={(val: number) => formatCurrency(val)}
                                labelStyle={{fontWeight: 'bold'}}
                                contentStyle={theme.charts.tooltip}
                            />
                            <Area type="monotone" dataKey="cumulative" stroke="#ef4444" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2} name="Total Impact" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
