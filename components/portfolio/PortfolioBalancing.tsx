
import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, ScatterChart, XAxis, YAxis, ZAxis, Tooltip, Legend, Scatter, ReferenceLine, ComposedChart, Line, Area, CartesianGrid } from 'recharts';
import { formatCompactCurrency } from '../../utils/formatters';
import { Sliders, RefreshCw, ShieldAlert, Target, Layers } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  'Innovation & Growth': '#0ea5e9',
  'Operational Efficiency': '#22c55e',
  'Regulatory & Compliance': '#eab308',
  'Keep the Lights On': '#64748b'
};

const PortfolioBalancing: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    
    // Feature: Interactive Strategic Weights
    const [weights, setWeights] = useState({ financial: 0.5, strategic: 0.3, risk: 0.2 });
    const [showEfficientFrontier, setShowEfficientFrontier] = useState(true);
    const [budgetConstraint, setBudgetConstraint] = useState(50000000); // 50M

    const handleWeightChange = (key: keyof typeof weights, val: string) => {
        setWeights(prev => ({ ...prev, [key]: parseFloat(val) }));
    };

    // Feature: Data Calculation with Integrated Scoring
    const portfolioData = useMemo(() => {
        return [...state.projects, ...state.programs].map(item => {
            // Feature: Risk-Adjusted Value Calculation
            // We penalize value based on the risk score (Risk Integration)
            const riskFactor = 1 - (item.riskScore / 25); // Normalize 25 (max risk) to a decimal
            
            const rawValue = (item.financialValue * weights.financial) + (item.strategicImportance * weights.strategic);
            const riskAdjustedValue = rawValue * riskFactor;

            return {
                id: item.id,
                name: item.name,
                risk: item.riskScore,
                value: Math.round(riskAdjustedValue * 100),
                budget: item.budget,
                category: item.category,
                roi: item.financialValue * 10
            };
        }).sort((a, b) => b.value - a.value); // Sort by value for frontier
    }, [state.projects, state.programs, weights]);

    // Feature: Efficient Frontier Calculation
    const frontierData = useMemo(() => {
        let cumCost = 0;
        let cumValue = 0;
        return portfolioData.map(p => {
            cumCost += p.budget;
            cumValue += p.value;
            return {
                cost: cumCost,
                value: cumValue,
                name: p.name
            };
        });
    }, [portfolioData]);

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Optimization</h2>
                    <p className={theme.typography.small}>Efficient Frontier & Strategic Balancing</p>
                </div>
                
                {/* Feature: Strategic Drivers Sliders */}
                <div className="flex gap-6 items-center">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Target size={12}/> Financial Weight</label>
                        <input type="range" min="0" max="1" step="0.1" value={weights.financial} onChange={(e) => handleWeightChange('financial', e.target.value)} className="h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-nexus-600"/>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><Layers size={12}/> Strategic Weight</label>
                        <input type="range" min="0" max="1" step="0.1" value={weights.strategic} onChange={(e) => handleWeightChange('strategic', e.target.value)} className="h-1.5 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"/>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 flex items-center gap-1"><ShieldAlert size={12}/> Risk Penalty</label>
                        <input type="range" min="0" max="1" step="0.1" value={weights.risk} onChange={(e) => handleWeightChange('risk', e.target.value)} className="h-1.5 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"/>
                    </div>
                </div>
                
                <button 
                    onClick={() => setShowEfficientFrontier(!showEfficientFrontier)}
                    className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium`}
                >
                    <RefreshCw size={16} /> Recalculate Model
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
                {/* Chart 1: Value vs Risk (The Bubble Chart) */}
                <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm flex flex-col`}>
                    <h3 className="font-bold text-slate-800 mb-4">Risk-Adjusted Value Analysis</h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" dataKey="risk" name="Risk Score" unit="" label={{ value: 'Risk Exposure', position: 'bottom', offset: 0 }}/>
                                <YAxis type="number" dataKey="value" name="Value Score" unit="" label={{ value: 'Strategic Value', angle: -90, position: 'insideLeft' }}/>
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
                                {/* Feature: Risk Tolerance Line */}
                                <ReferenceLine x={15} stroke="red" strokeDasharray="3 3" label="Max Risk Tolerance" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Chart 2: The Efficient Frontier */}
                <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm flex flex-col`}>
                    <h3 className="font-bold text-slate-800 mb-4">Efficient Frontier (Cumulative Value)</h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={frontierData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="cost" 
                                    type="number" 
                                    tickFormatter={(val) => formatCompactCurrency(val)} 
                                    label={{ value: 'Cumulative Budget Investment', position: 'bottom', offset: 0 }}
                                    domain={[0, 'auto']}
                                />
                                <YAxis label={{ value: 'Cumulative Value', angle: -90, position: 'insideLeft' }}/>
                                <Tooltip 
                                    labelFormatter={(val) => `Investment: ${formatCompactCurrency(val as number)}`}
                                />
                                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.1} />
                                <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={3} dot={false} />
                                {/* Feature: Budget Constraint Cutoff */}
                                <ReferenceLine x={budgetConstraint} stroke="red" label="Budget Cap" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 px-4">
                        <label className="text-xs font-bold text-slate-500 uppercase">Adjust Budget Constraint</label>
                        <input 
                            type="range" 
                            min="0" 
                            max={frontierData[frontierData.length-1]?.cost || 100} 
                            value={budgetConstraint} 
                            onChange={(e) => setBudgetConstraint(Number(e.target.value))} 
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2"
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>$0</span>
                            <span className="font-bold text-slate-700">{formatCompactCurrency(budgetConstraint)}</span>
                            <span>Max</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioBalancing;