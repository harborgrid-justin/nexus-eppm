
import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { RefreshCw, Sparkles } from 'lucide-react';
import { OptimizationMetrics } from './optimization/OptimizationMetrics';
import { DecisionWorkbench } from './optimization/DecisionWorkbench';
import { AiAdvisor } from './optimization/AiAdvisor';
import { generatePortfolioOptimization } from '../../services/geminiService';

const PortfolioOptimization: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [decisions, setDecisions] = useState<Record<string, string>>({});
    const [aiAdvice, setAiAdvice] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const projectRows = useMemo(() => {
        return state.projects.map(p => {
             const seed = p.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
             return { ...p, cpi: (0.8 + ((seed % 40) / 100)).toFixed(2), simulatedProgress: (seed % 100) };
        });
    }, [state.projects]);

    const handleAskAi = async () => {
        setIsAiLoading(true);
        const advice = await generatePortfolioOptimization(state.projects, 60000000); // Mock budget
        setAiAdvice(advice);
        setIsAiLoading(false);
    };

    return (
        <div className={`h-full overflow-y-auto p-6 space-y-6 animate-in fade-in`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Review & Optimization</h2>
                    <p className={theme.typography.small}>Continuous monitoring and decision workbench.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleAskAi} disabled={isAiLoading} className="px-4 py-2 bg-white border rounded-lg text-sm flex items-center gap-2">
                        {isAiLoading ? <RefreshCw className="animate-spin" /> : <Sparkles />} {isAiLoading ? 'Analyzing...' : 'Ask AI'}
                    </button>
                    <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2`}>
                        <RefreshCw /> Run Model
                    </button>
                </div>
            </div>

            <OptimizationMetrics projects={state.projects} />

            {aiAdvice && <AiAdvisor advice={aiAdvice} onClear={() => setAiAdvice(null)} />}
            
            <DecisionWorkbench 
                projects={projectRows}
                decisions={decisions}
                onDecision={setDecisions}
            />
        </div>
    );
};

export default PortfolioOptimization;
