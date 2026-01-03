
import { DataState, Action } from '../types/actions';
import { projectReducer } from './reducers/projectSlice';
import { programReducer } from './reducers/programSlice';
import { adminReducer } from './reducers/adminSlice';
import { systemReducer } from './reducers/systemSlice';
import { unifierReducer } from './reducers/unifierSlice';
import { procurementSlice } from './reducers/procurementSlice';
import { qualitySlice } from './reducers/qualitySlice';
import { documentSlice } from './reducers/documentSlice';
import { applyBusinessLogic } from '../utils/businessLogic';

export const rootReducer = (state: DataState, action: Action): DataState => {
  let nextState = { ...state };

  if (action.type.startsWith('PROJECT_') || action.type.startsWith('TASK_') || action.type.startsWith('BASELINE_') || action.type.startsWith('WBS_') || action.type.startsWith('COST_ESTIMATE_')) {
      nextState = projectReducer(state, action);
  } else if (action.type.startsWith('PROGRAM_')) {
      nextState = programReducer(state, action);
  } else if (action.type.startsWith('ADMIN_') || action.type.startsWith('RESOURCE_')) {
      nextState = adminReducer(state, action);
  } else if (action.type.startsWith('SYSTEM_') || action.type.startsWith('GOVERNANCE_') || action.type === 'APPROVE_CHANGE_ORDER' || action.type === 'SUBMIT_TIMESHEET' || action.type === 'UPDATE_USER' || action.type === 'ADD_USER' || action.type === 'DELETE_USER' || action.type === 'MARK_ALERT_READ') {
      nextState = systemReducer(state, action);
  } else if (action.type.startsWith('UNIFIER_')) {
      nextState = unifierReducer(state, action);
  } else if (action.type.startsWith('ADD_VENDOR') || action.type.startsWith('UPDATE_VENDOR') || action.type.startsWith('DELETE_VENDOR') || action.type.includes('CONTRACT') || action.type.includes('PURCHASE_ORDER') || action.type.includes('SOLICITATION') || action.type.includes('EXPENSE')) {
      nextState = procurementSlice(state, action);
  } else if (action.type.includes('QUALITY') || action.type.includes('NCR')) {
      nextState = qualitySlice(state, action);
  } else if (action.type.includes('DOCUMENT')) {
      nextState = documentSlice(state, action);
  } else if (action.type.includes('RISK') || action.type.includes('ISSUE')) {
      // Risk actions currently handled within projectSlice or systemSlice in some contexts, 
      // but for dedicated Risk management, we can ensure they flow correctly.
      // Assuming 'ADD_RISK' / 'UPDATE_RISK' flow through systemSlice based on previous logic,
      // or we can add a specific riskSlice later. For now, systemReducer handles generic updates.
      if (action.type === 'ADD_RISK' || action.type === 'UPDATE_RISK') {
          nextState = systemReducer(state, action); 
      }
  }
  
  return applyBusinessLogic(nextState, action, state);
};
