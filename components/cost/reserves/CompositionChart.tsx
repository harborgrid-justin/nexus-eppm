
import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../../utils/formatters';
import { ReserveAnalysisData } from '../../../types/index';
import { useTheme } from '../../../context/ThemeContext';

export const CompositionChart: React.FC<{ data: ReserveAnalysisData }> = ({ data }) => {
    const theme = useTheme();
    const chartData = [
        { name: 'Remaining Contingency', value: data.remainingContingency, color: theme.charts.palette[1] },
        { name: 'Remaining Mgmt Reserve', value: data.remainingManagement, color: theme.charts.palette[4] },
    ];

    return (
        <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-lg p-6 h-80`}>
            <h3 className={`font-bold ${theme.colors.text.primary} mb-4`}>Reserve Composition</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={theme.charts.tooltip} formatter={(val: number) => formatCurrency(val)} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
