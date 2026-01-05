
// Action Types
import { Project } from './project';
// FIX: Corrected imports for various types from their respective domain files.
import { Program, Benefit, PortfolioScenario, StrategicDriver, StrategicGoal, GovernanceDecision, ESGMetric, ProgramObjective, ProgramOutcome, ProgramDependency, ProgramChangeRequest, ProgramRisk, ProgramIssue, ProgramStakeholder, ProgramCommunicationItem } from './program';
import { Resource, ResourceRequest, Timesheet, EnterpriseRole, EnterpriseSkill } from './resource';
import { Risk, Issue, RiskBreakdownStructureNode, IssueCode, PortfolioRisk } from './risk';
import { BudgetLineItem, Expense, ChangeOrder, FundingSource, ExpenseCategory, CostBookItem, Invoice, CostReport, CostEstimate, ProjectFunding } from './finance';
import { QualityReport, NonConformanceReport } from './quality';
import { CommunicationLog, Stakeholder } from './project_subtypes';
import { Document, ActivityCode, UserDefinedField, Integration, Extension, StandardTemplate, DataJob, WorkflowDefinition, EtlMapping, QualityStandard } from './common';
import { GlobalCalendar } from './calendar';
import { EPSNode, OBSNode, Location } from './structure';
import { User } from './auth';
import { GovernanceState, GlobalChangeRule, ServiceStatus, SystemMetric, PipelineStage, KnowledgeArticle } from './business';
import { Contract, Solicitation, ProcurementPlan, ProcurementPackage, SupplierPerformanceReview, ProcurementClaim, MakeOrBuyAnalysis, Vendor, PurchaseOrder, MaterialReceipt } from './procurement';
import { UnifierState } from './unifier';
import { ExtensionDataState } from './extensions';
import { DailyLogEntry, SafetyIncident, PunchItem } from './field';
import { RoadmapLane, RoadmapItem } from './strategy';
import { KanbanTask, TeamEvent, ActivityItem } from './collaboration';


export interface StagingRecord {
  id: string;
  data: any;
  status: 'Valid' | 'Error';
  errors: string[];
  selected: boolean;
}

export interface DataState {
  projects: Project[];
  programs: Program[];
  resources: Resource[];
  resourceRequests: ResourceRequest[];
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
  qualityStandards: QualityStandard[];
  unifier: UnifierState;
  dailyLogs: DailyLogEntry[];
  safetyIncidents: SafetyIncident[];
  punchList: PunchItem[];
  roadmapLanes: RoadmapLane[];
  roadmapItems: RoadmapItem[];
  kanbanTasks: KanbanTask[];
  // FIX: Corrected typo from PortfolioCommunicationItem to ProgramCommunicationItem
  portfolioCommunicationPlan: ProgramCommunicationItem[];
  materialReceipts: MaterialReceipt[];
  activities: ActivityItem[];
  teamEvents: TeamEvent[];
  pipelineStages: PipelineStage[];
  knowledgeBase: KnowledgeArticle[];
  etlMappings: EtlMapping[];
  costReports: CostReport[];
  costMeetings: any[]; // Define CostMeeting type if needed
  costAlerts: any[]; // Define CostAlert type if needed
  systemMonitoring: {
    metrics: SystemMetric[];
    services: ServiceStatus[];
    throughput: { time: string; records: number }[];
  };
  staging: {
    activeImportId: string | null;
    entityType: string;
    records: StagingRecord[];
    isProcessing: boolean;
    summary: { total: number; valid: number; error: number };
  };
  extensionData: ExtensionDataState;
}

export type Action =
    // Project
    | { type: 'PROJECT_IMPORT'; payload: any[] }
    | { type: 'PROJECT_UPDATE'; payload: { projectId: string; updatedData: any } }
    | { type: 'TASK_UPDATE'; payload: { projectId: string; task: any } }
    | { type: 'PROJECT_CLOSE'; payload: string }
    | { type: 'COST_ESTIMATE_ADD_OR_UPDATE'; payload: { projectId: string; estimate: any } }
    | { type: 'ADD_PROJECT_FUNDING'; payload: { projectId: string; funding: any } }
    | { type: 'ADD_PROJECT_BUDGET_LOG'; payload: { projectId: string; logItem: any } }
    | { type: 'PROJECT_CREATE_REFLECTION'; payload: { sourceProjectId: string } }
    | { type: 'PROJECT_MERGE_REFLECTION'; payload: { reflectionId: string } }
    | { type: 'BASELINE_SET'; payload: { projectId: string; name: string; type: any } }
    | { type: 'BASELINE_UPDATE'; payload: { projectId: string; baselineId: string; name: string; type: any } }
    | { type: 'BASELINE_DELETE'; payload: { projectId: string; baselineId: string } }
    | { type: 'WBS_ADD_NODE'; payload: { projectId: string; parentId: string | null; newNode: any } }
    | { type: 'WBS_UPDATE_NODE'; payload: { projectId: string; nodeId: string; updatedData: any } }
    | { type: 'WBS_REPARENT'; payload: { projectId: string; nodeId: string; newParentId: string | null } }
    | { type: 'WBS_UPDATE_SHAPE'; payload: { projectId: string; nodeId: string; shape: any } }

    // Program
    | { type: 'ADD_PROGRAM'; payload: any }
    | { type: 'UPDATE_PROGRAM'; payload: any }
    | { type: 'PROGRAM_ADD_STAKEHOLDER'; payload: any }
    | { type: 'PROGRAM_UPDATE_STAKEHOLDER'; payload: any }
    | { type: 'PROGRAM_DELETE_STAKEHOLDER'; payload: string }
    | { type: 'PROGRAM_ADD_COMM_ITEM'; payload: any }
    | { type: 'PROGRAM_UPDATE_COMM_ITEM'; payload: any }
    | { type: 'PROGRAM_DELETE_COMM_ITEM'; payload: string }
    | { type: 'PROGRAM_UPDATE_ALLOCATION'; payload: any }
    | { type: 'PROGRAM_UPDATE_GATE'; payload: any }
    | { type: 'PROGRAM_ADD_OBJECTIVE'; payload: any }
    | { type: 'PROGRAM_UPDATE_OBJECTIVE'; payload: any }
    | { type: 'PROGRAM_DELETE_OBJECTIVE'; payload: string }
    | { type: 'PROGRAM_ADD_RISK'; payload: any }
    | { type: 'PROGRAM_DELETE_RISK'; payload: string }
    | { type: 'PROGRAM_ADD_ISSUE'; payload: any }
    | { type: 'PROGRAM_UPDATE_ISSUE'; payload: any }
    | { type: 'PROGRAM_DELETE_ISSUE'; payload: string }

    // Admin & System
    | { type: 'ADMIN_ADD_LOCATION'; payload: any }
    | { type: 'ADMIN_UPDATE_LOCATION'; payload: any }
    | { type: 'ADMIN_DELETE_LOCATION'; payload: string }
    | { type: 'ADMIN_ADD_ACTIVITY_CODE'; payload: any }
    | { type: 'ADMIN_UPDATE_ACTIVITY_CODE'; payload: any }
    | { type: 'ADMIN_DELETE_ACTIVITY_CODE'; payload: string }
    | { type: 'ADMIN_ADD_UDF'; payload: any }
    | { type: 'ADMIN_UPDATE_UDF'; payload: any }
    | { type: 'ADMIN_DELETE_UDF'; payload: string }
    | { type: 'ADMIN_ADD_USER'; payload: any }
    | { type: 'ADMIN_UPDATE_USER'; payload: any }
    | { type: 'ADMIN_DELETE_USER'; payload: string }
    | { type: 'RESOURCE_ADD'; payload: any }
    | { type: 'RESOURCE_UPDATE'; payload: any }
    | { type: 'RESOURCE_DELETE'; payload: string }
    | { type: 'RESOURCE_REQUEST_ADD'; payload: any }
    | { type: 'RESOURCE_REQUEST_UPDATE'; payload: any }
    | { type: 'ADMIN_ADD_FUNDING_SOURCE'; payload: any }
    | { type: 'ADMIN_UPDATE_FUNDING_SOURCE'; payload: any }
    | { type: 'ADMIN_DELETE_FUNDING_SOURCE'; payload: string }
    | { type: 'ADMIN_ADD_CALENDAR'; payload: any }
    | { type: 'ADMIN_UPDATE_CALENDAR'; payload: any }
    | { type: 'ADMIN_DELETE_CALENDAR'; payload: string }
    | { type: 'ADMIN_ADD_ISSUE_CODE'; payload: any }
    | { type: 'ADMIN_UPDATE_ISSUE_CODE'; payload: any }
    | { type: 'ADMIN_DELETE_ISSUE_CODE'; payload: string }
    | { type: 'ADMIN_ADD_EXPENSE_CATEGORY'; payload: any }
    | { type: 'ADMIN_UPDATE_EXPENSE_CATEGORY'; payload: any }
    | { type: 'ADMIN_DELETE_EXPENSE_CATEGORY'; payload: string }
    | { type: 'ADMIN_ADD_EPS_NODE'; payload: any }
    | { type: 'ADMIN_UPDATE_EPS_NODE'; payload: any }
    | { type: 'ADMIN_DELETE_EPS_NODE'; payload: string }
    | { type: 'ADMIN_ADD_OBS_NODE'; payload: any }
    | { type: 'ADMIN_UPDATE_OBS_NODE'; payload: any }
    | { type: 'ADMIN_DELETE_OBS_NODE'; payload: string }
    | { type: 'ADMIN_ADD_WORKFLOW'; payload: any }
    | { type: 'ADMIN_UPDATE_WORKFLOW'; payload: any }
    | { type: 'ADMIN_DELETE_WORKFLOW'; payload: string }
    | { type: 'ADMIN_ADD_ROLE'; payload: any }
    | { type: 'ADMIN_UPDATE_ROLE'; payload: any }
    
    // System Ops
    | { type: 'SYSTEM_QUEUE_DATA_JOB'; payload: any }
    | { type: 'SYSTEM_UPDATE_DATA_JOB'; payload: any }
    | { type: 'SYSTEM_TOGGLE_INTEGRATION'; payload: string }
    | { type: 'SYSTEM_INSTALL_EXTENSION'; payload: string }
    | { type: 'SYSTEM_ACTIVATE_EXTENSION'; payload: string }
    | { type: 'SYSTEM_SAVE_ETL_MAPPINGS'; payload: any[] }
    | { type: 'SYSTEM_ADD_INTEGRATION'; payload: any }
    | { type: 'SYSTEM_UPDATE_INTEGRATION'; payload: any }
    | { type: 'SYSTEM_ADD_SERVICE'; payload: ServiceStatus }
    | { type: 'MARK_ALERT_READ'; payload: string }
    | { type: 'UPDATE_SYSTEM_SCHEDULING'; payload: any }
    | { type: 'GOVERNANCE_UPDATE_SECURITY_POLICY'; payload: any }
    | { type: 'GOVERNANCE_UPDATE_CURRENCY'; payload: any }
    | { type: 'GOVERNANCE_ADD_CURRENCY'; payload: any }
    | { type: 'GOVERNANCE_DELETE_CURRENCY'; payload: string }
    | { type: 'GOVERNANCE_UPDATE_INFLATION_RATE'; payload: number }
    | { type: 'GOVERNANCE_UPDATE_ORG_PROFILE'; payload: any }
    | { type: 'GOVERNANCE_UPDATE_NOTIFICATION_PREFERENCE'; payload: any }
    | { type: 'GOVERNANCE_UPDATE_GLOBAL_CHANGE_RULES'; payload: any }
    | { type: 'GOVERNANCE_SYNC_PARAMETERS', payload: any }
    | { type: 'SYSTEM_LOG_SAFETY_INCIDENT'; payload: any } 
    | { type: 'RESET_SYSTEM' }

    // Unifier
    | { type: 'UNIFIER_UPDATE_BP_RECORD'; payload: { record: any; action: string; user: any } }

    // Procurement
    | { type: 'ADD_VENDOR'; payload: any }
    | { type: 'UPDATE_VENDOR'; payload: any }
    | { type: 'DELETE_VENDOR'; payload: string }
    | { type: 'ADD_CONTRACT'; payload: any }
    | { type: 'UPDATE_CONTRACT'; payload: any }
    | { type: 'ADD_PURCHASE_ORDER'; payload: any }
    | { type: 'UPDATE_PURCHASE_ORDER'; payload: any }
    | { type: 'ADD_SOLICITATION'; payload: any }
    | { type: 'UPDATE_SOLICITATION'; payload: any }
    | { type: 'ADD_MATERIAL_RECEIPT'; payload: any }
    | { type: 'ADD_PROCUREMENT_PLAN'; payload: any }
    | { type: 'UPDATE_PROCUREMENT_PLAN'; payload: any }

    // Quality
    | { type: 'ADD_QUALITY_REPORT'; payload: any }
    | { type: 'UPDATE_QUALITY_REPORT'; payload: any }
    | { type: 'ADD_NCR'; payload: any }
    | { type: 'UPDATE_NCR'; payload: any }
    | { type: 'ADD_QUALITY_STANDARD'; payload: any }

    // Documents
    | { type: 'UPLOAD_DOCUMENT'; payload: any }
    | { type: 'DELETE_DOCUMENT'; payload: string }
    | { type: 'VERSION_DOCUMENT'; payload: { documentId: string; version: string } }

    // Risk
    | { type: 'ADD_RISK'; payload: any }
    | { type: 'UPDATE_RISK'; payload: { risk: any } }
    | { type: 'DELETE_RISK'; payload: string }
    | { type: 'ADD_ISSUE'; payload: any }
    | { type: 'UPDATE_ISSUE'; payload: any }
    | { type: 'DELETE_ISSUE'; payload: string }
    | { type: 'PROJECT_UPDATE_RISK_PLAN'; payload: { projectId: string; plan: any } }
    | { type: 'UPDATE_RBS_NODE_PARENT'; payload: { nodeId: string; newParentId: string | null } }

    // Financial
    | { type: 'ADD_BUDGET_ITEM'; payload: any }
    | { type: 'UPDATE_BUDGET_ITEM'; payload: any }
    | { type: 'DELETE_BUDGET_ITEM'; payload: string }
    | { type: 'ADD_EXPENSE'; payload: any }
    | { type: 'UPDATE_EXPENSE'; payload: any }
    | { type: 'DELETE_EXPENSE'; payload: string }
    | { type: 'ADD_INVOICE'; payload: any }
    | { type: 'UPDATE_INVOICE'; payload: any }
    | { type: 'ADD_CHANGE_ORDER'; payload: any }
    | { type: 'UPDATE_CHANGE_ORDER'; payload: any }
    | { type: 'APPROVE_CHANGE_ORDER'; payload: { projectId: string; changeOrderId: string } }
    | { type: 'TRANSFER_BUDGET'; payload: any }

    // Field
    | { type: 'FIELD_ADD_LOG'; payload: any }
    | { type: 'FIELD_UPDATE_LOG'; payload: any }
    | { type: 'FIELD_ADD_INCIDENT'; payload: any }
    | { type: 'FIELD_UPDATE_INCIDENT'; payload: any }
    | { type: 'FIELD_ADD_PUNCH_ITEM'; payload: any }
    | { type: 'FIELD_UPDATE_PUNCH_ITEM'; payload: any }

    // Strategy
    | { type: 'ROADMAP_UPDATE_ITEM'; payload: any }
    | { type: 'KANBAN_MOVE_TASK'; payload: { taskId: string; status: string } }
    | { type: 'KANBAN_ADD_TASK'; payload: any }
    | { type: 'ADD_PORTFOLIO_COMM_ITEM'; payload: any }
    | { type: 'ADD_ACTIVITY'; payload: any }
    | { type: 'ADD_TEAM_EVENT'; payload: any }
    | { type: 'UPDATE_PORTFOLIO_SCENARIO'; payload: any }
    | { type: 'GOVERNANCE_DELETE_STRATEGIC_GOAL'; payload: string }
    | { type: 'GOVERNANCE_ADD_STRATEGIC_GOAL'; payload: any }
    | { type: 'GOVERNANCE_UPDATE_STRATEGIC_GOAL'; payload: any }
    | { type: 'GOVERNANCE_UPDATE_INTEGRATED_CHANGE'; payload: any }
    | { type: 'UPDATE_USER'; payload: any }
    | { type: 'SUBMIT_TIMESHEET'; payload: any }

    // Extension
    | { type: 'EXTENSION_UPDATE_FINANCIAL'; payload: any }
    | { type: 'EXTENSION_UPDATE_CONSTRUCTION'; payload: any }
    | { type: 'EXTENSION_UPDATE_GOVERNMENT'; payload: any }
    | { type: 'UPDATE_PIPELINE_STAGE'; payload: any }

    // Staging
    | { type: 'STAGING_INIT'; payload: { type: string; data: any[] } }
    | { type: 'STAGING_UPDATE_RECORD'; payload: { id: string; data: any } }
    | { type: 'STAGING_COMMIT_SELECTED'; payload: string[] }
    | { type: 'STAGING_CLEAR' }
;