
import { DataState, Action } from '../../types/index';

export const reportReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'ADD_REPORT_DEF':
      return { ...state, reportDefinitions: [...state.reportDefinitions, action.payload] };
    case 'DELETE_REPORT_DEF':
      return { ...state, reportDefinitions: state.reportDefinitions.filter(r => r.id !== action.payload) };
    default:
      return state;
  }
};
