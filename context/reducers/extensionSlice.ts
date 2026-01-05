
import { DataState, Action } from '../../types/index';

export const extensionReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'EXTENSION_UPDATE_FINANCIAL':
        return {
            ...state,
            extensionData: {
                ...state.extensionData,
                financial: { ...state.extensionData.financial, ...action.payload }
            }
        };
    case 'EXTENSION_UPDATE_CONSTRUCTION':
        return {
            ...state,
            extensionData: {
                ...state.extensionData,
                construction: { ...state.extensionData.construction, ...action.payload }
            }
        };
    case 'EXTENSION_UPDATE_GOVERNMENT':
        return {
            ...state,
            extensionData: {
                ...state.extensionData,
                government: { ...state.extensionData.government, ...action.payload }
            }
        };
    case 'UPDATE_PIPELINE_STAGE':
        return {
            ...state,
            pipelineStages: state.pipelineStages.map(s => s.id === action.payload.id ? action.payload : s)
        };
    default:
        return state;
  }
};
