
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
import { Banknote, PieChart, AlertCircle, Plus } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const FundingManager: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();

    const { totalAppropriated, totalConsumed, sourceDistribution, alerts } = useMemo(() => {
        let totalApp = 0;
        let totalCon = 0;
        const dist: Record<string, number> = {};
        const alertsList: string[] = [];

        state.fundingSources.forEach(fund => {
            totalApp += fund.totalAuthorized;
            
            // Calculate consumption (Allocated to projects)
            // In absence of explicit `fundAllocations` table in mock, we sum ProjectFunding entries
            const allocated = state.projects.reduce((pSum, proj) => {
                const funding = proj.funding?.filter(f => f.fundingSourceId === fund.id) || [];
                return pSum + funding.reduce((fSum, f) => fSum + f.amount, 0);
            }, 0);

            totalCon += allocated;
            
            // Distribution
            dist[fund.type] = (dist[fund.type] || 0) + fund.totalAuthorized;

            // Alerts
            const util = fund.totalAuthorized > 0 ? (allocated / fund.totalAuthorized) : 0;
            if (util >= 0.95) {
                alertsList.push(`${fund.name} allocation near cap (${(util * 100).toFixed(0)}%). Remaining: ${formatCompactCurrency(fund.totalAuthorized - allocated)}.`);
            } else if (util >= 0.8) {
                alertsList.push(`${fund.name} utilization high (${(util * 100).toFixed(0)}%).`);
            }
        });

        const distArray = Object.entries(dist).map(([type, amount]) => ({
            type,
            amount,
            percentage: totalApp > 0 ? (amount / totalApp) * 100 : 0,
            color: type === 'Internal' ? 'bg-blue-500' : type === 'Grant' ? 'bg-green-500' : type === 'Bond' ? 'bg-purple-500' : 'bg-slate-500'
        }));

        return { 
            totalAppropriated: totalApp, 
            totalConsumed: totalCon, 
            sourceDistribution: distArray, 
            alerts: alertsList 
        };
    }, [state.fundingSources, state.projects]);

    return (
        <div className="h-full flex flex-col space-y-6 p-6 overflow-y-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className={theme.typography.h2}>Funding Manager</h2>
                    <p className={theme.typography.small}>Manage fund appropriation, consumption, and transfers.</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-green-800 uppercase">Total Appropriated</p>
                        <p className="text-xl font-black text-green-900">{formatCompactCurrency(totalAppropriated)}</p>
                    </div>
                    <div className="w-px bg-green-200 h-10"></div>
                    <div>
                        <p className="text-[10px] font-bold text-green-800 uppercase">Consumed</p>
                        <p className="text-xl font-black text-green-900">{formatCompactCurrency(totalConsumed)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Funding Sources List */}
                <div className="space-y-4">
                    {state.fundingSources.map(fund => {
                        // Re-calculate local consumption for display
                        const allocated = state.projects.reduce((pSum, proj) => {
                             const funding = proj.funding?.filter(f => f.fundingSourceId === fund.id) || [];
                             return pSum + funding.reduce((fSum, f) => fSum + f.amount, 0);
                        }, 0);
                        const percent = fund.totalAuthorized > 0 ? (allocated / fund.totalAuthorized) * 100 : 0;
                        
                        return (
                            <div key={fund.id} className={`${theme.components.card} p-5 flex flex-col gap-3`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Banknote size={20}/></div>
                                        <div>
                                            <h4 className="font-bold text-slate-800">{fund.name}</h4>
                                            <p className="text-xs text-slate-500">{fund.type} • {fund.description}</p>
                                        </div>
                                    </div>
                                    <span className="font-mono font-bold text-lg text-slate-900">{formatCurrency(fund.totalAuthorized)}</span>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500">Allocated: {formatCurrency(allocated)}</span>
                                        <span className="font-bold text-slate-700">{percent.toFixed(1)}%</span>
                                    </div>
                                    <ProgressBar value={percent} size="sm" colorClass={percent > 90 ? 'bg-red-500' : 'bg-nexus-600'} />
                                </div>
                            </div>
                        );
                    })}
                    {state.fundingSources.length === 0 && (
                        <div className="p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                            <Banknote size={48} className="mx-auto mb-4 opacity-20"/>
                            <p>No funding sources defined.</p>
                            <button className="mt-4 text-sm font-bold text-nexus-600 flex items-center justify-center gap-2 mx-auto hover:underline">
                                <Plus size={14}/> Add Source in Admin
                            </button>
                        </div>
                    )}
                </div>

                {/* Alerts & Analysis */}
                <div className="space-y-6">
                    {alerts.length > 0 ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
                            <AlertCircle className="text-amber-600 shrink-0" size={24}/>
                            <div>
                                <h4 className="font-bold text-amber-900 text-sm">Funding Alerts</h4>
                                <ul className="text-xs text-amber-800 mt-2 space-y-1 list-disc list-inside">
                                    {alerts.map((alert, i) => (
                                        <li key={i}>{alert}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex gap-4 items-center">
                            <AlertCircle className="text-green-600 shrink-0" size={24}/>
                            <div>
                                <h4 className="font-bold text-green-900 text-sm">Funding Healthy</h4>
                                <p className="text-xs text-green-800 mt-1">No utilization breaches or expiration warnings.</p>
                            </div>
                        </div>
                    )}

                    <div className={`${theme.components.card} p-6`}>
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChart size={18}/> Fund Type Distribution</h4>
                        <div className="space-y-3">
                            {sourceDistribution.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div> 
                                        {item.type}
                                    </span>
                                    <span className="font-mono">{item.percentage.toFixed(1)}%</span>
                                </div>
                            ))}
                            {sourceDistribution.length === 0 && <p className="text-slate-400 text-xs italic">No data available.</p>}
                            
                            <div className="w-full h-4 rounded-full flex overflow-hidden mt-2 bg-slate-100">
                                {sourceDistribution.map((item, idx) => (
                                    <div key={idx} className={`${item.color} h-full`} style={{ width: `${item.percentage}%` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
