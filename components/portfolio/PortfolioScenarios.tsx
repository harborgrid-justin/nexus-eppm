import React, { useState } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Layers, Plus, Save, RotateCcw, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const PortfolioScenarios: React.FC = () => {
  const { scenarios, projects } = usePortfolioData();
  const theme = useTheme();
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id);

  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
                <Layers className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Scenario Planning (What-If)</h2>
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                    <Plus size={16}/> New Scenario
                </button>
                <button className={`flex items-center gap-2 px-3 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700`}>
                    <Save size={16}/> Save Model
                </button>
            </div>
        </div>

        {/* Scenario Selector */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            {scenarios.map(s => (
                <div 
                    key={s.id} 
                    onClick={() => setActiveScenarioId(s.id)}
                    className={`min-w-[250px] p-4 rounded-xl border cursor-pointer transition-all ${
                        activeScenarioId === s.id 
                        ? 'bg-nexus-50 border-nexus-500 ring-1 ring-nexus-500' 
                        : 'bg-white border-slate-200 hover:border-nexus-300'
                    }`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-800">{s.name}</h4>
                        {activeScenarioId === s.id && <CheckCircle size={16} className="text-nexus-600"/>}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{s.description}</p>
                    <div className="flex justify-between text-xs font-mono bg-white/50 p-1 rounded">
                        <span>Budget: {formatCompactCurrency(s.budgetConstraint)}</span>
                        <span>ROI: {s.metrics.totalROI}%</span>
                    </div>
                </div>
            ))}
        </div>

        {/* Modeling Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Selection List */}
            <div className={`lg:col-span-2 ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Component Selection</h3>
                    <span className="text-xs text-slate-500">{projects.length} Candidates Available</span>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="w-12 px-4 py-3 text-center"><input type="checkbox" className="rounded border-slate-300"/></th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Project</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Cost</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">ROI</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">Priority</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {projects.map(p => {
                                const isSelected = activeScenario.selectedComponentIds.includes(p.id);
                                return (
                                    <tr key={p.id} className={isSelected ? 'bg-blue-50/30' : ''}>
                                        <td className="px-4 py-3 text-center">
                                            <input type="checkbox" checked={isSelected} readOnly className="rounded border-slate-300 text-nexus-600 focus:ring-nexus-500"/>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{p.name}</td>
                                        <td className="px-4 py-3 text-right text-sm text-slate-600 font-mono">{formatCompactCurrency(p.budget)}</td>
                                        <td className="px-4 py-3 text-right text-sm text-green-600 font-bold">125%</td>
                                        <td className="px-4 py-3 text-center text-sm text-slate-600">{p.calculatedPriorityScore}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
                <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm`}>
                    <h3 className="font-bold text-slate-800 mb-4">Scenario Impact Analysis</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Budget Utilization</span>
                                <span className="font-bold text-slate-900">85%</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-nexus-500 h-full w-[85%]"></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 text-right">{formatCompactCurrency(activeScenario.budgetConstraint * 0.85)} / {formatCompactCurrency(activeScenario.budgetConstraint)}</p>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Strategic Alignment</span>
                                <span className="font-bold text-green-600">{activeScenario.metrics.strategicAlignmentScore}/100</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full" style={{width: `${activeScenario.metrics.strategicAlignmentScore}%`}}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">Risk Profile</span>
                                <span className="font-bold text-orange-500">{activeScenario.metrics.riskProfileScore}/100</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-orange-500 h-full" style={{width: `${activeScenario.metrics.riskProfileScore}%`}}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm h-64`}>
                    <h3 className="font-bold text-slate-800 mb-2">Efficient Frontier</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scenarios}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{fontSize: 10}} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="metrics.totalROI" fill="#8884d8" name="ROI %" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PortfolioScenarios;