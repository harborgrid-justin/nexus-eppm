
import { DataState, Action } from '../../types/index';
import { KanbanTask } from '../../types/index';

export const strategyReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'ROADMAP_UPDATE_ITEM':
        return {
            ...state,
            roadmapItems: state.roadmapItems.map(item => 
                item.id === action.payload.id ? action.payload : item
            )
        };
    
    case 'KANBAN_MOVE_TASK':
        return {
            ...state,
            kanbanTasks: state.kanbanTasks.map(task => 
                task.id === action.payload.taskId 
                ? { ...task, status: action.payload.status as any }
                : task
            )
        };

    case 'KANBAN_ADD_TASK': {
        const newTask: KanbanTask = {
            id: `KT-${Date.now()}`,
            title: 'New Task',
            status: 'todo',
            priority: 'Medium',
            ...action.payload
        };
        return {
            ...state,
            kanbanTasks: [...state.kanbanTasks, newTask]
        };
    }

    case 'ADD_PORTFOLIO_COMM_ITEM':
        return {
            ...state,
            portfolioCommunicationPlan: [...state.portfolioCommunicationPlan, action.payload]
        };
    
    case 'ADD_ACTIVITY':
        return {
            ...state,
            activities: [action.payload, ...state.activities]
        };

    case 'ADD_TEAM_EVENT':
        return {
            ...state,
            teamEvents: [...state.teamEvents, action.payload]
        };

    default:
        return state;
  }
};
