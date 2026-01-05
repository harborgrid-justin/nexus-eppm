
import { DataState, Action } from '../../types/index';

export const adminReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    // Locations
    case 'ADMIN_ADD_LOCATION': return { ...state, locations: [...state.locations, action.payload] };
    case 'ADMIN_UPDATE_LOCATION': return { ...state, locations: state.locations.map(l => l.id === action.payload.id ? action.payload : l) };
    case 'ADMIN_DELETE_LOCATION': return { ...state, locations: state.locations.filter(l => l.id !== action.payload) };
    
    // Activity Codes
    case 'ADMIN_ADD_ACTIVITY_CODE': return { ...state, activityCodes: [...state.activityCodes, action.payload] };
    case 'ADMIN_UPDATE_ACTIVITY_CODE': return { ...state, activityCodes: state.activityCodes.map(ac => ac.id === action.payload.id ? action.payload : ac) };
    case 'ADMIN_DELETE_ACTIVITY_CODE': return { ...state, activityCodes: state.activityCodes.filter(ac => ac.id !== action.payload) };

    // UDFs
    case 'ADMIN_ADD_UDF': return { ...state, userDefinedFields: [...state.userDefinedFields, action.payload] };
    case 'ADMIN_UPDATE_UDF': return { ...state, userDefinedFields: state.userDefinedFields.map(u => u.id === action.payload.id ? action.payload : u) };
    case 'ADMIN_DELETE_UDF': return { ...state, userDefinedFields: state.userDefinedFields.filter(u => u.id !== action.payload) };

    // Users
    case 'ADMIN_ADD_USER': return { ...state, users: [...state.users, action.payload] };
    case 'ADMIN_UPDATE_USER': return { ...state, users: state.users.map(u => u.id === action.payload.id ? action.payload : u) };
    case 'ADMIN_DELETE_USER': return { ...state, users: state.users.filter(u => u.id !== action.payload) };

    // Resources
    case 'RESOURCE_ADD': return { ...state, resources: [...state.resources, action.payload] };
    case 'RESOURCE_UPDATE': return { ...state, resources: state.resources.map(r => r.id === action.payload.id ? action.payload : r) };
    case 'RESOURCE_DELETE': return { ...state, resources: state.resources.filter(r => r.id !== action.payload) };

    // Resource Requests
    case 'RESOURCE_REQUEST_ADD': return { ...state, resourceRequests: [...state.resourceRequests, action.payload] };
    case 'RESOURCE_REQUEST_UPDATE': return { ...state, resourceRequests: state.resourceRequests.map(req => req.id === action.payload.id ? action.payload : req) };

    // Funding Sources
    case 'ADMIN_ADD_FUNDING_SOURCE': return { ...state, fundingSources: [...state.fundingSources, action.payload] };
    case 'ADMIN_UPDATE_FUNDING_SOURCE': return { ...state, fundingSources: state.fundingSources.map(f => f.id === action.payload.id ? action.payload : f) };
    case 'ADMIN_DELETE_FUNDING_SOURCE': return { ...state, fundingSources: state.fundingSources.filter(f => f.id !== action.payload) };

    // Calendars
    case 'ADMIN_ADD_CALENDAR': return { ...state, calendars: [...state.calendars, action.payload] };
    case 'ADMIN_UPDATE_CALENDAR': return { ...state, calendars: state.calendars.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'ADMIN_DELETE_CALENDAR': return { ...state, calendars: state.calendars.filter(c => c.id !== action.payload) };

    // Issue Codes
    case 'ADMIN_ADD_ISSUE_CODE': return { ...state, issueCodes: [...state.issueCodes, action.payload] };
    case 'ADMIN_UPDATE_ISSUE_CODE': return { ...state, issueCodes: state.issueCodes.map(ic => ic.id === action.payload.id ? action.payload : ic) };
    case 'ADMIN_DELETE_ISSUE_CODE': return { ...state, issueCodes: state.issueCodes.filter(ic => ic.id !== action.payload) };

    // Expense Categories
    case 'ADMIN_ADD_EXPENSE_CATEGORY': return { ...state, expenseCategories: [...state.expenseCategories, action.payload] };
    case 'ADMIN_UPDATE_EXPENSE_CATEGORY': return { ...state, expenseCategories: state.expenseCategories.map(ec => ec.id === action.payload.id ? action.payload : ec) };
    case 'ADMIN_DELETE_EXPENSE_CATEGORY': return { ...state, expenseCategories: state.expenseCategories.filter(ec => ec.id !== action.payload) };

    // EPS Nodes
    case 'ADMIN_ADD_EPS_NODE': return { ...state, eps: [...state.eps, action.payload] };
    case 'ADMIN_UPDATE_EPS_NODE': return { ...state, eps: state.eps.map(e => e.id === action.payload.id ? action.payload : e) };
    case 'ADMIN_DELETE_EPS_NODE': return { ...state, eps: state.eps.filter(e => e.id !== action.payload) };

    // OBS Nodes
    case 'ADMIN_ADD_OBS_NODE': return { ...state, obs: [...state.obs, action.payload] };
    case 'ADMIN_UPDATE_OBS_NODE': return { ...state, obs: state.obs.map(o => o.id === action.payload.id ? action.payload : o) };
    case 'ADMIN_DELETE_OBS_NODE': return { ...state, obs: state.obs.filter(o => o.id !== action.payload) };

    // Workflows
    case 'ADMIN_ADD_WORKFLOW': return { ...state, workflows: [...state.workflows, action.payload] };
    case 'ADMIN_UPDATE_WORKFLOW': return { ...state, workflows: state.workflows.map(w => w.id === action.payload.id ? action.payload : w) };
    case 'ADMIN_DELETE_WORKFLOW': return { ...state, workflows: state.workflows.filter(w => w.id !== action.payload) };

    // Roles
    case 'ADMIN_ADD_ROLE': return { ...state, roles: [...state.roles, action.payload] };
    case 'ADMIN_UPDATE_ROLE': return { ...state, roles: state.roles.map(r => r.id === action.payload.id ? action.payload : r) };

    default: return state;
  }
};
