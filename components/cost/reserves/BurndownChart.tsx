import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../../../utils/formatters';
import { ReserveAnalysisData } from '../../../types/index';
import { useTheme } from '../../../context/ThemeContext';
import { useProjectWorkspace } from '../../../context/ProjectWorkspaceContext';
import { Activity } from 'lucide-react';

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
            { period: 'Current Context', reserve: currentReserve, baseline: initialReserve },
            { period: 'Target Completion', reserve: forecastReserve, baseline: initialReserve }
        ];
    }, [project, data]);

    return (
        <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-[2.5rem] p-8 h-80 shadow-sm flex flex-col group hover:border-nexus-300 transition-all`}>
            <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Activity size={16} className="text-nexus-600 animate-pulse" /> Strategic Reserve Attenuation
                </h3>
                <div className="flex gap-4 text-[9px] font-black uppercase text-slate-400">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-slate-200 rounded-sm"></div> Capacity Cap</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-nexus-600 rounded-sm"></div> Consumption Path</span>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorReserve" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={theme.charts.palette[0]} stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor={theme.charts.palette[0]} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                            <XAxis dataKey="period" tick={{fontSize: 10, fontWeight: 'bold', fill: theme.colors.text.tertiary}} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={(val) => formatCompactCurrency(val)} width={50} tick={{fontSize: 10, fontWeight: 'bold', fill: theme.colors.text.tertiary}} axisLine={false} tickLine={false} />
                            <Tooltip formatter={(val: number) => formatCurrency(val)} contentStyle={theme.charts.tooltip} />
                            <Area type="monotone" dataKey="baseline" stroke="#cbd5e1" strokeWidth={1} fill="none" strokeDasharray="6 4" name="Reserve Cap" />
                            <Area type="monotone" dataKey="reserve" stroke={theme.charts.palette[0]} fill="url(#colorReserve)" strokeWidth={4} name="Authorized Liquidity" />
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