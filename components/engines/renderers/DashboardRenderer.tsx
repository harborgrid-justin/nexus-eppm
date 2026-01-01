
import React, { useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../../../context/ThemeContext';

interface DashboardRendererProps {
    extensionId: string;
}

export const DashboardRenderer: React.FC<DashboardRendererProps> = ({ extensionId }) => {
    const theme = useTheme();
    const dashboardMetrics = useMemo(() => {
        const seed = extensionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return [1, 2, 3].map(i => ({
            id: i, value: Math.floor(100 + ((seed * i * 37) % 900)),
            trend: (10 + ((seed * i) % 15)).toFixed(1)
        }));
    }, [extensionId]);

    return (
        <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {dashboardMetrics.map(item => (
                <div key={item.id} className={`${theme.components.card} p-5`}>
                    <h4 className="text-slate-500 text-sm font-medium mb-1">Key Metric {item.id}</h4>
                    <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                    <div className="text-xs text-green-600 flex items-center mt-1">+{item.trend}% from last month</div>
                </div>
                ))}
            </div>
            <div className={`h-80 ${theme.components.card} p-4`}>
                <h4 className="text-slate-800 font-bold mb-4">Trends Analysis</h4>
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[ { name: 'Jan', val: 400 }, { name: 'Jun', val: 900 } ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="val" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
