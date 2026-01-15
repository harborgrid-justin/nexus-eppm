
import React, { useDeferredValue, Suspense } from 'react';
import { Filter, PieChart as PieIcon, BarChart2, Loader2, Target, TrendingUp } from 'lucide-react';
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
        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <Card className={`p-10 h-[480px] flex flex-col relative overflow-hidden rounded-[2.5rem] shadow-sm transition-all duration-700 ${isPending ? 'opacity-40 blur-[2px]' : 'opacity-100'}`} >
                <div className="flex justify-between items-start mb-10 z-10">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3 border-b border-slate-50 pb-3">
                            <BarChart2 size={18} className="text-nexus-600"/>
                            {viewType === 'financial' ? 'Portfolio Liquidation Stream' : 'Alignment ROI Variance'}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 opacity-60">Partitioned by project code</p>
                    </div>
                    {isPending && <Loader2 className="animate-spin text-nexus-500" size={20}/>}
                </div>
                <div className="flex-1 min-h-0 z-10" ref={budgetRef}>
                    {budgetVisible ? (
                        <ErrorBoundary name="Budget Matrix">
                            <CustomBarChart 
                                data={deferredBudget} 
                                xAxisKey="name" 
                                dataKey="Spent" 
                                height={320} 
                                barColor="#0ea5e9" 
                                formatTooltip={(val) => formatCompactCurrency(val)} 
                            />
                        </ErrorBoundary>
                    ) : (
                        <div className="h-full w-full nexus-empty-pattern rounded-2xl animate-pulse flex items-center justify-center">
                            <Loader2 className="animate-spin text-slate-200" size={32}/>
                        </div>
                    )}
                </div>
                <div className="absolute -right-16 -bottom-16 opacity-[0.03] text-slate-900 pointer-events-none rotate-12">
                    <TrendingUp size={240} />
                </div>
            </Card>
            
            <Card className={`p-10 h-[480px] flex flex-col relative overflow-hidden rounded-[2.5rem] shadow-sm transition-all duration-700 ${isPending ? 'opacity-40 blur-[2px]' : 'opacity-100'}`}>
                <div className="flex justify-between items-start mb-10 z-10">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-3 border-b border-slate-50 pb-3">
                            <PieIcon size={18} className="text-blue-500"/>
                            Multi-Vector Delivery Health
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 opacity-60">Critical path distribution</p>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center z-10" ref={healthRef}>
                    {healthVisible ? (
                        <ErrorBoundary name="Health Distribution">
                            <CustomPieChart data={deferredHealth} height={340} />
                        </ErrorBoundary>
                    ) : (
                         <div className="h-full w-full nexus-empty-pattern rounded-2xl animate-pulse flex items-center justify-center">
                            <Loader2 className="animate-spin text-slate-200" size={32}/>
                        </div>
                    )}
                </div>
                <div className="absolute -left-16 -bottom-16 opacity-[0.03] text-slate-900 pointer-events-none -rotate-12">
                    <Target size={240} />
                </div>
            </Card>
        </div>
    );
};
