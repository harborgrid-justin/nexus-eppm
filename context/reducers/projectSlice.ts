
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
    case 'PROJECT_CREATE_REFLECTION': {
        const source = state.projects.find(p => p.id === action.payload.sourceProjectId);
        if (!source) return state;
        const reflection = { 
            ...JSON.parse(JSON.stringify(source)), 
            id: generateId('REFL'), 
            name: `Reflection: ${source.name}`,
            isReflection: true,
            sourceProjectId: source.id 
        };
        return { ...state, projects: [...state.projects, reflection] };
    }
    case 'TASK_UPDATE': {
        const { projectId, task } = action.payload;
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id !== projectId) return p;
                if (Array.isArray(task)) return { ...p, tasks: task };
                return { 
                    ...p, 
                    tasks: p.tasks.map(t => t.id === task.id ? task : t) 
                };
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
    default:
      return state;
  }
};
