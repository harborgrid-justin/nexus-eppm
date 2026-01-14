
import React, { useDeferredValue, Suspense } from 'react';
import { Filter, PieChart as PieIcon, BarChart2, Loader2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CustomBarChart } from '../charts/CustomBarChart';
import { CustomPieChart } from '../charts/CustomPieChart';
import { ErrorBoundary } from '../ErrorBoundary';
import { formatCompactCurrency } from '../../utils/formatters';
import { useLazyLoad } from '../../hooks/useLazyLoad';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  budgetData: any[];
  healthData: any[];
  viewType: 'financial' | 'strategic';
  isPending: boolean;
}

export const DashboardVisuals: React.FC<Props> = ({ budgetData, healthData, viewType, isPending }) => {
    const theme = useTheme();
    const deferredBudget = useDeferredValue(budgetData);
    const deferredHealth = useDeferredValue(healthData);
    
    const { containerRef: budgetRef, isVisible: budgetVisible } = useLazyLoad();
    const { containerRef: healthRef, isVisible: healthVisible } = useLazyLoad();

    return (
        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap} transition-opacity duration-500 ${isPending ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            <Card className="p-8 h-[450px] flex flex-col relative" >
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <BarChart2 size={16} className="text-nexus-500"/>
                            {viewType === 'financial' ? 'Portfolio Spend Matrix' : 'Strategic ROI Variance'}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Aggregated by project code</p>
                    </div>
                    <Button variant="ghost" size="sm" icon={Filter} />
                </div>
                <div className="flex-1 min-h-0" ref={budgetRef}>
                    {budgetVisible ? (
                        <ErrorBoundary name="Budget Matrix">
                            <CustomBarChart 
                                data={deferredBudget} 
                                xAxisKey="name" 
                                dataKey="Spent" 
                                height={320} 
                                barColor="#3b82f6" 
                                formatTooltip={(val) => formatCompactCurrency(val)} 
                            />
                        </ErrorBoundary>
                    ) : (
                        <div className="h-full w-full nexus-empty-pattern rounded-2xl animate-pulse flex items-center justify-center">
                            <Loader2 className="animate-spin text-slate-200" size={32}/>
                        </div>
                    )}
                </div>
            </Card>
            
            <Card className="p-8 h-[450px] flex flex-col relative">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <PieIcon size={16} className="text-blue-500"/>
                            Portfolio Delivery Health
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Criticality Distribution</p>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center" ref={healthRef}>
                    {healthVisible ? (
                        <ErrorBoundary name="Health Distribution">
                            <CustomPieChart data={deferredHealth} height={320} />
                        </ErrorBoundary>
                    ) : (
                         <div className="h-full w-full nexus-empty-pattern rounded-2xl animate-pulse flex items-center justify-center">
                            <Loader2 className="animate-spin text-slate-200" size={32}/>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
