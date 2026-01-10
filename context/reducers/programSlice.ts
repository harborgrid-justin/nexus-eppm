
import { DataState, Action } from '../../types/index';

export const programReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'ADD_PROGRAM':
      return { ...state, programs: [...state.programs, action.payload] };
    case 'UPDATE_PROGRAM':
      return { 
          ...state, 
          programs: state.programs.map(p => p.id === action.payload.id ? action.payload : p) 
      };
    case 'DELETE_PROGRAM':
      return { 
          ...state, 
          programs: state.programs.filter(p => p.id !== action.payload) 
      };
    case 'PROGRAM_ADD_STAKEHOLDER':
      return { ...state, programStakeholders: [action.payload, ...state.programStakeholders] };
    case 'PROGRAM_UPDATE_STAKEHOLDER':
      return { ...state, programStakeholders: state.programStakeholders.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'PROGRAM_DELETE_STAKEHOLDER':
      return { ...state, programStakeholders: state.programStakeholders.filter(s => s.id !== action.payload) };
    case 'PROGRAM_ADD_COMM_ITEM':
      return { ...state, programCommunicationPlan: [action.payload, ...state.programCommunicationPlan] };
    case 'PROGRAM_UPDATE_COMM_ITEM':
      return { ...state, programCommunicationPlan: state.programCommunicationPlan.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'PROGRAM_DELETE_COMM_ITEM':
      return { ...state, programCommunicationPlan: state.programCommunicationPlan.filter(c => c.id !== action.payload) };
    case 'PROGRAM_UPDATE_ALLOCATION':
        return {
            ...state,
            programAllocations: state.programAllocations.map(a => a.id === action.payload.id ? action.payload : a)
        };
    case 'PROGRAM_UPDATE_GATE':
        return {
            ...state,
            programFundingGates: state.programFundingGates.map(g => g.id === action.payload.id ? action.payload : g)
        };
    case 'PROGRAM_ADD_OBJECTIVE':
        return { ...state, programObjectives: [...state.programObjectives, action.payload] };
    case 'PROGRAM_UPDATE_OBJECTIVE':
        return { ...state, programObjectives: state.programObjectives.map(o => o.id === action.payload.id ? action.payload : o) };
    case 'PROGRAM_DELETE_OBJECTIVE':
        return { ...state, programObjectives: state.programObjectives.filter(o => o.id !== action.payload) };
    case 'PROGRAM_ADD_RISK':
        return { ...state, programRisks: [...state.programRisks, action.payload] };
    case 'PROGRAM_DELETE_RISK':
        return { ...state, programRisks: state.programRisks.filter(r => r.id !== action.payload) };
    case 'PROGRAM_ADD_ISSUE':
        return { ...state, programIssues: [...state.programIssues, action.payload] };
    case 'PROGRAM_UPDATE_ISSUE':
        return { ...state, programIssues: state.programIssues.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'PROGRAM_DELETE_ISSUE':
        return { ...state, programIssues: state.programIssues.filter(i => i.id !== action.payload) };
    
    // Trade-off Scenarios
    case 'PROGRAM_ADD_TRADEOFF':
        return { ...state, tradeoffScenarios: [...state.tradeoffScenarios, action.payload] };
    case 'PROGRAM_DELETE_TRADEOFF':
        return { ...state, tradeoffScenarios: state.tradeoffScenarios.filter(s => s.id !== action.payload) };
        
    // Program Change Requests
    case 'ADD_PROGRAM_CHANGE_REQUEST':
        return { ...state, programChangeRequests: [...state.programChangeRequests, action.payload] };
    case 'UPDATE_PROGRAM_CHANGE_REQUEST':
        return { ...state, programChangeRequests: state.programChangeRequests.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_PROGRAM_CHANGE_REQUEST':
        return { ...state, programChangeRequests: state.programChangeRequests.filter(c => c.id !== action.payload) };

    default:
      return state;
  }
};
