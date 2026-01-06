
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../../utils/formatters';
import { ReserveAnalysisData } from '../../../types/index';

export const CompositionChart: React.FC<{ data: ReserveAnalysisData }> = ({ data }) => {
    const chartData = [
        { name: 'Remaining Contingency', value: data.remainingContingency, color: '#10b981' },
        { name: 'Used Contingency', value: data.drawdowns.contingency, color: '#f59e0b' },
        { name: 'Remaining Mgmt Reserve', value: data.remainingManagement, color: '#3b82f6' },
        { name: 'Used Mgmt Reserve', value: data.drawdowns.management, color: '#ef4444' },
    ];

    return (
        <div className="bg-surface border border-border rounded-lg p-[var(--spacing-cardPadding)] h-80">
            <h3 className="font-bold text-text-primary mb-4">Reserve Composition & Usage</h3>
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
