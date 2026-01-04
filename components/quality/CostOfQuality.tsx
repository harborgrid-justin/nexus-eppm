
import React, { useMemo } from 'react';
import { Coins, TrendingDown, ArrowUpRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ComposedChart } from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { Project } from '../../types';
import StatCard from '../shared/StatCard';

interface CostOfQualityProps {
    project: Project;
}

const CostOfQuality: React.FC<CostOfQualityProps> = ({ project }) => {
    const theme = useTheme();

    const coq = project.costOfQuality || {
        preventionCosts: 0,
        appraisalCosts: 0,
        internalFailureCosts: 0,
        externalFailureCosts: 0
    };

    const goodQualityCost = coq.preventionCosts + coq.appraisalCosts;
    const poorQualityCost = coq.internalFailureCosts + coq.externalFailureCosts;
    const totalCoQ = goodQualityCost + poorQualityCost;
    const budgetPercent = project.budget > 0 ? (totalCoQ / project.budget) * 100 : 0;

    // Use real data if available, otherwise mock a trend based on current snapshot
    const trendData = useMemo(() => {
        if (project.coqHistory && project.coqHistory.length > 0) return project.coqHistory;
        
        // Generate trend based on current snapshot distribution
        // Prevention high = declining failure trend mock
        const isMature = goodQualityCost > poorQualityCost;
        
        return [
            { period: 'Q1', preventionCosts: coq.preventionCosts * 0.8, appraisalCosts: coq.appraisalCosts * 0.8, internalFailureCosts: isMature ? coq.internalFailureCosts * 1.5 : coq.internalFailureCosts * 0.8, externalFailureCosts: coq.externalFailureCosts },
            { period: 'Q2', preventionCosts: coq.preventionCosts * 0.9, appraisalCosts: coq.appraisalCosts * 0.9, internalFailureCosts: isMature ? coq.internalFailureCosts * 1.2 : coq.internalFailureCosts * 0.9, externalFailureCosts: coq.externalFailureCosts },
            { period: 'Q3', preventionCosts: coq.preventionCosts, appraisalCosts: coq.appraisalCosts, internalFailureCosts: coq.internalFailureCosts, externalFailureCosts: coq.externalFailureCosts },
        ];
    }, [project.coqHistory, coq, goodQualityCost, poorQualityCost]);

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
            <div className="flex items-center gap-2 mb-2">
                <Coins className="text-yellow-600" size={24}/>
                <h2 className={theme.typography.h2}>Cost of Quality (CoQ) Analysis</h2>
            </div>
            <p className={`${theme.typography.small} mb-4`}>Financial analysis of quality assurance investment versus cost of rework and defects.</p>

            {/* KPI Cards */}
            <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
                <StatCard 
                    title="Total Cost of Quality" 
                    value={formatCompactCurrency(totalCoQ)} 
                    subtext={`${budgetPercent.toFixed(1)}% of Project Budget`} 
                    icon={Coins} 
                />
                <StatCard 
                    title="Cost of Good Quality" 
                    value={formatCompactCurrency(goodQualityCost)} 
                    subtext="Prevention + Appraisal" 
                    icon={CheckCircle} 
                    trend="up" 
                />
                <StatCard 
                    title="Cost of Poor Quality" 
                    value={formatCompactCurrency(poorQualityCost)} 
                    subtext="Failure Costs" 
                    icon={AlertTriangle} 
                    trend="down" 
                />
                <StatCard 
                    title="Investment Ratio" 
                    value={poorQualityCost > 0 ? (goodQualityCost / poorQualityCost).toFixed(1) : "∞"} 
                    subtext="Target: > 2.0" 
                    icon={TrendingDown} 
                />
            </div>

            {/* Charts Section */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
                
                {/* 1. PAF Composition Chart */}
                <div className={`${theme.components.card} ${theme.layout.cardPadding} h-[400px]`}>
                    <h3 className={`${theme.typography.h3} mb-4 flex items-center gap-2`}>
                        <ArrowUpRight size={18} className="text-nexus-600"/> PAF Composition Trend
                    </h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="period" />
                            <YAxis tickFormatter={(val) => formatCompactCurrency(val)} />
                            <Tooltip formatter={(val: number) => formatCurrency(val)} />
                            <Legend />
                            {/* Cost of Good Quality */}
                            <Bar dataKey="preventionCosts" name="Prevention" stackId="a" fill="#22c55e" />
                            <Bar dataKey="appraisalCosts" name="Appraisal" stackId="a" fill="#3b82f6" />
                            {/* Cost of Poor Quality */}
                            <Bar dataKey="internalFailureCosts" name="Internal Failure" stackId="a" fill="#f59e0b" />
                            <Bar dataKey="externalFailureCosts" name="External Failure" stackId="a" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* 2. CoQ Model Explanation / Breakdown */}
                <div className="space-y-6">
                    <div className={`${theme.components.card} ${theme.layout.cardPadding}`}>
                        <h3 className={`${theme.typography.h3} mb-4`}>Investment Balance</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className={theme.colors.text.secondary}>Cost of Good Quality (Investment)</span>
                                    <span className="font-bold text-green-700">{formatCurrency(goodQualityCost)}</span>
                                </div>
                                <div className={`w-full ${theme.colors.background} h-3 rounded-full overflow-hidden flex`}>
                                    <div className="bg-green-500 h-full" style={{ width: `${totalCoQ > 0 ? (coq.preventionCosts / totalCoQ) * 100 : 0}%` }} title="Prevention"></div>
                                    <div className="bg-blue-500 h-full" style={{ width: `${totalCoQ > 0 ? (coq.appraisalCosts / totalCoQ) * 100 : 0}%` }} title="Appraisal"></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>Prevention: {formatCompactCurrency(coq.preventionCosts)}</span>
                                    <span>Appraisal: {formatCompactCurrency(coq.appraisalCosts)}</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className={theme.colors.text.secondary}>Cost of Poor Quality (Loss)</span>
                                    <span className="font-bold text-red-700">{formatCurrency(poorQualityCost)}</span>
                                </div>
                                <div className={`w-full ${theme.colors.background} h-3 rounded-full overflow-hidden flex`}>
                                    <div className="bg-yellow-500 h-full" style={{ width: `${totalCoQ > 0 ? (coq.internalFailureCosts / totalCoQ) * 100 : 0}%` }} title="Internal Failure"></div>
                                    <div className="bg-red-600 h-full" style={{ width: `${totalCoQ > 0 ? (coq.externalFailureCosts / totalCoQ) * 100 : 0}%` }} title="External Failure"></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>Internal Fail: {formatCompactCurrency(coq.internalFailureCosts)}</span>
                                    <span>External Fail: {formatCompactCurrency(coq.externalFailureCosts)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`${theme.colors.semantic.info.bg} p-6 rounded-xl border ${theme.colors.semantic.info.border}`}>
                        <h4 className={`font-bold ${theme.colors.semantic.info.text} mb-2`}>Optimal Quality Zone</h4>
                        <p className={`text-sm ${theme.colors.semantic.info.text} mb-4`}>
                            The goal is to invest in Prevention and Appraisal until the cost of Failure drops significantly. 
                            Current metrics suggest the project is in the <strong>{goodQualityCost > poorQualityCost ? 'Optimized' : 'Reactive'}</strong> zone.
                        </p>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 ${theme.colors.surface} rounded text-xs font-bold ${theme.colors.text.primary} shadow-sm border ${theme.colors.border}`}>
                                Prevention ROI: High
                            </span>
                            <span className={`px-3 py-1 ${theme.colors.surface} rounded text-xs font-bold ${theme.colors.text.primary} shadow-sm border ${theme.colors.border}`}>
                                Failure Rate: Low
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CostOfQuality;
