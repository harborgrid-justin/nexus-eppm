
import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { Project, Resource, Task, Risk, Issue, Expense, ExpenseCategory, DataJob, Extension, ActivityCode, FundingSource, ProcurementPackage, Solicitation, Contract, PurchaseOrder, SupplierPerformanceReview, ProcurementClaim, MakeOrBuyAnalysis, Benefit, PortfolioRisk, Program, Stakeholder, CommunicationLog, QualityReport, NonConformanceReport, ChangeOrder, BudgetLineItem, RiskBreakdownStructureNode, IssueCode, Integration, RiskManagementPlan, Document, CostEstimate, WBSNode, QualityStandard, EnterpriseRole, EnterpriseSkill, EPSNode, OBSNode, GlobalCalendar } from '../types';
import { MOCK_PROJECTS, MOCK_RESOURCES, MOCK_ACTIVITY_CODES, MOCK_UDFS, MOCK_DATA_JOBS, MOCK_ISSUE_CODES, MOCK_ISSUES, MOCK_EXPENSE_CATEGORIES, MOCK_EXPENSES, MOCK_BUDGET_LOG, MOCK_FUNDING_SOURCES, MOCK_PROJECT_FUNDING, MOCK_STAKEHOLDERS, MOCK_QUALITY_REPORTS, MOCK_DEFECTS, MOCK_COMM_LOGS, MOCK_RISK_PLAN, MOCK_RBS, MOCK_COST_ESTIMATES, MOCK_PROCUREMENT_PLANS, MOCK_VENDORS, MOCK_PROCUREMENT_PACKAGES, MOCK_SOLICITATIONS, MOCK_CONTRACTS, MOCK_PURCHASE_ORDERS, MOCK_SUPPLIER_REVIEWS, MOCK_CLAIMS, MOCK_PORTFOLIO_RISKS, MOCK_BENEFITS, MOCK_PROGRAMS, EXTENSIONS_REGISTRY, MOCK_QUALITY_STANDARDS, MOCK_ENTERPRISE_ROLES, MOCK_ENTERPRISE_SKILLS, MOCK_DOCUMENTS, MOCK_EPS, MOCK_OBS, MOCK_CALENDARS, MOCK_BUDGET_ITEMS } from '../constants';

export interface DataState {
  projects: Project[];
  resources: Resource[];
  expenses: Expense[];
  expenseCategories: ExpenseCategory[];
  dataJobs: DataJob[];
  extensions: Extension[];
  activityCodes: ActivityCode[];
  fundingSources: FundingSource[];
  procurementPackages: ProcurementPackage[];
  solicitations: Solicitation[];
  contracts: Contract[];
  purchaseOrders: PurchaseOrder[];
  supplierReviews: SupplierPerformanceReview[];
  claims: ProcurementClaim[];
  makeOrBuyAnalysis: MakeOrBuyAnalysis[];
  benefits: Benefit[];
  portfolioRisks: PortfolioRisk[];
  programs: Program[];
  stakeholders: Stakeholder[];
  communicationLogs: CommunicationLog[];
  qualityReports: QualityReport[];
  nonConformanceReports: NonConformanceReport[];
  changeOrders: ChangeOrder[];
  budgetItems: BudgetLineItem[];
  risks: Risk[];
  issues: Issue[];
  rbs: RiskBreakdownStructureNode[];
  issueCodes: IssueCode[];
  integrations: Integration[];
  vendors: any[]; 
  userDefinedFields: any[];
  qualityStandards: QualityStandard[];
  roles: EnterpriseRole[];
  skills: EnterpriseSkill[];
  documents: Document[];
  // New Enterprise Structures
  eps: EPSNode[];
  obs: OBSNode[];
  calendars: GlobalCalendar[];
  errors: string[];
}

export type Action =
  | { type: 'ADD_OR_UPDATE_COST_ESTIMATE'; payload: { projectId: string; estimate: CostEstimate } }
  | { type: 'QUEUE_DATA_JOB'; payload: DataJob }
  | { type: 'UPDATE_DATA_JOB'; payload: { jobId: string; status: DataJob['status']; progress?: number; details?: string; fileName?: string; fileSize?: string } }
  | { type: 'IMPORT_PROJECTS'; payload: Project[] }
  | { type: 'UPDATE_TASK'; payload: { projectId: string; task: Task } }
  | { type: 'UPDATE_RISK'; payload: { risk: Risk } }
  | { type: 'SET_BASELINE'; payload: { projectId: string; name: string } }
  | { type: 'TOGGLE_INTEGRATION'; payload: string }
  | { type: 'APPROVE_CHANGE_ORDER'; payload: { projectId: string; changeOrderId: string } }
  | { type: 'UPDATE_RISK_PLAN'; payload: { projectId: string; plan: RiskManagementPlan } }
  | { type: 'UPDATE_RBS_NODE_PARENT'; payload: { nodeId: string; newParentId: string | null } }
  | { type: 'ADD_WBS_NODE'; payload: { projectId: string; parentId: string | null; newNode: WBSNode } }
  | { type: 'UPDATE_WBS_NODE_PARENT'; payload: { projectId: string; nodeId: string; newParentId: string | null } }
  | { type: 'UPDATE_WBS_NODE_SHAPE'; payload: { projectId: string; nodeId: string; shape: any } }
  | { type: 'UPDATE_WBS_NODE'; payload: { projectId: string; nodeId: string; updatedData: Partial<WBSNode> } }
  | { type: 'INSTALL_EXTENSION'; payload: string }
  | { type: 'ACTIVATE_EXTENSION'; payload: string }
  | { type: 'CLEAR_ERRORS' };

const initialState: DataState = {
  projects: MOCK_PROJECTS,
  resources: MOCK_RESOURCES,
  expenses: MOCK_EXPENSES,
  expenseCategories: MOCK_EXPENSE_CATEGORIES,
  dataJobs: MOCK_DATA_JOBS,
  extensions: EXTENSIONS_REGISTRY,
  activityCodes: MOCK_ACTIVITY_CODES,
  fundingSources: MOCK_FUNDING_SOURCES,
  procurementPackages: MOCK_PROCUREMENT_PACKAGES,
  solicitations: MOCK_SOLICITATIONS,
  contracts: MOCK_CONTRACTS,
  purchaseOrders: MOCK_PURCHASE_ORDERS,
  supplierReviews: MOCK_SUPPLIER_REVIEWS,
  claims: MOCK_CLAIMS,
  makeOrBuyAnalysis: [], 
  benefits: MOCK_BENEFITS,
  portfolioRisks: MOCK_PORTFOLIO_RISKS,
  programs: MOCK_PROGRAMS,
  stakeholders: MOCK_STAKEHOLDERS,
  communicationLogs: MOCK_COMM_LOGS,
  qualityReports: MOCK_QUALITY_REPORTS,
  nonConformanceReports: MOCK_DEFECTS,
  changeOrders: [], 
  budgetItems: MOCK_BUDGET_ITEMS, 
  risks: [], 
  issues: MOCK_ISSUES,
  rbs: MOCK_RBS,
  issueCodes: MOCK_ISSUE_CODES,
  integrations: [
      { id: 'int-01', name: 'Oracle Primavera P6', type: 'Scheduling', status: 'Connected', lastSync: '10 mins ago', logo: 'P6' },
      { id: 'int-02', name: 'SAP S/4HANA', type: 'ERP', status: 'Disconnected', lastSync: '2 days ago', logo: 'SAP' },
      { id: 'int-03', name: 'Microsoft Project', type: 'Scheduling', status: 'Connected', lastSync: '1 hour ago', logo: 'MSP' },
      { id: 'int-04', name: 'Autodesk Construction Cloud', type: 'BIM', status: 'Connected', lastSync: '5 mins ago', logo: 'ACC' }
  ],
  vendors: MOCK_VENDORS,
  userDefinedFields: MOCK_UDFS,
  qualityStandards: MOCK_QUALITY_STANDARDS,
  roles: MOCK_ENTERPRISE_ROLES,
  skills: MOCK_ENTERPRISE_SKILLS,
  documents: MOCK_DOCUMENTS,
  eps: MOCK_EPS,
  obs: MOCK_OBS,
  calendars: MOCK_CALENDARS,
  errors: [],
};

const dataReducer = (state: DataState, action: Action): DataState => {
  switch (action.type) {
    case 'QUEUE_DATA_JOB':
      return { ...state, dataJobs: [action.payload, ...state.dataJobs] };
    case 'UPDATE_DATA_JOB':
      return {
        ...state,
        dataJobs: state.dataJobs.map(job => job.id === action.payload.jobId ? { ...job, ...action.payload } : job)
      };
    case 'IMPORT_PROJECTS':
      return { ...state, projects: [...state.projects, ...action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, tasks: p.tasks.map(t => t.id === action.payload.task.id ? action.payload.task : t) }
            : p
        )
      };
    case 'INSTALL_EXTENSION':
        return {
            ...state,
            extensions: state.extensions.map(ext => ext.id === action.payload ? { ...ext, status: 'Installed' } : ext)
        };
    case 'ACTIVATE_EXTENSION':
        return {
            ...state,
            extensions: state.extensions.map(ext => ext.id === action.payload ? { ...ext, status: 'Active' } : ext)
        };
    case 'TOGGLE_INTEGRATION':
        return {
            ...state,
            integrations: state.integrations.map(int => int.id === action.payload ? { ...int, status: int.status === 'Connected' ? 'Disconnected' : 'Connected' } : int)
        };
    default:
      return state;
  }
};

const DataContext = createContext<{
  state: DataState;
  dispatch: React.Dispatch<Action>;
  getRiskPlan: (projectId: string) => RiskManagementPlan;
  getProjectDocs: (projectId: string) => Document[];
  getActivityCodesForProject: (projectId: string) => ActivityCode[];
} | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const getRiskPlan = useCallback((projectId: string) => {
      return MOCK_RISK_PLAN;
  }, []);

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
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
