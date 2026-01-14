import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { RefreshCw, PieChart } from 'lucide-react';
import { StrategicDrivers } from './balancing/StrategicDrivers';
import { ValueRiskChart } from './balancing/ValueRiskChart';
import { EfficientFrontierChart } from './balancing/EfficientFrontierChart';
import { usePortfolioBalancingLogic } from '../../hooks/domain/usePortfolioBalancingLogic';
import { Button } from '../ui/Button';
import { EmptyGrid } from '../common/EmptyGrid';

const PortfolioBalancing: React.FC = () => {
    const theme = useTheme();
    const { t } = useI18n();
    const { portfolioData, weights, setWeights, budgetConstraint, setBudgetConstraint } = usePortfolioBalancingLogic();

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding} space-y-6 animate-in fade-in`}>
            <div className={`p-6 rounded-2xl border ${theme.colors.border} ${theme.colors.surface} flex flex-col xl:flex-row justify-between items-center gap-8 shadow-sm`}>
                <div>
                    <h2 className={theme.typography.h2}>{t('portfolio.opt_title', 'Portfolio Optimization')}</h2>
                    <p className={theme.typography.small}>{t('portfolio.opt_subtitle', 'Efficient Frontier & Strategic Balancing')}</p>
                </div>
                <div className="flex-1 w-full xl:w-auto">
                    <StrategicDrivers weights={weights} onWeightChange={setWeights} />
                </div>
                <Button className="w-full xl:w-auto" icon={RefreshCw}>{t('portfolio.opt_recalc', 'Recalculate Model')}</Button>
            </div>

            <div className="flex-1 overflow-hidden relative">
                {portfolioData.length > 0 ? (
                    <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap} h-full overflow-y-auto pr-2`}>
                        <ValueRiskChart data={portfolioData} />
                        <EfficientFrontierChart data={portfolioData} budget={budgetConstraint} onBudgetChange={setBudgetConstraint} />
                    </div>
                ) : (
                    <EmptyGrid title={t('portfolio.opt_empty', 'Model Inactive')} description={t('portfolio.opt_empty_desc', 'Requires active projects to calculate the efficient frontier.')} icon={PieChart} />
                )}
            </div>
        </div>
    );
};
export default PortfolioBalancing;