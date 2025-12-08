import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Project, Resource, Risk, Integration, Task } from '../types';
import { MOCK_PROJECTS, MOCK_RESOURCES } from '../constants';

// Initial Integrations Mock
const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'sap', name: 'SAP S/4HANA', type: 'ERP', status: 'Connected', lastSync: '10 mins ago', logo: 'S' },
  { id: 'oracle', name: 'Oracle Primavera Cloud', type: 'ERP', status: 'Disconnected', lastSync: '2 days ago', logo: 'O' },
  { id: 'wd', name: 'Workday', type: 'HRIS', status: 'Connected', lastSync: '1 hour ago', logo: 'W' },
  { id: 'sf', name: 'Salesforce', type: 'CRM', status: 'Connected', lastSync: '5 mins ago', logo: 'F' },
];

// Initial Risks Mock (attached to P1001)
const MOCK_RISKS: Risk[] = [
  { id: 'RSK-001', projectId: 'P1001', description: 'Supply chain delay for steel', category: 'External', probability: 'High', impact: 'High', status: 'Open', owner: 'Mike Ross', mitigationPlan: 'Source alternative local suppliers.' },
  { id: 'RSK-002', projectId: 'P1001', description: 'Permit approval bottleneck', category: 'Schedule', probability: 'Medium', impact: 'High', status: 'Open', owner: 'Sarah Chen', mitigationPlan: 'Expedite processing with city council.' },
  { id: 'RSK-003', projectId: 'P1001', description: 'Unexpected soil conditions', category: 'Technical', probability: 'Low', impact: 'Medium', status: 'Mitigated', owner: 'Jessica Pearson', mitigationPlan: 'Conduct secondary geo-survey.' },
];

interface DataState {
  projects: Project[];
  resources: Resource[];
  integrations: Integration[];
  risks: Risk[];
}

type Action = 
  | { type: 'UPDATE_TASK'; payload: { projectId: string; task: Task } }
  | { type: 'ADD_RISK'; payload: Risk }
  | { type: 'TOGGLE_INTEGRATION'; payload: string }
  | { type: 'ADD_RESOURCE'; payload: Resource };

const initialState: DataState = {
  projects: MOCK_PROJECTS,
  resources: MOCK_RESOURCES,
  integrations: MOCK_INTEGRATIONS,
  risks: MOCK_RISKS,
};

const dataReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'UPDATE_TASK':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, tasks: p.tasks.map(t => t.id === action.payload.task.id ? action.payload.task : t) }
            : p
        )
      };
    case 'ADD_RISK':
      return { ...state, risks: [...state.risks, action.payload] };
    case 'TOGGLE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.map(i => 
          i.id === action.payload 
            ? { ...i, status: i.status === 'Connected' ? 'Disconnected' : 'Connected', lastSync: 'Just now' } 
            : i
        )
      };
    case 'ADD_RESOURCE':
      return { ...state, resources: [...state.resources, action.payload] };
    default:
      return state;
  }
};

const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<Action>;
  getProjectRisks: (projectId: string) => Risk[];
  getTask: (projectId: string, taskId: string) => Task | undefined;
} | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const getProjectRisks = (projectId: string) => state.risks.filter(r => r.projectId === projectId);
  
  const getTask = (projectId: string, taskId: string) => {
    const project = state.projects.find(p => p.id === projectId);
    return project?.tasks.find(t => t.id === taskId);
  };

  return (
    <DataContext.Provider value={{ state, dispatch, getProjectRisks, getTask }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
