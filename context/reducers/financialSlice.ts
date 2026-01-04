
import { DataState, Action } from '../../types/actions';
import { BudgetLogItem } from '../../types/finance';

export const financialReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    // Budget Line Items
    case 'ADD_BUDGET_ITEM':
        return { ...state, budgetItems: [...state.budgetItems, action.payload] };
    case 'UPDATE_BUDGET_ITEM':
        return { ...state, budgetItems: state.budgetItems.map(b => b.id === action.payload.id ? action.payload : b) };
    case 'DELETE_BUDGET_ITEM':
        return { ...state, budgetItems: state.budgetItems.filter(b => b.id !== action.payload) };

    // Expenses
    case 'ADD_EXPENSE':
        return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
        return { ...state, expenses: state.expenses.map(e => e.id === action.payload.id ? action.payload : e) };
    case 'DELETE_EXPENSE':
        return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };

    // Invoices
    case 'ADD_INVOICE':
        return { ...state, invoices: [...state.invoices, action.payload] };
    case 'UPDATE_INVOICE':
        return { ...state, invoices: state.invoices.map(i => i.id === action.payload.id ? action.payload : i) };
    
    // Change Orders
    case 'ADD_CHANGE_ORDER':
        return { ...state, changeOrders: [...state.changeOrders, action.payload] };
    case 'UPDATE_CHANGE_ORDER':
        return { ...state, changeOrders: state.changeOrders.map(c => c.id === action.payload.id ? action.payload : c) };
    
    case 'APPROVE_CHANGE_ORDER': {
        const { projectId, changeOrderId } = action.payload;
        // Find CO
        const co = state.changeOrders.find(c => c.id === changeOrderId);
        if (!co) return state;

        // Update CO Status
        const updatedCOs = state.changeOrders.map(c => c.id === changeOrderId ? { ...c, status: 'Approved' as const } : c);

        // Update Project Budget
        const updatedProjects = state.projects.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    budget: (p.budget || 0) + co.amount,
                    // Optionally update budget log here if not handled separately
                };
            }
            return p;
        });

        return { ...state, changeOrders: updatedCOs, projects: updatedProjects };
    }

    // Budget Transfer
    case 'TRANSFER_BUDGET': {
        const { projectId, sourceItemId, targetItemId, amount, reason } = action.payload;
        
        // 1. Update Line Items
        const updatedBudgetItems = state.budgetItems.map(item => {
            if (item.id === sourceItemId) return { ...item, planned: item.planned - amount };
            if (item.id === targetItemId) return { ...item, planned: item.planned + amount };
            return item;
        });

        // 2. Add Audit Log to Project
        const newLog: BudgetLogItem = {
            id: `BL-${Date.now()}`,
            projectId,
            date: new Date().toISOString().split('T')[0],
            description: `Transfer: ${reason}`,
            amount: 0, // Net zero change to total budget
            status: 'Approved',
            submitterId: 'System',
            source: 'Internal Transfer'
        };

        const updatedProjects = state.projects.map(p => {
             if (p.id === projectId) {
                 return { ...p, budgetLog: [...(p.budgetLog || []), newLog] };
             }
             return p;
        });

        return { ...state, budgetItems: updatedBudgetItems, projects: updatedProjects };
    }

    default:
        return state;
  }
};
