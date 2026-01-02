
import { DataState, Action } from '../../types/actions';
import { generateId } from '../../utils/formatters';
import { Baseline, WBSNode, Project } from '../../types/index';

// Helper to deep clone project for reflection
const cloneProject = (project: Project): Project => {
    return JSON.parse(JSON.stringify(project));
};

export const projectReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'PROJECT_IMPORT':
      return { ...state, projects: [...state.projects, ...action.payload] };
    case 'PROJECT_UPDATE':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, ...action.payload.updatedData }
            : p
        )
      };
    case 'TASK_UPDATE':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, tasks: p.tasks.map(t => t.id === action.payload.task.id ? action.payload.task : t) }
            : p
        )
      };
    case 'PROJECT_CLOSE':
        return { 
            ...state, 
            projects: state.projects.map(p => p.id === action.payload ? { ...p, status: 'Closed' } : p)
        };
    case 'COST_ESTIMATE_ADD_OR_UPDATE':
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
    
    // --- REFLECTION PROJECTS ---
    case 'PROJECT_CREATE_REFLECTION': {
        const sourceProject = state.projects.find(p => p.id === action.payload.sourceProjectId);
        if (!sourceProject) return state;
        
        const reflection: Project = cloneProject(sourceProject);
        reflection.id = generateId('REFL');
        reflection.name = `${sourceProject.name} (Reflection)`;
        reflection.isReflection = true;
        reflection.sourceProjectId = sourceProject.id;
        
        return { ...state, projects: [...state.projects, reflection] };
    }
    
    case 'PROJECT_MERGE_REFLECTION': {
        const reflection = state.projects.find(p => p.id === action.payload.reflectionId);
        if (!reflection || !reflection.sourceProjectId) return state;
        
        // In a real implementation, we would apply selective logic from comparison
        // Here we overwrite source with reflection data (simplified merge)
        const updatedSource = { ...reflection, id: reflection.sourceProjectId, isReflection: false, name: reflection.name.replace(' (Reflection)', '') };
        
        return {
            ...state,
            projects: state.projects
                .map(p => p.id === reflection.sourceProjectId ? updatedSource : p)
                .filter(p => p.id !== reflection.id) // Remove reflection after merge
        };
    }

    // --- BASELINE MANAGEMENT ---
    case 'BASELINE_SET': {
        const { projectId, name, type } = action.payload;
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id === projectId) {
                    const taskBaselines: Record<string, any> = {};
                    p.tasks.forEach(t => {
                        taskBaselines[t.id] = {
                            baselineStartDate: t.startDate,
                            baselineEndDate: t.endDate,
                            baselineDuration: t.duration
                        };
                    });
                    const newBaseline: Baseline = {
                        id: generateId('BL'),
                        name,
                        type: type || 'Revised',
                        date: new Date().toISOString(),
                        taskBaselines
                    };
                    return { ...p, baselines: [...(p.baselines || []), newBaseline] };
                }
                return p;
            })
        };
    }
    case 'BASELINE_UPDATE': {
        const { projectId, baselineId, name, type } = action.payload;
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id === projectId) {
                    return {
                        ...p,
                        baselines: (p.baselines || []).map(b => 
                            b.id === baselineId ? { ...b, name, type } : b
                        )
                    };
                }
                return p;
            })
        };
    }
    case 'BASELINE_DELETE': {
        const { projectId, baselineId } = action.payload;
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id === projectId) {
                    return {
                        ...p,
                        baselines: (p.baselines || []).filter(b => b.id !== baselineId)
                    };
                }
                return p;
            })
        };
    }
    case 'WBS_ADD_NODE':
      // Placeholder for new logic, actual logic in domainLogic.ts is complex
      return state;
    case 'WBS_UPDATE_NODE':
       return {
        ...state,
        projects: state.projects.map(p => {
            if (p.id === action.payload.projectId) {
                // This is a simplified update. A real one would traverse the tree.
                return { ...p, wbs: [...(p.wbs || [])] };
            }
            return p;
        })
       };
    case 'WBS_REPARENT':
       return state; // Placeholder
    case 'WBS_UPDATE_SHAPE':
       return state; // Placeholder

    default:
      return state;
  }
};
