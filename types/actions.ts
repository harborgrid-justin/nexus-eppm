
import { 
    DataJob, Extension, ActivityCode, Document, QualityStandard, Integration, 
    StandardTemplate, UserDefinedField, WorkflowDefinition, GlobalChangeRule, CostBookItem 
} from './common';
import { Project, Task, WBSNode, Baseline, WBSNodeShape } from './project';
import { Resource, Timesheet, EnterpriseRole, EnterpriseSkill } from './resource';
import { 
    Expense, ExpenseCategory, FundingSource, BudgetLogItem, ProjectFunding, CostEstimate, 
    BudgetLineItem, ChangeOrder, Invoice, CostReport, CostMeeting, CostAlert
} from './finance';
import { 
    Risk, Issue, RiskManagementPlan, RiskBreakdownStructureNode, IssueCode, PortfolioRisk, 
    QualityReport, NonConformanceReport, ProgramRisk
} from './risk';
import { 
    ProcurementPackage, Solicitation, Contract, SupplierPerformanceReview, ProcurementClaim, 
    MakeOrBuyAnalysis, Vendor, PurchaseOrder, ProcurementPlan
} from './procurement';
import { 
    Program, Benefit, StrategicGoal, ProgramObjective, ProgramIssue, GovernanceRole, GovernanceEvent,
    ProgramBudgetAllocation, IntegratedChangeRequest, ProgramStageGate, ProgramStakeholder,
    ProgramCommunicationItem, PortfolioScenario, GovernanceDecision, ProgramDependency, ProgramOutcome,
    ProgramChangeRequest, ProgramQualityStandard, ProgramAssuranceReview, ProgramTransitionItem,
    ProgramArchitectureStandard, ProgramArchitectureReview, TradeoffScenario, ProgramFundingGate,
    StrategicDriver, ESGMetric
} from './program';
import { Stakeholder, CommunicationLog } from './project_subtypes';
import { EPSNode, OBSNode, Location } from './structure';
import { GlobalCalendar } from './calendar';
import { User } from './auth';
import { GovernanceState } from './business';


export interface DataState {
  projects: Project[];
  resources: Resource[];
  timesheets: Timesheet[];
  expenses: Expense[];
  expenseCategories: ExpenseCategory[];
  invoices: Invoice[];
  costReports: CostReport[]; 
  costMeetings: CostMeeting[]; 
  costAlerts: CostAlert[]; 
  costBook: CostBookItem[];
  dataJobs: DataJob[];
  extensions: Extension[];
  activityCodes: ActivityCode[];
  fundingSources: FundingSource[];
  procurementPackages: ProcurementPackage[];
  procurementPlans: ProcurementPlan[]; 
  solicitations: Solicitation[];
  contracts: Contract[];
  purchaseOrders: PurchaseOrder[];
  supplierReviews: SupplierPerformanceReview[];
  claims: ProcurementClaim[];
  makeOrBuyAnalysis: any[];
  benefits: Benefit[];
  portfolioRisks: PortfolioRisk[];
  portfolioScenarios: PortfolioScenario[];
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
  vendors: Vendor[];
  integrations: Integration[];
  userDefinedFields: UserDefinedField[];
  qualityStandards: QualityStandard[];
  roles: EnterpriseRole[];
  skills: EnterpriseSkill[];
  documents: Document[];
  standardTemplates: StandardTemplate[];
  eps: EPSNode[];
  obs: OBSNode[];
  calendars: GlobalCalendar[];
  locations: Location[];
  strategicGoals: StrategicGoal[];
  strategicDrivers: StrategicDriver[];
  esgMetrics: ESGMetric[];
  programObjectives: ProgramObjective[];
  programDependencies: ProgramDependency[];
  programOutcomes: ProgramOutcome[];
  programRisks: ProgramRisk[];
  programIssues: ProgramIssue[];
  programChangeRequests: ProgramChangeRequest[];
  programQualityStandards: ProgramQualityStandard[];
  programAssuranceReviews: ProgramAssuranceReview[];
  programTransitionItems: ProgramTransitionItem[];
  programArchitectureStandards: ProgramArchitectureStandard[];
  programArchitectureReviews: ProgramArchitectureReview[];
  tradeoffScenarios: TradeoffScenario[];
  governanceRoles: GovernanceRole[];
  governanceEvents: GovernanceEvent[];
  governanceDecisions: GovernanceDecision[];
  programAllocations: ProgramBudgetAllocation[];
  programFundingGates: ProgramFundingGate[];
  programStageGates: ProgramStageGate[];
  integratedChanges: IntegratedChangeRequest[];
  programStakeholders: ProgramStakeholder[];
  programCommunicationPlan: ProgramCommunicationItem[];
  workflows: WorkflowDefinition[];
  globalChangeRules: GlobalChangeRule[];
  governance: GovernanceState;
  errors: string[];
  users: User[];
}

export type Action =
  // PROJECT
  | { type: 'PROJECT_IMPORT'; payload: Project[] }
  | { type: 'PROJECT_UPDATE'; payload: { projectId: string; updatedData: Partial<Project> } }
  | { type: 'PROJECT_CLOSE'; payload: string }
  | { type: 'PROJECT_UPDATE_RISK_PLAN'; payload: { projectId: string; plan: RiskManagementPlan } }
  // TASK
  | { type: 'TASK_UPDATE'; payload: { projectId: string; task: Task } }
  // WBS
  | { type: 'WBS_ADD_NODE'; payload: { projectId: string; parentId: string | null; newNode: WBSNode } }
  | { type: 'WBS_UPDATE_NODE'; payload: { projectId: string; nodeId: string; updatedData: Partial<WBSNode> } }
  | { type: 'WBS_REPARENT'; payload: { projectId: string; nodeId: string; newParentId: string | null } }
  | { type: 'WBS_UPDATE_SHAPE'; payload: { projectId: string; nodeId: string; shape: any } }
  // COST
  | { type: 'COST_ESTIMATE_ADD_OR_UPDATE'; payload: { projectId: string; estimate: CostEstimate } }
  // BASELINE
  | { type: 'BASELINE_SET'; payload: { projectId: string; name: string; type?: Baseline['type'] } }
  | { type: 'BASELINE_UPDATE'; payload: { projectId: string; baselineId: string; name: string; type: Baseline['type'] } }
  | { type: 'BASELINE_DELETE'; payload: { projectId: string; baselineId: string } }
  // RISK
  | { type: 'ADD_RISK'; payload: Risk }
  | { type: 'UPDATE_RISK'; payload: { risk: Risk } }
  | { type: 'DELETE_RISK'; payload: string }
  | { type: 'RBS_REPARENT'; payload: { nodeId: string; newParentId: string | null } }
  // PROGRAM
  | { type: 'PROGRAM_ADD_STAKEHOLDER'; payload: ProgramStakeholder }
  | { type: 'PROGRAM_UPDATE_STAKEHOLDER'; payload: ProgramStakeholder }
  | { type: 'PROGRAM_DELETE_STAKEHOLDER'; payload: string }
  | { type: 'PROGRAM_ADD_COMM_ITEM'; payload: ProgramCommunicationItem }
  | { type: 'PROGRAM_UPDATE_COMM_ITEM'; payload: ProgramCommunicationItem }
  | { type: 'PROGRAM_DELETE_COMM_ITEM'; payload: string }
  | { type: 'PROGRAM_UPDATE_ALLOCATION'; payload: ProgramBudgetAllocation }
  | { type: 'PROGRAM_UPDATE_GATE'; payload: ProgramFundingGate }
  | { type: 'PROGRAM_ADD_OBJECTIVE'; payload: ProgramObjective }
  | { type: 'PROGRAM_UPDATE_OBJECTIVE'; payload: ProgramObjective }
  | { type: 'PROGRAM_DELETE_OBJECTIVE'; payload: string }
  | { type: 'PROGRAM_ADD_RISK'; payload: ProgramRisk }
  | { type: 'PROGRAM_DELETE_RISK'; payload: string }
  | { type: 'PROGRAM_ADD_ISSUE'; payload: ProgramIssue }
  | { type: 'PROGRAM_UPDATE_ISSUE'; payload: ProgramIssue }
  | { type: 'PROGRAM_DELETE_ISSUE'; payload: string }
  // ADMIN
  | { type: 'ADMIN_ADD_LOCATION'; payload: Location }
  | { type: 'ADMIN_UPDATE_LOCATION'; payload: Location }
  | { type: 'ADMIN_DELETE_LOCATION'; payload: string }
  | { type: 'ADMIN_ADD_ACTIVITY_CODE'; payload: ActivityCode }
  | { type: 'ADMIN_UPDATE_ACTIVITY_CODE'; payload: ActivityCode }
  | { type: 'ADMIN_DELETE_ACTIVITY_CODE'; payload: string }
  | { type: 'ADMIN_ADD_UDF'; payload: UserDefinedField }
  | { type: 'ADMIN_UPDATE_UDF'; payload: UserDefinedField }
  | { type: 'ADMIN_DELETE_UDF'; payload: string }
  | { type: 'ADMIN_ADD_USER'; payload: User }
  | { type: 'ADMIN_UPDATE_USER'; payload: User }
  | { type: 'ADMIN_DELETE_USER'; payload: string }
  | { type: 'ADMIN_ADD_FUNDING_SOURCE'; payload: FundingSource }
  | { type: 'ADMIN_UPDATE_FUNDING_SOURCE'; payload: FundingSource }
  | { type: 'ADMIN_DELETE_FUNDING_SOURCE'; payload: string }
  | { type: 'ADMIN_ADD_CALENDAR'; payload: GlobalCalendar }
  | { type: 'ADMIN_UPDATE_CALENDAR'; payload: GlobalCalendar }
  | { type: 'ADMIN_DELETE_CALENDAR'; payload: string }
  | { type: 'ADMIN_ADD_ISSUE_CODE'; payload: IssueCode }
  | { type: 'ADMIN_UPDATE_ISSUE_CODE'; payload: IssueCode }
  | { type: 'ADMIN_DELETE_ISSUE_CODE'; payload: string }
  | { type: 'ADMIN_ADD_EXPENSE_CATEGORY'; payload: ExpenseCategory }
  | { type: 'ADMIN_UPDATE_EXPENSE_CATEGORY'; payload: ExpenseCategory }
  | { type: 'ADMIN_DELETE_EXPENSE_CATEGORY'; payload: string }
  | { type: 'ADMIN_ADD_EPS_NODE'; payload: EPSNode }
  | { type: 'ADMIN_UPDATE_EPS_NODE'; payload: EPSNode }
  | { type: 'ADMIN_DELETE_EPS_NODE'; payload: string }
  | { type: 'ADMIN_ADD_OBS_NODE'; payload: OBSNode }
  | { type: 'ADMIN_UPDATE_OBS_NODE'; payload: OBSNode }
  | { type: 'ADMIN_DELETE_OBS_NODE'; payload: string }
  | { type: 'ADMIN_ADD_WORKFLOW'; payload: WorkflowDefinition }
  | { type: 'ADMIN_UPDATE_WORKFLOW'; payload: WorkflowDefinition }
  | { type: 'ADMIN_DELETE_WORKFLOW'; payload: string }
  | { type: 'ADMIN_ADD_ROLE'; payload: EnterpriseRole }
  | { type: 'ADMIN_UPDATE_ROLE'; payload: EnterpriseRole }
  // SYSTEM & GOVERNANCE
  | { type: 'SYSTEM_QUEUE_DATA_JOB'; payload: DataJob }
  | { type: 'SYSTEM_UPDATE_DATA_JOB'; payload: { jobId: string; status: DataJob['status']; progress?: number; details?: string; fileName?: string; fileSize?: string } }
  | { type: 'SYSTEM_TOGGLE_INTEGRATION'; payload: string }
  | { type: 'SYSTEM_INSTALL_EXTENSION'; payload: string }
  | { type: 'SYSTEM_ACTIVATE_EXTENSION'; payload: string }
  | { type: 'SYSTEM_LOG_SAFETY_INCIDENT'; payload: { locationId: string } }
  | { type: 'SYSTEM_CLEAR_ERRORS' }
  | { type: 'GOVERNANCE_UPDATE_CURRENCY'; payload: { code: string; rate: number } }
  | { type: 'GOVERNANCE_ADD_CURRENCY'; payload: { code: string; rate: number } }
  | { type: 'GOVERNANCE_DELETE_CURRENCY'; payload: string }
  | { type: 'GOVERNANCE_UPDATE_SECURITY_POLICY'; payload: Partial<GovernanceState['security']> }
  | { type: 'GOVERNANCE_UPDATE_NOTIFICATION_PREFERENCE'; payload: { id: string; field: string; value: boolean } }
  | { type: 'GOVERNANCE_MARK_ALERT_READ'; payload: string }
  | { type: 'GOVERNANCE_UPDATE_INFLATION_RATE'; payload: number }
  | { type: 'GOVERNANCE_UPDATE_SYSTEM_SCHEDULING'; payload: Record<string, any> }
  | { type: 'GOVERNANCE_ADD_STRATEGIC_GOAL'; payload: StrategicGoal }
  | { type: 'GOVERNANCE_UPDATE_STRATEGIC_GOAL'; payload: StrategicGoal }
  | { type: 'GOVERNANCE_DELETE_STRATEGIC_GOAL'; payload: string }
  | { type: 'GOVERNANCE_ADD_ROLE'; payload: GovernanceRole }
  | { type: 'GOVERNANCE_DELETE_ROLE'; payload: string }
  | { type: 'GOVERNANCE_UPDATE_INTEGRATED_CHANGE'; payload: IntegratedChangeRequest }
  | { type: 'GOVERNANCE_UPDATE_GLOBAL_CHANGE_RULES'; payload: GlobalChangeRule[] }
  // UNCATEGORIZED - Legacy, to be refactored
  | { type: 'APPROVE_CHANGE_ORDER'; payload: { projectId: string; changeOrderId: string } }
  | { type: 'ADD_CHANGE_ORDER'; payload: ChangeOrder }
  | { type: 'ADD_PURCHASE_ORDER'; payload: PurchaseOrder }
  | { type: 'SUBMIT_TIMESHEET'; payload: Timesheet }
  | { type: 'ADD_QUALITY_STANDARD'; payload: QualityStandard }
  | { type: 'UPDATE_VENDOR'; payload: Vendor }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_PORTFOLIO_SCENARIO'; payload: PortfolioScenario };
