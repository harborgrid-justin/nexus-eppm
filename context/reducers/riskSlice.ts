
import { DataState, Action } from '../../types/index';
import { Risk, PortfolioRisk } from '../../types/index';

export const riskReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    // Risk Management
    case 'ADD_RISK': {
        const risk = action.payload;
        if ('projectId' in risk) {
             return { ...state, risks: [...state.risks, risk as Risk] };
        } else {
             return { ...state, portfolioRisks: [...state.portfolioRisks, risk as PortfolioRisk] };
        }
    }
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
         return {
             ...state,
             projects: state.projects.map(p => 
                p.id === action.payload.projectId 
                ? { ...p, riskPlan: action.payload.plan } 
                : p
             )
         };
    
    case 'UPDATE_RBS_NODE_PARENT':
         return state; 

    default:
      return state;
  }
};
