import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Project, Resource, Risk, Integration, Task, ChangeOrder, BudgetLineItem, Document, Extension, Stakeholder, ProcurementPackage } from '../types';
import { MOCK_PROJECTS, MOCK_RESOURCES, EXTENSIONS_REGISTRY, MOCK_STAKEHOLDERS, MOCK_PROCUREMENT } from '../constants';

const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'sap', name: 'SAP S/4HANA', type: 'ERP', status: 'Connected', lastSync: '10 mins ago', logo: 'S' },
  { id: 'oracle', name: 'Oracle Primavera Cloud', type: 'ERP', status: 'Disconnected', lastSync: '2 days ago', logo: 'O' },
  { id: 'wd', name: 'Workday', type: 'HRIS', status: 'Connected', lastSync: '1 hour ago', logo: 'W' },
  { id: 'sf', name: 'Salesforce', type: 'CRM', status: 'Connected', lastSync: '5 mins ago', logo: 'F' },
  { id: 'procore', name: 'Procore', type: 'ERP', status: 'Connected', lastSync: '1 hour ago', logo: 'P' },
];

const MOCK_RISKS: Risk[] = [
  { id: 'RSK-001', projectId: 'P1001', description: 'Supply chain delay for steel', category: 'External', probability: 'High', impact: 'High', status: 'Open', owner: 'Mike Ross', mitigationPlan: 'Source alternative local suppliers.' },
  { id: 'RSK-002', projectId: 'P1001', description: 'Permit approval bottleneck', category: 'Schedule', probability: 'Medium', impact: 'High', status: 'Open', owner: 'Sarah Chen', mitigationPlan: 'Expedite processing with city council.' },
  { id: 'RSK-003', projectId: 'P1001', description: 'Unexpected soil conditions', category: 'Technical', probability: 'Low', impact: 'Medium', status: 'Mitigated', owner: 'Jessica Pearson', mitigationPlan: 'Conduct secondary geo-survey.' },
];

const MOCK_CHANGE_ORDERS: ChangeOrder[] = [
  { id: 'CO-001', projectId: 'P1001', title: 'Additional Foundation Reinforcement', description: 'Required due to soil report findings.', amount: 150000, status: 'Approved', submittedBy: 'Mike Ross', dateSubmitted: '2024-03-10' },
  { id: 'CO-002', projectId: 'P1001', title: 'Scope Expansion - North Wing', description: 'Client requested addition of 2 floors.', amount: 4500000, status: 'Pending Approval', submittedBy: 'Sarah Chen', dateSubmitted: '2024-06-15' },
];

const MOCK_BUDGET: BudgetLineItem[] = [
  { id: 'B-001', projectId: 'P1001', category: 'Labor', planned: 12000000, actual: 4500000, variance: 7500000 },
  { id: 'B-002', projectId: 'P1001', category: 'Materials', planned: 18000000, actual: 6200000, variance: 11800000 },
  { id: 'B-003', projectId: 'P1001', category: 'Equipment', planned: 5000000, actual: 1200000, variance: 3800000 },
  { id: 'B-004', projectId: 'P1001', category: 'Contingency', planned: 4000000, actual: 150000, variance: 3850000 },
];

const MOCK_DOCUMENTS: Document[] = [
  { id: 'DOC-001', projectId: 'P1001', name: 'Project_Charter_Signed.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'Sarah Chen', uploadDate: '2024-01-02', version: '1.0', status: 'Final' },
  { id: 'DOC-002', projectId: 'P1001', name: 'Site_Plan_v4.dwg', type: 'DWG', size: '45 MB', uploadedBy: 'Jessica Pearson', uploadDate: '2024-02-15', version: '4.2', status: 'Draft' },
  { id: 'DOC-003', projectId: 'P1001', name: 'Q1_Budget_Report.xlsx', type: 'XLSX', size: '1.1 MB', uploadedBy: 'Louis Litt', uploadDate: '2024-04-01', version: '1.0', status: 'Final' },
];

// --- STATE MANAGEMENT ---

interface DataState {
  projects: Project[];
  resources: Resource[];
  integrations: Integration[];
  risks: Risk[];
  changeOrders: ChangeOrder[];
  budgetItems: BudgetLineItem[];
  documents: Document[];
  extensions: Extension[];
  stakeholders: Stakeholder[];
  procurementPackages: ProcurementPackage[];
}

type Action = 
  | { type: 'UPDATE_TASK'; payload: { projectId: string; task: Task } }
  | { type: 'ADD_RISK'; payload: Risk }
  | { type: 'TOGGLE_INTEGRATION'; payload: string }
  | { type: 'ADD_RESOURCE'; payload: Resource }
  | { type: 'ADD_CHANGE_ORDER'; payload: ChangeOrder }
  | { type: 'APPROVE_CHANGE_ORDER'; payload: string } 
  | { type: 'UPLOAD_DOCUMENT'; payload: Document }
  | { type: 'INSTALL_EXTENSION'; payload: string }
  | { type: 'UNINSTALL_EXTENSION'; payload: string }
  | { type: 'ACTIVATE_EXTENSION'; payload: string };

const initialState: DataState = {
  projects: MOCK_PROJECTS,
  resources: MOCK_RESOURCES,
  integrations: MOCK_INTEGRATIONS,
  risks: MOCK_RISKS,
  changeOrders: MOCK_CHANGE_ORDERS,
  budgetItems: MOCK_BUDGET,
  documents: MOCK_DOCUMENTS,
  extensions: EXTENSIONS_REGISTRY,
  stakeholders: MOCK_STAKEHOLDERS,
  procurementPackages: MOCK_PROCUREMENT,
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
    case 'ADD_CHANGE_ORDER':
      return { ...state, changeOrders: [...state.changeOrders, action.payload] };
    case 'APPROVE_CHANGE_ORDER':
      return {
        ...state,
        changeOrders: state.changeOrders.map(co => 
          co.id === action.payload ? { ...co, status: 'Approved' } : co
        )
      };
    case 'UPLOAD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'INSTALL_EXTENSION':
      return {
        ...state,
        extensions: state.extensions.map(ext => 
          ext.id === action.payload 
             ? { ...ext, status: 'Installed', installedDate: new Date().toISOString().split('T')[0] } 
             : ext
        )
      };
    case 'UNINSTALL_EXTENSION':
      return {
        ...state,
        extensions: state.extensions.map(ext => 
          ext.id === action.payload ? { ...ext, status: 'Available', installedDate: undefined } : ext
        )
      };
     case 'ACTIVATE_EXTENSION':
      return {
        ...state,
        extensions: state.extensions.map(ext => 
          ext.id === action.payload ? { ...ext, status: 'Active' } : ext
        )
      };
    default:
      return state;
  }
};

const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<Action>;
  getTask: (projectId: string, taskId: string) => Task | undefined;
} | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  
  const getTask = (projectId: string, taskId: string) => {
    const project = state.projects.find(p => p.id === projectId);
    return project?.tasks.find(t => t.id === taskId);
  };

  return (
    <DataContext.Provider value={{ state, dispatch, getTask }}>
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