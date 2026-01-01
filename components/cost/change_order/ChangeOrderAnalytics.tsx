
import React, { useMemo } from 'react';
import { ChangeOrder } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

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

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-y-auto">
            <div className="bg-white p-6 rounded-xl border h-[400px]">
                <h3 className={theme.typography.h3}>Change Volume by Category</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {categoryData.map((e, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-xl border h-[400px] flex items-center justify-center text-slate-400">
                <p>Cumulative Cost Impact Chart Coming Soon</p>
            </div>
        </div>
    );
};
