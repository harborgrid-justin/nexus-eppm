import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { formatCompactCurrency } from '../../utils/formatters';
import { TrendingUp, ListOrdered, AlertCircle } from 'lucide-react';
import { usePortfolioPrioritizationLogic } from '../../hooks/domain/usePortfolioPrioritizationLogic';
import { EmptyGrid } from '../common/EmptyGrid';

const PortfolioPrioritization: React.FC = () => {
    const theme = useTheme();
    const { t } = useI18n();
    const { prioritizedItems, totalPortfolioValue, fundingLimit, setFundingLimit } = usePortfolioPrioritizationLogic();

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding} space-y-6 animate-nexus-in`}>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-nexus-600 text-white rounded-lg shadow-lg"><ListOrdered size={20}/></div>
                <h2 className={theme.typography.h2}>{t('portfolio.pri_title', 'Portfolio Prioritization & Selection')}</h2>
            </div>
            
            <div className={`${theme.components.card} p-8 border-l-4 border-l-nexus-500`}>
                <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-4">
                    <div>
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">{t('portfolio.pri_cutoff', 'Portfolio Funding Cutoff')}</label>
                        <p className="text-sm text-slate-500">{t('portfolio.pri_cutoff_desc', 'Simulate funding scenarios based on strategic rank.')}</p>
                    </div>
                    <span className="text-3xl font-black text-slate-900 font-mono">{formatCompactCurrency(fundingLimit)}</span>
                </div>
                <input type="range" min={0} max={totalPortfolioValue} step={1000000} value={fundingLimit} onChange={(e) => setFundingLimit(Number(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nexus-600" />
            </div>
            
            <div className={`flex-1 overflow-auto rounded-xl border ${theme.colors.border} bg-white shadow-sm`}>
                {prioritizedItems.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className={theme.components.table.header}>{t('common.rank', 'Rank')}</th>
                                <th className={theme.components.table.header}>{t('common.component', 'Component')}</th>
                                <th className={theme.components.table.header + " text-center"}>{t('common.score', 'Strategic Score')}</th>
                                <th className={theme.components.table.header + " text-right"}>{t('common.budget', 'Budget')}</th>
                                <th className={theme.components.table.header + " text-center"}>{t('common.posture', 'Posture')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {prioritizedItems.map((item, index) => (
                                <tr key={item.id} className={`transition-opacity ${!item.isFunded ? 'opacity-40 grayscale bg-slate-50' : 'hover:bg-slate-50'}`}>
                                    <td className="px-6 py-4 font-black text-slate-400">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900 flex items-center gap-2">{item.name} {!item.isFunded && <AlertCircle size={14} className="text-red-500"/>}</div>
                                        <div className="text-[10px] text-slate-500 font-mono uppercase">{item.id} • {item.type}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center"><div className="flex items-center justify-center gap-1.5"><TrendingUp size={14} className="text-green-500"/><span className="text-lg font-black">{item.score}</span></div></td>
                                    <td className="px-6 py-4 text-right font-mono font-bold">{formatCompactCurrency(item.budget)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${item.isFunded ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>{item.isFunded ? 'Funded' : 'Deferred'}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyGrid title={t('portfolio.pri_empty', 'Prioritization Engine Neutral')} description={t('portfolio.pri_empty_desc', 'No candidate initiatives found in current ledger.')} icon={ListOrdered} />
                )}
            </div>
        </div>
    );
};
export default PortfolioPrioritization;