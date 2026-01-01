
import React, { useMemo, useState, useDeferredValue } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { RefreshCw } from 'lucide-react';
import { StrategicDrivers } from './balancing/StrategicDrivers';
import { ValueRiskChart } from './balancing/ValueRiskChart';
import { EfficientFrontierChart } from './balancing/EfficientFrontierChart';

export const CATEGORY_COLORS: Record<string, string> = {
  'Innovation & Growth': '#0ea5e9', 'Operational Efficiency': '#22c55e',
  'Regulatory & Compliance': '#eab308', 'Keep the Lights On': '#64748b'
};

const PortfolioBalancing: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    
    const [weights, setWeights] = useState({ financial: 0.5, strategic: 0.3, risk: 0.2 });
    const deferredWeights = useDeferredValue(weights);
    const [budgetConstraint, setBudgetConstraint] = useState(50000000);

    const portfolioData = useMemo(() => {
        return [...state.projects, ...state.programs].map(item => {
            const riskFactor = 1 - (item.riskScore / 25); 
            const rawValue = (item.financialValue * deferredWeights.financial) + (item.strategicImportance * deferredWeights.strategic);
            return {
                id: item.id, name: item.name, risk: item.riskScore,
                value: Math.round(rawValue * riskFactor * 100), 
                budget: item.budget, category: item.category,
            };
        }).sort((a, b) => b.value - a.value); 
    }, [state.projects, state.programs, deferredWeights]);

    return (
        <div className={`h-full overflow-y-auto p-6 space-y-6 animate-in fade-in`}>
            <div className={`bg-white p-5 rounded-xl border flex flex-col xl:flex-row justify-between items-center gap-6`}>
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Optimization</h2>
                    <p className={theme.typography.small}>Efficient Frontier & Strategic Balancing</p>
                </div>
                <StrategicDrivers weights={weights} onWeightChange={setWeights} />
                <button className="w-full xl:w-auto px-4 py-2.5 bg-nexus-600 text-white rounded-lg flex items-center gap-2">
                    <RefreshCw size={16} /> Recalculate Model
                </button>
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto`}>
                <ValueRiskChart data={portfolioData} />
                <EfficientFrontierChart data={portfolioData} budget={budgetConstraint} onBudgetChange={setBudgetConstraint} />
            </div>
        </div>
    );
};

export default PortfolioBalancing;
