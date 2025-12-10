
import React from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Filter, Search } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface CostExpensesProps {
    projectId: string;
}

const CostExpenses: React.FC<CostExpensesProps> = ({ projectId }) => {
    const { state } = useData();
    const tasks = state.projects.find(p => p.id === projectId)?.tasks || [];
    const taskMap = new Map(tasks.map(t => [t.id, t.name]));
    
    // Filter expenses associated with tasks in the current project
    const expenses = state.expenses.filter(e => tasks.some(t => t.id === e.activityId));

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search expenses..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-nexus-500" />
                    </div>
                </div>
                <button className="px-3 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium">
                    <Plus size={16} /> Add Expense
                </button>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Budgeted Cost</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actual Cost</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Remaining Cost</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {expenses.length > 0 ? expenses.map(exp => (
                            <tr key={exp.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{exp.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{state.expenseCategories.find(c=>c.id === exp.categoryId)?.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 truncate max-w-xs" title={taskMap.get(exp.activityId)}>
                                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs mr-2">{tasks.find(t=>t.id===exp.activityId)?.wbsCode}</span> 
                                  {taskMap.get(exp.activityId)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{formatCurrency(exp.budgetedCost)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800 text-right">{formatCurrency(exp.actualCost)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 text-right">{formatCurrency(exp.remainingCost)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">No expenses found for this project.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CostExpenses;
