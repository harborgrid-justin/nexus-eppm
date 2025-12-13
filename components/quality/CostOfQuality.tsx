
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

    // Mock trend data if not present on project
    const trendData = useMemo(() => {
        if (project.coqHistory && project.coqHistory.length > 0) return project.coqHistory;
        
        // Generate mock trend showing "Investment in Prevention reduces Failure"
        return [
            { period: 'Q1', preventionCosts: 5000, appraisalCosts: 5000, internalFailureCosts: 15000, externalFailureCosts: 2000 },
            { period: 'Q2', preventionCosts: 8000, appraisalCosts: 7000, internalFailureCosts: 12000, externalFailureCosts: 1000 },
            { period: 'Q3', preventionCosts: 12000, appraisalCosts: 8000, internalFailureCosts: 6000, externalFailureCosts: 500 },
            { period: 'Q4', preventionCosts: 15000, appraisalCosts: 8000, internalFailureCosts: 4000, externalFailureCosts: 0 },
        ];
    }, [project.coqHistory]);

    return (
        <div className="h-full overflow-y-auto p-6 space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 mb-2">
                <Coins className="text-yellow-600" size={24}/>
                <h2 className={theme.typography.h2}>Cost of Quality (CoQ) Analysis</h2>
            </div>
            <p className="text-sm text-slate-500 mb-4">Financial analysis of quality assurance investment versus cost of rework and defects.</p>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. PAF Composition Chart */}
                <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm h-[400px]`}>
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
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
                    <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm`}>
                        <h3 className="font-bold text-slate-800 mb-4">Investment Balance</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Cost of Good Quality (Investment)</span>
                                    <span className="font-bold text-green-700">{formatCurrency(goodQualityCost)}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                                    <div className="bg-green-500 h-full" style={{ width: `${(coq.preventionCosts / totalCoQ) * 100}%` }} title="Prevention"></div>
                                    <div className="bg-blue-500 h-full" style={{ width: `${(coq.appraisalCosts / totalCoQ) * 100}%` }} title="Appraisal"></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>Prevention: {formatCompactCurrency(coq.preventionCosts)}</span>
                                    <span>Appraisal: {formatCompactCurrency(coq.appraisalCosts)}</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">Cost of Poor Quality (Loss)</span>
                                    <span className="font-bold text-red-700">{formatCurrency(poorQualityCost)}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                                    <div className="bg-yellow-500 h-full" style={{ width: `${(coq.internalFailureCosts / totalCoQ) * 100}%` }} title="Internal Failure"></div>
                                    <div className="bg-red-600 h-full" style={{ width: `${(coq.externalFailureCosts / totalCoQ) * 100}%` }} title="External Failure"></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mt-1">
                                    <span>Internal Fail: {formatCompactCurrency(coq.internalFailureCosts)}</span>
                                    <span>External Fail: {formatCompactCurrency(coq.externalFailureCosts)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h4 className="font-bold text-blue-900 mb-2">Optimal Quality Zone</h4>
                        <p className="text-sm text-blue-800 mb-4">
                            The goal is to invest in Prevention and Appraisal until the cost of Failure drops significantly. 
                            Current metrics suggest the project is in the <strong>{goodQualityCost > poorQualityCost ? 'Optimized' : 'Reactive'}</strong> zone.
                        </p>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-white rounded text-xs font-bold text-blue-700 shadow-sm border border-blue-100">
                                Prevention ROI: High
                            </span>
                            <span className="px-3 py-1 bg-white rounded text-xs font-bold text-blue-700 shadow-sm border border-blue-100">
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
