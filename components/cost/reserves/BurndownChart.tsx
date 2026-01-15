
import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../../../utils/formatters';
import { ReserveAnalysisData } from '../../../types/index';
import { useTheme } from '../../../context/ThemeContext';
import { useProjectWorkspace } from '../../../context/ProjectWorkspaceContext';

interface BurndownChartProps {
    data: ReserveAnalysisData;
}

export const BurndownChart: React.FC<BurndownChartProps> = ({ data }) => {
    const theme = useTheme();
    const { project } = useProjectWorkspace();

    const chartData = useMemo(() => {
        if (!project) return [];

        const initialReserve = data.totalReserves;
        const totalUsed = data.drawdowns.contingency + data.drawdowns.management;
        const currentReserve = initialReserve - totalUsed;
        
        // Strategy: Derive 3 data points: Baseline, Current, and Predictive Forecast
        // Forecast Logic: current - (avg_monthly_drawdown * remaining_months)
        const projectStart = new Date(project.startDate);
        const projectEnd = new Date(project.endDate);
        const today = new Date();
        
        const totalMonths = (projectEnd.getFullYear() - projectStart.getFullYear()) * 12 + (projectEnd.getMonth() - projectStart.getMonth());
        const elapsedMonths = Math.max(1, (today.getFullYear() - projectStart.getFullYear()) * 12 + (today.getMonth() - projectStart.getMonth()));
        const remainingMonths = Math.max(0, totalMonths - elapsedMonths);
        
        const avgMonthlyDrawdown = totalUsed / elapsedMonths;
        const forecastReserve = Math.max(0, currentReserve - (avgMonthlyDrawdown * remainingMonths));

        return [
            { period: 'Plan Start', reserve: initialReserve, baseline: initialReserve },
            { period: 'Current', reserve: currentReserve, baseline: initialReserve },
            { period: 'Target Finish', reserve: forecastReserve, baseline: initialReserve }
        ];
    }, [project, data]);

    return (
        <div className={`bg-white border ${theme.colors.border} rounded-[2rem] p-8 h-80 shadow-sm flex flex-col`}>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 border-b pb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div> Fiscal Reserve Burndown Velocity
            </h3>
            <div className="flex-1 min-h-0">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorReserve" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                            <XAxis dataKey="period" tick={{fontSize: 10, fontWeight: 'bold'}} />
                            <YAxis tickFormatter={(val) => formatCompactCurrency(val)} width={60} tick={{fontSize: 10, fontWeight: 'bold'}} />
                            <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={theme.charts.tooltip} />
                            <Legend wrapperStyle={{fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold'}} />
                            <Area type="monotone" dataKey="baseline" stroke="#cbd5e1" strokeWidth={1} fill="none" strokeDasharray="5 5" name="Reserve Cap" />
                            <Area type="monotone" dataKey="reserve" stroke="#8b5cf6" fill="url(#colorReserve)" strokeWidth={3} name="Authorized Liquidity" />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full nexus-empty-pattern rounded-2xl flex items-center justify-center text-slate-400 italic text-sm">
                        Waiting for fiscal baseline commit...
                    </div>
                )}
            </div>
        </div>
    );
};
