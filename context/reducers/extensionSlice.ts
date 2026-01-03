
import { DataState, Action } from '../../types/actions';

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
    default:
        return state;
  }
};
