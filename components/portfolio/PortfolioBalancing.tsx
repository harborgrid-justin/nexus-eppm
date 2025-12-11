
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, ZAxis, Tooltip, Legend, Scatter, PieChart, Pie, Cell } from 'recharts';
import { formatCompactCurrency } from '../../utils/formatters';

const CATEGORY_COLORS: Record<string, string> = {
  'Innovation & Growth': '#0ea5e9',
  'Operational Efficiency': '#22c55e',
  'Regulatory & Compliance': '#eab308',
  'Keep the Lights On': '#64748b'
};

const PortfolioBalancing: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();

    const portfolioData = useMemo(() => {
        return [...state.projects, ...state.programs].map(item => {
            const valueScore = (item.strategicImportance * 0.6) + (item.financialValue * 0.4);
            return {
                name: item.name,
                risk: item.riskScore,
                value: valueScore,
                budget: item.budget,
                category: item.category
            };
        });
    }, [state.projects, state.programs]);

    const categoryDistribution = useMemo(() => {
        const distribution = portfolioData.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + item.budget;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(distribution).map(([name, value]) => ({ name, value }));
    }, [portfolioData]);

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8`}>
            <section>
                <h2 className={theme.typography.h2}>Portfolio Balance: Value vs. Risk</h2>
                <p className={`${theme.typography.small} mb-4`}>Visualize components based on strategic value, risk, and financial size.</p>
                <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} h-[500px]`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <XAxis type="number" dataKey="risk" name="Risk Score" unit="" />
                            <YAxis type="number" dataKey="value" name="Value Score" unit="" />
                            <ZAxis type="number" dataKey="budget" range={[100, 1000]} name="Budget" unit=" USD" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => {
                                if (name === 'Budget') return formatCompactCurrency(value as number);
                                return value;
                            }} />
                            <Legend />
                            {Object.keys(CATEGORY_COLORS).map(cat => (
                                <Scatter 
                                    key={cat}
                                    name={cat}
                                    data={portfolioData.filter(p => p.category === cat)}
                                    fill={CATEGORY_COLORS[cat]}
                                    shape="circle"
                                />
                            ))}
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
            </section>
            
            <section>
                <h2 className={theme.typography.h2}>Investment by Strategic Category</h2>
                 <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} h-[400px]`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {categoryDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCompactCurrency(value as number)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </div>
    );
};

export default PortfolioBalancing;
