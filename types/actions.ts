
import { Project, Task, WBSNode, Baseline } from './project';
import { 
    Program, ProgramRisk, ProgramIssue, ProgramStakeholder, 
    ProgramCommunicationItem, ProgramBudgetAllocation, ProgramFundingGate, 
    ProgramStageGate, IntegratedChangeRequest, StrategicGoal, 
    StrategicDriver, ProgramDependency, GovernanceDecision, 
    TradeoffScenario, ProgramChangeRequest, Benefit,
    ProgramOutcome, ProgramQualityStandard, ProgramAssuranceReview,
    ProgramTransitionItem, ProgramArchitectureStandard, ProgramArchitectureReview,
    ProgramObjective
} from './program';
import { Resource, ResourceRequest, Timesheet, EnterpriseRole } from './resource';
import { Risk, Issue, IssueCode, PortfolioRisk } from './risk';
import { 
    BudgetLineItem, Expense, ChangeOrder, FundingSource, 
    ExpenseCategory, CostBookItem, Invoice, CostReport, 
    CostEstimate, ProjectFunding, BudgetLogItem 
} from './finance';
import { QualityStandard, DataJob, Integration, ActivityCode, WorkflowDefinition, EtlMapping, GlobalChangeRule } from './common';
import { QualityReport, NonConformanceReport } from './quality';
import { GlobalCalendar } from './calendar';
import { EPSNode, OBSNode, Location } from './structure';
import { ServiceStatus, SystemAlert, OrganizationProfile, SecurityPolicy, KnowledgeArticle, PipelineStage, SchedulingLogic } from './business';
import { DailyLogEntry, SafetyIncident, WorkLog, DelayLog, PunchItem } from './field';
import { KanbanTask, ActivityItem, TeamEvent } from './collaboration';
import { ReportDefinition } from './analytics';

export type Action =
    // Project & Schedule
    | { type: 'PROJECT_IMPORT'; payload: Project[] }
    | { type: 'PROJECT_UPDATE'; payload: { projectId: string; updatedData: Partial<Project> } }
    | { type: 'PROJECT_CLOSE'; payload: string }
    | { type: 'PROJECT_CREATE_REFLECTION'; payload: { sourceProjectId: string } }
    | { type: 'PROJECT_MERGE_REFLECTION'; payload: { reflectionId: string } }
    | { type: 'TASK_UPDATE'; payload: { projectId: string; task: Task | Task[] } }
    | { type: 'BASELINE_SET'; payload: { projectId: string; name: string; type: string } }
    | { type: 'BASELINE_UPDATE'; payload: { projectId: string; baselineId: string; name: string; type: string } }
    | { type: 'BASELINE_DELETE'; payload: { projectId: string; baselineId: string } }
    | { type: 'WBS_ADD_NODE'; payload: { projectId: string; parentId: string | null; newNode: WBSNode } }
    | { type: 'WBS_UPDATE_NODE'; payload: { projectId: string; nodeId: string; updatedData: Partial<WBSNode> } }
    | { type: 'WBS_REPARENT'; payload: { projectId: string; nodeId: string; newParentId: string | null } }
    
    // Program & Portfolio
    | { type: 'ADD_PROGRAM'; payload: Program }
    | { type: 'UPDATE_PROGRAM'; payload: Program }
    | { type: 'DELETE_PROGRAM'; payload: string }
    | { type: 'PROGRAM_ADD_OBJECTIVE'; payload: ProgramObjective }
    | { type: 'PROGRAM_UPDATE_OBJECTIVE'; payload: ProgramObjective }
    | { type: 'PROGRAM_DELETE_OBJECTIVE'; payload: string }
    | { type: 'PROGRAM_UPDATE_GATE'; payload: ProgramStageGate | ProgramFundingGate }
    | { type: 'ADD_STRATEGIC_DRIVER'; payload: StrategicDriver }
    | { type: 'GOVERNANCE_ADD_DECISION'; payload: GovernanceDecision }
    | { type: 'GOVERNANCE_UPDATE_DECISION'; payload: GovernanceDecision }
    | { type: 'GOVERNANCE_DELETE_DECISION'; payload: string }
    | { type: 'UPDATE_PORTFOLIO_SCENARIO'; payload: any }
    | { type: 'PROGRAM_UPDATE_ALLOCATION'; payload: ProgramBudgetAllocation }
    | { type: 'PROGRAM_ADD_STAKEHOLDER'; payload: ProgramStakeholder }
    | { type: 'PROGRAM_UPDATE_STAKEHOLDER'; payload: ProgramStakeholder }
    | { type: 'PROGRAM_DELETE_STAKEHOLDER'; payload: string }
    | { type: 'PROGRAM_ADD_COMM_ITEM'; payload: ProgramCommunicationItem }
    | { type: 'PROGRAM_UPDATE_COMM_ITEM'; payload: ProgramCommunicationItem }
    | { type: 'PROGRAM_DELETE_COMM_ITEM'; payload: string }
    | { type: 'ADD_PROGRAM_DEPENDENCY'; payload: ProgramDependency }
    | { type: 'DELETE_PROGRAM_DEPENDENCY'; payload: string }
    | { type: 'PROGRAM_ADD_RISK'; payload: ProgramRisk }
    | { type: 'PROGRAM_DELETE_RISK'; payload: string }
    | { type: 'PROGRAM_ADD_ISSUE'; payload: ProgramIssue }
    | { type: 'PROGRAM_UPDATE_ISSUE'; payload: ProgramIssue }
    | { type: 'PROGRAM_DELETE_ISSUE'; payload: string }
    | { type: 'PROGRAM_ADD_TRADEOFF'; payload: TradeoffScenario }
    | { type: 'PROGRAM_DELETE_TRADEOFF'; payload: string }
    | { type: 'ADD_PROGRAM_CHANGE_REQUEST'; payload: ProgramChangeRequest }
    | { type: 'UPDATE_PROGRAM_CHANGE_REQUEST'; payload: ProgramChangeRequest }
    | { type: 'DELETE_PROGRAM_CHANGE_REQUEST'; payload: string }
    | { type: 'GOVERNANCE_ADD_STRATEGIC_GOAL'; payload: StrategicGoal }
    | { type: 'GOVERNANCE_UPDATE_STRATEGIC_GOAL'; payload: StrategicGoal }
    | { type: 'GOVERNANCE_DELETE_STRATEGIC_GOAL'; payload: string }

    // Resources
    | { type: 'RESOURCE_ADD'; payload: Resource }
    | { type: 'RESOURCE_UPDATE'; payload: Resource }
    | { type: 'RESOURCE_DELETE'; payload: string }
    | { type: 'RESOURCE_REQUEST_ADD'; payload: ResourceRequest }
    | { type: 'RESOURCE_REQUEST_UPDATE'; payload: ResourceRequest }
    | { type: 'SUBMIT_TIMESHEET'; payload: Timesheet }
    | { type: 'ADD_TEAM_EVENT'; payload: TeamEvent }

    // Financials
    | { type: 'ADD_BUDGET_ITEM'; payload: BudgetLineItem }
    | { type: 'UPDATE_BUDGET_ITEM'; payload: BudgetLineItem }
    | { type: 'DELETE_BUDGET_ITEM'; payload: string }
    | { type: 'ADD_PROJECT_BUDGET_LOG'; payload: { projectId: string; logItem: BudgetLogItem } }
    | { type: 'TRANSFER_BUDGET'; payload: any }
    | { type: 'ADD_CHANGE_ORDER'; payload: ChangeOrder }
    | { type: 'UPDATE_CHANGE_ORDER'; payload: ChangeOrder }
    | { type: 'APPROVE_CHANGE_ORDER'; payload: { projectId: string; changeOrderId: string } }
    | { type: 'ADD_EXPENSE'; payload: Expense }
    | { type: 'UPDATE_EXPENSE'; payload: Expense }
    | { type: 'DELETE_EXPENSE'; payload: string }
    | { type: 'ADD_INVOICE'; payload: Invoice }
    | { type: 'UPDATE_INVOICE'; payload: Invoice }
    
    // Procurement
    | { type: 'ADD_VENDOR'; payload: Vendor }
    | { type: 'UPDATE_VENDOR'; payload: Vendor }
    | { type: 'DELETE_VENDOR'; payload: string }
    | { type: 'ADD_CONTRACT'; payload: Contract }
    | { type: 'UPDATE_CONTRACT'; payload: Contract }
    | { type: 'ADD_PURCHASE_ORDER'; payload: PurchaseOrder }
    | { type: 'UPDATE_PURCHASE_ORDER'; payload: PurchaseOrder }
    | { type: 'ADD_SOLICITATION'; payload: Solicitation }
    | { type: 'UPDATE_SOLICITATION'; payload: Solicitation }
    | { type: 'ADD_MATERIAL_RECEIPT'; payload: MaterialReceipt }
    | { type: 'ADD_PROCUREMENT_PLAN'; payload: ProcurementPlan }
    | { type: 'UPDATE_PROCUREMENT_PLAN'; payload: ProcurementPlan }
    | { type: 'ADD_SUPPLIER_REVIEW'; payload: SupplierPerformanceReview }

    // Risks & Issues
    | { type: 'ADD_RISK'; payload: Risk | PortfolioRisk }
    | { type: 'UPDATE_RISK'; payload: { risk: Risk } }
    | { type: 'DELETE_RISK'; payload: string }
    | { type: 'ADD_ISSUE'; payload: Issue }
    | { type: 'UPDATE_ISSUE'; payload: Issue }
    | { type: 'DELETE_ISSUE'; payload: string }
    | { type: 'PROJECT_UPDATE_RISK_PLAN'; payload: { projectId: string; plan: any } }
    | { type: 'UPDATE_RBS_NODE_PARENT'; payload: { nodeId: string; newParentId: string | null } }
    
    // Field & Quality
    | { type: 'FIELD_ADD_LOG'; payload: DailyLogEntry }
    | { type: 'FIELD_UPDATE_LOG'; payload: DailyLogEntry }
    | { type: 'FIELD_ADD_INCIDENT'; payload: SafetyIncident }
    | { type: 'FIELD_UPDATE_INCIDENT'; payload: SafetyIncident }
    | { type: 'FIELD_DELETE_INCIDENT'; payload: string }
    | { type: 'FIELD_ADD_PUNCH_ITEM'; payload: PunchItem }
    | { type: 'FIELD_UPDATE_PUNCH_ITEM'; payload: PunchItem }
    | { type: 'ADD_NCR'; payload: NonConformanceReport }
    | { type: 'UPDATE_NCR'; payload: NonConformanceReport }
    | { type: 'ADD_QUALITY_STANDARD'; payload: QualityStandard | ProgramQualityStandard }
    | { type: 'ADD_QUALITY_REPORT'; payload: QualityReport }
    | { type: 'UPDATE_QUALITY_REPORT'; payload: QualityReport }
    | { type: 'SYSTEM_LOG_SAFETY_INCIDENT'; payload: SafetyIncident }

    // Strategy & Roadmap
    | { type: 'ROADMAP_UPDATE_ITEM'; payload: RoadmapItem }
    | { type: 'KANBAN_MOVE_TASK'; payload: { taskId: string; status: string } }
    | { type: 'KANBAN_ADD_TASK'; payload: Partial<KanbanTask> }
    | { type: 'ADD_PORTFOLIO_COMM_ITEM'; payload: ProgramCommunicationItem }
    | { type: 'ADD_ACTIVITY'; payload: ActivityItem }
    | { type: 'ADD_BENEFIT'; payload: any }
    | { type: 'ADD_ARCH_STANDARD'; payload: ProgramArchitectureStandard }
    | { type: 'ADD_ARTICLE'; payload: KnowledgeArticle }
    | { type: 'UPDATE_ARTICLE'; payload: KnowledgeArticle }
    | { type: 'DELETE_ARTICLE'; payload: string }

    // System & Data
    | { type: 'SYSTEM_QUEUE_DATA_JOB'; payload: DataJob }
    | { type: 'SYSTEM_UPDATE_DATA_JOB'; payload: { jobId: string } & Partial<DataJob> }
    | { type: 'SYSTEM_ADD_INTEGRATION'; payload: Integration }
    | { type: 'SYSTEM_UPDATE_INTEGRATION'; payload: Integration }
    | { type: 'SYSTEM_TOGGLE_INTEGRATION'; payload: string }
    | { type: 'SYSTEM_SAVE_ETL_MAPPINGS'; payload: EtlMapping[] }
    | { type: 'SYSTEM_ADD_SERVICE'; payload: ServiceStatus }
    | { type: 'SYSTEM_INSTALL_EXTENSION'; payload: string }
    | { type: 'SYSTEM_ACTIVATE_EXTENSION'; payload: string }
    | { type: 'ADMIN_ADD_USER'; payload: any }
    | { type: 'ADMIN_UPDATE_USER'; payload: any }
    | { type: 'ADMIN_DELETE_USER'; payload: string }
    | { type: 'UPDATE_USER'; payload: any }
    | { type: 'MARK_ALERT_READ'; payload: string }
    | { type: 'RESET_SYSTEM' }
    | { type: 'LOAD_DEMO_PROJECT'; payload: 'construction' | 'software' | 'defense' }
    | { type: 'ADMIN_ADD_ACTIVITY_CODE'; payload: ActivityCode }
    | { type: 'ADMIN_UPDATE_ACTIVITY_CODE'; payload: ActivityCode }
    | { type: 'ADMIN_DELETE_ACTIVITY_CODE'; payload: string }
    | { type: 'ADMIN_ADD_UDF'; payload: UserDefinedField }
    | { type: 'ADMIN_UPDATE_UDF'; payload: UserDefinedField }
    | { type: 'ADMIN_DELETE_UDF'; payload: string }
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
    | { type: 'GOVERNANCE_UPDATE_NOTIFICATION_PREFERENCE'; payload: { id: string, field: string } }
    | { type: 'GOVERNANCE_ADD_NOTIFICATION_PREFERENCE'; payload: any }
    | { type: 'GOVERNANCE_UPDATE_SECURITY_POLICY'; payload: SecurityPolicy }
    | { type: 'GOVERNANCE_UPDATE_ORG_PROFILE'; payload: Partial<OrganizationProfile> }
    | { type: 'UPDATE_SYSTEM_SCHEDULING'; payload: SchedulingLogic }
    | { type: 'STAGING_INIT'; payload: { type: string, data: any[] } }
    | { type: 'STAGING_UPDATE_RECORD'; payload: { id: string, data: any } }
    | { type: 'STAGING_COMMIT_SELECTED'; payload: string[] }
    | { type: 'STAGING_CLEAR' }
    | { type: 'ADD_REPORT_DEF'; payload: ReportDefinition }
    | { type: 'DELETE_REPORT_DEF'; payload: string }
    | { type: 'UNIFIER_UPDATE_BP_RECORD'; payload: { record: any, action: string, user: any } }
    | { type: 'EXTENSION_UPDATE_FINANCIAL'; payload: any }
    | { type: 'EXTENSION_UPDATE_CONSTRUCTION'; payload: any }
    | { type: 'EXTENSION_UPDATE_GOVERNMENT'; payload: any }
    | { type: 'UPDATE_PIPELINE_STAGE'; payload: PipelineStage }
    | { type: 'UPLOAD_DOCUMENT'; payload: any }
    | { type: 'DELETE_DOCUMENT'; payload: any }
    | { type: 'VERSION_DOCUMENT'; payload: any }
    | { type: 'ADD_STAKEHOLDER'; payload: any };
