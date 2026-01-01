
import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { 
    Project, Risk, ActivityCode, Document, RiskManagementPlan, WBSNode
// FIX: Corrected import path to avoid module resolution conflict.
} from '../types/index';
import { User } from '../types/auth';
// FIX: Export DataState and Action to be used in other files
export type { DataState, Action } from '../types/actions';
import { DataState, Action } from '../types/actions';
// FIX: Corrected import path to avoid module resolution conflict.
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

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

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
