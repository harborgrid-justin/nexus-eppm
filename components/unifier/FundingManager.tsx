
import React from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import { Banknote, PieChart, AlertCircle } from 'lucide-react';
import { ProgressBar } from '../common/ProgressBar';

export const FundingManager: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();

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
                        <p className="text-xl font-black text-green-900">$125.0M</p>
                    </div>
                    <div className="w-px bg-green-200 h-10"></div>
                    <div>
                        <p className="text-[10px] font-bold text-green-800 uppercase">Consumed</p>
                        <p className="text-xl font-black text-green-900">$42.5M</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Funding Sources List */}
                <div className="space-y-4">
                    {state.fundingSources.map(fund => {
                        const allocated = state.fundAllocations?.filter(a => a.fundId === fund.id).reduce((sum, a) => sum + a.amount, 0) || 0;
                        const percent = (allocated / fund.totalAuthorized) * 100;
                        
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
                </div>

                {/* Alerts & Analysis */}
                <div className="space-y-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
                         <AlertCircle className="text-amber-600 shrink-0" size={24}/>
                         <div>
                             <h4 className="font-bold text-amber-900 text-sm">Funding Alerts</h4>
                             <ul className="text-xs text-amber-800 mt-2 space-y-1 list-disc list-inside">
                                 <li>Grant FY24 expires in 45 days. $1.2M remaining.</li>
                                 <li>Bond A allocation near cap (95%).</li>
                             </ul>
                         </div>
                    </div>

                    <div className={`${theme.components.card} p-6`}>
                        <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChart size={18}/> Fund Type Distribution</h4>
                        {/* Mock Distribution Viz */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Internal CapEx</span>
                                <span className="font-mono">45%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Grants</span>
                                <span className="font-mono">30%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div> Bonds</span>
                                <span className="font-mono">25%</span>
                            </div>
                            <div className="w-full h-4 rounded-full flex overflow-hidden mt-2">
                                <div className="bg-blue-500 w-[45%]"></div>
                                <div className="bg-green-500 w-[30%]"></div>
                                <div className="bg-purple-500 w-[25%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
