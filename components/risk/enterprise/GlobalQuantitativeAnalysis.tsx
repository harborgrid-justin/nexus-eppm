
import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import { BarChart2, Play, RefreshCw, AlertTriangle, Activity } from 'lucide-react';
import { Button } from '../../ui/Button';
import StatCard from '../../shared/StatCard';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { formatCompactCurrency } from '../../../utils/formatters';

export const GlobalQuantitativeAnalysis: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [isSimulating, setIsSimulating] = useState(false);
    const [result, setResult] = useState<any>(null);

    const runPortfolioSimulation = () => {
        setIsSimulating(true);
        setTimeout(() => {
            const iterations = 1000;
            const portfolioBudget = state.projects.reduce((sum, p) => sum + p.budget, 0);
            const simResults = [];

            for(let i=0; i<iterations; i++) {
                let iterationCost = 0;
                state.projects.forEach(p => {
                    // Base cost + random risk variance
                    // Higher risk score = higher potential variance
                    const riskFactor = 1 + (Math.random() * (p.riskScore / 100)); // e.g. score 20 => 0-20% variance
                    iterationCost += p.budget * riskFactor;
                });
                simResults.push(iterationCost);
            }

            simResults.sort((a,b) => a - b);
            const p50 = simResults[Math.floor(iterations * 0.50)];
            const p80 = simResults[Math.floor(iterations * 0.80)];
            const maxCost = simResults[iterations - 1];
            
            // Histogram
            const min = simResults[0];
            const range = maxCost - min;
            const buckets = 20;
            const bucketSize = range / buckets;
            const histogramData = [];
            let cumulative = 0;

            for(let b=0; b<buckets; b++) {
                const start = min + (b * bucketSize);
                const end = start + bucketSize;
                const count = simResults.filter(r => r >= start && r < end).length;
                cumulative += count;
                histogramData.push({
                    range: formatCompactCurrency(start),
                    count,
                    cumulative: (cumulative / iterations) * 100,
                    rawVal: start
                });
            }

            setResult({
                deterministic: portfolioBudget,
                p50,
                p80,
                contingency: p80 - portfolioBudget,
                data: histogramData
            });
            setIsSimulating(false);
        }, 800);
    };

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6`}>
            <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl text-white shadow-lg">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2"><BarChart2 className="text-nexus-400"/> Portfolio Risk Model</h2>
                    <p className="text-sm text-slate-400">Monte Carlo simulation of total portfolio cost exposure.</p>
                </div>
                <Button onClick={runPortfolioSimulation} disabled={isSimulating} className="bg-nexus-600 border-none text-white hover:bg-nexus-500">
                    {isSimulating ? <RefreshCw className="animate-spin mr-2"/> : <Play className="mr-2"/>}
                    Run Simulation
                </Button>
            </div>

            {result ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard title="Deterministic Cost" value={formatCompactCurrency(result.deterministic)} icon={BarChart2} />
                        <StatCard title="P50 Confidence" value={formatCompactCurrency(result.p50)} icon={BarChart2} />
                        <StatCard title="P80 Confidence" value={formatCompactCurrency(result.p80)} icon={BarChart2} trend="up" />
                        <StatCard title="Required Contingency" value={formatCompactCurrency(result.contingency)} icon={AlertTriangle} subtext="To reach P80" />
                    </div>

                    <div className={`${theme.components.card} p-6 h-[500px]`}>
                        <h3 className={theme.typography.h3}>Cost Frequency Distribution</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={result.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="range" tick={{fontSize: 10}} />
                                <YAxis yAxisId="left" label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }} />
                                <YAxis yAxisId="right" orientation="right" unit="%" />
                                <Tooltip />
                                <Bar yAxisId="left" dataKey="count" fill="#cbd5e1" barSize={30} />
                                <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#0ea5e9" strokeWidth={3} dot={false} />
                                <ReferenceLine x={result.data.find((d:any) => d.cumulative >= 80)?.range} stroke="#f59e0b" label="P80" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </>
            ) : (
                <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 bg-slate-50">
                    <Activity size={48} className="mb-4 opacity-20"/>
                    <p>Run the simulation to generate portfolio risk profile.</p>
                </div>
            )}
        </div>
    );
};
