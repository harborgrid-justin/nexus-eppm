
import React, { useState, useMemo } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useData } from '../../../context/DataContext';
import StatCard from '../../shared/StatCard';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../common/ProgressBar';
import { ChartPlaceholder } from '../../charts/ChartPlaceholder';
import { Activity, DollarSign, TrendingUp, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { formatCompactCurrency } from '../../../utils/formatters';

const TemplateHeader = ({ number, title, subtitle }: { number: string, title: string, subtitle?: string }) => (
    <div className="flex items-start gap-4 mb-8 border-b border-slate-200 pb-6">
        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono text-lg font-bold shadow-lg shadow-slate-200 shrink-0">
            {number}
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
        </div>
    </div>
);

export const ExecutiveDashboardTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [period, setPeriod] = useState('FY2024');

    const metrics = useMemo(() => {
        const totalValue = state.projects.reduce((sum, p) => sum + p.budget, 0);
        const totalRisks = state.risks.filter(r => r.score >= 15).length;
        const criticalProjects = state.projects.filter(p => p.health === 'Critical').length;
        const healthScore = Math.max(0, 100 - (criticalProjects * 10));
        return { totalValue, totalRisks, healthScore };
    }, [state.projects, state.risks]);

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding}`}>
            <div className="flex justify-between items-start">
                <TemplateHeader number="01" title="Executive Portfolio" subtitle={`${period} Strategic Overview`} />
                <div className="flex gap-2">
                    <select 
                        className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-nexus-500"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <option>FY2024</option>
                        <option>Q1 2024</option>
                    </select>
                </div>
            </div>
            
            <div className={theme.layout.sectionSpacing}>
                <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
                    <StatCard title="Portfolio Value" value={formatCompactCurrency(metrics.totalValue)} icon={DollarSign} trend="up" subtext="Live Budget Sum" />
                    <StatCard title="Health Score" value={`${metrics.healthScore}/100`} icon={Activity} subtext="Weighted average" />
                    <StatCard title="ROI" value="18.5%" icon={TrendingUp} trend="up" subtext="Projected (Target)" />
                    <StatCard title="Critical Risks" value={metrics.totalRisks} icon={AlertTriangle} trend={metrics.totalRisks > 0 ? 'down' : 'up'} subtext="High Severity" />
                </div>

                <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
                    <Card className={`lg:col-span-2 ${theme.layout.cardPadding} flex flex-col`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={theme.typography.h3}>Strategic Alignment Matrix</h3>
                            <Button variant="ghost" size="sm" icon={MoreHorizontal} />
                        </div>
                        <div className="flex-1 min-h-[300px] bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center relative overflow-hidden">
                            <ChartPlaceholder title="Risk (Y) vs Value (X) vs Budget (Z)" message="Data visualization requires active projects." />
                        </div>
                    </Card>
                    <Card className={`${theme.layout.cardPadding} flex flex-col`}>
                        <h3 className={`${theme.typography.h3} mb-6`}>Investment Mix</h3>
                        <div className="flex-1 flex flex-col justify-center min-h-[300px]">
                            <ChartPlaceholder title="Portfolio Allocation" height={200} />
                            <div className="mt-8 space-y-4">
                                {state.projects.length > 0 ? (
                                    <>
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1"><span>Growth</span> <span>45%</span></div>
                                            <ProgressBar value={45} colorClass="bg-nexus-600" size="sm"/>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1"><span>Run</span> <span>30%</span></div>
                                            <ProgressBar value={30} colorClass="bg-emerald-500" size="sm"/>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-center text-xs text-slate-400 italic">No projects to classify.</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
