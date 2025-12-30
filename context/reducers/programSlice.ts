
import { DataState, Action } from '../DataContext';

export const programReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'ADD_PROGRAM_STAKEHOLDER':
      return { ...state, programStakeholders: [action.payload, ...state.programStakeholders] };
    case 'UPDATE_PROGRAM_STAKEHOLDER':
      return { ...state, programStakeholders: state.programStakeholders.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'DELETE_PROGRAM_STAKEHOLDER':
      return { ...state, programStakeholders: state.programStakeholders.filter(s => s.id !== action.payload) };
    case 'ADD_PROGRAM_COMM_ITEM':
      return { ...state, programCommunicationPlan: [action.payload, ...state.programCommunicationPlan] };
    case 'UPDATE_PROGRAM_COMM_ITEM':
      return { ...state, programCommunicationPlan: state.programCommunicationPlan.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_PROGRAM_COMM_ITEM':
      return { ...state, programCommunicationPlan: state.programCommunicationPlan.filter(c => c.id !== action.payload) };
    default:
      return state;
  }
};
