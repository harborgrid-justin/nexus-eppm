
import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { BarChart2, Play, Pause, XCircle, CheckCircle, Sliders, RefreshCw } from 'lucide-react';
import { formatCompactCurrency, getHealthColorClass } from '../../utils/formatters';

const PortfolioOptimization: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [decisions, setDecisions] = useState<Record<string, string>>({});

    // --- PMI Portfolio Metrics Calculation ---
    const metrics = useMemo(() => {
        const totalProjects = state.projects.length;
        if (totalProjects === 0) return { alignment: 0, riskIndex: 0, valueRate: 0 };

        const avgAlignment = state.projects.reduce((sum, p) => sum + p.strategicImportance, 0) / totalProjects; // 0-10
        const avgRisk = state.projects.reduce((sum, p) => sum + p.riskScore, 0) / totalProjects; // 0-10
        // Mock Benefits Realization: (realized benefits / planned benefits)
        const valueRate = 85; 

        return {
            alignment: (avgAlignment / 10) * 100,
            riskIndex: avgRisk,
            valueRate
        };
    }, [state.projects]);

    const handleDecision = (id: string, decision: string) => {
        setDecisions(prev => ({ ...prev, [id]: decision }));
    };

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Review & Optimization</h2>
                    <p className={theme.typography.small}>Continuous monitoring and quarterly decision workbench.</p>
                </div>
                <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium`}>
                    <RefreshCw size={16} /> Run Optimization Model
                </button>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <Sliders size={24}/>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{metrics.alignment.toFixed(1)}%</div>
                    <div className="text-xs font-medium text-slate-500 uppercase">Strategic Alignment Index</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-3">
                        <CheckCircle size={24}/>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{metrics.valueRate}%</div>
                    <div className="text-xs font-medium text-slate-500 uppercase">Benefits Realization Rate</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
                        <BarChart2 size={24}/>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{metrics.riskIndex.toFixed(1)} / 10</div>
                    <div className="text-xs font-medium text-slate-500 uppercase">Portfolio Risk Index</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                        <RefreshCw size={24}/>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">Q3 2024</div>
                    <div className="text-xs font-medium text-slate-500 uppercase">Current Review Cycle</div>
                </div>
            </div>

            {/* Decision Workbench */}
            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Portfolio Decision Workbench</h3>
                    <div className="text-xs text-slate-500 italic">Select actions to simulate portfolio impact</div>
                </div>
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Component</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Health</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Budget</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Performance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Recommended Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Decision</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {state.projects.map(p => (
                            <tr key={p.id} className={decisions[p.id] === 'Terminate' ? 'bg-red-50 opacity-70' : decisions[p.id] === 'Pause' ? 'bg-yellow-50' : 'hover:bg-slate-50'}>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-sm text-slate-900">{p.name}</div>
                                    <div className="text-xs text-slate-500">{p.code}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${getHealthColorClass(p.health)}`}>
                                        {p.health}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm text-slate-600 font-mono">
                                    {formatCompactCurrency(p.budget)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="inline-flex flex-col items-center">
                                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                                            <div className="h-full bg-blue-500" style={{width: `${Math.random() * 100}%`}}></div>
                                        </div>
                                        <span className="text-[10px] text-slate-400">CPI: {(0.8 + Math.random() * 0.4).toFixed(2)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {p.health === 'Critical' ? (
                                        <span className="text-xs font-bold text-red-600 flex items-center gap-1"><XCircle size={12}/> Review for Termination</span>
                                    ) : p.health === 'Warning' ? (
                                        <span className="text-xs font-bold text-yellow-600 flex items-center gap-1"><Pause size={12}/> Consider Pausing</span>
                                    ) : (
                                        <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Play size={12}/> Continue</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-1">
                                        <button 
                                            onClick={() => handleDecision(p.id, 'Continue')}
                                            className={`p-1.5 rounded border ${decisions[p.id] === 'Continue' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-400 hover:text-green-600'}`}
                                            title="Continue"
                                        ><Play size={14}/></button>
                                        <button 
                                            onClick={() => handleDecision(p.id, 'Pause')}
                                            className={`p-1.5 rounded border ${decisions[p.id] === 'Pause' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-slate-400 hover:text-yellow-600'}`}
                                            title="Pause"
                                        ><Pause size={14}/></button>
                                        <button 
                                            onClick={() => handleDecision(p.id, 'Terminate')}
                                            className={`p-1.5 rounded border ${decisions[p.id] === 'Terminate' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-400 hover:text-red-600'}`}
                                            title="Terminate"
                                        ><XCircle size={14}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PortfolioOptimization;
