import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';
import { TrendingUp, ListOrdered } from 'lucide-react';

const PortfolioPrioritization: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();

    const components = useMemo(() => {
        const all = [...state.projects, ...state.programs];
        return all.sort((a, b) => b.calculatedPriorityScore - a.calculatedPriorityScore);
    }, [state.projects, state.programs]);

    const totalPortfolioValue = useMemo(() => components.reduce((sum, item) => sum + item.budget, 0), [components]);
    const [fundingLimit, setFundingLimit] = useState(totalPortfolioValue * 0.8);

    let cumulativeBudget = 0;

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
            <div className="flex items-center gap-2 mb-2">
                <ListOrdered className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Portfolio Prioritization & Selection</h2>
            </div>
            
            <div className={`${theme.components.card} p-6 border-l-4 border-l-nexus-500`}>
                <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-4">
                    <div>
                        <label htmlFor="funding-limit" className="text-sm font-bold text-slate-700 block mb-1">
                            Portfolio Funding Cutoff
                        </label>
                        <p className="text-xs text-slate-500">Adjust to simulate funding scenarios based on priority score.</p>
                    </div>
                    <span className="text-2xl font-mono font-black text-nexus-700">{formatCompactCurrency(fundingLimit)}</span>
                </div>
                <input
                    id="funding-limit"
                    type="range"
                    min={0}
                    max={totalPortfolioValue}
                    step={1000000}
                    value={fundingLimit}
                    onChange={(e) => setFundingLimit(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nexus-600"
                />
                <div className="flex justify-between text-xs font-mono text-slate-400 mt-2">
                    <span>$0</span>
                    <span>{formatCompactCurrency(totalPortfolioValue)}</span>
                </div>
            </div>
            
            <div className={`${theme.components.card} overflow-hidden`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rank</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Component</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Budget</th>
                                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cumulative</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {components.map((item, index) => {
                                const prevCumulative = cumulativeBudget;
                                cumulativeBudget += item.budget;
                                const isFunded = cumulativeBudget <= fundingLimit;

                                return (
                                    <tr key={item.id} className={`transition-colors ${!isFunded ? 'bg-slate-50/50 opacity-60 grayscale' : 'hover:bg-slate-50'}`}>
                                        <td className="px-6 py-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isFunded ? 'bg-nexus-100 text-nexus-700' : 'bg-slate-200 text-slate-500'}`}>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-sm text-slate-900">{item.name}</div>
                                            <div className="text-[10px] font-mono text-slate-500">{item.id}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <TrendingUp size={14} className={isFunded ? "text-green-500" : "text-slate-400"} />
                                                <span className={`font-black text-lg ${isFunded ? "text-slate-800" : "text-slate-500"}`}>{item.calculatedPriorityScore}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">{formatCompactCurrency(item.budget)}</td>
                                        <td className="px-6 py-4 text-right text-xs font-mono text-slate-500">{formatCompactCurrency(cumulativeBudget)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PortfolioPrioritization;