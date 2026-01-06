import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { RefreshCw, PieChart } from 'lucide-react';
import { StrategicDrivers } from './balancing/StrategicDrivers';
import { ValueRiskChart } from './balancing/ValueRiskChart';
import { EfficientFrontierChart } from './balancing/EfficientFrontierChart';
import { usePortfolioBalancingLogic } from '../../hooks/domain/usePortfolioBalancingLogic';
import { Button } from '../ui/Button';
import { EmptyState } from '../common/EmptyState';

const PortfolioBalancing: React.FC = () => {
    const theme = useTheme();
    const { 
        portfolioData, 
        weights, 
        setWeights, 
        budgetConstraint, 
        setBudgetConstraint,
        isEmpty
    } = usePortfolioBalancingLogic();

    if (isEmpty) {
        return (
            <div className={`h-full flex items-center justify-center ${theme.colors.background}`}>
                <EmptyState 
                    title="No Data to Balance" 
                    description="Add projects to the portfolio to enable optimization modeling." 
                    icon={PieChart} 
                />
            </div>
        );
    }

    return (
        <div className={`h-full overflow-y-auto p-6 space-y-6 animate-in fade-in`}>
            <div className={`${theme.colors.surface} p-5 rounded-xl border ${theme.colors.border} flex flex-col xl:flex-row justify-between items-center gap-6 shadow-sm`}>
                <div>
                    <h2 className={theme.typography.h2}>Portfolio Optimization</h2>
                    <p className={theme.typography.small}>Efficient Frontier & Strategic Balancing</p>
                </div>
                <div className="flex-1 w-full xl:w-auto">
                    <StrategicDrivers weights={weights} onWeightChange={setWeights} />
                </div>
                <Button 
                    className="w-full xl:w-auto" 
                    icon={RefreshCw} 
                    onClick={() => {/* Trigger re-simulation if logic requires explicit run */}}
                >
                    Recalculate Model
                </Button>
            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto`}>
                <ValueRiskChart data={portfolioData} />
                <EfficientFrontierChart data={portfolioData} budget={budgetConstraint} onBudgetChange={setBudgetConstraint} />
            </div>
        </div>
    );
};
export default PortfolioBalancing;