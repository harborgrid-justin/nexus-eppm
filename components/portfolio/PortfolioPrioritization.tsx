import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { formatCompactCurrency } from '../../utils/formatters';
import { TrendingUp, ListOrdered, AlertCircle, ShieldCheck } from 'lucide-react';
import { usePortfolioPrioritizationLogic } from '../../hooks/domain/usePortfolioPrioritizationLogic';
import { EmptyGrid } from '../common/EmptyGrid';
import { useData } from '../../context/DataContext';

const PortfolioPrioritization: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const { t } = useI18n();
    const { prioritizedItems, totalPortfolioValue, fundingLimit, setFundingLimit } = usePortfolioPrioritizationLogic();

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding} space-y-6 animate-nexus-in scrollbar-thin`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-nexus-600 text-white rounded-xl shadow-lg shadow-nexus-500/20"><ListOrdered size={24}/></div>
                    <div>
                        <h2 className={theme.typography.h2}>{t('portfolio.pri_title', 'Strategic Prioritization Workbench')}</h2>
                        <p className={theme.typography.small}>Algorithmic ranking based on corporate strategic weights.</p>
                    </div>
                </div>
                <div className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-3 shadow-xl">
                    <ShieldCheck size={16} className="text-nexus-400"/>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        Weights: Financial {(state.governance.strategicWeights.financial * 100).toFixed(0)}% | Strategic {(state.governance.strategicWeights.strategic * 100).toFixed(0)}%
                    </span>
                </div>
            </div>
            
            <div className={`${theme.components.card} p-10 border-l-4 border-l-nexus-500 shadow-md`}>
                <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-8">
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">{t('portfolio.pri_cutoff', 'Portfolio Funding Cutoff')}</label>
                        <p className="text-sm text-slate-500 font-medium">{t('portfolio.pri_cutoff_desc', 'Simulate funding scenarios by adjusting the capital constraint boundary.')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Boundary Limit</p>
                        <span className="text-4xl font-black text-slate-900 font-mono tracking-tighter">{formatCompactCurrency(fundingLimit)}</span>
                    </div>
                </div>
                <input 
                    type="range" min={0} max={totalPortfolioValue} step={1000000} 
                    value={fundingLimit} onChange={(e) => setFundingLimit(Number(e.target.value))} 
                    className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-nexus-600 border border-slate-200 shadow-inner" 
                />
                <div className="flex justify-between mt-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <span>$0.00 Authorized</span>
                    <span>{formatCompactCurrency(totalPortfolioValue)} MAX EXPOSURE</span>
                </div>
            </div>
            
            <div className={`flex-1 overflow-auto rounded-[2rem] border ${theme.colors.border} bg-white shadow-sm`}>
                {prioritizedItems.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                        <thead className="bg-slate-50/80 backdrop-blur-md sticky top-0 z-10 shadow-sm border-b">
                            <tr>
                                <th className={theme.components.table.header + " pl-8 py-6"}>{t('common.rank', 'Rank')}</th>
                                <th className={theme.components.table.header}>{t('common.component', 'Component Identity')}</th>
                                <th className={theme.components.table.header + " text-center"}>{t('common.score', 'Weighted Index')}</th>
                                <th className={theme.components.table.header + " text-right"}>{t('common.budget', 'Capital Request')}</th>
                                <th className={theme.components.table.header + " text-center pr-8"}>{t('common.posture', 'Funding Posture')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {prioritizedItems.map((item, index) => (
                                <tr key={item.id} className={`nexus-table-row transition-all group ${!item.isFunded ? 'opacity-30 grayscale bg-slate-50/50' : 'hover:bg-slate-50/50'}`}>
                                    <td className="px-6 py-5 pl-8 font-black text-xl text-slate-300 group-hover:text-nexus-500 transition-colors tabular-nums">{index + 1}</td>
                                    <td className="px-6 py-5">
                                        <div className="font-black text-sm text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                            {item.name} 
                                            {!item.isFunded && <AlertCircle size={14} className="text-red-500 animate-pulse"/>}
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-mono uppercase font-bold mt-1">Ref: {item.id} • {item.category}</div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <TrendingUp size={16} className={item.score > 80 ? "text-green-500" : "text-slate-400"}/>
                                            <span className="text-xl font-black tabular-nums">{item.score}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right font-mono font-black text-slate-700">{formatCompactCurrency(item.budget)}</td>
                                    <td className="px-6 py-5 text-center pr-8">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all ${
                                            item.isFunded 
                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                            : 'bg-white text-slate-400 border-slate-200'
                                        }`}>
                                            {item.isFunded ? 'Funded' : 'Deferred'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="h-full flex flex-col justify-center">
                        <EmptyGrid 
                            title={t('portfolio.pri_empty', 'Prioritization Logic Null')} 
                            description={t('portfolio.pri_empty_desc', 'No candidate initiatives found in the strategic ledger. Populate the database to activate the ranking engine.')} 
                            icon={ListOrdered} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
export default PortfolioPrioritization;