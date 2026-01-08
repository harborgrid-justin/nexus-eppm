
import React, { useDeferredValue, Suspense } from 'react';
import { Filter, Loader2 } from 'lucide-react';
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
    
    // Optimization: Intersection Observer API for lazy rendering charts
    const { containerRef: budgetRef, isVisible: budgetVisible } = useLazyLoad();
    const { containerRef: healthRef, isVisible: healthVisible } = useLazyLoad();

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
            <Card className="p-6 h-[400px] flex flex-col" >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-bold text-slate-800">{viewType === 'financial' ? 'Spend by Project' : 'Strategic ROI'}</h3>
                    <Button variant="ghost" size="sm" icon={Filter} />
                </div>
                <div className="flex-1 min-h-0" ref={budgetRef}>
                    {budgetVisible ? (
                        <ErrorBoundary name="Budget Chart">
                            <CustomBarChart data={deferredBudget} xAxisKey="name" dataKey="Spent" height={300} barColor="#3b82f6" formatTooltip={(val) => formatCompactCurrency(val)} />
                        </ErrorBoundary>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-300">
                             <Loader2 className="animate-spin" size={24}/>
                        </div>
                    )}
                </div>
            </Card>
            
            <Card className="p-6 h-[400px] flex flex-col">
                <h3 className="text-base font-bold text-slate-800 mb-6">Portfolio Health</h3>
                <div className="flex-1 flex items-center justify-center" ref={healthRef}>
                    {healthVisible ? (
                        <ErrorBoundary name="Health Chart">
                            <CustomPieChart data={deferredHealth} height={300} />
                        </ErrorBoundary>
                    ) : (
                         <div className="h-full flex items-center justify-center text-slate-300">
                             <Loader2 className="animate-spin" size={24}/>
                         </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
