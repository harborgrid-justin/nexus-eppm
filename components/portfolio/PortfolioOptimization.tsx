
import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { RefreshCw, Sparkles, AlertCircle, Briefcase } from 'lucide-react';
import { OptimizationMetrics } from './optimization/OptimizationMetrics';
import { DecisionWorkbench } from './optimization/DecisionWorkbench';
import { AiAdvisor } from './optimization/AiAdvisor';
import { generatePortfolioOptimization } from '../../services/geminiService';
import { calculateEVM } from '../../utils/integrations/cost';
import { calculateProjectProgress } from '../../utils/calculations';
import { EmptyGrid } from '../common/EmptyGrid';
import { useNavigate } from 'react-router-dom';

const PortfolioOptimization: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { state, dispatch } = useData();
    const [decisions, setDecisions] = useState<Record<string, string>>({});
    const [aiAdvice, setAiAdvice] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const projectRows = useMemo(() => {
        return state.projects.map(p => {
             const projectBudgetItems = state.budgetItems.filter(b => b.projectId === p.id);
             const evm = calculateEVM(p, projectBudgetItems);
             const progress = calculateProjectProgress(p);
             
             let recAction = 'Maintain';
             if (evm.cpi < 0.8) recAction = 'Descope';
             else if (evm.cpi < 0.95) recAction = 'Review';
             else if (evm.cpi > 1.1) recAction = 'Accelerate';

             return { 
                 ...p, 
                 cpi: evm.cpi > 0 ? evm.cpi.toFixed(2) : 'N/A', 
                 simulatedProgress: progress,
                 recAction,
                 variance: evm.cv
             };
        });
    }, [state.projects, state.budgetItems]);

    const handleAskAi = async () => {
        setIsAiLoading(true);
        try {
            // Constraint derived from total budget plus a 10% tolerance for modeling
            const totalBudget = state.projects.reduce((s, p) => s + p.budget, 0);
            const advice = await generatePortfolioOptimization(state.projects, totalBudget * 1.1); 
            setAiAdvice(advice);
        } catch (e) {
            setAiAdvice("Unable to generate optimization advice at this time.");
        } finally {
            setIsAiLoading(false);
        }
    };

    if (state.projects.length === 0 && state.programs.length === 0) {
        return (
            <div className="h-full flex items-center justify-center p-12">
                <EmptyGrid 
                    title="Optimization Target Null"
                    description="Populate the enterprise ledger with projects or programs to activate the strategic optimization and balancing engine."
                    icon={Briefcase}
                    actionLabel="Initialize Initiative"
                    onAdd={() => navigate('/projectList?action=create')}
                />
            </div>
        );
    }

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Review & Optimization</h2>
                    <p className={theme.typography.small}>Continuous monitoring and decision workbench.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleAskAi} disabled={isAiLoading} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50 text-slate-700">
                        {isAiLoading ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} className="text-purple-600"/>} 
                        {isAiLoading ? 'Analyzing...' : 'Ask AI Advisor'}
                    </button>
                    <button className={`px-4 py-2 ${theme.colors.primary} text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-md hover:brightness-110 active:scale-95 transition-all`}>
                        <RefreshCw size={16} /> Run Model
                    </button>
                </div>
            </div>

            <OptimizationMetrics 
                projects={state.projects} 
                programs={state.programs} 
                scenarios={state.portfolioScenarios} 
            />

            {aiAdvice && <AiAdvisor advice={aiAdvice} onClear={() => setAiAdvice(null)} />}
            
            {projectRows.length > 0 ? (
                <DecisionWorkbench 
                    projects={projectRows}
                    decisions={decisions}
                    onDecision={setDecisions}
                />
            ) : (
                <div className="flex-1">
                    <EmptyGrid 
                        title="Optimization Workbench Empty"
                        description="No project components identified for review in this cycle."
                        icon={AlertCircle}
                    />
                </div>
            )}
        </div>
    );
};

export default PortfolioOptimization;
