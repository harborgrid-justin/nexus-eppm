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
import { knowledgeReducer } from './reducers/knowledgeSlice';
import { reportReducer } from './reducers/reportSlice';
import { applyBusinessLogic } from '../utils/businessLogic';
import { initialState } from './initialState';
import { constructionDemoData } from '../constants/demos/constructionDemo';
import { softwareDemoData } from '../constants/demos/softwareDemo';
import { generateId } from '../utils/formatters';

// Helper to generate human-readable audit logs from actions
const generateAuditEntry = (action: Action) => {
    const timestamp = new Date().toISOString();
    const user = 'System/User'; // In a real app, this would come from the action meta or auth context
    let description = '';
    let entity = '';

    if (action.type.includes('ADD')) {
        description = `Created new record`;
        entity = action.type.split('_')[1] || 'Entity';
    } else if (action.type.includes('UPDATE')) {
        description = `Modified record details`;
        entity = action.type.split('_')[1] || 'Entity';
    } else if (action.type.includes('DELETE')) {
        description = `Deleted record`;
        entity = action.type.split('_')[1] || 'Entity';
    } else if (action.type === 'APPROVE_CHANGE_ORDER') {
        description = 'Approved Change Order';
        entity = 'ChangeOrder';
    } else if (action.type === 'TRANSFER_BUDGET') {
        description = 'Transferred Budget Funds';
        entity = 'Budget';
    }

    if (!description) return null;

    return {
        date: timestamp,
        user,
        action: description,
        details: `Action: ${action.type}`,
        entity
    };
};

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

  // Dispatcher Routing
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
  } else if (action.type.includes('ARTICLE')) {
      nextState = knowledgeReducer(state, action);
  } else if (action.type.includes('REPORT_DEF')) {
      nextState = reportReducer(state, action);
  }
  
  // Middleware: Centralized Audit Logging
  // Automatically captures any state-changing action into the governance audit log
  const auditEntry = generateAuditLog(action);
  if (auditEntry) {
      // Ensure governance object exists
      if (!nextState.governance) nextState.governance = { ...initialState.governance };
      
      nextState = {
          ...nextState,
          governance: {
              ...nextState.governance,
              auditLog: [
                  { ...auditEntry, id: `AUD-${Date.now()}` }, // Ensure unique ID
                  ...(nextState.governance.auditLog || []).slice(0, 99) // Keep last 100 logs
              ]
          }
      };
  }

  // Post-Processing: Business Rules Engine
  // Runs 50+ data integrity and business logic checks
  return applyBusinessLogic(nextState, action, state);
};

// Internal helper for the reducer
function generateAuditLog(action: Action) {
    if (action.type === 'MARK_ALERT_READ' || action.type.startsWith('STAGING_') || action.type.startsWith('SYSTEM_')) return null;
    
    const timestamp = new Date().toISOString();
    let details = '';
    
    if ('payload' in action && typeof action.payload === 'object') {
        // Try to extract a name or ID for context
        const p = action.payload as any;
        if (p.name) details = `Name: ${p.name}`;
        else if (p.title) details = `Title: ${p.title}`;
        else if (p.id) details = `ID: ${p.id}`;
        else if (p.projectId) details = `Project: ${p.projectId}`;
    }

    return {
        date: timestamp,
        user: 'Current User', // In a real app, pass user from action payload or context
        action: action.type,
        details: details || 'State mutation'
    };
}