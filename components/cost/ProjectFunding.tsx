
import React, { useState, useMemo, useTransition } from 'react';
import { useData } from '../../context/DataContext';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { Banknote, Plus, PieChart as PieChartIcon, TrendingUp, Layers, Lock, ShieldCheck, ArrowRightLeft, DollarSign, Wallet } from 'lucide-react';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { CustomPieChart } from '../charts/CustomPieChart';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Bar } from 'recharts';
import FundingAllocationModal from './FundingAllocationModal';
import { getDaysDiff } from '../../utils/dateUtils';
import StatCard from '../shared/StatCard';
import { ProjectFunding as ProjectFundingType } from '../../types/index';
import { EmptyGrid } from '../common/EmptyGrid';

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];

export const ProjectFunding: React.FC = () => {
    const { state, dispatch } = useData();
    const { project, financials } = useProjectWorkspace();
    const projectId = project.id;
    const [viewMode, setViewMode] = useState<'reconciliation' | 'sources'>('reconciliation');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleViewChange = (mode: 'reconciliation' | 'sources') => {
        startTransition(() => {
            setViewMode(mode);
        });
    };

    // Filter to show only funding sources that are actually linked to this project
    const projectFundingSources = useMemo(() => {
        if (!project?.funding) return [];
        return project.funding.map(f => {
            const source = state.fundingSources.find(s => s.id === f.fundingSourceId);
            return {
                ...f,
                sourceName: source?.name || 'Unknown Authority',
                sourceType: source?.type || 'Other'
            };
        });
    }, [project, state.fundingSources]);

    const fundingSummary = useMemo(() => {
        const released = project?.funding?.filter(f => f.status === 'Released').reduce((sum, f) => sum + f.amount, 0) || 0;
        const total = project?.funding?.reduce((sum, f) => sum + f.amount, 0) || 0;
        return { released, total, percentage: total > 0 ? (released / total) * 100 : 0 };
    }, [project]);

    const sourceData = useMemo(() => {
        return projectFundingSources.map((f, i) => ({
            name: f.sourceName,
            value: f.amount,
            color: COLORS[i % COLORS.length]
        }));
    }, [projectFundingSources]);

    // Derived chart data for reconciliation
    const reconciliationData = useMemo(() => {
        if (!project) return [];
        const start = new Date(project.startDate);
        const end = new Date(project.endDate);
        const months = [];
        let curr = new Date(start);
        
        while (curr <= end) {
            months.push(new Date(curr));
            curr.setMonth(curr.getMonth() + 1);
        }
        
        // Mocking cumulative spend curve logic - in real app, aggregate from cost/budget log
        let cumulativeSpend = 0;
        let cumulativeFunding = 0;
        
        return months.slice(0, 12).map((date, i) => { // limit to 12 months for view
             const monthKey = date.toLocaleDateString('default', { month: 'short' });
             
             // Simple linear mock for spend based on project progress
             const monthlySpend = (project.spent || 0) / 12 * (i < 6 ? 1 : 0); 
             cumulativeSpend += monthlySpend;
             
             // Cumulative Funding release based on total released
             cumulativeFunding = (fundingSummary.released / 12) * (i + 1);
             
             return {
                 name: monthKey,
                 Limit: cumulativeFunding, 
                 Spend: cumulativeSpend
             };
        });
    }, [project, fundingSummary]);

    const handleSaveFunding = (funding: ProjectFundingType) => {
        dispatch({ type: 'ADD_PROJECT_FUNDING', payload: { projectId, funding } });
        setIsModalOpen(false);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50/50">
            {isModalOpen && (
                <FundingAllocationModal 
                    projectId={projectId} 
                    sources={state.fundingSources} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSaveFunding} 
                />
            )}

            <div className="p-6 pb-0 grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Funding Authorized" value={formatCompactCurrency(fundingSummary.total)} icon={ShieldCheck} />
                <StatCard title="Funds Released" value={formatCompactCurrency(fundingSummary.released)} icon={Banknote} subtext={`${fundingSummary.percentage.toFixed(1)}% of Authority`} />
                <StatCard title="Available Cash Flow" value={formatCompactCurrency(fundingSummary.released - (project?.spent || 0))} icon={Wallet} trend="up" />
                <StatCard title="Funding Status" value={fundingSummary.released >= (project?.spent || 0) ? 'Solvent' : 'Cash Constraint'} icon={Layers} trend={fundingSummary.released >= (project?.spent || 0) ? 'up' : 'down'} />
            </div>

            <div className="px-6 py-4 flex justify-between items-center">
                <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                    <button onClick={() => handleViewChange('reconciliation')} className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-md transition-all ${viewMode === 'reconciliation' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}>Reconciliation</button>
                    <button onClick={() => handleViewChange('sources')} className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-md transition-all ${viewMode === 'sources' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}>Color of Money</button>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-nexus-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-nexus-700 shadow-md active:scale-95 transition-all">
                    <Plus size={16}/> New Allocation
                </button>
            </div>

            <div className={`flex-1 overflow-hidden px-6 pb-6 ${isPending ? 'opacity-50' : 'opacity-100'} transition-opacity`}>
                {viewMode === 'reconciliation' ? (
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ArrowRightLeft size={18} className="text-nexus-600"/> Fiscal Burn vs. Funding Release
                        </h3>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={reconciliationData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis tickFormatter={(val) => formatCompactCurrency(val)} />
                                    <Tooltip formatter={(val: number) => formatCurrency(val)} />
                                    <Legend />
                                    <Area type="stepAfter" dataKey="Limit" stroke="#10b981" fill="#dcfce7" name="Funding Limit" />
                                    <Bar dataKey="Spend" fill="#0ea5e9" barSize={30} name="Cumulative Spend" radius={[4,4,0,0]} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <PieChartIcon size={18} className="text-blue-500"/> Funding by Source (Authority Distribution)
                            </h3>
                            <CustomPieChart data={sourceData} height={350} />
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-500">Source Restrictions & Compliance</div>
                            <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-thin">
                                {projectFundingSources.length > 0 ? projectFundingSources.map(f => (
                                    <div key={f.id} className="border-l-4 border-l-nexus-500 pl-4 py-1 group hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-slate-800">{f.sourceName}</p>
                                                <p className="text-xs text-slate-500 mt-1">Authority Type: <strong>{f.sourceType}</strong> • FY{f.fiscalYear}</p>
                                            </div>
                                            <span className="font-mono font-bold text-sm text-nexus-700">{formatCompactCurrency(f.amount)}</span>
                                        </div>
                                        <div className="mt-3 flex gap-2">
                                            <span className="text-[9px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-tighter">Ringfenced</span>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-tighter ${f.status === 'Released' ? 'bg-green-50 text-green-700' : 'bg-indigo-50 text-indigo-700'}`}>
                                                {f.status}
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                     <div className="h-full flex flex-col justify-center">
                                         <EmptyGrid 
                                            title="No Funding Sources"
                                            description="This project has no allocated funds. Add a funding source to enable budget release."
                                            icon={Banknote}
                                            actionLabel="Allocate Funds"
                                            onAdd={() => setIsModalOpen(true)}
                                         />
                                     </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ProjectFunding;
