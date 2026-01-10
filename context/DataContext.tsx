
import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { 
    RiskManagementPlan, Document, ActivityCode, DataState, Action
} from '../types/index';
import { initialState } from './initialState';
import { rootReducer } from './rootReducer';
import { loadPersistedState, savePersistedState, clearPersistedState } from '../utils/storage';

const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<Action>;
  getRiskPlan: (projectId: string) => RiskManagementPlan | undefined;
  getProjectDocs: (projectId: string) => Document[];
  getActivityCodesForProject: (projectId: string) => ActivityCode[];
} | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage if available, passing initialState as the default
  // The reducer will start with the merged state returned by loadPersistedState
  const [state, dispatch] = useReducer(rootReducer, initialState, (defaultState) => loadPersistedState(defaultState));

  // Persistence Effect: Save to LocalStorage whenever state changes
  useEffect(() => {
    savePersistedState(state);
  }, [state]);

  // Intercept Reset Logic to clear storage
  const enhancedDispatch = useCallback((action: Action) => {
      if (action.type === 'RESET_SYSTEM') {
          clearPersistedState();
      }
      dispatch(action);
  }, []);

  const getRiskPlan = useCallback((projectId: string): RiskManagementPlan | undefined => {
    const project = state.projects.find(p => p.id === projectId);
    return project?.riskPlan;
  }, [state.projects]);
  
  const getProjectDocs = useCallback((projectId: string): Document[] => {
      return state.documents.filter(d => d.projectId === projectId);
  }, [state.documents]);

  const getActivityCodesForProject = useCallback((projectId: string): ActivityCode[] => {
      return state.activityCodes.filter(ac => ac.scope === 'Global' || (ac.scope === 'Project' && ac.projectId === projectId));
  }, [state.activityCodes]);

  return (
    <DataContext.Provider value={{ state, dispatch: enhancedDispatch, getRiskPlan, getProjectDocs, getActivityCodesForProject }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
