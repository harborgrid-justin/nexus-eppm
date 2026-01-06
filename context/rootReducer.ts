import { DataState, Action } from '../types/index';
import { projectReducer } from './reducers/projectSlice';
import { programReducer } from './reducers/programSlice';
import { adminReducer } from './reducers/adminSlice';
import { systemReducer } from './reducers/systemSlice';
import { unifierReducer } from './reducers/unifierSlice';
import { procurementSlice } from './reducers/procurementSlice';
import { qualitySlice } from './reducers/qualitySlice';
import { documentSlice } from './reducers/documentSlice';
import { riskReducer } from './reducers/riskSlice';
import { financialReducer } from './reducers/financialSlice';
import { fieldReducer } from './reducers/fieldSlice';
import { strategyReducer } from './reducers/strategySlice';
import { extensionReducer } from './reducers/extensionSlice';
import { stagingReducer } from './reducers/stagingSlice';
import { applyBusinessLogic } from '../utils/businessLogic';
import { initialState } from './initialState';
import { constructionDemoData } from '../constants/demos/constructionDemo';
import { softwareDemoData } from '../constants/demos/softwareDemo';

export const rootReducer = (state: DataState, action: Action): DataState => {
  // Global Interceptors
  if (action.type === 'RESET_SYSTEM') {
      return initialState;
  }

  if (action.type === 'LOAD_DEMO_PROJECT') {
    if (action.payload === 'construction') {
      return { ...initialState, ...constructionDemoData, projects: constructionDemoData.projects || [] };
    }
    if (action.payload === 'software') {
      return { ...initialState, ...softwareDemoData, projects: softwareDemoData.projects || [] };
    }
  }
  
  let nextState = { ...state };

  if (action.type.startsWith('PROJECT_') || action.type.startsWith('TASK_') || action.type.startsWith('BASELINE_') || action.type.startsWith('WBS_') || action.type.startsWith('COST_ESTIMATE_')) {
      nextState = projectReducer(state, action);
  } else if (action.type.startsWith('PROGRAM_')) {
      nextState = programReducer(state, action);
  } else if (action.type.startsWith('ADMIN_') || action.type.startsWith('RESOURCE_')) {
      nextState = adminReducer(state, action);
  } else if (action.type.startsWith('SYSTEM_') || action.type.startsWith('GOVERNANCE_') || action.type.includes('PORTFOLIO_SCENARIO') || action.type === 'SUBMIT_TIMESHEET' || action.type === 'UPDATE_USER' || action.type === 'MARK_ALERT_READ') {
      nextState = systemReducer(state, action);
  } else if (action.type.startsWith('UNIFIER_')) {
      nextState = unifierReducer(state, action);
  } else if (action.type.startsWith('ADD_VENDOR') || action.type.startsWith('UPDATE_VENDOR') || action.type.startsWith('DELETE_VENDOR') || action.type.includes('CONTRACT') || action.type.includes('PURCHASE_ORDER') || action.type.includes('SOLICITATION')) {
      nextState = procurementSlice(state, action);
  } else if (action.type.includes('QUALITY') || action.type.includes('NCR')) {
      nextState = qualitySlice(state, action);
  } else if (action.type.includes('DOCUMENT')) {
      nextState = documentSlice(state, action);
  } else if (action.type.includes('RISK') || action.type.includes('ISSUE') || action.type === 'UPDATE_RBS_NODE_PARENT') {
      nextState = riskReducer(state, action);
  } else if (action.type.includes('BUDGET_ITEM') || action.type.includes('EXPENSE') || action.type.includes('INVOICE') || action.type === 'APPROVE_CHANGE_ORDER' || action.type === 'TRANSFER_BUDGET') {
      nextState = financialReducer(state, action);
  } else if (action.type.startsWith('FIELD_')) {
      nextState = fieldReducer(state, action);
  } else if (action.type.startsWith('ROADMAP_') || action.type.startsWith('KANBAN_') || action.type.startsWith('ADD_ACTIVITY') || action.type.startsWith('ADD_TEAM_EVENT')) {
      nextState = strategyReducer(state, action);
  } else if (action.type.startsWith('EXTENSION_') || action.type.startsWith('UPDATE_PIPELINE_STAGE')) {
      nextState = extensionReducer(state, action);
  } else if (action.type.startsWith('STAGING_')) {
      nextState = stagingReducer(state, action);
  }
  
  return applyBusinessLogic(nextState, action, state);
};