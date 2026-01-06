import React from 'react';
import { Expense } from '../../../types';
import { useData } from '../../../context/DataContext';
import { formatCurrency } from '../../../utils/formatters';

interface ExpenseTableProps {
    expenses: Expense[];
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses }) => {
    const { state } = useData();
    const taskMap = new Map<string, {name: string, wbsCode: string}>(state.projects.flatMap(p => p.tasks).map(t => [t.id, { name: t.name, wbsCode: t.wbsCode }]));

    return (
        <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0 shadow-sm">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Budgeted</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actual</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Remaining</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
                {expenses.length > 0 ? expenses.map(exp => {
                    const taskInfo = taskMap.get(exp.activityId);
                    return (
                        <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{exp.description}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{state.expenseCategories.find(c=>c.id === exp.categoryId)?.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 truncate max-w-xs" title={taskInfo?.name}>
                                {taskInfo && <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs mr-2">{taskInfo.wbsCode}</span>}
                                {taskInfo?.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{formatCurrency(exp.budgetedCost)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800 text-right">{formatCurrency(exp.actualCost)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{formatCurrency(exp.remainingCost)}</td>
                        </tr>
                    );
                }) : (
                    <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400 italic">No expenses found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};
