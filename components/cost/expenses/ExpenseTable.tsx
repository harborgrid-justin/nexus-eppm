
import React from 'react';
import { Expense } from '../../../types';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import { formatCurrency } from '../../../utils/formatters';

interface ExpenseTableProps {
    expenses: Expense[];
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses }) => {
    const { state } = useData();
    const theme = useTheme();
    
    // Map tasks for contextual display (WBS + Name)
    const taskMap = new Map<string, {name: string, wbsCode: string}>(
        state.projects.flatMap(p => p.tasks).map(t => [t.id, { name: t.name, wbsCode: t.wbsCode }])
    );

    return (
        <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
            <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm border-b`}>
                <tr>
                    <th className={theme.components.table.header}>Description</th>
                    <th className={theme.components.table.header}>Category</th>
                    <th className={theme.components.table.header}>Activity</th>
                    <th className={`${theme.components.table.header} text-right`}>Budgeted</th>
                    <th className={`${theme.components.table.header} text-right`}>Actual</th>
                    <th className={`${theme.components.table.header} text-right`}>Remaining</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
                {expenses.length > 0 ? expenses.map(exp => {
                    const taskInfo = taskMap.get(exp.activityId);
                    return (
                        <tr key={exp.id} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">{exp.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-black uppercase tracking-wider text-slate-500 bg-slate-50 px-2 rounded-lg border border-slate-200 w-min whitespace-nowrap">
                                {state.expenseCategories.find(c=>c.id === exp.categoryId)?.name || 'Uncategorized'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 truncate max-w-xs flex items-center" title={taskInfo?.name}>
                                {taskInfo ? (
                                    <>
                                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[10px] mr-2 text-slate-600 font-bold">{taskInfo.wbsCode}</span>
                                        <span className="truncate">{taskInfo.name}</span>
                                    </>
                                ) : <span className="italic text-slate-400">Unlinked</span>}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-right font-mono">{formatCurrency(exp.budgetedCost)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-800 text-right font-mono">{formatCurrency(exp.actualCost)}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-bold ${exp.remainingCost < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                {formatCurrency(exp.remainingCost)}
                            </td>
                        </tr>
                    );
                }) : (
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400 italic bg-slate-50/30">
                            No non-labor expenses recorded for this project scope.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};
