
import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { 
    Project, Resource, Task, Risk, Issue, Expense, ExpenseCategory, DataJob, Extension, ActivityCode, 
    FundingSource, ProcurementPackage, Solicitation, Contract, PurchaseOrder, SupplierPerformanceReview, 
    ProcurementClaim, MakeOrBuyAnalysis, Benefit, PortfolioRisk, Program, Stakeholder, CommunicationLog, 
    QualityReport, NonConformanceReport, ChangeOrder, BudgetLineItem, RiskBreakdownStructureNode, IssueCode, 
    Integration, RiskManagementPlan, Document, CostEstimate, WBSNode, QualityStandard, EnterpriseRole, 
    EnterpriseSkill, EPSNode, OBSNode, GlobalCalendar, StrategicGoal, ProgramObjective, 
    ProgramRisk, ProgramIssue, GovernanceRole, GovernanceEvent, ProgramBudgetAllocation, ProgramFundingGate,
    IntegratedChangeRequest, Vendor, ProgramStageGate, ProgramStakeholder, ProgramCommunicationItem
} from '../types';
import { GovernanceState } from '../types/business';
import { MOCK_RISK_PLAN } from '../constants';
import { initialState } from './initialState';
import { rootReducer } from './rootReducer';

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
  vendors: Vendor[]; 
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
  programRisks: ProgramRisk[];
  programIssues: ProgramIssue[];
  governanceRoles: GovernanceRole[];
  governanceEvents: GovernanceEvent[];
  programAllocations: ProgramBudgetAllocation[];
  programFundingGates: ProgramFundingGate[];
  programStageGates: ProgramStageGate[];
  integratedChanges: IntegratedChangeRequest[];
  programStakeholders: ProgramStakeholder[];
  programCommunicationPlan: ProgramCommunicationItem[];
  governance: GovernanceState;
  errors: string[];
}

export type Action =
  | { type: 'ADD_OR_UPDATE_COST_ESTIMATE'; payload: { projectId: string; estimate: CostEstimate } }
  | { type: 'QUEUE_DATA_JOB'; payload: DataJob }
  | { type: 'UPDATE_DATA_JOB'; payload: { jobId: string; status: DataJob['status']; progress?: number; details?: string; fileName?: string; fileSize?: string } }
  | { type: 'IMPORT_PROJECTS'; payload: Project[] }
  | { type: 'UPDATE_TASK'; payload: { projectId: string; task: Task } }
  | { type: 'ADD_RISK'; payload: Risk }
  | { type: 'UPDATE_RISK'; payload: { risk: Risk } }
  | { type: 'DELETE_RISK'; payload: string }
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
  | { type: 'ADD_PROGRAM_STAKEHOLDER'; payload: ProgramStakeholder }
  | { type: 'UPDATE_PROGRAM_STAKEHOLDER'; payload: ProgramStakeholder }
  | { type: 'DELETE_PROGRAM_STAKEHOLDER'; payload: string }
  | { type: 'ADD_PROGRAM_COMM_ITEM'; payload: ProgramCommunicationItem }
  | { type: 'UPDATE_PROGRAM_COMM_ITEM'; payload: ProgramCommunicationItem }
  | { type: 'DELETE_PROGRAM_COMM_ITEM'; payload: string }
  | { type: 'MARK_ALERT_READ'; payload: string }
  | { type: 'UPDATE_EXCHANGE_RATES'; payload: Record<string, number> }
  | { type: 'UPDATE_INFLATION_RATE'; payload: number }
  | { type: 'UPDATE_RESOURCE'; payload: Resource }
  | { type: 'UPDATE_VENDOR'; payload: Vendor }
  | { type: 'FREEZE_BASELINE'; payload: string }
  | { type: 'LOG_SAFETY_INCIDENT'; payload: { locationId: string; description: string } }
  | { type: 'CLOSE_PROJECT'; payload: string }
  | { type: 'CLEAR_ERRORS' };

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
