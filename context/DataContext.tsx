
import React, { createContext, useContext, useReducer, ReactNode, useCallback, useEffect } from 'react';
import { 
    Project, Risk, ActivityCode, Document, RiskManagementPlan, WBSNode, DataState, Action
} from '../types/index';
import { User } from '../types/auth';
import { MOCK_RISK_PLAN } from '../constants/index';
import { initialState } from './initialState';
import { rootReducer } from './rootReducer';

const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<Action>;
  getRiskPlan: (projectId: string) => RiskManagementPlan;
  getProjectDocs: (projectId: string) => Document[];
  getActivityCodesForProject: (projectId: string) => ActivityCode[];
} | undefined>(undefined);

// Lazy initializer to hydration from local storage
const init = (defaultState: DataState): DataState => {
  if (typeof window === 'undefined') return defaultState;
  try {
    const stored = localStorage.getItem('NEXUS_STATE');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Failed to rehydrate state from local storage:", e);
  }
  return defaultState;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState, init);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem('NEXUS_STATE', JSON.stringify(state));
    } catch (e) {
      console.error("State size exceeded LocalStorage limits. Persistence paused.", e);
    }
  }, [state]);

  const getRiskPlan = useCallback((projectId: string) => MOCK_RISK_PLAN, []);
  
  const getProjectDocs = useCallback((projectId: string) => {
      return state.documents.filter(d => d.projectId === projectId);
  }, [state.documents]);

  const getActivityCodesForProject = useCallback((projectId: string) => {
      return state.activityCodes.filter(ac => ac.scope === 'Global' || (ac.scope === 'Project' && ac.projectId === projectId));
  }, [state.activityCodes]);

  return (
    <DataContext.Provider value={{ state, dispatch, getRiskPlan, getProjectDocs, getActivityCodesForProject }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
