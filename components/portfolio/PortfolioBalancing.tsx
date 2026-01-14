
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { RefreshCw, PieChart } from 'lucide-react';
import { StrategicDrivers } from './balancing/StrategicDrivers';
import { ValueRiskChart } from './balancing/ValueRiskChart';
import { EfficientFrontierChart } from './balancing/EfficientFrontierChart';
import { usePortfolioBalancingLogic } from '../../hooks/domain/usePortfolioBalancingLogic';
import { Button } from '../ui/Button';
import { EmptyGrid } from '../common/EmptyGrid';
import { useNavigate } from 'react-router-dom';

const PortfolioBalancing: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
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
                <EmptyGrid 
                    title="Optimization Model Inactive" 
                    description="The investment balancing model requires active projects to calculate the efficient frontier." 
                    icon={PieChart}
                    actionLabel="Create Initiative"
                    onAdd={() => navigate('/projectList?action=create')}
                />
            </div>
        );
    }

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in`}>
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

            <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap} h-auto`}>
                <ValueRiskChart data={portfolioData} />
                <EfficientFrontierChart data={portfolioData} budget={budgetConstraint} onBudgetChange={setBudgetConstraint} />
            </div>
        </div>
    );
};
export default PortfolioBalancing;
