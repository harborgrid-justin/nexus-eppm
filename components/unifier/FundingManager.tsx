
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
import { Banknote, PieChart, AlertCircle, Plus, Wallet, ShieldCheck } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';
import { EmptyGrid } from '../common/EmptyGrid';
import { useNavigate } from 'react-router-dom';
// Fix: Added missing Card import from local UI components to resolve reference errors
import { Card } from '../ui/Card';

export const FundingManager: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const navigate = useNavigate();

    const { totalAppropriated, totalConsumed, sourceDistribution, alerts } = useMemo(() => {
        let totalApp = 0;
        let totalCon = 0;
        const dist: Record<string, number> = {};
        const alertsList: string[] = [];

        state.fundingSources.forEach(fund => {
            totalApp += fund.totalAuthorized;
            
            const allocated = state.projects.reduce((pSum, proj) => {
                const funding = proj.funding?.filter(f => f.fundingSourceId === fund.id) || [];
                return pSum + funding.reduce((fSum, f) => fSum + f.amount, 0);
            }, 0);

            totalCon += allocated;
            dist[fund.type] = (dist[fund.type] || 0) + fund.totalAuthorized;

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

        return { totalAppropriated: totalApp, totalConsumed: totalCon, sourceDistribution: distArray, alerts: alertsList };
    }, [state.fundingSources, state.projects]);

    return (
        <div className="h-full flex flex-col space-y-8 p-8 overflow-y-auto scrollbar-thin bg-slate-50/50">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Strategic Funding Ledger</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1 uppercase tracking-tight">Appropriation governance and capital consumption monitoring.</p>
                </div>
                <div className="p-6 bg-white border border-slate-200 rounded-[2rem] flex gap-10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 bg-green-500/5 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Authority</p>
                        <p className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{formatCompactCurrency(totalAppropriated)}</p>
                    </div>
                    <div className="w-px bg-slate-100 h-12 self-center"></div>
                    <div className="relative z-10 text-right xl:text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Committed Consumption</p>
                        <p className="text-3xl font-black text-green-600 font-mono tracking-tighter">{formatCompactCurrency(totalConsumed)}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {state.fundingSources.length === 0 ? (
                         <div className="h-[400px]">
                             <EmptyGrid 
                                title="Funding Authorities Unmapped"
                                description="Configure organizational funding sources (Grants, Bonds, CapEx) in the administrative terminal to enable project appropriations."
                                icon={Wallet}
                                actionLabel="Provision Authorities"
                                onAdd={() => navigate('/admin?view=fundingSources')}
                             />
                         </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {state.fundingSources.map(fund => {
                                const allocated = state.projects.reduce((pSum, proj) => {
                                    const funding = proj.funding?.filter(f => f.fundingSourceId === fund.id) || [];
                                    return pSum + funding.reduce((fSum, f) => fSum + f.amount, 0);
                                }, 0);
                                const percent = fund.totalAuthorized > 0 ? (allocated / fund.totalAuthorized) * 100 : 0;
                                
                                return (
                                    <div key={fund.id} className={`${theme.colors.surface} border ${theme.colors.border} p-6 flex flex-col gap-6 group hover:border-nexus-400 transition-all rounded-[2rem] bg-white relative overflow-hidden`}>
                                        <div className="absolute top-0 right-0 p-8 bg-slate-50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex justify-between items-start relative z-10">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 bg-slate-100 rounded-2xl text-slate-500 group-hover:bg-nexus-50 group-hover:text-nexus-600 transition-colors shadow-inner`}><Banknote size={24}/></div>
                                                <div className="min-w-0">
                                                    <h4 className={`font-black text-sm text-slate-800 uppercase tracking-tight truncate`}>{fund.name}</h4>
                                                    <p className={`text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1`}>{fund.type} Source</p>
                                                </div>
                                            </div>
                                            <span className={`font-mono font-black text-base text-slate-900`}>{formatCompactCurrency(fund.totalAuthorized)}</span>
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2.5">
                                                <span className="text-slate-400">Appropriated: {formatCurrency(allocated)}</span>
                                                <span className={`${percent > 90 ? 'text-red-600' : 'text-nexus-700'} font-mono`}>{percent.toFixed(1)}%</span>
                                            </div>
                                            <ProgressBar value={percent} size="sm" colorClass={percent > 90 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-nexus-600 shadow-[0_0_8px_rgba(14,165,233,0.4)]'} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    {alerts.length > 0 ? (
                        <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8 space-y-6 shadow-sm animate-nexus-in">
                            <div className="flex items-center gap-3 border-b border-red-100 pb-4">
                                <AlertCircle className="text-red-500" size={24}/>
                                <h4 className="font-black text-red-900 text-sm uppercase tracking-widest">Compliance Alerts</h4>
                            </div>
                            <ul className="space-y-4">
                                {alerts.map((alert, i) => (
                                    <li key={i} className="text-xs text-red-800 leading-relaxed font-bold uppercase tracking-tight flex gap-3">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0 animate-pulse"></div>
                                        {alert}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : state.fundingSources.length > 0 ? (
                        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden group">
                            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="p-4 bg-green-50 rounded-2xl border border-green-100 text-green-600 mb-4 shadow-sm group-hover:scale-110 transition-transform"><ShieldCheck size={40}/></div>
                            <h4 className="font-black text-green-900 text-sm uppercase tracking-[0.2em]">Fiscal Posture Stable</h4>
                            <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">All appropriations are within established liquidation thresholds.</p>
                        </div>
                    ) : null}

                    {sourceDistribution.length > 0 && (
                        <Card className={`p-8 rounded-[2.5rem] shadow-sm`}>
                            <h4 className={`font-black text-slate-800 text-[10px] uppercase tracking-[0.3em] mb-8 flex items-center gap-3 border-b border-slate-50 pb-4`}><PieChart size={18} className="text-purple-600"/> Capital Mix Topology</h4>
                            <div className="space-y-6">
                                {sourceDistribution.map((item, idx) => (
                                    <div key={idx} className="group">
                                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tight mb-2">
                                            <span className={`flex items-center gap-2 text-slate-500 group-hover:text-slate-900 transition-colors`}>
                                                <div className={`w-2.5 h-2.5 rounded-full ${item.color}`}></div> 
                                                {item.type}
                                            </span>
                                            <span className={`font-mono text-slate-900`}>{item.percentage.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                                            <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: `${item.percentage}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
