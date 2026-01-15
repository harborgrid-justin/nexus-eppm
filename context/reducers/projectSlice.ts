
import { DataState, Action } from '../../types/index';
import { findAndModifyNode, findAndReparentNode } from '../../utils/treeUtils';
import { generateId } from '../../utils/formatters';

export const projectReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'PROJECT_UPDATE':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, ...action.payload.updatedData }
            : p
        )
      };
    case 'PROJECT_CLOSE':
        return {
            ...state,
            projects: state.projects.map(p => 
                p.id === action.payload 
                ? { ...p, status: 'Closed' }
                : p
            )
        };
    case 'PROJECT_IMPORT':
        return {
            ...state,
            projects: [...state.projects, ...action.payload]
        };
    case 'PROJECT_CREATE_REFLECTION': {
        const source = state.projects.find(p => p.id === action.payload.sourceProjectId);
        if (!source) return state;
        const reflection = { 
            ...JSON.parse(JSON.stringify(source)), 
            id: generateId('REFL'), 
            name: `Reflection: ${source.name}`,
            code: `${source.code}-SIM`,
            isReflection: true,
            sourceProjectId: source.id 
        };
        return { ...state, projects: [...state.projects, reflection] };
    }
    case 'PROJECT_MERGE_REFLECTION': {
        const reflection = state.projects.find(p => p.id === action.payload.reflectionId);
        if (!reflection || !reflection.sourceProjectId) return state;
        
        const mergedProject = { ...reflection, id: reflection.sourceProjectId, isReflection: false, sourceProjectId: undefined, name: reflection.name.replace('Reflection: ', '') };
        
        return {
            ...state,
            projects: state.projects.map(p => 
                p.id === reflection.sourceProjectId ? mergedProject : p
            ).filter(p => p.id !== action.payload.reflectionId) 
        };
    }
    case 'TASK_UPDATE': {
        const { projectId, task } = action.payload;
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id !== projectId) return p;
                
                // Bulk update via Engine
                if (Array.isArray(task)) return { ...p, tasks: task };
                
                // Single update via Drag/Drop
                const updatedTasks = p.tasks.map(t => t.id === task.id ? task : t);
                
                // If new, add it
                if (!p.tasks.find(t => t.id === task.id)) {
                    updatedTasks.push(task);
                }

                return { ...p, tasks: updatedTasks };
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
                return { 
                    ...p, 
                    wbs: findAndModifyNode(p.wbs || [], nodeId, (node) => ({ ...node, ...updatedData })) 
                };
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
    case 'BASELINE_SET': {
        const { projectId, name, type } = action.payload;
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id !== projectId) return p;
                const baseline = {
                    id: generateId('BL'),
                    name, type: type as any,
                    date: new Date().toISOString().split('T')[0],
                    taskBaselines: p.tasks.reduce((acc, t) => {
                        acc[t.id] = { baselineStartDate: t.startDate, baselineEndDate: t.endDate, baselineDuration: t.duration };
                        return acc;
                    }, {} as any)
                };
                return { ...p, baselines: [...(p.baselines || []), baseline] };
            })
        };
    }
    case 'BASELINE_UPDATE': {
         const { projectId, baselineId, name, type } = action.payload;
         return {
             ...state,
             projects: state.projects.map(p => {
                 if (p.id !== projectId) return p;
                 return {
                     ...p,
                     baselines: (p.baselines || []).map(b => b.id === baselineId ? { ...b, name, type: type as any } : b)
                 };
             })
         };
    }
    case 'BASELINE_DELETE': {
        const { projectId, baselineId } = action.payload;
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id !== projectId) return p;
                return {
                    ...p,
                    baselines: (p.baselines || []).filter(b => b.id !== baselineId)
                };
            })
        };
    }
    default:
      return state;
  }
};
