
import { DataState, Action } from '../../types/index';

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
                 integrations: state.integrations.map(int => 
                    int.id === action.payload 
                    ? { ...int, status: int.status === 'Connected' ? 'Disconnected' : 'Connected' }
                    : int
                 )
             };
        case 'SYSTEM_SAVE_ETL_MAPPINGS':
             return { ...state, etlMappings: action.payload };
        case 'SYSTEM_ADD_INTEGRATION':
             return { ...state, integrations: [...state.integrations, action.payload] };
        case 'SYSTEM_UPDATE_INTEGRATION':
             return { ...state, integrations: state.integrations.map(i => i.id === action.payload.id ? action.payload : i) };
        case 'SYSTEM_ADD_SERVICE':
             return {
                 ...state,
                 systemMonitoring: {
                     ...state.systemMonitoring,
                     services: [...state.systemMonitoring.services, action.payload]
                 }
             };
        
        // --- Alerts ---
        case 'MARK_ALERT_READ':
            return {
                ...state,
                governance: {
                    ...state.governance,
                    alerts: state.governance.alerts.map(a => a.id === action.payload ? { ...a, isRead: true } : a)
                }
            };
            
        // --- Extensions ---
        case 'SYSTEM_INSTALL_EXTENSION':
             return { ...state, extensions: state.extensions.map(e => e.id === action.payload ? { ...e, status: 'Installed' } : e) };
        case 'SYSTEM_ACTIVATE_EXTENSION':
             return { ...state, extensions: state.extensions.map(e => e.id === action.payload ? { ...e, status: 'Active' } : e) };

        // --- NEW GOVERNANCE & PROGRAM ACTIONS ---
        case 'GOVERNANCE_ADD_DECISION':
             return { ...state, governanceDecisions: [action.payload, ...state.governanceDecisions] };
        case 'ADD_BENEFIT':
             return { ...state, benefits: [...state.benefits, action.payload] };
        case 'ADD_ARCH_STANDARD':
             return { ...state, programArchitectureStandards: [...state.programArchitectureStandards, action.payload] };
             
        default: return state;
    }
};
