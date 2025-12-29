
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Filter, Search, Receipt, Save } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';
import { Expense } from '../../types';

interface CostExpensesProps {
    projectId: string;
}

const CostExpenses: React.FC<CostExpensesProps> = ({ projectId }) => {
    const { state } = useData();
    const tasks = state.projects.find(p => p.id === projectId)?.tasks || [];
    const taskMap = new Map(tasks.map(t => [t.id, t.name]));
    
    // Filter expenses associated with tasks in the current project
    const expenses = state.expenses.filter(e => tasks.some(t => t.id === e.activityId));

    // Panel State
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [newExpense, setNewExpense] = useState<Partial<Expense>>({
        description: '',
        categoryId: state.expenseCategories[0]?.id || '',
        activityId: '',
        budgetedCost: 0,
        actualCost: 0
    });

    const handleSaveExpense = () => {
        if(!newExpense.description || !newExpense.activityId) return;
        const expense: Expense = {
            id: generateId('EXP'),
            activityId: newExpense.activityId,
            categoryId: newExpense.categoryId || '',
            description: newExpense.description,
            budgetedCost: newExpense.budgetedCost || 0,
            actualCost: newExpense.actualCost || 0,
            remainingCost: (newExpense.budgetedCost || 0) - (newExpense.actualCost || 0),
            atCompletionCost: newExpense.budgetedCost || 0,
            budgetedUnits: 0,
            actualUnits: 0,
            remainingUnits: 0,
            atCompletionUnits: 0
        };
        // Dispatch logic would go here
        console.log("Saving Expense:", expense);
        setIsPanelOpen(false);
        setNewExpense({ description: '', categoryId: '', activityId: '', budgetedCost: 0, actualCost: 0 });
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search expenses..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-nexus-500" />
                    </div>
                </div>
                <button 
                    onClick={() => setIsPanelOpen(true)}
                    className="px-3 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium"
                >
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

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title="Add Non-Labor Expense"
                width="md:w-[500px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveExpense} icon={Save}>Add Expense</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Expense Description</label>
                        <Input 
                            value={newExpense.description} 
                            onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                            placeholder="e.g. Travel to Site A"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        <select 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                            value={newExpense.categoryId}
                            onChange={e => setNewExpense({...newExpense, categoryId: e.target.value})}
                        >
                            {state.expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Linked Task</label>
                        <select 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                            value={newExpense.activityId}
                            onChange={e => setNewExpense({...newExpense, activityId: e.target.value})}
                        >
                            <option value="">Select Task...</option>
                            {tasks.map(t => <option key={t.id} value={t.id}>{t.wbsCode} - {t.name}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Budgeted Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input 
                                    type="number" 
                                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg text-sm"
                                    value={newExpense.budgetedCost}
                                    onChange={e => setNewExpense({...newExpense, budgetedCost: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Actual Amount (To Date)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input 
                                    type="number" 
                                    className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg text-sm"
                                    value={newExpense.actualCost}
                                    onChange={e => setNewExpense({...newExpense, actualCost: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default CostExpenses;
