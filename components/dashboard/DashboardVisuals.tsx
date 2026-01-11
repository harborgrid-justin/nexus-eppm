
import React, { useDeferredValue } from 'react';
import { Filter, Loader2, PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CustomBarChart } from '../charts/CustomBarChart';
import { CustomPieChart } from '../charts/CustomPieChart';
import { ErrorBoundary } from '../ErrorBoundary';
import { formatCompactCurrency } from '../../utils/formatters';
import { useLazyLoad } from '../../hooks/useLazyLoad';

interface Props {
  budgetData: any[];
  healthData: any[];
  viewType: 'financial' | 'strategic';
  isPending: boolean;
}

export const DashboardVisuals: React.FC<Props> = ({ budgetData, healthData, viewType, isPending }) => {
    const deferredBudget = useDeferredValue(budgetData);
    const deferredHealth = useDeferredValue(healthData);
    
    const { containerRef: budgetRef, isVisible: budgetVisible } = useLazyLoad();
    const { containerRef: healthRef, isVisible: healthVisible } = useLazyLoad();

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-500 ${isPending ? 'opacity-40' : 'opacity-100'}`}>
            <Card className="p-6 h-[400px] flex flex-col" >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <BarChart2 size={16} className="text-nexus-500"/>
                        {viewType === 'financial' ? 'Portfolio Spend Matrix' : 'Strategic ROI Variance'}
                    </h3>
                    <Button variant="ghost" size="sm" icon={Filter} />
                </div>
                <div className="flex-1 min-h-0" ref={budgetRef}>
                    {budgetVisible ? (
                        <ErrorBoundary name="Budget Chart">
                            <CustomBarChart data={deferredBudget} xAxisKey="name" dataKey="Spent" height={300} barColor="#3b82f6" formatTooltip={(val) => formatCompactCurrency(val)} />
                        </ErrorBoundary>
                    ) : (
                        <div className="h-full nexus-empty-pattern rounded-xl animate-pulse"></div>
                    )}
                </div>
            </Card>
            
            <Card className="p-6 h-[400px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <PieIcon size={16} className="text-blue-500"/>
                        Execution Health Distribution
                    </h3>
                </div>
                <div className="flex-1 flex items-center justify-center" ref={healthRef}>
                    {healthVisible ? (
                        <ErrorBoundary name="Health Chart">
                            <CustomPieChart data={deferredHealth} height={300} />
                        </ErrorBoundary>
                    ) : (
                         <div className="h-full w-full nexus-empty-pattern rounded-xl animate-pulse"></div>
                    )}
                </div>
            </Card>
        </div>
    );
};
