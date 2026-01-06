
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../../utils/formatters';
import { ReserveAnalysisData } from '../../../types/index';

interface BurndownChartProps {
    data: ReserveAnalysisData;
}

export const BurndownChart: React.FC<BurndownChartProps> = ({ data }) => {
    const totalUsed = data.drawdowns.contingency + data.drawdowns.management;
    const remaining = data.totalReserves - totalUsed;
    const chartData = [
        { month: 'Start', reserve: data.totalReserves },
        { month: 'Current', reserve: remaining },
        { month: 'Forecast', reserve: Math.max(0, remaining - (totalUsed * 0.2)) } 
    ];

    return (
        <div className="bg-surface border border-border rounded-lg p-[var(--spacing-cardPadding)] h-80">
            <h3 className="font-bold text-text-primary mb-4">Reserve Burndown Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(val) => formatCurrency(val)} width={80} />
                    <Tooltip formatter={(val: number) => formatCurrency(val)} />
                    <Legend />
                    <Area type="monotone" dataKey="reserve" stroke="#8b5cf6" fill="#ddd6fe" name="Available Reserve" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
