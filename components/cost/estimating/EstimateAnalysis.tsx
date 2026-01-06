import React from 'react';
import { CostEstimate, CostEstimateItem } from '../../../types/index';
import { PieChart, Calculator } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../../../utils/formatters';
import { useTheme } from '../../../context/ThemeContext';

interface EstimateAnalysisProps {
  estimate: CostEstimate;
  chartData: { name: string; value: number }[];
  colors: string[];
  estimateClasses: { id: string; accuracy: string }[];
}

export const EstimateAnalysis: React.FC<EstimateAnalysisProps> = ({ estimate, chartData, colors, estimateClasses }) => {
  const theme = useTheme();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${theme.components.card} p-6`}>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChart size={18}/> Cost Distribution by Type</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />)}
                        </Pie>
                        <Tooltip formatter={(val: number) => formatCurrency(val)} />
                        <Legend />
                    </RePieChart>
                </ResponsiveContainer>
            </div>
        </div>
        <div className={`${theme.components.card} p-6`}>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Calculator size={18}/> Estimating Metrics</h3>
            <div className="space-y-4">
                <div className={`p-4 ${theme.colors.background} rounded-lg flex justify-between items-center`}>
                    <span className="text-sm text-slate-600">Estimate Class</span>
                    <span className="font-bold text-slate-900">{estimate.class}</span>
                </div>
                <div className={`p-4 ${theme.colors.background} rounded-lg flex justify-between items-center`}>
                    <span className="text-sm text-slate-600">Expected Accuracy</span>
                    <span className="font-bold text-nexus-600">{estimateClasses.find(c => c.id === estimate.class)?.accuracy}</span>
                </div>
                <div className={`p-4 ${theme.colors.background} rounded-lg flex justify-between items-center`}>
                    <span className="text-sm text-slate-600">Item Count</span>
                    <span className="font-bold text-slate-900">{estimate.items.length}</span>
                </div>
            </div>
        </div>
    </div>
  );
};
