
import { Project } from './project';
import { 
    Program, Benefit, PortfolioScenario, StrategicDriver, StrategicGoal, 
    GovernanceDecision, ESGMetric, ProgramObjective, ProgramOutcome, 
    ProgramDependency, ProgramChangeRequest, ProgramRisk, ProgramIssue, 
    ProgramStakeholder, ProgramCommunicationItem, ProgramBudgetAllocation, 
    ProgramFundingGate, ProgramStageGate, ProgramTransitionItem, 
    IntegratedChangeRequest, GovernanceRole, GovernanceEvent, 
    ProgramQualityStandard, ProgramAssuranceReview, ProgramArchitectureStandard, 
    ProgramArchitectureReview, TradeoffScenario 
} from './program';
import { Resource, ResourceRequest, Timesheet, EnterpriseRole, EnterpriseSkill } from './resource';
import { Risk, Issue, RiskBreakdownStructureNode, IssueCode, PortfolioRisk } from './risk';
import { BudgetLineItem, Expense, ChangeOrder, FundingSource, ExpenseCategory, CostBookItem, Invoice, CostReport, CostEstimate, ProjectFunding } from './finance';
import { QualityReport, NonConformanceReport } from './quality';
import { Stakeholder } from './project_subtypes';
import { Document, ActivityCode, UserDefinedField, Integration, Extension, StandardTemplate, DataJob, WorkflowDefinition, EtlMapping, QualityStandard, GlobalChangeRule } from './common';
import { GlobalCalendar } from './calendar';
import { EPSNode, OBSNode, Location } from './structure';
import { User } from './auth';
import { GovernanceState, ServiceStatus, SystemMetric, PipelineStage, KnowledgeArticle } from './business';
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
  communicationLogs: any[];
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
  portfolioCommunicationPlan: ProgramCommunicationItem[];
  materialReceipts: MaterialReceipt[];
  activities: ActivityItem[];
  teamEvents: TeamEvent[];
  pipelineStages: PipelineStage[];
  knowledgeBase: KnowledgeArticle[];
  etlMappings: EtlMapping[];
  costReports: CostReport[];
  costMeetings: any[];
  costAlerts: any[];
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
