
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { BarChart2, Play, RefreshCw, AlertTriangle, Activity } from 'lucide-react';
import { Button } from '../../ui/Button';
import StatCard from '../../shared/StatCard';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { formatCompactCurrency } from '../../../utils/formatters';
import { useGlobalQuantitativeAnalysisLogic } from '../../../hooks/domain/useGlobalQuantitativeAnalysisLogic';

export const GlobalQuantitativeAnalysis: React.FC = () => {
    const theme = useTheme();
    const { isSimulating, result, runPortfolioSimulation } = useGlobalQuantitativeAnalysisLogic();

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
