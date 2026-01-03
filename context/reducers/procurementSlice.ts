
import { DataState, Action } from '../../types/actions';

export const procurementSlice = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    // Vendors
    case 'ADD_VENDOR':
      return { ...state, vendors: [...state.vendors, action.payload] };
    case 'UPDATE_VENDOR':
      return { ...state, vendors: state.vendors.map(v => v.id === action.payload.id ? action.payload : v) };
    case 'DELETE_VENDOR':
      return { ...state, vendors: state.vendors.filter(v => v.id !== action.payload) };

    // Contracts
    case 'ADD_CONTRACT':
      return { ...state, contracts: [...state.contracts, action.payload] };
    case 'UPDATE_CONTRACT':
      return { ...state, contracts: state.contracts.map(c => c.id === action.payload.id ? action.payload : c) };

    // Purchase Orders
    case 'ADD_PURCHASE_ORDER':
      return { ...state, purchaseOrders: [...state.purchaseOrders, action.payload] };
    case 'UPDATE_PURCHASE_ORDER':
      return { ...state, purchaseOrders: state.purchaseOrders.map(po => po.id === action.payload.id ? action.payload : po) };
    
    // Solicitations
    case 'ADD_SOLICITATION':
        return { ...state, solicitations: [...state.solicitations, action.payload] };
    case 'UPDATE_SOLICITATION':
        return { ...state, solicitations: state.solicitations.map(s => s.id === action.payload.id ? action.payload : s) };

    // Legacy Fallback for Expense Actions (Financials, but closely related)
    case 'ADD_EXPENSE':
        return { ...state, expenses: [...state.expenses, action.payload] };
    case 'UPDATE_EXPENSE':
        return { ...state, expenses: state.expenses.map(e => e.id === action.payload.id ? action.payload : e) };
    case 'DELETE_EXPENSE':
        return { ...state, expenses: state.expenses.filter(e => e.id !== action.payload) };

    default:
      return state;
  }
};
