import { DataState, Action } from '../../types/index';
import { generateId } from '../../utils/formatters';
import { Baseline, WBSNode, Project, Task } from '../../types/index';
import { findAndModifyNode, findAndReparentNode } from '../../utils/treeUtils';

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
    case 'TASK_UPDATE': {
        const { projectId, task } = action.payload;
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id !== projectId) return p;
                
                if (Array.isArray(task)) {
                    return { ...p, tasks: task };
                }
                
                return { 
                    ...p, 
                    tasks: p.tasks.map(t => t.id === task.id ? task : t) 
                };
            })
        };
    }
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
    case 'ADD_PROJECT_FUNDING':
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id === action.payload.projectId) {
                     return { ...p, funding: [...(p.funding || []), action.payload.funding] };
                }
                return p;
            })
        };
    
    case 'ADD_PROJECT_BUDGET_LOG':
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id === action.payload.projectId) {
                    return { ...p, budgetLog: [...(p.budgetLog || []), action.payload.logItem] };
                }
                return p;
            })
        };

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
        
        const updatedSource = { ...reflection, id: reflection.sourceProjectId, isReflection: false, name: reflection.name.replace(' (Reflection)', '') };
        
        return {
            ...state,
            projects: state.projects
                .map(p => p.id === reflection.sourceProjectId ? updatedSource : p)
                .filter(p => p.id !== reflection.id) 
        };
    }

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
                        type: (type as Baseline['type']) || 'Revised',
                        date: new Date().toISOString(),
                        taskBaselines
                    };
                    return { ...p, baselines: [...(p.baselines || []), newBaseline] };
                }
                return p;
            })
        };
    }

    case 'WBS_ADD_NODE': {
        const { projectId, parentId, newNode } = action.payload;
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id !== projectId) return p;
                
                let updatedWbs = [...(p.wbs || [])];
                if (parentId === null) {
                    updatedWbs.push(newNode);
                } else {
                    updatedWbs = findAndModifyNode(updatedWbs, parentId, (node) => ({
                        ...node,
                        children: [...(node.children || []), newNode]
                    }));
                }
                return { ...p, wbs: updatedWbs };
            })
        };
    }
    
    case 'WBS_UPDATE_NODE': {
        const { projectId, nodeId, updatedData } = action.payload;
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id !== projectId) return p;
                const updatedWbs = findAndModifyNode(p.wbs || [], nodeId, (node) => ({
                    ...node,
                    ...updatedData
                }));
                return { ...p, wbs: updatedWbs };
            })
        };
    }

    case 'WBS_REPARENT': {
        const { projectId, nodeId, newParentId } = action.payload;
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id !== projectId) return p;
                const { newNodes } = findAndReparentNode(p.wbs || [], nodeId, newParentId);
                return { ...p, wbs: newNodes };
            })
        };
    }

    default:
      return state;
  }
};
