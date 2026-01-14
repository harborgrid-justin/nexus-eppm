import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { BarChart2, Play, RefreshCw, AlertTriangle, Activity } from 'lucide-react';
import { Button } from '../../ui/Button';
import StatCard from '../../shared/StatCard';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { formatCompactCurrency } from '../../../utils/formatters';
import { useGlobalQuantitativeAnalysisLogic } from '../../../hooks/domain/useGlobalQuantitativeAnalysisLogic';
import { EmptyGrid } from '../../common/EmptyGrid';

export const GlobalQuantitativeAnalysis: React.FC = () => {
    const theme = useTheme();
    const { isSimulating, result, runPortfolioSimulation } = useGlobalQuantitativeAnalysisLogic();

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-500 scrollbar-thin`}>
            <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-32 bg-nexus-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-nexus-500/20 transition-colors"></div>
                <div className="relative z-10">
                    <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <BarChart2 className="text-nexus-400" size={24}/> Monte Carlo Portfolio Solver
                    </h2>
                    <p className="text-sm text-slate-400 font-medium mt-1">Multi-variable stochastic modeling of total enterprise exposure.</p>
                </div>
                <Button onClick={runPortfolioSimulation} disabled={isSimulating} className="bg-nexus-600 border-none text-white hover:bg-nexus-500 shadow-xl shadow-nexus-500/20 relative z-10 px-8 h-12 font-black uppercase tracking-widest text-xs">
                    {isSimulating ? <RefreshCw className="animate-spin mr-2" size={16}/> : <Play className="mr-2" size={16}/>}
                    {isSimulating ? 'Simulating Threads...' : 'Run Simulation'}
                </Button>
            </div>

            {result ? (
                <>
                    <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
                        <StatCard title="Deterministic Basis" value={formatCompactCurrency(result.deterministic)} icon={BarChart2} subtext="Simple Budget Sum" />
                        <StatCard title="P50 Probability" value={formatCompactCurrency(result.p50)} icon={Activity} subtext="Median Forecast" />
                        <StatCard title="P80 Confidence" value={formatCompactCurrency(result.p80)} icon={ShieldAlert} trend="down" subtext="Target for Funding" />
                        <StatCard title="Exposure Delta" value={formatCompactCurrency(result.contingency)} icon={AlertTriangle} subtext="Required Buffer" />
                    </div>

                    <div className={`${theme.components.card} p-10 rounded-[2.5rem] h-[500px] shadow-sm flex flex-col`}>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-10 border-b border-slate-50 pb-4 flex items-center gap-2">
                             <TrendingUp size={16}/> Cost Frequency & Confidence (S-Curve)
                        </h3>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={result.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                                    <XAxis dataKey="range" tick={{fontSize: 10, fontStyle: 'bold', fill: theme.colors.text.secondary}} />
                                    <YAxis yAxisId="left" tickFormatter={(val) => val} tick={{fontSize: 10, fill: theme.colors.text.secondary}} />
                                    <YAxis yAxisId="right" orientation="right" unit="%" tick={{fontSize: 10, fill: theme.colors.text.secondary}} />
                                    <Tooltip contentStyle={theme.charts.tooltip} />
                                    <Bar yAxisId="left" dataKey="count" fill="#cbd5e1" barSize={35} radius={[6,6,0,0]} name="Frequency" />
                                    <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke={theme.charts.palette[0]} strokeWidth={4} dot={false} name="Cumulative Probability" />
                                    <ReferenceLine x={result.data.find((d:any) => d.cumulative >= 80)?.range} stroke="#f59e0b" strokeDasharray="5 5" label={{ value: 'P80 CAP', position: 'top', fontSize: 10, fontWeight: 'black', fill: '#f59e0b' }} yAxisId="left" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1">
                    <EmptyGrid 
                        title="Statistical Engine Neutral"
                        description="Execute the 1000-iteration Monte Carlo model to calculate the probability distribution of portfolio cost completion."
                        icon={Activity}
                        actionLabel="Initialize Simulation"
                        onAdd={runPortfolioSimulation}
                    />
                </div>
            )}
        </div>
    );
};
import { ShieldAlert, TrendingUp } from 'lucide-react';