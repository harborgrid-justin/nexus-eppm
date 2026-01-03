
import { DataState, Action } from '../../types/actions';

export const systemReducer = (state: DataState, action: Action): DataState => {
    switch (action.type) {
        case 'SYSTEM_QUEUE_DATA_JOB':
            return { ...state, dataJobs: [action.payload, ...state.dataJobs] };
        case 'SYSTEM_UPDATE_DATA_JOB':
            return {
                ...state,
                dataJobs: state.dataJobs.map(job => 
                    job.id === action.payload.jobId ? { ...job, ...action.payload } : job
                )
            };
        case 'SYSTEM_TOGGLE_INTEGRATION':
            return {
                ...state,
                integrations: state.integrations.map(i => 
                    i.id === action.payload ? { ...i, status: i.status === 'Connected' ? 'Disconnected' : 'Connected' } : i
                )
            };
        case 'SYSTEM_INSTALL_EXTENSION':
             return {
                 ...state,
                 extensions: state.extensions.map(e => e.id === action.payload ? { ...e, status: 'Installed' } : e)
             };
        case 'SYSTEM_ACTIVATE_EXTENSION':
             return {
                 ...state,
                 extensions: state.extensions.map(e => e.id === action.payload ? { ...e, status: 'Active' } : e)
             };
        case 'SYSTEM_SAVE_ETL_MAPPINGS':
             return {
                 ...state,
                 etlMappings: action.payload
             };
             
        // Governance Actions
        case 'GOVERNANCE_UPDATE_CURRENCY':
             return {
                 ...state,
                 governance: {
                     ...state.governance,
                     exchangeRates: { ...state.governance.exchangeRates, [action.payload.code]: action.payload.rate }
                 }
             };
        case 'GOVERNANCE_ADD_CURRENCY':
             return {
                 ...state,
                 governance: {
                     ...state.governance,
                     exchangeRates: { ...state.governance.exchangeRates, [action.payload.code]: action.payload.rate }
                 }
             };
        case 'GOVERNANCE_DELETE_CURRENCY': {
             const newRates = { ...state.governance.exchangeRates };
             delete newRates[action.payload];
             return {
                 ...state,
                 governance: { ...state.governance, exchangeRates: newRates }
             };
        }
        case 'GOVERNANCE_UPDATE_SECURITY_POLICY':
             return {
                 ...state,
                 governance: {
                     ...state.governance,
                     security: { ...state.governance.security, ...action.payload }
                 }
             };
        case 'GOVERNANCE_UPDATE_INFLATION_RATE':
             return {
                 ...state,
                 governance: { ...state.governance, inflationRate: action.payload }
             };
        case 'GOVERNANCE_UPDATE_SYSTEM_SCHEDULING':
             return {
                 ...state,
                 governance: { ...state.governance, scheduling: { ...state.governance.scheduling, ...action.payload } }
             };
        case 'GOVERNANCE_MARK_ALERT_READ':
             return {
                 ...state,
                 governance: {
                     ...state.governance,
                     alerts: state.governance.alerts.map(a => a.id === action.payload ? { ...a, isRead: true } : a)
                 }
             };
        case 'GOVERNANCE_UPDATE_NOTIFICATION_PREFERENCE':
            return state;
        case 'GOVERNANCE_ADD_STRATEGIC_GOAL':
            return { ...state, strategicGoals: [...state.strategicGoals, action.payload] };
        case 'GOVERNANCE_UPDATE_STRATEGIC_GOAL':
            return { ...state, strategicGoals: state.strategicGoals.map(g => g.id === action.payload.id ? action.payload : g) };
        case 'GOVERNANCE_DELETE_STRATEGIC_GOAL':
            return { ...state, strategicGoals: state.strategicGoals.filter(g => g.id !== action.payload) };
        case 'GOVERNANCE_ADD_ROLE':
            return { ...state, governanceRoles: [...state.governanceRoles, action.payload] };
        case 'GOVERNANCE_DELETE_ROLE':
            return { ...state, governanceRoles: state.governanceRoles.filter(r => r.id !== action.payload) };
        case 'GOVERNANCE_UPDATE_INTEGRATED_CHANGE':
            return { ...state, integratedChanges: state.integratedChanges.map(c => c.id === action.payload.id ? action.payload : c) };
        case 'GOVERNANCE_UPDATE_GLOBAL_CHANGE_RULES':
            return { ...state, globalChangeRules: action.payload };

        // Portfolio Scenarios
        case 'ADD_PORTFOLIO_SCENARIO':
            return { ...state, portfolioScenarios: [...state.portfolioScenarios, action.payload] };
        case 'UPDATE_PORTFOLIO_SCENARIO':
            return { ...state, portfolioScenarios: state.portfolioScenarios.map(s => s.id === action.payload.id ? action.payload : s) };

        // Timesheets
        case 'SUBMIT_TIMESHEET': {
            // Check if timesheet exists
            const exists = state.timesheets.some(t => t.id === action.payload.id);
            if (exists) {
                 return { ...state, timesheets: state.timesheets.map(t => t.id === action.payload.id ? action.payload : t) };
            } else {
                 return { ...state, timesheets: [...state.timesheets, action.payload] };
            }
        }

        default: return state;
    }
};
