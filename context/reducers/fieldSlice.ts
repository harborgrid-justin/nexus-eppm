
import { DataState, Action } from '../../types/actions';

export const fieldReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'FIELD_ADD_LOG':
      return { ...state, dailyLogs: [...state.dailyLogs, action.payload] };
    case 'FIELD_UPDATE_LOG':
      return { ...state, dailyLogs: state.dailyLogs.map(l => l.id === action.payload.id ? action.payload : l) };

    case 'FIELD_ADD_INCIDENT':
      return { ...state, safetyIncidents: [...state.safetyIncidents, action.payload] };
    case 'FIELD_UPDATE_INCIDENT':
      return { ...state, safetyIncidents: state.safetyIncidents.map(i => i.id === action.payload.id ? action.payload : i) };

    case 'FIELD_ADD_PUNCH_ITEM':
      return { ...state, punchList: [...state.punchList, action.payload] };
    case 'FIELD_UPDATE_PUNCH_ITEM':
      return { ...state, punchList: state.punchList.map(p => p.id === action.payload.id ? action.payload : p) };
      
    default:
      return state;
  }
};
