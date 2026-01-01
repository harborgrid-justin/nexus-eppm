import React, { useState, useMemo } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Layers, Plus, Save, RotateCcw, CheckCircle, Sparkles, Loader2, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { generatePortfolioOptimization } from '../../services/geminiService';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';

const PortfolioScenarios: React.FC = () => {
  const { scenarios, projects } = usePortfolioData();
  const theme = useTheme();
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0].id);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(scenarios[0].selectedComponentIds);
  const [budgetLimit, setBudgetLimit] = useState(60000000);
  
  // AI State
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const activeScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  const scenarioResults = useMemo(() => {
    const selected = projects.filter(p => selectedProjectIds.includes(p.id));
    const totalCost = selected.reduce((sum, p) => sum + p.budget, 0);
    const avgStrat = selected.length ? selected.reduce((sum, p) => sum + p.strategicImportance, 0) / selected.length * 10 : 0;
    const avgRisk = selected.length ? selected.reduce((sum, p) => sum + p.riskScore, 0) / selected.length * 4 : 0; 
    
    return { totalCost, avgStrat, avgRisk, isOverBudget: totalCost > budgetLimit };
  }, [selectedProjectIds, projects, budgetLimit]);

  const toggleProject = (id: string) => {
    setSelectedProjectIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleAskAi = async () => {
    setIsAiLoading(true);
    const advice = await generatePortfolioOptimization(projects, budgetLimit);
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
                <Layers className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Strategic Scenario Modeling</h2>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="secondary" onClick={handleAskAi} disabled={isAiLoading} icon={Sparkles} className="flex-1 sm:flex-none">
                    {isAiLoading ? 'Analyzing...' : 'Ask AI Advisor'}
                </Button>
                <button className={`flex-1 sm:flex-none px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700 shadow-md flex items-center justify-center gap-2`}>
                    <Save size={16}/> Save
                </button>
            </div>
        </div>

        {/* Modeling UI */}
        <div className={`grid grid-cols-1 lg:grid-cols-4 ${theme.layout.gridGap}`}>
            {/* Left: Toggles */}
            <div className={`lg:col-span-1 space-y-4`}>
                <div className={`${theme.components.card} p-5`}>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Budget Constraint</h3>
                    <input 
                        type="range" min="10000000" max="100000000" step="5000000" 
                        value={budgetLimit} onChange={e => setBudgetLimit(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nexus-600"
                    />
                    <div className="text-center font-mono font-bold text-lg mt-2 text-nexus-900">{formatCompactCurrency(budgetLimit)}</div>
                </div>

                <div className={`${theme.components.card} overflow-hidden flex flex-col max-h-[500px]`}>
                    <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 text-xs uppercase">Project Candidates</div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {projects.map(p => (
                            <label key={p.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${selectedProjectIds.includes(p.id) ? 'bg-nexus-50 border-nexus-200' : 'bg-white border-transparent hover:bg-slate-50'}`}>
                                <input type="checkbox" checked={selectedProjectIds.includes(p.id)} onChange={() => toggleProject(p.id)} className="rounded text-nexus-600 focus:ring-nexus-500" />
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                                    <p className="text-[10px] text-slate-500 font-mono">{formatCompactCurrency(p.budget)}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Analysis & AI */}
            <div className={`lg:col-span-3 space-y-6`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`p-6 rounded-xl border shadow-sm ${scenarioResults.isOverBudget ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Scenario Utilization</p>
                        <p className={`text-3xl font-black ${scenarioResults.isOverBudget ? 'text-red-600' : 'text-slate-900'}`}>{formatCompactCurrency(scenarioResults.totalCost)}</p>
                        <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                             <div className={`h-full ${scenarioResults.isOverBudget ? 'bg-red-500' : 'bg-nexus-500'}`} style={{width: `${Math.min(100, (scenarioResults.totalCost/budgetLimit)*100)}%`}}></div>
                        </div>
                    </div>
                    <div className={`${theme.components.card} p-6`}>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Strategic Alignment</p>
                        <p className="text-3xl font-black text-green-600">{scenarioResults.avgStrat.toFixed(0)}%</p>
                        <p className="text-xs text-slate-400 mt-2">Weighted average contribution</p>
                    </div>
                    <div className={`${theme.components.card} p-6`}>
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Risk Exposure</p>
                        <p className="text-3xl font-black text-orange-500">{scenarioResults.avgRisk.toFixed(0)}</p>
                        <p className="text-xs text-slate-400 mt-2">Scale 0-100 Aggregate</p>
                    </div>
                </div>

                {aiAdvice && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm animate-in zoom-in-95">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2"><Sparkles className="text-indigo-600" size={20}/> AI Advisor: Efficient Frontier Suggestion</h3>
                            <button onClick={() => setAiAdvice(null)} className="text-indigo-400 hover:text-indigo-600"><RotateCcw size={16}/></button>
                        </div>
                        <div className="prose prose-sm text-indigo-900 leading-relaxed max-w-none">
                            {aiAdvice.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                        </div>
                    </div>
                )}

                <div className={`${theme.components.card} p-6 h-[350px]`}>
                    <h3 className={`${theme.typography.h3} mb-6`}>Simulation Chart (Cost vs Value)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scenarios}>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} />
                             <XAxis dataKey="name" tick={{fontSize: 12}} />
                             <YAxis tick={{fontSize: 12}} />
                             <Tooltip />
                             <Legend />
                             <Bar dataKey="metrics.totalROI" fill="#818cf8" name="ROI %" radius={[4,4,0,0]} />
                             <Bar dataKey="metrics.strategicAlignmentScore" fill="#34d399" name="Alignment %" radius={[4,4,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PortfolioScenarios;