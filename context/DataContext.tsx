
import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { 
    RiskManagementPlan, Document, ActivityCode, DataState, Action
} from '../types/index';
import { initialState } from './initialState';
import { rootReducer } from './rootReducer';

const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<Action>;
  getRiskPlan: (projectId: string) => RiskManagementPlan | undefined;
  getProjectDocs: (projectId: string) => Document[];
  getActivityCodesForProject: (projectId: string) => ActivityCode[];
} | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // The root reducer now handles all state logic, including loading demo data.
  const [state, dispatch] = useReducer(rootReducer, initialState);

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