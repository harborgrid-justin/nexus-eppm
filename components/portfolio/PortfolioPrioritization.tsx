import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';
import { TrendingUp, ListOrdered, AlertCircle, Briefcase } from 'lucide-react';
import { usePortfolioPrioritizationLogic } from '../../hooks/domain/usePortfolioPrioritizationLogic';
import { Button } from '../ui/Button';
import { EmptyState } from '../common/EmptyState';

const PortfolioPrioritization: React.FC = () => {
    const theme = useTheme();
    const { 
        prioritizedItems, 
        totalPortfolioValue, 
        fundingLimit, 
        setFundingLimit,
        isEmpty 
    } = usePortfolioPrioritizationLogic();

    if (isEmpty) {
        return (
            <div className={`h-full flex items-center justify-center ${theme.colors.background}`}>
                <EmptyState 
                    title="No Portfolio Components"
                    description="Add projects or programs to begin prioritization analysis."
                    icon={ListOrdered}
                    action={<Button variant="primary" icon={Briefcase}>Create Project</Button>}
                />
            </div>
        );
    }

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
            <div className="flex items-center gap-2 mb-2">
                <ListOrdered className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Portfolio Prioritization & Selection</h2>
            </div>
            
            <div className={`${theme.components.card} p-6 border-l-4 border-l-nexus-500`}>
                <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-4">
                    <div>
                        <label htmlFor="funding-limit" className={`text-sm font-bold ${theme.colors.text.primary} block mb-1`}>
                            Portfolio Funding Cutoff
                        </label>
                        <p className={`text-xs ${theme.colors.text.secondary}`}>Adjust to simulate funding scenarios based on priority score.</p>
                    </div>
                    <span className={`text-2xl font-mono font-black ${theme.colors.text.primary}`}>{formatCompactCurrency(fundingLimit)}</span>
                </div>
                <input
                    id="funding-limit"
                    type="range"
                    min={0}
                    max={totalPortfolioValue}
                    step={1000000}
                    value={fundingLimit}
                    onChange={(e) => setFundingLimit(Number(e.target.value))}
                    className={`w-full h-3 ${theme.colors.background} rounded-lg appearance-none cursor-pointer accent-nexus-600 border ${theme.colors.border}`}
                />
                <div className={`flex justify-between text-xs font-mono ${theme.colors.text.tertiary} mt-2`}>
                    <span>$0</span>
                    <span>{formatCompactCurrency(totalPortfolioValue)}</span>
                </div>
            </div>
            
            <div className={`${theme.components.card} overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className={theme.colors.background}>
                            <tr>
                                <th className={`px-6 py-4 text-left text-[10px] font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>Rank</th>
                                <th className={`px-6 py-4 text-left text-[10px] font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>Component</th>
                                <th className={`px-6 py-4 text-left text-[10px] font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>Category</th>
                                <th className={`px-6 py-4 text-center text-[10px] font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>Score</th>
                                <th className={`px-6 py-4 text-right text-[10px] font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>Budget</th>
                                <th className={`px-6 py-4 text-right text-[10px] font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>Cumulative</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                            {prioritizedItems.map((item, index) => (
                                <tr key={item.id} className={`transition-colors ${!item.isFunded ? 'opacity-50 grayscale bg-slate-50' : `hover:${theme.colors.background}`}`}>
                                    <td className="px-6 py-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${item.isFunded ? 'bg-nexus-100 text-nexus-700' : 'bg-slate-200 text-slate-500'}`}>
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`font-bold text-sm ${theme.colors.text.primary} flex items-center gap-2`}>
                                            {item.name}
                                            {!item.isFunded && <AlertCircle size={12} className="text-red-500"/>}
                                        </div>
                                        <div className={`text-[10px] font-mono ${theme.colors.text.tertiary}`}>{item.id} • {item.type}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${theme.colors.background} border ${theme.colors.border} ${theme.colors.text.secondary}`}>
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <TrendingUp size={14} className={item.isFunded ? "text-green-500" : "text-slate-400"} />
                                            <span className={`font-black text-lg ${item.isFunded ? theme.colors.text.primary : theme.colors.text.tertiary}`}>{item.score}</span>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-mono font-medium ${theme.colors.text.secondary}`}>{formatCompactCurrency(item.budget)}</td>
                                    <td className={`px-6 py-4 text-right text-xs font-mono ${theme.colors.text.tertiary}`}>{formatCompactCurrency(item.cumulativeBudget)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PortfolioPrioritization;