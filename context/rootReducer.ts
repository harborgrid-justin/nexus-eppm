
import { DataState, Action } from '../types/index';
import { projectReducer } from './reducers/projectSlice';
import { programReducer } from './reducers/programSlice';
import { adminReducer } from './reducers/adminSlice';
import { systemReducer } from './reducers/systemSlice';
import { procurementSlice } from './reducers/procurementSlice';
import { qualitySlice } from './reducers/qualitySlice';
import { documentSlice } from './reducers/documentSlice';
import { riskReducer } from './reducers/riskSlice';
import { financialReducer } from './reducers/financialSlice';
import { strategyReducer } from './reducers/strategySlice';
import { applyBusinessLogic } from '../utils/businessLogic';
import { initialState } from './initialState';
import { constructionDemoData } from '../constants/demos/constructionDemo';
import { softwareDemoData } from '../constants/demos/softwareDemo';

export const rootReducer = (state: DataState, action: Action): DataState => {
  if (action.type === 'RESET_SYSTEM') return initialState;

  if (action.type === 'LOAD_DEMO_PROJECT') {
    if (action.payload === 'construction') return { ...initialState, ...constructionDemoData } as DataState;
    if (action.payload === 'software') return { ...initialState, ...softwareDemoData } as DataState;
  }
  
  let nextState = { ...state };

  // Domain routing logic
  if (action.type.startsWith('PROJECT_') || action.type.startsWith('TASK_') || action.type.startsWith('BASELINE_') || action.type.startsWith('WBS_')) {
      nextState = projectReducer(state, action as any);
  } else if (action.type.startsWith('PROGRAM_') || action.type.includes('PROGRAM')) {
      nextState = programReducer(state, action as any);
  } else if (action.type.startsWith('ADMIN_') || action.type.startsWith('RESOURCE_') || action.type.startsWith('GOVERNANCE_')) {
      nextState = adminReducer(state, action as any);
  } else if (action.type.startsWith('SYSTEM_') || action.type === 'UPDATE_USER' || action.type === 'MARK_ALERT_READ' || action.type.startsWith('STAGING_')) {
      nextState = systemReducer(state, action as any);
  } else if (action.type.includes('VENDOR') || action.type.includes('CONTRACT') || action.type.includes('PURCHASE_ORDER') || action.type.includes('PROCUREMENT') || action.type.includes('MATERIAL')) {
      nextState = procurementSlice(state, action as any);
  } else if (action.type.includes('QUALITY') || action.type.includes('NCR')) {
      nextState = qualitySlice(state, action as any);
  } else if (action.type.includes('RISK') || action.type.includes('ISSUE')) {
      nextState = riskReducer(state, action as any);
  } else if (action.type.includes('BUDGET_ITEM') || action.type.includes('EXPENSE') || action.type === 'APPROVE_CHANGE_ORDER' || action.type === 'TRANSFER_BUDGET' || action.type.includes('INVOICE')) {
      nextState = financialReducer(state, action as any);
  } else if (action.type.startsWith('FIELD_') || action.type.startsWith('ROADMAP_') || action.type.startsWith('KANBAN_') || action.type === 'ADD_ACTIVITY' || action.type.startsWith('ADD_ARTICLE')) {
      nextState = strategyReducer(state, action as any);
  }

  // Post-Processing: Audit Logging & Business Rules
  return applyBusinessLogic(nextState, action, state);
};
