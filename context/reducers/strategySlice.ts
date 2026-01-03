
import { DataState, Action } from '../../types/actions';

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

    case 'KANBAN_ADD_TASK':
        return {
            ...state,
            kanbanTasks: [...state.kanbanTasks, action.payload]
        };

    default:
        return state;
  }
};
