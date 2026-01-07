
import React, { useState, useMemo } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Layers, Plus, Save, RotateCcw, CheckCircle, Sparkles, Loader2, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { generatePortfolioOptimization } from '../../services/geminiService';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { EmptyGrid } from '../common/EmptyGrid';

const PortfolioScenarios: React.FC = () => {
  const { scenarios, projects } = usePortfolioData();
  const { dispatch } = useData();
  const theme = useTheme();

  // Initial local state derived from data
  const [activeScenarioId, setActiveScenarioId] = useState(scenarios[0]?.id || '');
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>(scenarios[0]?.selectedComponentIds || []);
  const [budgetLimit, setBudgetLimit] = useState(60000000);
  
  // AI State
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const activeScenario = useMemo(() => 
    scenarios.find(s => s.id === activeScenarioId) || scenarios[0],
  [scenarios, activeScenarioId]);

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

  const handleSaveScenario = () => {
      if(!activeScenario) return;
      const updatedScenario = {
          ...activeScenario,
          selectedComponentIds: selectedProjectIds,
          metrics: {
              totalCost: scenarioResults.totalCost,
              totalROI: 15, // Mock recalc
              strategicAlignmentScore: scenarioResults.avgStrat,
              riskExposure: scenarioResults.avgRisk
          }
      };
      dispatch({ type: 'UPDATE_PORTFOLIO_SCENARIO', payload: updatedScenario });
      alert("Scenario model persisted to database.");
  };

  if (scenarios.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-12">
              <EmptyGrid 
                title="Scenario Sandbox Empty"
                description="Initialize a scenario to model 'What-If' funding distributions and strategic trade-offs."
                icon={Layers}
                actionLabel="Create Modeling Scenario"
                onAdd={() => {}}
              />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
                <Layers className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Strategic Scenario Modeling</h2>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-inner">
                    {scenarios.map(s => (
                        <button 
                            key={s.id} 
                            onClick={() => { setActiveScenarioId(s.id); setSelectedProjectIds(s.selectedComponentIds); }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeScenarioId === s.id ? 'bg-white shadow text-nexus-700' : 'text-slate-500'}`}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>
                <Button variant="secondary" onClick={handleAskAi} disabled={isAiLoading} icon={Sparkles} className="flex-1 sm:flex-none">
                    {isAiLoading ? 'Analyzing...' : 'Ask AI Advisor'}
                </Button>
                <button 
                    onClick={handleSaveScenario}
                    className={`flex-1 sm:flex-none px-4 py-2 ${theme.colors.primary} text-white rounded-lg text-sm font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-nexus-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all`}
                >
                    <Save size={16}/> Save
                </button>
            </div>
        </div>

        {/* Modeling UI */}
        <div className={`grid grid-cols-1 lg:grid-cols-4 ${theme.layout.gridGap}`}>
            {/* Left: Toggles */}
            <div className={`lg:col-span-1 space-y-4`}>
                <div className={`${theme.components.card} p-5`}>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Budget Constraint</h3>
                    <input 
                        type="range" min="10000000" max="100000000" step="5000000" 
                        value={budgetLimit} onChange={e => setBudgetLimit(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nexus-600"
                    />
                    <div className="text-center font-mono font-bold text-lg mt-2 text-nexus-900">{formatCompactCurrency(budgetLimit)}</div>
                </div>

                <div className={`${theme.components.card} overflow-hidden flex flex-col max-h-[500px]`}>
                    <div className="p-4 border-b border-slate-100 bg-slate-50 font-black text-[10px] uppercase tracking-widest text-slate-500">Component Selection</div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {projects.map(p => (
                            <label key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${selectedProjectIds.includes(p.id) ? 'bg-nexus-50 border-nexus-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50'}`}>
                                <input type="checkbox" checked={selectedProjectIds.includes(p.id)} onChange={() => toggleProject(p.id)} className="rounded text-nexus-600 focus:ring-nexus-500" />
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono font-bold">{formatCompactCurrency(p.budget)}</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Analysis & AI */}
            <div className={`lg:col-span-3 space-y-6`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={`p-6 rounded-2xl border shadow-sm ${scenarioResults.isOverBudget ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Scenario Utilization</p>
                        <p className={`text-3xl font-black ${scenarioResults.isOverBudget ? 'text-red-600' : 'text-slate-900'}`}>{formatCompactCurrency(scenarioResults.totalCost)}</p>
                        <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                             <div className={`h-full ${scenarioResults.isOverBudget ? 'bg-red-500' : 'bg-nexus-500'}`} style={{width: `${Math.min(100, (scenarioResults.totalCost/budgetLimit)*100)}%`}}></div>
                        </div>
                    </div>
                    <div className={`${theme.components.card} p-6 border-l-4 border-l-green-500`}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Strategic Alignment</p>
                        <p className="text-3xl font-black text-green-600">{scenarioResults.avgStrat.toFixed(0)}%</p>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Weighted average contribution</p>
                    </div>
                    <div className={`${theme.components.card} p-6 border-l-4 border-l-orange-500`}>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Risk Exposure</p>
                        <p className="text-3xl font-black text-orange-500">{scenarioResults.avgRisk.toFixed(0)}</p>
                        <p className="text-xs text-slate-400 mt-2 font-medium">Score: {scenarioResults.avgRisk.toFixed(0)} / 100</p>
                    </div>
                </div>

                {aiAdvice && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 shadow-xl animate-in zoom-in-95 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 bg-white/40 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none"></div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <h3 className="font-bold text-indigo-900 flex items-center gap-2"><Sparkles className="text-indigo-600" size={20}/> AI Optimization Advice</h3>
                            <button onClick={() => setAiAdvice(null)} className="text-indigo-300 hover:text-indigo-500 transition-colors p-1"><RotateCcw size={16}/></button>
                        </div>
                        <div className="prose prose-sm text-indigo-900 leading-relaxed max-w-none relative z-10 font-medium">
                            {aiAdvice.split('\n').map((line, i) => <p key={i} className="mb-2 last:mb-0">{line}</p>)}
                        </div>
                    </div>
                )}

                <div className={`${theme.components.card} p-6 h-[350px] flex flex-col`}>
                    <h3 className={`font-black text-slate-900 text-sm uppercase tracking-widest mb-6`}>Comparative Scenario Analysis</h3>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scenarios}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                                <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} />
                                <YAxis tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0'}} />
                                <Legend />
                                <Bar dataKey="metrics.totalROI" fill="#818cf8" name="ROI %" radius={[4,4,0,0]} />
                                <Bar dataKey="metrics.strategicAlignmentScore" fill="#34d399" name="Alignment %" radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PortfolioScenarios;
