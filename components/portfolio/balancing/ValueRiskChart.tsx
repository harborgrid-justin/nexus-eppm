
import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ReferenceLine, Cell } from 'recharts';
import { useTheme } from '../../../context/ThemeContext';
import { PORTFOLIO_CATEGORY_COLORS } from '../../../constants/index';

interface ValueRiskChartProps {
    data: any[];
}

export const ValueRiskChart: React.FC<ValueRiskChartProps> = ({ data }) => {
    const theme = useTheme();

    return (
        <div className={`${theme.components.card} ${theme.layout.cardPadding} h-[400px]`}>
            <h3 className="font-bold text-slate-800 mb-4">Value vs. Risk Analysis</h3>
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" dataKey="value" name="Value Score" label={{ value: 'Weighted Value', position: 'bottom', offset: 0 }} />
                    <YAxis type="number" dataKey="risk" name="Risk Score" label={{ value: 'Risk Exposure', angle: -90, position: 'insideLeft' }} />
                    <ZAxis type="number" dataKey="budget" range={[50, 500]} name="Budget" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                        if (payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                                <div className="bg-white p-2 border border-slate-200 shadow-lg rounded text-xs">
                                    <p className="font-bold">{d.name}</p>
                                    <p>Value: {d.value}, Risk: {d.risk}</p>
                                    <p className="text-slate-500">{d.category}</p>
                                </div>
                            );
                        }
                        return null;
                    }} />
                    <ReferenceLine x={50} stroke={theme.colors.border} strokeDasharray="3 3" />
                    <ReferenceLine y={15} stroke={theme.colors.border} strokeDasharray="3 3" />
                    <Scatter name="Projects" data={data}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PORTFOLIO_CATEGORY_COLORS[entry.category] || '#8884d8'} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};
