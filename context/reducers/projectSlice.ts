
import { DataState, Action } from '../DataContext';

export const projectReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'IMPORT_PROJECTS':
      return { ...state, projects: [...state.projects, ...action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, tasks: p.tasks.map(t => t.id === action.payload.task.id ? action.payload.task : t) }
            : p
        )
      };
    case 'CLOSE_PROJECT':
        return { 
            ...state, 
            projects: state.projects.map(p => p.id === action.payload ? { ...p, status: 'Closed' } : p)
        };
    case 'ADD_OR_UPDATE_COST_ESTIMATE':
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id === action.payload.projectId) {
                    const estimates = p.costEstimates || [];
                    const existingIdx = estimates.findIndex(e => e.id === action.payload.estimate.id);
                    if (existingIdx >= 0) {
                        const updated = [...estimates];
                        updated[existingIdx] = action.payload.estimate;
                        return { ...p, costEstimates: updated };
                    }
                    return { ...p, costEstimates: [...estimates, action.payload.estimate] };
                }
                return p;
            })
        };
    default:
      return state;
  }
};
