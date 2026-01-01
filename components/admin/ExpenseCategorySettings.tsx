

import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Receipt, Plus, Globe, Briefcase, Edit2, Trash2, Save, X } from 'lucide-react';
// FIX: Corrected import path for types to resolve module resolution errors.
import { ActivityCodeScope, ExpenseCategory } from '../../types/index';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

export const ExpenseCategorySettings: React.FC = () => {
    const { state, dispatch } = useData();
    const [activeScope, setActiveScope] = useState<ActivityCodeScope>('Global');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Partial<ExpenseCategory> | null>(null);

    const filteredCategories = useMemo(() => {
        return state.expenseCategories.filter(ec => ec.scope === activeScope);
    }, [state.expenseCategories, activeScope]);

    const handleOpenPanel = (category?: ExpenseCategory) => {
        setEditingCategory(category || { name: '', scope: activeScope });
        setIsPanelOpen(true);
    };

    const handleSave = () => {
        if (!editingCategory?.name) return;
        const categoryToSave: ExpenseCategory = {
            id: editingCategory.id || generateId('EC'),
            name: editingCategory.name,
            scope: editingCategory.scope || 'Global',
        };
        dispatch({
            type: editingCategory.id ? 'ADMIN_UPDATE_EXPENSE_CATEGORY' : 'ADMIN_ADD_EXPENSE_CATEGORY',
            payload: categoryToSave
        });
        setIsPanelOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this category? This may affect existing expense records.")) {
            dispatch({ type: 'ADMIN_DELETE_EXPENSE_CATEGORY', payload: id });
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h3 className="font-bold text-slate-800 text-lg">Expense Category Dictionary</h3>
                    <p className="text-sm text-slate-600">Define standardized cost categories for expense tracking and reporting.</p>
                </div>
                <Button size="sm" icon={Plus} onClick={() => handleOpenPanel()}>New Category</Button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-min shadow-inner border border-slate-200">
                <button onClick={() => setActiveScope('Global')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-bold rounded-md ${activeScope === 'Global' ? 'bg-white shadow' : 'text-slate-500'}`}><Globe size={14}/> Global</button>
                <button onClick={() => setActiveScope('Project')} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-bold rounded-md ${activeScope === 'Project' ? 'bg-white shadow' : 'text-slate-500'}`}><Briefcase size={14}/> Project</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                {filteredCategories.map(cat => (
                    <div key={cat.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm group hover:border-nexus-300 transition-all flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg text-slate-500 group-hover:bg-nexus-50 group-hover:text-nexus-600">
                                <Receipt size={16}/>
                            </div>
                            <span className="font-bold text-slate-800">{cat.name}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenPanel(cat)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><Edit2 size={14}/></button>
                            <button onClick={() => handleDelete(cat.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 size={14}/></button>
                        </div>
                    </div>
                ))}
                {filteredCategories.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400">No categories defined for this scope.</div>
                )}
            </div>
        </div>
    );
};

export default ExpenseCategorySettings;