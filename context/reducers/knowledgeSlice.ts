
import { DataState, Action } from '../../types/index';

export const knowledgeReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'ADD_ARTICLE':
      return { ...state, knowledgeBase: [...state.knowledgeBase, action.payload] };
    case 'UPDATE_ARTICLE':
      return { 
          ...state, 
          knowledgeBase: state.knowledgeBase.map(a => a.id === action.payload.id ? action.payload : a) 
      };
    case 'DELETE_ARTICLE':
      return { ...state, knowledgeBase: state.knowledgeBase.filter(a => a.id !== action.payload) };
    default:
      return state;
  }
};
