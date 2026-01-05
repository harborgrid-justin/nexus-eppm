
import { DataState, Action } from '../../types/index';

export const qualitySlice = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'ADD_QUALITY_REPORT':
      return { ...state, qualityReports: [...state.qualityReports, action.payload] };
    case 'UPDATE_QUALITY_REPORT':
      return { ...state, qualityReports: state.qualityReports.map(r => r.id === action.payload.id ? action.payload : r) };
    
    case 'ADD_NCR':
        return { ...state, nonConformanceReports: [...state.nonConformanceReports, action.payload] };
    case 'UPDATE_NCR':
        return { ...state, nonConformanceReports: state.nonConformanceReports.map(n => n.id === action.payload.id ? action.payload : n) };

    // This handles adding to the global quality standards list in state, though payload might be typed ProgramQualityStandard
    // In a real app, we'd map types carefully. Here we assume structural compatibility or cast if needed.
    case 'ADD_QUALITY_STANDARD': 
        return { 
            ...state, 
            programQualityStandards: [...state.programQualityStandards, action.payload] 
        };

    default:
      return state;
  }
};
