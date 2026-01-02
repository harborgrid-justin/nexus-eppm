import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../../context/ThemeContext';

export const BurndownChart: React.FC<{ data: any }> = () => {
    const theme = useTheme();
    // Mock burndown data
    const data = [
        { month: 'Jan', reserve: 500000 },
        { month: 'Feb', reserve: 480000 },
        { month: 'Mar', reserve: 480000 },
        { month: 'Apr', reserve: 450000 },
        { month: 'May', reserve: 420000 },
        { month: 'Jun', reserve: 410000 },
    ];

    return (
        <div className={`${theme.components.card} ${theme.layout.cardPadding} h-80`}>
            <h3 className="font-bold text-slate-800 mb-4">Reserve Burndown Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="reserve" stroke="#8b5cf6" fill="#ddd6fe" name="Available Reserve" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
