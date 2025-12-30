
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useProjectState } from '../../hooks';
import { Banknote, Plus, PieChart as PieChartIcon, TrendingUp, AlertTriangle, Layers, Lock, ShieldCheck } from 'lucide-react';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { CustomPieChart } from '../charts/CustomPieChart';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Bar } from 'recharts';
import type { ProjectFunding, FundingTransaction } from '../../types';
import FundingAllocationModal from './FundingAllocationModal';
import { getDaysDiff } from '../../utils/dateUtils';
import StatCard from '../shared/StatCard';

interface ProjectFundingProps {
    projectId: string;
}

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];

const ProjectFunding: React.FC<ProjectFundingProps> = ({ projectId }) => {
    const { state, dispatch } = useData();
    const { project, financials } = useProjectState(projectId);
    const [viewMode, setViewMode] = useState<'reconciliation' | 'ledger'>('reconciliation');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- Derived Data ---
    
    // 1. Funding Summary
    const fundingSummary = useMemo(() => {
        const totalAuthorized = project?.funding?.filter(f => f.status === 'Authorized' || f.status === 'Released').reduce((sum, f) => sum + f.amount, 0) || 0;
        const totalReleased = project?.funding?.filter(f => f.status === 'Released').reduce((sum, f) => sum + f.amount, 0) || 0;
        // In real app, committed comes from POs, spent from Actuals.
        // We use project.spent and financials.totalCommitted from hook
        const spent = project?.spent || 0;
        const remaining = totalReleased - spent;
        
        return { totalAuthorized, totalReleased, spent, remaining };
    }, [project, financials]);

    // 2. Funding Limit Reconciliation Chart Data
    // Compares Cumulative Cost vs Funding Limit Steps over time
    const reconciliationData = useMemo(() => {
        if (!project) return [];
        const start = new Date(project.startDate);
        const end = new Date(project.endDate);
        const totalDays = getDaysDiff(start, end);
        const data = [];
        const steps = 12;

        const fundingReleases = (project.funding || [])
            .filter(f => f.status === 'Released' && f.transactions)
            .flatMap(f => (f.transactions || [])
                .filter(t => t.type === 'Allocation')
                .map(t => ({
                    day: getDaysDiff(start, new Date(t.date)),
                    amount: t.amount
                }))
            );

        for (let i = 0; i <= steps; i++) {
            const currentDay = (i / steps) * totalDays;

            const fundingAtPoint = fundingReleases
                .filter(r => r.day <= currentDay)
                .reduce((sum, r) => sum + r.amount, 0);

            const percentTime = i / steps;
            const curveFactor = percentTime < 0.5 ? 2 * percentTime * percentTime : -1 + (4 - 2 * percentTime) * percentTime;
            const costAtPoint = project.budget * curveFactor;

            data.push({
                period: `Month ${i}`,
                FundingLimit: fundingAtPoint,
                CumulativeCost: costAtPoint,
                Variance: fundingAtPoint - costAtPoint
            });
        }
        return data;
    }, [project]);

    // 3. Distribution Data
    const distributionData = useMemo(() => {
        return project?.funding?.map((f, i) => {
            const source = state.fundingSources.find(s => s.id === f.fundingSourceId);
            return {
                name: source?.name || 'Unknown Source',
                value: f.amount,
                color: COLORS[i % COLORS.length]
            };
        }) || [];
    }, [project, state.fundingSources]);

    // 4. Ledger Data
    const ledgerData = useMemo(() => {
        if (!project?.funding) return [];

        return project.funding.flatMap(f =>
            (f.transactions || []).map(t => ({
                ...t,
                sourceName: state.fundingSources.find(s => s.id === f.fundingSourceId)?.name
            }))
        ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [project, state.fundingSources]);


    const handleAddFunding = (newFunding: Partial<ProjectFunding>) => {
        // In real app, dispatch action to add funding
        alert(`Allocated ${formatCurrency(newFunding.amount || 0)} from Source ${newFunding.fundingSourceId}`);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50/50">
            {isModalOpen && (
                <FundingAllocationModal 
                    projectId={projectId} 
                    sources={state.fundingSources} 
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddFunding}
                />
            )}

            {/* Header / KPI Area */}
            <div className="p-6 pb-0 grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Authorized Funding" 
                    value={formatCompactCurrency(fundingSummary.totalAuthorized)} 
                    icon={ShieldCheck} 
                    subtext="Approved Budget Authority"
                />
                <StatCard 
                    title="Funds Released" 
                    value={formatCompactCurrency(fundingSummary.totalReleased)} 
                    icon={Banknote} 
                    subtext="Available for Expenditure"
                />
                <StatCard 
                    title="Burn Rate" 
                    value="$125k / mo" 
                    icon={TrendingUp} 
                    subtext="3-Month Average"
                />
                <StatCard 
                    title="Solvency Status" 
                    value={fundingSummary.remaining < 0 ? "Insolvent" : "Solvent"} 
                    icon={fundingSummary.remaining < 0 ? AlertTriangle : Layers}
                    trend={fundingSummary.remaining < 0 ? 'down' : 'up'}
                    subtext={`Runway: ${fundingSummary.remaining < 0 ? 0 : 4} Months`}
                />
            </div>

            {/* Toolbar */}
            <div className="px-6 py-4 flex justify-between items-center">
                <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                    <button 
                        onClick={() => setViewMode('reconciliation')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'reconciliation' ? 'bg-nexus-100 text-nexus-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        Reconciliation Analysis
                    </button>
                    <button 
                        onClick={() => setViewMode('ledger')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'ledger' ? 'bg-nexus-100 text-nexus-700 shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        Transaction Ledger
                    </button>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium"
                >
                    <Plus size={16} /> New Allocation
                </button>
            </div>

            <div className="flex-1 overflow-hidden px-6 pb-6">
                {viewMode === 'reconciliation' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full overflow-y-auto">
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[500px]">
                            <h3 className="font-bold text-slate-800 mb-4">Funding Limit Reconciliation</h3>
                            <div className="h-[420px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={reconciliationData} margin={{top: 20, right: 30, left: 20, bottom: 0}}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="period" />
                                        <YAxis tickFormatter={(val) => formatCompactCurrency(val)} />
                                        <Tooltip formatter={(val: number) => formatCurrency(val)} />
                                        <Legend />
                                        {/* Step Chart for Funding Limit */}
                                        <Line type="stepAfter" dataKey="FundingLimit" stroke="#22c55e" strokeWidth={3} name="Funding Limit" dot={false} />
                                        {/* S-Curve for Cost */}
                                        <Area type="monotone" dataKey="CumulativeCost" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={2} name="Cumulative Cost" />
                                        {/* Reference Line for Solvency */}
                                        <ReferenceLine y={fundingSummary.totalReleased} stroke="red" strokeDasharray="3 3" label="Current Cap" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1">
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChartIcon size={16} /> Funding Sources</h4>
                                <CustomPieChart data={distributionData} height={200} />
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="font-bold text-slate-800 mb-2">Solvency Check</h4>
                                <p className="text-sm text-slate-600 mb-4">Ensure funding releases (Step) always exceed cumulative costs (Curve).</p>
                                {reconciliationData.some(d => d.Variance < 0) ? (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                                        <AlertTriangle className="text-red-600 shrink-0" size={20}/>
                                        <div className="text-sm text-red-800">
                                            <strong>Solvency Breach Detected:</strong> Cost exceeds funding limit in upcoming period. Request drawdown immediately.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                                        <ShieldCheck className="text-green-600 shrink-0" size={20}/>
                                        <div className="text-sm text-green-800">
                                            <strong>Healthy:</strong> Funding covers projected costs through project completion.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
                            Funding Ledger (Audit Trail)
                        </div>
                        <div className="flex-1 overflow-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-white sticky top-0">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Approved By</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {ledgerData.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 text-sm font-mono text-slate-500">{tx.id}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{tx.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    tx.type === 'Allocation' ? 'bg-green-100 text-green-700' :
                                                    tx.type === 'Drawdown' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-800">{tx.description}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{tx.approvedBy}</td>
                                            <td className={`px-6 py-4 text-sm font-mono font-bold text-right ${
                                                tx.amount < 0 ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                                {formatCurrency(tx.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectFunding;
