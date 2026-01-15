
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { BarChart2, Play, RefreshCw, AlertTriangle, Activity, ShieldCheck, TrendingUp } from 'lucide-react';
import { Button } from '../../ui/Button';
import StatCard from '../../shared/StatCard';
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from 'recharts';
import { formatCompactCurrency, formatCurrency } from '../../../utils/formatters';
import { useGlobalQuantitativeAnalysisLogic } from '../../../hooks/domain/useGlobalQuantitativeAnalysisLogic';
import { EmptyGrid } from '../../common/EmptyGrid';

export const GlobalQuantitativeAnalysis: React.FC = () => {
    const theme = useTheme();
    const { isSimulating, result, runPortfolioSimulation } = useGlobalQuantitativeAnalysisLogic();

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-10 animate-in fade-in duration-500 scrollbar-thin bg-slate-50/50`}>
            <div className="flex flex-col md:flex-row justify-between items-center bg-slate-950 p-12 rounded-[3rem] text-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] relative overflow-hidden group border border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(14,165,233,0.1)_1.5px,transparent_1.5px)] bg-[size:32px_32px] pointer-events-none opacity-40"></div>
                <div className="absolute top-0 right-0 p-48 bg-nexus-600/10 rounded-full blur-[120px] -mr-24 -mt-24 pointer-events-none group-hover:bg-nexus-600/20 transition-all duration-700"></div>
                
                <div className="relative z-10 flex-1">
                    <h2 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-6">
                        <BarChart2 className="text-nexus-400" size={40}/> Monte Carlo Portfolio Solver
                    </h2>
                    <p className="text-base text-slate-400 font-medium mt-4 max-w-2xl leading-relaxed uppercase tracking-tight opacity-70">10,000-iteration stochastic modeling of total enterprise financial exposure based on risk-weighted project variance.</p>
                </div>
                <Button 
                    onClick={runPortfolioSimulation} 
                    disabled={isSimulating} 
                    className="bg-nexus-600 border-none text-white hover:bg-nexus-500 shadow-[0_0_40px_rgba(14,165,233,0.3)] relative z-10 px-12 h-16 font-black uppercase tracking-[0.2em] text-sm rounded-2xl transition-all hover:scale-105 active:scale-95"
                >
                    {isSimulating ? <RefreshCw className="animate-spin mr-3" size={20}/> : <Play className="mr-3" size={20}/>}
                    {isSimulating ? 'SIMULATING THREADS...' : 'RUN PORTFOLIO MODEL'}
                </Button>
            </div>

            {result ? (
                <div className="space-y-10 animate-nexus-in">
                    <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
                        <StatCard title="Deterministic Baseline" value={formatCompactCurrency(result.deterministic)} icon={BarChart2} subtext="Global Project Budget Sum" />
                        <StatCard title="P50 Central Estimate" value={formatCompactCurrency(result.p50)} icon={Activity} subtext="Median Statistical Forecast" />
                        <StatCard title="P80 Confidence Cap" value={formatCompactCurrency(result.p80)} icon={ShieldCheck} trend="down" subtext="Funding Goal for Security" />
                        <StatCard title="Contingency Requirement" value={formatCompactCurrency(result.contingency)} icon={AlertTriangle} subtext="Required Risk Reserve" />
                    </div>

                    <div className={`${theme.components.card} p-12 rounded-[3.5rem] h-[550px] shadow-2xl flex flex-col bg-white border-slate-100`}>
                        <div className="flex justify-between items-center mb-12 border-b border-slate-50 pb-6">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                                    <TrendingUp size={18} className="text-nexus-600"/> Multi-Variable Probabilistic Distribution
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">S-Curve Analysis for Capital Commitment</p>
                            </div>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={result.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                                    <XAxis dataKey="range" tick={{fontSize: 10, fontStyle: 'bold', fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="left" tick={{fontSize: 10, fontStyle: 'bold', fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="right" orientation="right" unit="%" tick={{fontSize: 10, fontStyle: 'bold', fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2)'}} />
                                    <Bar yAxisId="left" dataKey="count" fill="#cbd5e1" barSize={40} radius={[8,8,0,0]} name="Iteration Frequency" />
                                    <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke={theme.charts.palette[0]} strokeWidth={4} dot={false} name="Cumulative Confidence" />
                                    <ReferenceLine x={result.data.find((d:any) => d.cumulative >= 80)?.range} stroke="#f59e0b" strokeDasharray="6 6" label={{ value: 'P80 THRESHOLD', position: 'top', fontSize: 10, fontWeight: 'black', fill: '#f59e0b', offset: 20 }} yAxisId="left" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1">
                    <EmptyGrid 
                        title="Statistical Modeling Idle"
                        description="Launch the 10,000-iteration Monte Carlo model to calculate the unified probability distribution of portfolio capital requirements. The engine analyzes aleatory and epistemic uncertainty across all active projects."
                        icon={Activity}
                        actionLabel="Initialize Simulation Hub"
                        onAdd={runPortfolioSimulation}
                    />
                </div>
            )}
        </div>
    );
};
