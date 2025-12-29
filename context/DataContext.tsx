
import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { 
    Project, Resource, Task, Risk, Issue, Expense, ExpenseCategory, DataJob, Extension, ActivityCode, 
    FundingSource, ProcurementPackage, Solicitation, Contract, PurchaseOrder, SupplierPerformanceReview, 
    ProcurementClaim, MakeOrBuyAnalysis, Benefit, PortfolioRisk, Program, Stakeholder, CommunicationLog, 
    QualityReport, NonConformanceReport, ChangeOrder, BudgetLineItem, RiskBreakdownStructureNode, IssueCode, 
    Integration, RiskManagementPlan, Document, CostEstimate, WBSNode, QualityStandard, EnterpriseRole, 
    EnterpriseSkill, EPSNode, OBSNode, GlobalCalendar, StrategicGoal, ProgramObjective, 
    ProgramRisk, ProgramIssue, GovernanceRole, GovernanceEvent, ProgramBudgetAllocation, ProgramFundingGate,
    IntegratedChangeRequest
} from '../types';
import { 
    MOCK_PROJECTS, MOCK_RESOURCES, MOCK_ACTIVITY_CODES, MOCK_UDFS, MOCK_DATA_JOBS, MOCK_ISSUE_CODES, 
    MOCK_ISSUES, MOCK_EXPENSE_CATEGORIES, MOCK_EXPENSES, MOCK_BUDGET_LOG, MOCK_FUNDING_SOURCES, 
    MOCK_PROJECT_FUNDING, MOCK_STAKEHOLDERS, MOCK_QUALITY_REPORTS, MOCK_DEFECTS, MOCK_COMM_LOGS, 
    MOCK_RISK_PLAN, MOCK_RBS, MOCK_COST_ESTIMATES, MOCK_PROCUREMENT_PLANS, MOCK_VENDORS, 
    MOCK_PROCUREMENT_PACKAGES, MOCK_SOLICITATIONS, MOCK_CONTRACTS, MOCK_PURCHASE_ORDERS, 
    MOCK_SUPPLIER_REVIEWS, MOCK_CLAIMS, MOCK_PORTFOLIO_RISKS, MOCK_BENEFITS, MOCK_PROGRAMS, 
    EXTENSIONS_REGISTRY, MOCK_QUALITY_STANDARDS, MOCK_ENTERPRISE_ROLES, MOCK_ENTERPRISE_SKILLS, 
    MOCK_DOCUMENTS, MOCK_EPS, MOCK_OBS, MOCK_CALENDARS, MOCK_BUDGET_ITEMS 
} from '../constants';

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
  eps: EPSNode[];
  obs: OBSNode[];
  calendars: GlobalCalendar[];
  strategicGoals: StrategicGoal[];
  programObjectives: ProgramObjective[];
  // Program Specific Data Arrays
  programRisks: ProgramRisk[];
  programIssues: ProgramIssue[];
  governanceRoles: GovernanceRole[];
  governanceEvents: GovernanceEvent[];
  programAllocations: ProgramBudgetAllocation[];
  programFundingGates: ProgramFundingGate[];
  integratedChanges: IntegratedChangeRequest[];
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
  | { type: 'ADD_STRATEGIC_GOAL'; payload: StrategicGoal }
  | { type: 'UPDATE_STRATEGIC_GOAL'; payload: StrategicGoal }
  | { type: 'DELETE_STRATEGIC_GOAL'; payload: string }
  | { type: 'ADD_PROGRAM_OBJECTIVE'; payload: ProgramObjective }
  | { type: 'UPDATE_PROGRAM_OBJECTIVE'; payload: ProgramObjective }
  | { type: 'DELETE_PROGRAM_OBJECTIVE'; payload: string }
  // Program CRUD Actions
  | { type: 'ADD_PROGRAM_RISK'; payload: ProgramRisk }
  | { type: 'UPDATE_PROGRAM_RISK'; payload: ProgramRisk }
  | { type: 'DELETE_PROGRAM_RISK'; payload: string }
  | { type: 'ADD_PROGRAM_ISSUE'; payload: ProgramIssue }
  | { type: 'UPDATE_PROGRAM_ISSUE'; payload: ProgramIssue }
  | { type: 'DELETE_PROGRAM_ISSUE'; payload: string }
  | { type: 'ADD_GOVERNANCE_ROLE'; payload: GovernanceRole }
  | { type: 'DELETE_GOVERNANCE_ROLE'; payload: string }
  | { type: 'ADD_GOVERNANCE_EVENT'; payload: GovernanceEvent }
  | { type: 'UPDATE_PROGRAM_ALLOCATION'; payload: ProgramBudgetAllocation }
  | { type: 'UPDATE_PROGRAM_GATE'; payload: ProgramFundingGate }
  | { type: 'UPDATE_INTEGRATED_CHANGE'; payload: IntegratedChangeRequest }
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
  strategicGoals: [
    { id: 'SG-01', name: 'Operational Excellence', description: 'Reduce operating costs by 15% through infrastructure modernization.', programs: ['PRG-001', 'PRG-002'] },
    { id: 'SG-02', name: 'Market Expansion', description: 'Enable service delivery in 2 new metropolitan regions.', programs: ['PRG-001'] },
  ],
  programObjectives: [
    { id: 'PO-01', description: 'Increase transit capacity by 40%', linkedStrategicGoalId: 'SG-02', linkedProjectIds: ['P1001'] },
    { id: 'PO-02', description: 'Centralize city services hub', linkedStrategicGoalId: 'SG-01', linkedProjectIds: ['P1002'] },
  ],
  // Initial Mock Data for Program Management
  programRisks: [
      { id: 'PR-001', programId: 'PRG-001', description: 'Regulatory shift in environmental compliance standards', category: 'External', probability: 'Medium', impact: 'High', score: 12, owner: 'Legal', status: 'Open', mitigationPlan: 'Engage lobbyists and prepare impact assessment.' },
      { id: 'PR-002', programId: 'PRG-001', description: 'Resource contention between Metro and Hub projects', category: 'Resource', probability: 'High', impact: 'Medium', score: 12, owner: 'PMO', status: 'Open', mitigationPlan: 'Implement resource leveling at portfolio level.' }
  ],
  programIssues: [
      { id: 'PI-01', programId: 'PRG-001', title: 'Global Supply Chain Disruption', description: 'Steel tariffs impacting all infrastructure projects.', priority: 'Critical', status: 'Open', impactedProjectIds: ['P1001', 'P1002'], owner: 'Procurement Director', resolutionPath: 'Negotiating bulk fixed-price contracts.' },
  ],
  governanceRoles: [
    { id: 'GR-01', programId: 'PRG-001', role: 'Sponsor', name: 'VP Infrastructure', authorityLevel: 'High', responsibilities: 'Funding approval, strategic alignment validation.' },
    { id: 'GR-02', programId: 'PRG-001', role: 'Steering Committee', name: 'Enterprise Steering Board', authorityLevel: 'High', responsibilities: 'Gate reviews, major scope changes, risk escalation.' },
    { id: 'GR-03', programId: 'PRG-001', role: 'Program Manager', name: 'Jessica Pearson', authorityLevel: 'Medium', responsibilities: 'Day-to-day execution, dependency management, reporting.' },
  ],
  governanceEvents: [
    { id: 'GE-01', programId: 'PRG-001', name: 'Monthly Steering Committee', type: 'Steering Committee', frequency: 'Monthly', nextDate: '2024-07-15', status: 'Scheduled' },
    { id: 'GE-02', programId: 'PRG-001', name: 'Phase 2 Gate Review', type: 'Gate Review', frequency: 'Ad-hoc', nextDate: '2024-08-01', status: 'Scheduled' },
  ],
  programAllocations: [
      { id: 'PBA-01', programId: 'PRG-001', projectId: 'P1001', allocated: 5200000, spent: 2100000, forecast: 5500000 },
      { id: 'PBA-02', programId: 'PRG-001', projectId: 'Unallocated Reserve', allocated: 5000000, spent: 0, forecast: 5000000 }
  ],
  programFundingGates: [
      { id: 'FG-01', programId: 'PRG-001', name: 'Initiation Release', amount: 5000000, releaseDate: '2023-01-15', status: 'Released', milestoneTrigger: 'Program Charter Approval' },
      { id: 'FG-02', programId: 'PRG-001', name: 'Design Phase Funding', amount: 15000000, releaseDate: '2023-06-01', status: 'Released', milestoneTrigger: 'Concept Review' },
      { id: 'FG-03', programId: 'PRG-001', name: 'Construction Mobilization', amount: 50000000, releaseDate: '2024-02-01', status: 'Pending', milestoneTrigger: 'Permit Acquisition' }
  ],
  integratedChanges: [
    {
        id: 'ICR-001', programId: 'PRG-001', title: 'New ERP Rollout', description: 'Transitioning finance from Legacy System to SAP.', type: 'Hybrid', 
        impactAreas: ['Systems', 'Processes', 'Data'], severity: 'High', status: 'Assessing', 
        readinessImpact: [
            { stakeholderGroup: 'Finance Team', awareness: 90, desire: 60, knowledge: 40, ability: 20, reinforcement: 10 },
            { stakeholderGroup: 'Project Managers', awareness: 50, desire: 80, knowledge: 10, ability: 10, reinforcement: 0 }
        ]
    },
    {
        id: 'ICR-002', programId: 'PRG-001', title: 'Agile Transformation', description: 'Shifting software teams to SAFe methodology.', type: 'Organizational', 
        impactAreas: ['Roles', 'Governance'], severity: 'Medium', status: 'Implemented',
        readinessImpact: [
            { stakeholderGroup: 'Dev Teams', awareness: 100, desire: 90, knowledge: 85, ability: 80, reinforcement: 70 }
        ]
    }
  ],
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
    case 'ADD_STRATEGIC_GOAL':
        return { ...state, strategicGoals: [...state.strategicGoals, action.payload] };
    case 'UPDATE_STRATEGIC_GOAL':
        return { ...state, strategicGoals: state.strategicGoals.map(g => g.id === action.payload.id ? action.payload : g) };
    case 'DELETE_STRATEGIC_GOAL':
        return { ...state, strategicGoals: state.strategicGoals.filter(g => g.id !== action.payload) };
    case 'ADD_PROGRAM_OBJECTIVE':
        return { ...state, programObjectives: [...state.programObjectives, action.payload] };
    case 'UPDATE_PROGRAM_OBJECTIVE':
        return { ...state, programObjectives: state.programObjectives.map(o => o.id === action.payload.id ? action.payload : o) };
    case 'DELETE_PROGRAM_OBJECTIVE':
        return { ...state, programObjectives: state.programObjectives.filter(o => o.id !== action.payload) };
    // --- Program Management Reducers ---
    case 'ADD_PROGRAM_RISK':
        return { ...state, programRisks: [...state.programRisks, action.payload] };
    case 'UPDATE_PROGRAM_RISK':
        return { ...state, programRisks: state.programRisks.map(r => r.id === action.payload.id ? action.payload : r) };
    case 'DELETE_PROGRAM_RISK':
        return { ...state, programRisks: state.programRisks.filter(r => r.id !== action.payload) };
    case 'ADD_PROGRAM_ISSUE':
        return { ...state, programIssues: [...state.programIssues, action.payload] };
    case 'UPDATE_PROGRAM_ISSUE':
        return { ...state, programIssues: state.programIssues.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_PROGRAM_ISSUE':
        return { ...state, programIssues: state.programIssues.filter(i => i.id !== action.payload) };
    case 'ADD_GOVERNANCE_ROLE':
        return { ...state, governanceRoles: [...state.governanceRoles, action.payload] };
    case 'DELETE_GOVERNANCE_ROLE':
        return { ...state, governanceRoles: state.governanceRoles.filter(r => r.id !== action.payload) };
    case 'ADD_GOVERNANCE_EVENT':
        return { ...state, governanceEvents: [...state.governanceEvents, action.payload] };
    case 'UPDATE_PROGRAM_ALLOCATION':
        return { ...state, programAllocations: state.programAllocations.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'UPDATE_PROGRAM_GATE':
        return { ...state, programFundingGates: state.programFundingGates.map(g => g.id === action.payload.id ? action.payload : g) };
    case 'UPDATE_INTEGRATED_CHANGE':
        return { ...state, integratedChanges: state.integratedChanges.map(c => c.id === action.payload.id ? action.payload : c) };
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
