
import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { OptimizationMetrics } from './optimization/OptimizationMetrics';
import { DecisionWorkbench } from './optimization/DecisionWorkbench';
import { AiAdvisor } from './optimization/AiAdvisor';
import { generatePortfolioOptimization } from '../../services/geminiService';
import { calculateEVM } from '../../utils/integrations/cost';
import { calculateProjectProgress } from '../../utils/calculations';

const PortfolioOptimization: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [decisions, setDecisions] = useState<Record<string, string>>({});
    const [aiAdvice, setAiAdvice] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const projectRows = useMemo(() => {
        return state.projects.map(p => {
             // Fetch real budget items for this project to calculate accurate EVM
             const projectBudgetItems = state.budgetItems.filter(b => b.projectId === p.id);
             const evm = calculateEVM(p, projectBudgetItems);
             const progress = calculateProjectProgress(p);
             
             // Determine recommended action based on real CPI
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
            const advice = await generatePortfolioOptimization(state.projects, 60000000); // Mock budget constraint for AI prompt
            setAiAdvice(advice);
        } catch (e) {
            setAiAdvice("Unable to generate optimization advice at this time.");
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className={`h-full overflow-y-auto p-6 space-y-6 animate-in fade-in`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Review & Optimization</h2>
                    <p className={theme.typography.small}>Continuous monitoring and decision workbench.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleAskAi} disabled={isAiLoading} className="px-4 py-2 bg-white border rounded-lg text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50">
                        {isAiLoading ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} className="text-purple-600"/>} 
                        {isAiLoading ? 'Analyzing...' : 'Ask AI Advisor'}
                    </button>
                    <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2 shadow-sm hover:opacity-90`}>
                        <RefreshCw size={16} /> Run Model
                    </button>
                </div>
            </div>

            <OptimizationMetrics projects={state.projects} />

            {aiAdvice && <AiAdvisor advice={aiAdvice} onClear={() => setAiAdvice(null)} />}
            
            {projectRows.length > 0 ? (
                <DecisionWorkbench 
                    projects={projectRows}
                    decisions={decisions}
                    onDecision={setDecisions}
                />
            ) : (
                <div className="p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                    <AlertCircle size={48} className="mb-4 opacity-20"/>
                    <p className="font-medium">No projects available for optimization.</p>
                </div>
            )}
        </div>
    );
};

export default PortfolioOptimization;
