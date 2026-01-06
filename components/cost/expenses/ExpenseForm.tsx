import React, { useState, useEffect } from 'react';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Expense } from '../../../types';
import { useCostExpensesLogic } from '../../../hooks/domain/useCostExpensesLogic';
import { Save } from 'lucide-react';

interface ExpenseFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Expense>) => void;
    projectId: string;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ isOpen, onClose, onSave, projectId }) => {
    const { tasks, expenseCategories } = useCostExpensesLogic(projectId);
    const [newExpense, setNewExpense] = useState<Partial<Expense>>({});

    useEffect(() => {
        if(isOpen) {
            setNewExpense({
                description: '',
                categoryId: expenseCategories[0]?.id || '',
                activityId: '',
                budgetedCost: 0,
                actualCost: 0
            });
        }
    }, [isOpen, expenseCategories]);
    
    const handleSave = () => {
        onSave(newExpense);
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title="Add Non-Labor Expense"
            width="md:w-[500px]"
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSave} icon={Save}>Add Expense</Button></>}
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <Input value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} placeholder="e.g. Travel to Site A" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" value={newExpense.categoryId} onChange={e => setNewExpense({...newExpense, categoryId: e.target.value})}>
                        {expenseCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Linked Task</label>
                    <select className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white" value={newExpense.activityId} onChange={e => setNewExpense({...newExpense, activityId: e.target.value})}>
                        <option value="">Select Task...</option>
                        {tasks.map(t => <option key={t.id} value={t.id}>{t.wbsCode} - {t.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Budgeted Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input type="number" className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg text-sm" value={newExpense.budgetedCost} onChange={e => setNewExpense({...newExpense, budgetedCost: parseFloat(e.target.value)})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Actual (To Date)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input type="number" className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg text-sm" value={newExpense.actualCost} onChange={e => setNewExpense({...newExpense, actualCost: parseFloat(e.target.value)})} />
                        </div>
                    </div>
                </div>
            </div>
        </SidePanel>
    );
};
