
import {
    Project, Program, Resource, Risk, Issue, BudgetLineItem, Expense,
    ChangeOrder, PurchaseOrder, QualityReport, NonConformanceReport,
    CommunicationLog, Stakeholder, Document, ActivityCode, UserDefinedField,
    FundingSource, GlobalCalendar, User, EnterpriseRole, EPSNode, OBSNode,
    Location, WorkflowDefinition, DataJob, Integration, Extension,
    ExpenseCategory, IssueCode, CostBookItem, StandardTemplate,
    GovernanceState, StrategicGoal, StrategicDriver, PortfolioScenario,
    GovernanceDecision, ESGMetric, PortfolioRisk, ProgramObjective,
    ProgramOutcome, ProgramDependency, ProgramChangeRequest, ProgramRisk,
    ProgramIssue, ProgramStakeholder, ProgramCommunicationItem,
    ProgramBudgetAllocation, ProgramFundingGate, ProgramStageGate,
    ProgramTransitionItem, IntegratedChangeRequest, GovernanceRole,
    GovernanceEvent, ProgramQualityStandard, ProgramAssuranceReview,
    ProgramArchitectureStandard, ProgramArchitectureReview, TradeoffScenario,
    Contract, Solicitation, ProcurementPlan, ProcurementPackage,
    SupplierPerformanceReview, ProcurementClaim, MakeOrBuyAnalysis,
    GlobalChangeRule, Invoice, Timesheet, EnterpriseSkill, Benefit,
    RiskBreakdownStructureNode, WorkflowStep, Vendor, Baseline
} from './index';

import { BPDefinition, BPRecord, CostSheetColumn, CostSheetRow } from './unifier';

export interface UnifierState {
    definitions: BPDefinition[];
    records: BPRecord[];
    costSheet: {
        columns: CostSheetColumn[];
        rows: CostSheetRow[];
    };
}

export interface DataState {
    projects: Project[];
    programs: Program[];
    resources: Resource[];
    risks: Risk[];
    issues: Issue[];
    budgetItems: BudgetLineItem[];
    expenses: Expense[];
    changeOrders: ChangeOrder[];
    purchaseOrders: PurchaseOrder[];
    qualityReports: QualityReport[];
    nonConformanceReports: NonConformanceReport[];
    communicationLogs: CommunicationLog[];
    stakeholders: Stakeholder[];
    documents: Document[];
    activityCodes: ActivityCode[];
    userDefinedFields: UserDefinedField[];
    fundingSources: FundingSource[];
    calendars: GlobalCalendar[];
    users: User[];
    roles: EnterpriseRole[];
    eps: EPSNode[];
    obs: OBSNode[];
    locations: Location[];
    workflows: WorkflowDefinition[];
    dataJobs: DataJob[];
    integrations: Integration[];
    extensions: Extension[];
    expenseCategories: ExpenseCategory[];
    issueCodes: IssueCode[];
    costBook: CostBookItem[];
    standardTemplates: StandardTemplate[];
    governance: GovernanceState;
    strategicGoals: StrategicGoal[];
    strategicDrivers: StrategicDriver[];
    portfolioScenarios: PortfolioScenario[];
    governanceDecisions: GovernanceDecision[];
    esgMetrics: ESGMetric[];
    portfolioRisks: PortfolioRisk[];
    programObjectives: ProgramObjective[];
    programOutcomes: ProgramOutcome[];
    programDependencies: ProgramDependency[];
    programChangeRequests: ProgramChangeRequest[];
    programRisks: ProgramRisk[];
    programIssues: ProgramIssue[];
    programStakeholders: ProgramStakeholder[];
    programCommunicationPlan: ProgramCommunicationItem[];
    programAllocations: ProgramBudgetAllocation[];
    programFundingGates: ProgramFundingGate[];
    programStageGates: ProgramStageGate[];
    programTransitionItems: ProgramTransitionItem[];
    integratedChanges: IntegratedChangeRequest[];
    governanceRoles: GovernanceRole[];
    governanceEvents: GovernanceEvent[];
    programQualityStandards: ProgramQualityStandard[];
    programAssuranceReviews: ProgramAssuranceReview[];
    programArchitectureStandards: ProgramArchitectureStandard[];
    programArchitectureReviews: ProgramArchitectureReview[];
    tradeoffScenarios: TradeoffScenario[];
    contracts: Contract[];
    solicitations: Solicitation[];
    procurementPlans: ProcurementPlan[];
    procurementPackages: ProcurementPackage[];
    supplierReviews: SupplierPerformanceReview[];
    claims: ProcurementClaim[];
    makeOrBuyAnalysis: MakeOrBuyAnalysis[];
    globalChangeRules: GlobalChangeRule[];
    invoices: Invoice[];
    timesheets: Timesheet[];
    skills: EnterpriseSkill[];
    benefits: Benefit[];
    rbs: RiskBreakdownStructureNode[];
    vendors: Vendor[];
    unifier: UnifierState;
}

export type Action =
    | { type: 'PROJECT_IMPORT'; payload: Project[] }
    | { type: 'PROJECT_UPDATE'; payload: { projectId: string; updatedData: Partial<Project> } }
    | { type: 'TASK_UPDATE'; payload: { projectId: string; task: any } }
    | { type: 'PROJECT_CLOSE'; payload: string }
    | { type: 'COST_ESTIMATE_ADD_OR_UPDATE'; payload: { projectId: string; estimate: any } }
    | { type: 'PROJECT_CREATE_REFLECTION'; payload: { sourceProjectId: string } }
    | { type: 'PROJECT_MERGE_REFLECTION'; payload: { reflectionId: string } }
    | { type: 'BASELINE_SET'; payload: { projectId: string; name: string; type?: Baseline['type'] } }
    | { type: 'BASELINE_UPDATE'; payload: { projectId: string; baselineId: string; name: string; type: Baseline['type'] } }
    | { type: 'BASELINE_DELETE'; payload: { projectId: string; baselineId: string } }
    | { type: 'WBS_ADD_NODE'; payload: { projectId: string; parentId: string | null; newNode: any } }
    | { type: 'WBS_UPDATE_NODE'; payload: { projectId: string; nodeId: string; updatedData: any } }
    | { type: 'WBS_REPARENT'; payload: { projectId: string; nodeId: string; newParentId: string | null } }
    | { type: 'WBS_UPDATE_SHAPE'; payload: { projectId: string; nodeId: string; shape: string } }
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
    | { type: 'SYSTEM_QUEUE_DATA_JOB'; payload: DataJob }
    | { type: 'SYSTEM_UPDATE_DATA_JOB'; payload: Partial<DataJob> & { jobId: string } }
    | { type: 'SYSTEM_TOGGLE_INTEGRATION'; payload: string }
    | { type: 'SYSTEM_INSTALL_EXTENSION'; payload: string }
    | { type: 'SYSTEM_ACTIVATE_EXTENSION'; payload: string }
    | { type: 'GOVERNANCE_UPDATE_CURRENCY'; payload: { code: string; rate: number } }
    | { type: 'GOVERNANCE_ADD_CURRENCY'; payload: { code: string; rate: number } }
    | { type: 'GOVERNANCE_DELETE_CURRENCY'; payload: string }
    | { type: 'GOVERNANCE_UPDATE_SECURITY_POLICY'; payload: any }
    | { type: 'GOVERNANCE_UPDATE_INFLATION_RATE'; payload: number }
    | { type: 'GOVERNANCE_UPDATE_SYSTEM_SCHEDULING'; payload: any }
    | { type: 'GOVERNANCE_MARK_ALERT_READ'; payload: string }
    | { type: 'GOVERNANCE_UPDATE_NOTIFICATION_PREFERENCE'; payload: any }
    | { type: 'GOVERNANCE_ADD_STRATEGIC_GOAL'; payload: StrategicGoal }
    | { type: 'GOVERNANCE_UPDATE_STRATEGIC_GOAL'; payload: StrategicGoal }
    | { type: 'GOVERNANCE_DELETE_STRATEGIC_GOAL'; payload: string }
    | { type: 'GOVERNANCE_ADD_ROLE'; payload: GovernanceRole }
    | { type: 'GOVERNANCE_DELETE_ROLE'; payload: string }
    | { type: 'GOVERNANCE_UPDATE_INTEGRATED_CHANGE'; payload: IntegratedChangeRequest }
    | { type: 'GOVERNANCE_UPDATE_GLOBAL_CHANGE_RULES'; payload: GlobalChangeRule[] }
    | { type: 'ADD_INVOICE'; payload: Invoice }
    | { type: 'UNIFIER_UPDATE_BP_RECORD'; payload: { record: BPRecord; action: string; user: any } }
    | { type: 'UNIFIER_UPDATE_COST_SHEET'; payload: { projectId: string; costCode: string; columnId: string; amount: number; operator: string } }
    | { type: 'UPDATE_RISK'; payload: { risk: Risk } }
    | { type: 'ADD_RISK'; payload: Risk }
    | { type: 'DELETE_USER'; payload: string }
    | { type: 'UPDATE_USER'; payload: User }
    | { type: 'ADD_USER'; payload: User }
    | { type: 'DELETE_ISSUE_CODE'; payload: string }
    | { type: 'UPDATE_ISSUE_CODE'; payload: IssueCode }
    | { type: 'ADD_ISSUE_CODE'; payload: IssueCode }
    | { type: 'DELETE_UDF'; payload: string }
    | { type: 'UPDATE_UDF'; payload: UserDefinedField }
    | { type: 'ADD_UDF'; payload: UserDefinedField }
    | { type: 'DELETE_LOCATION'; payload: string }
    | { type: 'UPDATE_LOCATION'; payload: Location }
    | { type: 'ADD_LOCATION'; payload: Location }
    | { type: 'UPDATE_WORKFLOW'; payload: WorkflowDefinition }
    | { type: 'ADD_WORKFLOW'; payload: WorkflowDefinition }
    | { type: 'DELETE_WORKFLOW'; payload: string }
    | { type: 'APPROVE_CHANGE_ORDER'; payload: { projectId: string; changeOrderId: string } }
    | { type: 'SUBMIT_TIMESHEET'; payload: any }
    | { type: 'SYSTEM_LOG_SAFETY_INCIDENT'; payload: any }
    | { type: 'UPDATE_VENDOR'; payload: any }
    | { type: 'UPDATE_SECURITY_POLICY'; payload: any }
    | { type: 'UPDATE_INFLATION_RATE'; payload: any }
    | { type: 'UPDATE_NOTIFICATION_PREFERENCE'; payload: any }
    | { type: 'UPDATE_GLOBAL_CHANGE_RULES'; payload: any }
    | { type: 'PROJECT_UPDATE_RISK_PLAN'; payload: any }
    | { type: 'UPDATE_RBS_NODE_PARENT'; payload: any }
    | { type: 'MARK_ALERT_READ'; payload: string };
