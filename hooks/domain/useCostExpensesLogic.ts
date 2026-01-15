
import { useState, useMemo, useDeferredValue } from 'react';
import { useData } from '../../context/DataContext';
import { Expense } from '../../types';
import { generateId } from '../../utils/formatters';

export const useCostExpensesLogic = (projectId: string) => {
    const { state, dispatch } = useData();
    const tasks = useMemo(() => state.projects.find(p => p.id === projectId)?.tasks || [], [state.projects, projectId]);
    
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const deferredSearch = useDeferredValue(searchTerm);

    const filteredExpenses = useMemo(() => {
        const projectExpenses = state.expenses.filter(e => tasks.some(t => t.id === e.activityId));
        if (!deferredSearch) return projectExpenses;
        const term = deferredSearch.toLowerCase();
        const taskMap = new Map<string, string>(tasks.map(t => [t.id, t.name]));
        return projectExpenses.filter(e => e.description.toLowerCase().includes(term) || taskMap.get(e.activityId)?.toLowerCase().includes(term));
    }, [state.expenses, tasks, deferredSearch]);
    
    const handleSaveExpense = (data: Partial<Expense>) => {
        if (!data.description || !data.activityId) return alert("Validation Fault: Linked Task and Description mandatory.");
        const expense: Expense = {
            id: generateId('EXP'), activityId: data.activityId, categoryId: data.categoryId || state.expenseCategories[0]?.id || '',
            description: data.description, budgetedCost: data.budgetedCost || 0, actualCost: data.actualCost || 0,
            remainingCost: (data.budgetedCost || 0) - (data.actualCost || 0), atCompletionCost: data.budgetedCost || 0,
            budgetedUnits: 0, actualUnits: 0, remainingUnits: 0, atCompletionUnits: 0
        };
        dispatch({ type: 'ADD_EXPENSE', payload: expense });
        setIsPanelOpen(false);
    };

    return {
        searchTerm, setSearchTerm, deferredSearch, isPanelOpen, setIsPanelOpen, tasks,
        expenseCategories: state.expenseCategories, filteredExpenses, handleSaveExpense,
    };
};
