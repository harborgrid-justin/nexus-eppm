
import { DataState, Action } from '../types/actions';
import { projectReducer } from './reducers/projectSlice';
import { programReducer } from './reducers/programSlice';
import { adminReducer } from './reducers/adminSlice';
import { systemReducer } from './reducers/systemSlice';
import { unifierReducer } from './reducers/unifierSlice'; // New Import
import { applyBusinessLogic } from '../utils/businessLogic';

export const rootReducer = (state: DataState, action: Action): DataState => {
  let nextState = { ...state };

  if (action.type.startsWith('PROJECT_') || action.type.startsWith('TASK_') || action.type.startsWith('BASELINE_') || action.type.startsWith('WBS_') || action.type.startsWith('COST_ESTIMATE_')) {
      nextState = projectReducer(state, action);
  } else if (action.type.startsWith('PROGRAM_')) {
      nextState = programReducer(state, action);
  } else if (action.type.startsWith('ADMIN_')) {
      nextState = adminReducer(state, action);
  } else if (action.type.startsWith('SYSTEM_') || action.type.startsWith('GOVERNANCE_') || action.type.startsWith('ADD_') || action.type.startsWith('UPDATE_') || action.type === 'APPROVE_CHANGE_ORDER' || action.type === 'SUBMIT_TIMESHEET') {
      nextState = systemReducer(state, action);
  } else if (action.type.startsWith('UNIFIER_')) { // New Hook
      nextState = unifierReducer(state, action);
  }
  
  return applyBusinessLogic(nextState, action, state);
};
