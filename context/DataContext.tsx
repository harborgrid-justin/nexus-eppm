import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { 
  Project, Resource, Risk, Integration, Task, ChangeOrder, BudgetLineItem, 
  Document, Extension, Stakeholder, ProcurementPackage, QualityReport, CommunicationLog, WBSNode,
  RiskManagementPlan, RiskBreakdownStructureNode, ActivityCode, IssueCode, Issue, ExpenseCategory, Expense, FundingSource, WBSNodeShape, BudgetLogItem, TaskStatus,
  ProcurementPlan, Vendor, Solicitation, Contract, PurchaseOrder, SupplierPerformanceReview, ProcurementClaim, Program, NonConformanceReport, CostEstimate
} from '../types';
import { 
  MOCK_PROJECTS, MOCK_RESOURCES, EXTENSIONS_REGISTRY, MOCK_STAKEHOLDERS, 
  MOCK_PROCUREMENT_PACKAGES, MOCK_QUALITY_REPORTS, MOCK_COMM_LOGS, MOCK_RISK_PLAN, MOCK_RBS, MOCK_ACTIVITY_CODES,
  MOCK_ISSUE_CODES, MOCK_ISSUES, MOCK_EXPENSE_CATEGORIES, MOCK_EXPENSES, MOCK_FUNDING_SOURCES,
  MOCK_PROCUREMENT_PLANS, MOCK_VENDORS, MOCK_SOLICITATIONS, MOCK_CONTRACTS, MOCK_PURCHASE_ORDERS,
  MOCK_SUPPLIER_REVIEWS, MOCK_CLAIMS, MOCK_PROGRAMS, MOCK_DEFECTS
} from '../constants';
import { findAndModifyNode, findAndRemoveNode, findAndReparentNode } from '../utils/treeUtils';
import { addWbsNodeToProject, reparentWbsNodeInProject, approveChangeOrderInState } from '../utils/domainLogic';


const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'sap', name: 'SAP S/4HANA', type: 'ERP', status: 'Connected', lastSync: '10 mins ago', logo: 'S' },
  { id: 'oracle', name: 'Oracle Primavera Cloud', type: 'ERP', status: 'Disconnected', lastSync: '2 days ago', logo: 'O' },
  { id: 'wd', name: 'Workday', type: 'HRIS', status: 'Connected', lastSync: '1 hour ago', logo: 'W' },
  { id: 'sf', name: 'Salesforce', type: 'CRM', status: 'Connected', lastSync: '5 mins ago', logo: 'F' },
  { id: 'procore', name: 'Procore', type: 'ERP', status: 'Connected', lastSync: '1 hour ago', logo: 'P' },
];

const MOCK_RISKS: Risk[] = [
  { id: 'RSK-001', projectId: 'P1001', description: 'Supply chain delay for structural steel', category: 'External', probability: 'High', impact: 'High', probabilityValue: 4, impactValue: 5, score: 20, status: 'Open', owner: 'Mike Ross', rbsNodeId: 'rbs-2.3', dateIdentified: '2024-02-20', responseStrategy: 'Mitigate', responseActions: [{ id: 'RA-001', description: 'Source alternative local suppliers and place backup PO.', ownerId: 'R5', dueDate: '2024-03-15', status: 'In Progress' }] },
  { id: 'RSK-002', projectId: 'P1001', description: 'Permit approval bottleneck from city council', category: 'External', probability: 'Medium', impact: 'High', probabilityValue: 3, impactValue: 4, score: 12, status: 'Open', owner: 'Sarah Chen', rbsNodeId: 'rbs-2.1', dateIdentified: '2024-01-15', responseStrategy: 'Mitigate', responseActions: [{ id: 'RA-002', description: 'Expedite processing with city council via legal counsel.', ownerId: 'R4', dueDate: '2024-02-28', status: 'Complete' }] },
  { id: 'RSK-003', projectId: 'P1001', description: 'Unexpected soil conditions during excavation', category: 'Technical', probability: 'Low', impact: 'Medium', probabilityValue: 2, impactValue: 3, score: 6, status: 'Mitigated', owner: 'Jessica Pearson', rbsNodeId: 'rbs-1.2', dateIdentified: '2024-03-01', responseStrategy: 'Mitigate', responseActions: [{ id: 'RA-003', description: 'Conduct secondary geo-survey and have contingency foundation design ready.', ownerId: 'R2', dueDate: '2024-04-01', status: 'Complete' }], residualProbabilityValue: 1, residualImpactValue: 3 },
  { id: 'RSK-004', projectId: 'P1001', description: 'Key engineer resigns', category: 'Organizational', probability: 'Low', impact: 'High', probabilityValue: 2, impactValue: 4, score: 8, status: 'Open', owner: 'Sarah Chen', rbsNodeId: 'rbs-1', dateIdentified: '2024-05-10', responseStrategy: 'Accept', responseActions: [] },
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

export interface DataState {
  programs: Program[];
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
  qualityReports: QualityReport[];
  nonConformanceReports: NonConformanceReport[];
  communicationLogs: CommunicationLog[];
  riskPlans: RiskManagementPlan[];
  rbs: RiskBreakdownStructureNode[];
  activityCodes: ActivityCode[];
  issueCodes: IssueCode[];
  issues: Issue[];
  expenseCategories: ExpenseCategory[];
  expenses: Expense[];
  fundingSources: FundingSource[];
  procurementPlans: ProcurementPlan[];
  vendors: Vendor[];
  solicitations: Solicitation[];
  contracts: Contract[];
  purchaseOrders: PurchaseOrder[];
  supplierReviews: SupplierPerformanceReview[];
  claims: ProcurementClaim[];
  errors: string[]; // Global error tracking
}

export type Action = 
  | { type: 'UPDATE_TASK'; payload: { projectId: string; task: Task } }
  | { type: 'ADD_RISK'; payload: Risk }
  | { type: 'UPDATE_RISK'; payload: { risk: Risk } }
  | { type: 'UPDATE_RISK_PLAN'; payload: { projectId: string; plan: Partial<RiskManagementPlan> } }
  | { type: 'TOGGLE_INTEGRATION'; payload: string }
  | { type: 'ADD_RESOURCE'; payload: Resource }
  | { type: 'ADD_CHANGE_ORDER'; payload: ChangeOrder }
  | { type: 'APPROVE_CHANGE_ORDER'; payload: { projectId: string, changeOrderId: string } } 
  | { type: 'UPLOAD_DOCUMENT'; payload: Document }
  | { type: 'INSTALL_EXTENSION'; payload: string }
  | { type: 'UNINSTALL_EXTENSION'; payload: string }
  | { type: 'ACTIVATE_EXTENSION'; payload: string }
  | { type: 'ADD_WBS_NODE'; payload: { projectId: string; parentId: string | null; newNode: WBSNode } }
  | { type: 'UPDATE_WBS_NODE'; payload: { projectId: string; nodeId: string; updatedData: Partial<WBSNode> } }
  | { type: 'UPDATE_WBS_NODE_SHAPE'; payload: { projectId: string; nodeId: string; shape: WBSNodeShape } }
  | { type: 'DELETE_WBS_NODE'; payload: { projectId: string; nodeId: string } }
  | { type: 'UPDATE_WBS_NODE_PARENT'; payload: { projectId: string; nodeId: string; newParentId: string | null } }
  | { type: 'SET_BASELINE'; payload: { projectId: string; name: string } }
  | { type: 'ADD_ACTIVITY_CODE'; payload: ActivityCode }
  | { type: 'UPDATE_ACTIVITY_CODE'; payload: ActivityCode }
  | { type: 'DELETE_ACTIVITY_CODE'; payload: string }
  | { type: 'UPDATE_RBS_NODE_PARENT'; payload: { nodeId: string; newParentId: string | null } }
  | { type: 'LINK_ISSUE_TO_TASK'; payload: { projectId: string; taskId: string; issueId: string } }
  | { type: 'CREATE_ISSUE_FROM_QUALITY_FAIL'; payload: { qualityReport: QualityReport } }
  | { type: 'ADD_OR_UPDATE_COST_ESTIMATE'; payload: { projectId: string; estimate: CostEstimate } }
  | { type: 'CLEAR_ERRORS' };


const initialState: DataState = {
  programs: MOCK_PROGRAMS,
  projects: MOCK_PROJECTS,
  resources: MOCK_RESOURCES,
  integrations: MOCK_INTEGRATIONS,
  risks: MOCK_RISKS,
  changeOrders: MOCK_CHANGE_ORDERS,
  budgetItems: MOCK_BUDGET,
  documents: MOCK_DOCUMENTS,
  extensions: EXTENSIONS_REGISTRY,
  stakeholders: MOCK_STAKEHOLDERS,
  procurementPackages: MOCK_PROCUREMENT_PACKAGES,
  qualityReports: MOCK_QUALITY_REPORTS,
  nonConformanceReports: MOCK_DEFECTS,
  communicationLogs: MOCK_COMM_LOGS,
  riskPlans: [MOCK_RISK_PLAN],
  rbs: MOCK_RBS,
  activityCodes: MOCK_ACTIVITY_CODES,
  issueCodes: MOCK_ISSUE_CODES,
  issues: MOCK_ISSUES,
  expenseCategories: MOCK_EXPENSE_CATEGORIES,
  expenses: MOCK_EXPENSES,
  fundingSources: MOCK_FUNDING_SOURCES,
  procurementPlans: MOCK_PROCUREMENT_PLANS,
  vendors: MOCK_VENDORS,
  solicitations: MOCK_SOLICITATIONS,
  contracts: MOCK_CONTRACTS,
  purchaseOrders: MOCK_PURCHASE_ORDERS,
  supplierReviews: MOCK_SUPPLIER_REVIEWS,
  claims: MOCK_CLAIMS,
  errors: [],
};

const dataReducer = (state: DataState, action: Action): DataState => {
  try {
    switch (action.type) {
      case 'CLEAR_ERRORS':
        return { ...state, errors: [] };
      
      case 'UPDATE_TASK':
        return {
          ...state,
          projects: state.projects.map(p => 
            p.id === action.payload.projectId 
              ? { ...p, tasks: p.tasks.map(t => t.id === action.payload.task.id ? action.payload.task : t) }
              : p
          )
        };
      case 'SET_BASELINE': {
          const { projectId, name } = action.payload;
          return {
              ...state,
              projects: state.projects.map(p => {
                  if (p.id !== projectId) return p;
                  const newBaseline = {
                      id: `BL${(p.baselines?.length || 0) + 1}`,
                      name,
                      date: new Date().toISOString().split('T')[0],
                      taskBaselines: p.tasks.reduce((acc, task) => {
                          acc[task.id] = {
                              baselineStartDate: task.startDate,
                              baselineEndDate: task.endDate
                          };
                          return acc;
                      }, {} as Record<string, { baselineStartDate: string, baselineEndDate: string }>)
                  };
                  return { ...p, baselines: [...(p.baselines || []), newBaseline] };
              })
          };
      }
      case 'ADD_WBS_NODE': {
        const { projectId, parentId, newNode } = action.payload;
        const updatedProjects = state.projects.map(p => 
          p.id === projectId ? addWbsNodeToProject(p, parentId, newNode) : p
        );
        return { ...state, projects: updatedProjects };
      }
      case 'UPDATE_WBS_NODE': {
        const { projectId, nodeId, updatedData } = action.payload;
        return {
          ...state,
          projects: state.projects.map(p => {
            if (p.id !== projectId || !p.wbs) return p;
            const newWbs = findAndModifyNode(p.wbs, nodeId, node => ({
              ...node, ...updatedData
            }));
            return { ...p, wbs: newWbs };
          })
        };
      }
      case 'UPDATE_WBS_NODE_SHAPE': {
        const { projectId, nodeId, shape } = action.payload;
        return {
          ...state,
          projects: state.projects.map(p => {
            if (p.id !== projectId || !p.wbs) return p;
            const newWbs = findAndModifyNode(p.wbs, nodeId, node => ({ ...node, shape }));
            return { ...p, wbs: newWbs };
          })
        };
      }
      case 'UPDATE_WBS_NODE_PARENT': {
        const { projectId, nodeId, newParentId } = action.payload;
        if (nodeId === newParentId) return state;
        
        const projectToUpdate = state.projects.find(p => p.id === projectId);
        if (!projectToUpdate) return state;

        const { project: updatedProject, error } = reparentWbsNodeInProject(projectToUpdate, nodeId, newParentId);

        if (error) {
             return { ...state, errors: [...state.errors, `WBS Move Failed: ${error}`] };
        }
        
        const updatedProjects = state.projects.map(p => p.id === projectId ? updatedProject : p);
        return { ...state, projects: updatedProjects };
      }
      case 'DELETE_WBS_NODE': {
        const { projectId, nodeId } = action.payload;
         return {
          ...state,
          projects: state.projects.map(p => {
            if (p.id !== projectId || !p.wbs) return p;
            const newWbs = findAndRemoveNode(p.wbs, nodeId);
            return { ...p, wbs: newWbs };
          })
        };
      }
      case 'ADD_RISK':
        return { ...state, risks: [...state.risks, action.payload] };
      case 'UPDATE_RISK':
        return {
          ...state,
          risks: state.risks.map(r => r.id === action.payload.risk.id ? action.payload.risk : r)
        };
      case 'UPDATE_RISK_PLAN':
        return {
          ...state,
          riskPlans: state.riskPlans.map(p => 
            p.projectId === action.payload.projectId
              ? { ...p, ...action.payload.plan }
              : p
          )
        };
      case 'UPDATE_RBS_NODE_PARENT': {
        const { nodeId, newParentId } = action.payload;
        if (nodeId === newParentId) return state;
        
        const { newNodes, error } = findAndReparentNode(state.rbs, nodeId, newParentId);
        
        if (error) {
            return { ...state, errors: [...state.errors, `RBS Move Failed: ${error}`] };
        }
        
        return { ...state, rbs: newNodes };
      }
      case 'ADD_ACTIVITY_CODE':
        return { ...state, activityCodes: [...state.activityCodes, action.payload] };
      case 'UPDATE_ACTIVITY_CODE':
        return {
          ...state,
          activityCodes: state.activityCodes.map(ac =>
            ac.id === action.payload.id ? action.payload : ac
          )
        };
      case 'DELETE_ACTIVITY_CODE':
        return {
          ...state,
          activityCodes: state.activityCodes.filter(ac => ac.id !== action.payload)
        };
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
      case 'APPROVE_CHANGE_ORDER': {
          const { projectId, changeOrderId } = action.payload;
          const { updatedProjects, updatedChangeOrders } = approveChangeOrderInState(
            state.projects, 
            state.changeOrders, 
            projectId, 
            changeOrderId
          );
          return { ...state, projects: updatedProjects, changeOrders: updatedChangeOrders };
      }
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
      case 'LINK_ISSUE_TO_TASK': {
          const { projectId, taskId, issueId } = action.payload;
          return {
              ...state,
              projects: state.projects.map(p => 
                  p.id === projectId ? { ...p, tasks: p.tasks.map(t => 
                      t.id === taskId ? { ...t, issueIds: [...(t.issueIds || []), issueId] } : t
                  )} : p
              ),
              issues: state.issues.map(i => 
                  i.id === issueId ? { ...i, activityId: taskId } : i
              )
          };
      }
      case 'CREATE_ISSUE_FROM_QUALITY_FAIL': {
          const { qualityReport } = action.payload;
          const newIssue: Issue = {
              id: `ISS-${Date.now()}`,
              projectId: qualityReport.projectId,
              priority: 'Medium',
              status: 'Open',
              description: `Quality Failure: ${qualityReport.details.finding || qualityReport.type}`,
              assignedTo: 'Unassigned',
              dateIdentified: new Date().toISOString().split('T')[0],
          };
          return {
              ...state,
              issues: [...state.issues, newIssue],
              qualityReports: state.qualityReports.map(qr => 
                  qr.id === qualityReport.id ? { ...qr, linkedIssueId: newIssue.id } : qr
              )
          };
      }
      case 'ADD_OR_UPDATE_COST_ESTIMATE': {
        const { projectId, estimate } = action.payload;
        return {
            ...state,
            projects: state.projects.map(p => {
                if (p.id !== projectId) return p;
                const newEstimates = [...(p.costEstimates || [])];
                const existingIndex = newEstimates.findIndex(e => e.wbsId === estimate.wbsId);
                if (existingIndex > -1) {
                    newEstimates[existingIndex] = estimate;
                } else {
                    newEstimates.push({ ...estimate, id: `EST-${Date.now()}` });
                }
                return { ...p, costEstimates: newEstimates };
            })
        };
      }
      default:
        return state;
    }
  } catch (error) {
    console.error("Reducer Error:", error);
    // Return current state but append error message
    return { ...state, errors: [...state.errors, "Internal System Error occurred during action processing."] };
  }
};

const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<Action>;
  getTask: (projectId: string, taskId: string) => Task | undefined;
  getRiskPlan: (projectId: string) => RiskManagementPlan | undefined;
  getRBS: () => RiskBreakdownStructureNode[];
  getProjectDocs: (projectId: string) => Document[];
  getActivityCodesForProject: (projectId: string) => ActivityCode[];
} | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  
  // Large dataset warning check
  useMemo(() => {
     if (state.projects.reduce((acc, p) => acc + p.tasks.length, 0) > 2000) {
        console.warn("Large dataset detected. Performance degradation may occur.");
     }
  }, [state.projects]);

  const getTask = (projectId: string, taskId: string) => {
    const project = state.projects.find(p => p.id === projectId);
    return project?.tasks.find(t => t.id === taskId);
  };
  
  const getRiskPlan = (projectId: string) => {
    return state.riskPlans.find(p => p.projectId === projectId);
  };
  
  const getRBS = () => {
    return state.rbs;
  };

  const getProjectDocs = (projectId: string) => {
    return state.documents.filter(d => d.projectId === projectId);
  };

  const getActivityCodesForProject = (projectId: string) => {
    return state.activityCodes.filter(ac => ac.scope === 'Global' || (ac.scope === 'Project' && ac.projectId === projectId));
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    getTask,
    getProjectDocs,
    getRiskPlan,
    getRBS,
    getActivityCodesForProject
  }), [state]);

  return (
    <DataContext.Provider value={contextValue}>
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
