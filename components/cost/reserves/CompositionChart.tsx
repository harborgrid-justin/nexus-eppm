
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../../utils/formatters';
import { useTheme } from '../../../context/ThemeContext';
import { ReserveAnalysisData } from '../../../types';

export const CompositionChart: React.FC<{ data: ReserveAnalysisData }> = ({ data }) => {
    const theme = useTheme();
    const chartData = [
        { name: 'Remaining Contingency', value: data.remainingContingency, color: '#10b981' },
        { name: 'Used Contingency', value: data.drawdowns.contingency, color: '#f59e0b' },
        { name: 'Remaining Mgmt Reserve', value: data.remainingManagement, color: '#3b82f6' },
        { name: 'Used Mgmt Reserve', value: data.drawdowns.management, color: '#ef4444' },
    ];

    return (
        <div className={`${theme.components.card} ${theme.layout.cardPadding} h-80`}>
            <h3 className="font-bold text-slate-800 mb-4">Reserve Composition & Usage</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(val: number) => formatCurrency(val)} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
