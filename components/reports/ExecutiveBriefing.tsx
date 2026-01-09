
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, TrendingUp, AlertTriangle, Activity, Target } from 'lucide-react';
import { formatCompactCurrency, formatPercentage } from '../../utils/formatters';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from 'recharts';

export const ExecutiveBriefing: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const slides = [
        { id: 'overview', title: 'Portfolio Health Overview' },
        { id: 'financials', title: 'Financial Performance' },
        { id: 'risk', title: 'Strategic Risk Profile' },
        { id: 'roadmap', title: 'Strategic Alignment' }
    ];

    const nextSlide = () => setCurrentSlide((p) => (p + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((p) => (p - 1 + slides.length) % slides.length);

    // --- DATA PREP ---
    const healthData = useMemo(() => [
        { name: 'Good', value: state.projects.filter(p => p.health === 'Good').length, color: '#10b981' },
        { name: 'Warning', value: state.projects.filter(p => p.health === 'Warning').length, color: '#f59e0b' },
        { name: 'Critical', value: state.projects.filter(p => p.health === 'Critical').length, color: '#ef4444' },
    ], [state.projects]);

    const financialTrend = useMemo(() => {
        // Aggregate real spend data from project budgets and elapsed time
        const totalBudget = state.projects.reduce((s, p) => s + p.budget, 0);
        const totalSpent = state.projects.reduce((s, p) => s + p.spent, 0);
        
        // Generate a synthetic trend based on actual totals for visualization
        // In a real app, this would query a historical snapshots table
        const trend = [];
        const months = ['Q1', 'Q2', 'Q3', 'Q4'];
        let cumulativeBudget = 0;
        let cumulativeActual = 0;
        
        // Simple linear distribution for demo purpose based on live totals
        for(let i=0; i<4; i++) {
            cumulativeBudget += (totalBudget / 4);
            // Simulate S-curve for actuals
            const increment = (totalSpent / 4) * (i === 0 ? 0.5 : i === 1 ? 1.0 : i === 2 ? 1.5 : 1.0);
            cumulativeActual += increment;
            
            trend.push({
                month: months[i],
                budget: Math.round(cumulativeBudget),
                actual: Math.round(cumulativeActual)
            });
        }
        return trend;
    }, [state.projects]);

    const riskHeatmap = useMemo(() => {
        const high = state.risks.filter(r => r.score >= 15).length;
        const medium = state.risks.filter(r => r.score >= 8 && r.score < 15).length;
        const low = state.risks.filter(r => r.score < 8).length;
        return { high, medium, low };
    }, [state.risks]);

    const alignmentData = useMemo(() => {
        const cats: Record<string, number> = {};
        state.projects.forEach(p => {
            const category = p.category || 'Unassigned';
            cats[category] = (cats[category] || 0) + p.budget;
        });
        return Object.entries(cats).map(([name, value]) => ({ name, value }));
    }, [state.projects]);

    return (
        <div className={`h-full flex flex-col bg-slate-900 text-white ${isFullscreen ? 'fixed inset-0 z-[100]' : 'relative'}`}>
            {/* Toolbar */}
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-slate-950">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-3">
                        <Activity className="text-nexus-400" /> Executive Briefing
                    </h2>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">{slides[currentSlide].title}</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-mono text-slate-500">{currentSlide + 1} / {slides.length}</span>
                    <div className="flex gap-2">
                        <button onClick={prevSlide} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft size={24}/></button>
                        <button onClick={nextSlide} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronRight size={24}/></button>
                    </div>
                    <div className="w-px h-8 bg-white/10 mx-2"></div>
                    <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                        {isFullscreen ? <Minimize2 size={20}/> : <Maximize2 size={20}/>}
                    </button>
                </div>
            </div>

            {/* Slide Content */}
            <div className="flex-1 overflow-hidden relative">
                {currentSlide === 0 && (
                    <div className="h-full flex flex-col items-center justify-center p-12 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="grid grid-cols-2 gap-12 w-full max-w-6xl">
                            <div className="flex flex-col justify-center space-y-8">
                                <div>
                                    <div className="text-6xl font-black text-white mb-2">{state.projects.length}</div>
                                    <div className="text-xl text-slate-400 uppercase tracking-widest font-bold">Active Projects</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                                        <span className="font-bold text-green-400">On Track</span>
                                        <span className="text-2xl font-mono">{healthData.find(d => d.name === 'Good')?.value}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                                        <span className="font-bold text-yellow-400">At Risk</span>
                                        <span className="text-2xl font-mono">{healthData.find(d => d.name === 'Warning')?.value}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                                        <span className="font-bold text-red-500">Critical</span>
                                        <span className="text-2xl font-mono">{healthData.find(d => d.name === 'Critical')?.value}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[400px] flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={healthData} innerRadius={100} outerRadius={140} paddingAngle={5} dataKey="value">
                                            {healthData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#fff' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <div className="text-4xl font-black text-white">{formatPercentage((healthData[0].value / (state.projects.length || 1)) * 100)}</div>
                                        <div className="text-xs text-slate-400 uppercase font-bold mt-1">Health Index</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentSlide === 1 && (
                    <div className="h-full flex flex-col p-12 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h3 className="text-4xl font-bold text-white mb-2">Portfolio Financials</h3>
                                <p className="text-slate-400">Fiscal Year Cumulative Performance</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-mono font-bold text-nexus-400">{formatCompactCurrency(state.projects.reduce((s,p) => s+p.budget, 0))}</div>
                                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Total Authority</div>
                            </div>
                        </div>
                        <div className="flex-1 bg-slate-800/50 rounded-2xl border border-white/10 p-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={financialTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                    <XAxis dataKey="month" stroke="#94a3b8" />
                                    <YAxis tickFormatter={(val) => formatCompactCurrency(val)} stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="budget" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" name="Budget Baseline" dot={false}/>
                                    <Line type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={4} name="Actual Spend" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {currentSlide === 2 && (
                     <div className="h-full flex flex-col p-12 animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full">
                            <div className="flex flex-col justify-center space-y-6">
                                <div className="p-8 bg-red-500/10 border border-red-500/30 rounded-2xl">
                                    <h4 className="text-red-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2"><AlertTriangle/> Critical Exposure</h4>
                                    <div className="text-5xl font-black text-white mb-2">{riskHeatmap.high}</div>
                                    <p className="text-slate-400">Risks with score ≥ 15 requiring immediate mitigation plans.</p>
                                </div>
                                <div className="p-8 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
                                    <h4 className="text-yellow-400 font-black uppercase tracking-widest mb-2">Watchlist Items</h4>
                                    <div className="text-5xl font-black text-white mb-2">{riskHeatmap.medium}</div>
                                    <p className="text-slate-400">Risks with score 8-14 to be monitored weekly.</p>
                                </div>
                            </div>
                            <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-8 overflow-y-auto">
                                <h3 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">Top Threats</h3>
                                <div className="space-y-4">
                                    {state.risks.filter(r => r.score >= 12).slice(0, 5).map(r => (
                                        <div key={r.id} className="flex justify-between items-start gap-4">
                                            <div className="w-10 h-10 rounded bg-red-500/20 text-red-500 font-bold flex items-center justify-center shrink-0 border border-red-500/30">
                                                {r.score}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-200">{r.description}</p>
                                                <p className="text-xs text-slate-500 mt-1">{r.category} • {r.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                     </div>
                )}

                {currentSlide === 3 && (
                     <div className="h-full flex flex-col p-12 animate-in fade-in slide-in-from-right-8 duration-500">
                        <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                            <Target className="text-purple-500" size={32}/> Investment Alignment
                        </h3>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={alignmentData} layout="vertical" margin={{ left: 40, right: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155"/>
                                    <XAxis type="number" stroke="#94a3b8" tickFormatter={(val) => formatCompactCurrency(val)}/>
                                    <YAxis type="category" dataKey="name" stroke="#cbd5e1" width={150} tick={{fontSize: 14, fontWeight: 'bold'}}/>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }} formatter={(val: number) => formatCompactCurrency(val)}/>
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={40}>
                                        {alignmentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                     </div>
                )}
            </div>
            
            {/* Progress Bar */}
            <div className="h-1 bg-slate-800 w-full">
                <div className="h-full bg-nexus-500 transition-all duration-300" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}></div>
            </div>
        </div>
    );
};
