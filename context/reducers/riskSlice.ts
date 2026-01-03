
import { DataState, Action } from '../../types/actions';

export const riskReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    // Risk Management
    case 'ADD_RISK':
      return { ...state, risks: [...state.risks, action.payload] };
    case 'UPDATE_RISK':
      return { 
          ...state, 
          risks: state.risks.map(r => r.id === action.payload.risk.id ? action.payload.risk : r) 
      };
    case 'DELETE_RISK':
      return { ...state, risks: state.risks.filter(r => r.id !== action.payload) };
    
    // Issue Management
    case 'ADD_ISSUE':
        return { ...state, issues: [...state.issues, action.payload] };
    case 'UPDATE_ISSUE':
        return { ...state, issues: state.issues.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_ISSUE':
        return { ...state, issues: state.issues.filter(i => i.id !== action.payload) };

    case 'PROJECT_UPDATE_RISK_PLAN':
         // This assumes risk plan is stored on project, we might need to update project
         return {
             ...state,
             projects: state.projects.map(p => 
                p.id === action.payload.projectId 
                ? { ...p, riskPlan: action.payload.plan } 
                : p
             )
         };
    
    case 'UPDATE_RBS_NODE_PARENT':
         // Simplified RBS logic: flat update for now, real recursion handled in UI or separate utility
         // Ideally we deep update the RBS tree structure
         return state; 

    default:
      return state;
  }
};
