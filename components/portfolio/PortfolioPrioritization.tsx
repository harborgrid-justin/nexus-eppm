
import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';
import { TrendingUp } from 'lucide-react';

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
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6`}>
            <h2 className={theme.typography.h2}>Portfolio Prioritization & Selection</h2>
            
            <div className="bg-white p-6 rounded-xl border border-slate-200">
                <label htmlFor="funding-limit" className="text-sm font-medium text-slate-700 block mb-2">
                    Set Portfolio Funding Limit: <span className="font-bold text-nexus-700">{formatCompactCurrency(fundingLimit)}</span>
                </label>
                <input
                    id="funding-limit"
                    type="range"
                    min={0}
                    max={totalPortfolioValue}
                    step={1000000}
                    value={fundingLimit}
                    onChange={(e) => setFundingLimit(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            
            <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rank</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Component</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Priority Score</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Budget</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Cumulative</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {components.map((item, index) => {
                            const prevCumulative = cumulativeBudget;
                            cumulativeBudget += item.budget;
                            const isFunded = cumulativeBudget <= fundingLimit;

                            return (
                                <tr key={item.id} className={`${!isFunded ? 'bg-slate-50 opacity-50' : 'hover:bg-slate-50'}`}>
                                    <td className="px-6 py-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isFunded ? 'bg-nexus-100 text-nexus-700' : 'bg-slate-200 text-slate-500'}`}>
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{item.name}</div>
                                        <div className="text-xs text-slate-500">{item.id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <TrendingUp size={14} className="text-green-500" />
                                            <span className="font-semibold text-lg text-slate-800">{item.calculatedPriorityScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-800">{formatCompactCurrency(item.budget)}</td>
                                    <td className="px-6 py-4 text-right text-sm text-slate-500">{formatCompactCurrency(cumulativeBudget)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PortfolioPrioritization;
