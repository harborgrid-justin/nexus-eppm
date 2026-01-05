
import { DataState, Action } from '../../types/index';

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

    // Material Receipts
    case 'ADD_MATERIAL_RECEIPT':
        return { ...state, materialReceipts: [...state.materialReceipts, action.payload] };

    // Procurement Plans
    case 'ADD_PROCUREMENT_PLAN':
        return { ...state, procurementPlans: [...state.procurementPlans, action.payload] };
    case 'UPDATE_PROCUREMENT_PLAN':
        return { 
            ...state, 
            procurementPlans: state.procurementPlans.map(p => p.id === action.payload.id ? action.payload : p) 
        };

    default:
      return state;
  }
};
