
import { DataState, Action } from './DataContext';
import { projectReducer } from './reducers/projectSlice';
import { programReducer } from './reducers/programSlice';
import { applyBusinessLogic } from '../utils/businessLogic';

export const rootReducer = (state: DataState, action: Action): DataState => {
  // 1. Delegate to slices based on Action Type groupings
  let nextState = state;

  if (action.type.startsWith('UPDATE_TASK') || action.type.startsWith('IMPORT_PROJECTS') || action.type.startsWith('CLOSE_PROJECT') || action.type.startsWith('ADD_OR_UPDATE_COST_ESTIMATE')) {
      nextState = projectReducer(state, action);
  } else if (
      action.type.startsWith('ADD_PROGRAM_STAKEHOLDER') || 
      action.type.startsWith('UPDATE_PROGRAM_STAKEHOLDER') || 
      action.type.startsWith('DELETE_PROGRAM_STAKEHOLDER') || 
      action.type.startsWith('ADD_PROGRAM_COMM_ITEM') || 
      action.type.startsWith('UPDATE_PROGRAM_COMM_ITEM') || 
      action.type.startsWith('DELETE_PROGRAM_COMM_ITEM')
  ) {
      nextState = programReducer(state, action);
  } else if (action.type === 'QUEUE_DATA_JOB') {
      nextState = { ...state, dataJobs: [action.payload, ...state.dataJobs] };
  } else if (action.type === 'UPDATE_DATA_JOB') {
      nextState = {
        ...state,
        dataJobs: state.dataJobs.map(job => job.id === action.payload.jobId ? { ...job, ...action.payload } : job)
      };
  } else if (action.type === 'ADD_RISK') {
      nextState = { ...state, risks: [action.payload, ...state.risks] };
  } else if (action.type === 'UPDATE_RISK') {
      nextState = { ...state, risks: state.risks.map(r => r.id === action.payload.risk.id ? action.payload.risk : r) };
  } else if (action.type === 'UPDATE_INTEGRATED_CHANGE') {
      nextState = {
          ...state,
          integratedChanges: state.integratedChanges.map(c => c.id === action.payload.id ? action.payload : c)
      };
  }
  // ... Additional else ifs for other slices (Program, Finance) would go here in a full refactor

  // 2. Apply Governance Engine
  return applyBusinessLogic(nextState, action, state);
};
