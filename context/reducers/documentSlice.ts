
import { DataState, Action } from '../../types/actions';

export const documentSlice = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'UPLOAD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'DELETE_DOCUMENT':
      return { ...state, documents: state.documents.filter(d => d.id !== action.payload) };
    case 'VERSION_DOCUMENT':
        return {
            ...state,
            documents: state.documents.map(d => 
                d.id === action.payload.documentId 
                ? { ...d, version: action.payload.version } 
                : d
            )
        };
    default:
      return state;
  }
};
