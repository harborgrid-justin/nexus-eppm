
export type Industry = 'Standard' | 'Construction' | 'Software';

export enum TaskStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  DELAYED = "Delayed"
}

export type DependencyType = 'FS' | 'SS' | 'FF' | 'SF';

export interface Dependency {
  targetId: string;
  type: DependencyType;
  lag: number; // in days
  comment?: string;
}

export type TaskType = 'Task' | 'Milestone' | 'Summary';

export type ConstraintType = 
  | 'Start On'
  | 'Start On or Before'
  | 'Start On or After'
  | 'Finish On'
  | 'Finish On or Before'
  | 'Finish On or After'
  | 'As Late As Possible'
  | 'Mandatory Start'
  | 'Mandatory Finish';

export interface TaskConstraint {
  type: ConstraintType;
  date: string;
}

export type EffortType = 'Fixed Duration' | 'Fixed Work' | 'Fixed Units';

export interface ResourceRequirement {
  roleId?: string;
  skillId?: string;
  quantity: number; // How many are needed
}

export interface ResourceAssignment {
  resourceId: string;
  units: number; // % allocation, e.g., 100 for full-time
}

export interface ThreePointEstimate {
  optimistic: number; // hours
  pessimistic: number; // hours
  mostLikely: number; // hours
}

export interface AcceptanceCriterion {
  id: string;
  description: string;
  isAccepted: boolean;
  acceptedBy?: string;
  date?: string;
}

// --- ACTIVITY CODE TYPES ---
export type ActivityCodeScope = 'Global' | 'EPS' | 'Project';

export interface ActivityCodeValue {
  id: string;
  value: string;
  description?: string;
  color?: string;
}

export interface ActivityCode {
  id: string;
  name: string;
  scope: ActivityCodeScope;
  projectId?: string; // Only for 'Project' scope
  values: ActivityCodeValue[];
}

// --- USER DEFINED FIELDS (UDFs) ---
export type UDFSubjectArea = 'Projects' | 'Tasks' | 'Resources' | 'Risks';
export type UDFDataType = 'Text' | 'Number' | 'Date' | 'List';

export interface UserDefinedField {
  id: string;
  subjectArea: UDFSubjectArea;
  title: string;
  dataType: UDFDataType;
  listValues?: string[]; // Only for 'List' dataType
}

// --- AUDIT TRAIL ---
export interface AuditEntry {
  timestamp: string;
  user: string;
  field: string;
  oldValue: string;
  newValue: string;
}


export interface Task {
  id: string;
  wbsCode: string;
  name:string;
  startDate: string; // ISO Date
  endDate: string; // ISO Date
  duration: number; // Working days
  status: TaskStatus;
  progress: number; // 0-100
  dependencies: Dependency[];
  critical: boolean; // This will now be calculated
  description?: string;
  
  // --- INTEGRATION FIELDS ---
  riskIds?: string[];
  issueIds?: string[];
  documentIds?: string[];
  // --- END INTEGRATION FIELDS ---

  expenseIds?: string[];
  activityCodeAssignments?: Record<string, string>; // { [activityCodeId]: activityCodeValueId }
  udfValues?: Record<string, any>; // { [udfId]: value }
  auditTrail?: AuditEntry[];
  
  // Advanced Scheduling & Resource Fields
  type: TaskType;
  primaryConstraint?: TaskConstraint;
  secondaryConstraint?: TaskConstraint;
  baselineStartDate?: string;
  baselineEndDate?: string;
  work?: number; // in hours
  cost?: number; // calculated or fixed
  effortType: EffortType;
  resourceRequirements: ResourceRequirement[];
  assignments: ResourceAssignment[];
  estimation?: ThreePointEstimate;
  acceptanceCriteria?: AcceptanceCriterion[];
}

export interface CostRate {
  id: string;
  rate: number;
  overtimeRate: number;
  effectiveDate: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  code: string;
}

export interface ResourceSkill {
  skillId: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Expert';
}

export interface ResourceCalendar {
  id: string;
  name: string;
  workingDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  exceptions: { date: string; isWorking: boolean; hours?: number }[]; // For holidays, PTO, etc.
}

export interface Resource {
  id: string;
  name: string;
  role: string;
  type: 'Human' | 'Equipment' | 'Material';
  status: 'Active' | 'Inactive';
  capacity: number; // Hours per week
  allocated: number; // Current allocation
  avatar?: string;
  skills: ResourceSkill[];
  hourlyRate?: number; // Kept for simple cases
  costRates: CostRate[];
  calendarId: string;
}

// --- RISK MANAGEMENT TYPES ---

export interface RiskManagementPlan {
  id: string;
  projectId: string;
  objectives: string;
  scope: string;
  approach: string;
  riskCategories: { id: string, name: string }[];
  probabilityImpactScale: {
    levels: { label: string; value: number; description: string }[];
  };
  thresholds: {
    low: number;
    medium: number;
    high: number;
  };
  version: number;
  status: 'Draft' | 'In Review' | 'Approved';
}

export interface RiskBreakdownStructureNode {
  id: string;
  code: string;
  name: string;
  children: RiskBreakdownStructureNode[];
  shape?: 'rectangle' | 'oval' | 'hexagon';
  links?: { targetId: string; type: 'dependency' | 'related' }[];
}

export interface RiskResponseAction {
  id: string;
  description: string;
  ownerId: string; // resourceId
  dueDate: string;
  status: 'Planned' | 'In Progress' | 'Complete';
}

export interface Risk {
  id: string;
  projectId: string;
  description: string;
  category: string; 
  probability: 'Low' | 'Medium' | 'High'; 
  impact: 'Low' | 'Medium' | 'High'; 
  probabilityValue: number; // 1-5 scale
  impactValue: number; // 1-5 scale
  score: number; // Calculated
  status: 'Open' | 'Mitigated' | 'Closed' | 'Realized';
  owner: string; 
  
  causes?: string;
  effects?: string;
  trigger?: string;
  rbsNodeId?: string; 
  responseStrategy?: 'Avoid' | 'Mitigate' | 'Transfer' | 'Accept' | 'Exploit' | 'Enhance' | 'Share';
  responseActions: RiskResponseAction[];
  residualProbabilityValue?: number;
  residualImpactValue?: number;
  secondaryRisks?: string[];
  linkedRiskIds?: string[];
  dateIdentified: string;
}

export type WBSNodeShape = 'rectangle' | 'oval' | 'hexagon';

export interface WBSNode {
  id: string;
  wbsCode: string;
  name: string;
  description?: string;
  children: WBSNode[];
  shape?: WBSNodeShape;
  links?: { targetId: string; type: 'dependency' | 'related' }[];
}

export interface ProjectBaseline {
  id: string;
  name: string;
  date: string;
  taskBaselines: Record<string, { baselineStartDate: string, baselineEndDate: string }>;
}

export interface ProjectCalendar {
  id: string;
  name: string;
  workingDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  holidays: string[]; // ISO date strings
}

// --- QUALITY MANAGEMENT TYPES ---

export interface QualityPlan {
  id: string;
  projectId: string;
  objectives: string;
  standards: string[]; // IDs of QualityStandard
  metrics: string[]; // IDs of QualityMetric
  rolesAndResponsibilities: string;
  version: number;
  status: 'Draft' | 'In Review' | 'Approved';
}

export interface QualityStandard {
  id: string;
  name: string; // e.g., "ISO 9001:2015"
  description: string;
  source: 'Internal' | 'External';
}

export interface QualityMetric {
  id: string;
  name: string;
  target: number;
  threshold: number; // e.g., acceptable variance
  linkedTo: string; // WBS ID or Deliverable ID
}

export interface NonConformanceReport {
  id: string;
  projectId: string;
  date: string;
  description: string;
  severity: 'Critical' | 'Major' | 'Minor';
  status: 'Open' | 'In Progress' | 'Closed';
  assignedTo: string;
  rootCause?: string;
  correctiveAction?: string;
  linkedDeliverable: string; // Task ID
}

export interface QualityActivity {
  id: string;
  projectId: string;
  type: 'Audit' | 'Process Check' | 'Peer Review';
  date: string;
  status: 'Planned' | 'Complete';
  result: 'Pass' | 'Fail';
}

// --- COST & EXPENSE MANAGEMENT TYPES ---

export interface CostPlan {
  id: string;
  projectId: string;
  controlThresholds: string;
  estimatingMethods: string;
  version: number;
  status: 'Draft' | 'In Review' | 'Approved';
}

export interface ExpenseCategory {
  id: string;
  name: string;
  scope: 'Global' | 'Project';
  projectId?: string;
}

export interface Expense {
  id: string;
  activityId: string;
  categoryId: string;
  description: string;
  
  budgetedCost: number;
  actualCost: number;
  remainingCost: number;
  atCompletionCost: number;
  
  budgetedUnits: number;
  actualUnits: number;
  remainingUnits: number;
  atCompletionUnits: number;
}


export interface CostEstimate {
  id: string;
  wbsId: string;
  amount: number;
  basisOfEstimate: string; // Narrative
  type: 'ROM' | 'Preliminary' | 'Definitive';
  confidence: 'Low' | 'Medium' | 'High';
}

export interface CostBreakdownStructureNode {
  id: string;
  code: string;
  name: string;
  type: 'Direct' | 'Indirect';
  children: CostBreakdownStructureNode[];
}

// --- ISSUE MANAGEMENT TYPES ---
export interface IssueCodeValue {
  id: string;
  value: string;
  description: string;
}

export interface IssueCode {
  id: string;
  name: string;
  scope: 'Global' | 'Project';
  projectId?: string;
  values: IssueCodeValue[];
}

export interface Issue {
  id: string;
  projectId: string;
  activityId?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'On Hold' | 'In Progress' | 'Closed';
  description: string;
  assignedTo: string; // Resource ID
  dateIdentified: string;
  issueCodeAssignments?: Record<string, string>; // { [issueCodeId]: issueCodeValueId }
}

// --- BUDGET & FUNDING ---

export interface BudgetLogItem {
  id: string;
  projectId: string;
  date: string;
  description: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Not Approved';
  submittedBy: string;
  source?: 'Initial' | 'Change Order' | 'Contingency';
}

export interface FundingSource {
  id: string;
  name:string;
  description?: string;
}

export interface ProjectFunding {
  id: string;
  projectId: string;
  fundingSourceId: string;
  amount: number;
}

export interface Program {
  id: string;
  name: string;
  manager: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  benefits: string;
  status: 'Active' | 'Planned' | 'Closed';
  health: 'Good' | 'Warning' | 'Critical';
}

export interface Project {
  id:string;
  programId?: string; // Link to Program
  name: string;
  code: string;
  manager: string;
  budget: number; // This is current budget
  originalBudget: number; // This is initial budget
  spent: number;
  startDate: string;
  endDate: string;
  tasks: Task[];
  health: 'Good' | 'Warning' | 'Critical';
  risks?: Risk[];
  issues?: Issue[];
  wbs?: WBSNode[];
  baselines?: ProjectBaseline[];
  calendar?: ProjectCalendar;
  procurementPlanId?: string;
  qualityPlanId?: string;
  costPlanId?: string;
  budgetLog?: BudgetLogItem[];
  funding?: ProjectFunding[];
  udfValues?: Record<string, any>; // { [udfId]: value }
}

export interface Integration {
  id: string;
  name: string;
  type: 'ERP' | 'CRM' | 'HRIS' | 'Storage';
  status: 'Connected' | 'Disconnected' | 'Error';
  lastSync: string;
  logo: string;
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected';
  submittedBy: string;
  dateSubmitted: string;
  impacts?: {
    scheduleImpactDays?: number;
    budgetImpact?: number;
  };
}

export interface BudgetLineItem {
  id: string;
  projectId: string;
  category: 'Labor' | 'Materials' | 'Equipment' | 'Subcontractor' | 'Contingency';
  planned: number;
  actual: number;
  variance: number; // Calculated
}

export interface Document {
  id: string;
  projectId: string;
  name: string;
  type: 'PDF' | 'DWG' | 'XLSX' | 'DOCX' | 'IMG';
  size: string;
  uploadedBy: string;
  uploadDate: string;
  version: string;
  status: 'Draft' | 'Final' | 'Archived';
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  category: 'Construction' | 'Financials' | 'Operations' | 'Compliance' | 'Design' | 'Analytics';
  icon: string; // Lucide icon name or emoji
  status: 'Active' | 'Installed' | 'Available';
  version: string;
  installedDate?: string;
  viewType: 'dashboard' | 'grid' | 'map' | 'viewer3d' | 'form';
}

export interface Stakeholder {
  id: string;
  projectId: string;
  name: string;
  role: string;
  interest: 'Low' | 'Medium' | 'High';
  influence: 'Low' | 'Medium' | 'High';
  engagementStrategy: string;
}

export interface CommunicationLog {
  id: string;
  projectId: string;
  subject: string;
  participants: string[]; // Names
  date: string;
  type: 'Meeting' | 'Email' | 'Official Letter' | 'Call';
  summary: string;
}

export interface QualityReport {
  id: string;
  projectId: string;
  date: string;
  type: 'Inspection' | 'Test' | 'Audit';
  status: 'Pass' | 'Fail' | 'Conditional';
  details: Record<string, any>; // Flexible for industry specifics
  linkedIssueId?: string; // INTEGRATION POINT
}

// =================================================================
// --- ENTERPRISE PROCUREMENT MODULE TYPES ---
// =================================================================

// --- Planning ---
export interface ProcurementPlan {
  id: string;
  projectId: string;
  objectives: string;
  scope: string;
  approach: string;
  procurementMethods: ('RFP' | 'RFQ' | 'Sole Source')[];
  status: 'Draft' | 'In Review' | 'Approved';
  version: number;
}

export interface ProcurementPlanTemplate {
  id: string;
  name: string;
  content: Omit<ProcurementPlan, 'id' | 'projectId' | 'status' | 'version'>;
}

// --- Requirements & Vendor Management ---
export interface MakeOrBuyAnalysis {
  id: string;
  projectId: string;
  wbsId: string;
  decision: 'Make' | 'Buy';
  rationale: string;
  decisionDate: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  status: 'Prequalified' | 'Preferred' | 'Active' | 'Probationary' | 'Blacklisted';
  performanceScore: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High';
  contact: { name: string; email: string; phone: string };
  location?: string;
  lastAudit?: string;
}

export interface SupplierPerformanceReview {
  id: string;
  vendorId: string;
  projectId: string;
  date: string;
  rating: number; // 1-5
  reviewer: string;
  comments: string;
}

// --- Solicitation & Bidding ---
export interface Solicitation {
  id: string;
  projectId: string;
  packageId: string;
  type: 'RFI' | 'RFP' | 'RFQ';
  title: string;
  issueDate: string;
  deadline: string;
  status: 'Draft' | 'Issued' | 'Bidding' | 'Closed' | 'Awarded';
  invitedVendorIds: string[];
}

export interface BidSubmission {
  id: string;
  solicitationId: string;
  vendorId: string;
  submissionDate: string;
  technicalScore?: number;
  commercialScore?: number;
  totalValue: number;
}

// --- Contract Management ---
export interface Contract {
  id: string;
  projectId: string;
  vendorId: string;
  solicitationId?: string;
  title: string;
  contractValue: number;
  status: 'Draft' | 'Negotiation' | 'Pending Signature' | 'Active' | 'Expired' | 'Terminated';
  startDate: string;
  endDate: string;
  renewalDate?: string;
  type: 'Fixed Price' | 'Time & Materials' | 'Cost Plus';
}

export interface ProcurementClaim {
  id: string;
  projectId: string;
  contractId: string;
  title: string;
  description: string;
  status: 'Open' | 'Under Review' | 'Resolved' | 'Disputed';
  amount: number;
  filingDate: string;
  filedBy: 'Owner' | 'Vendor';
}

export interface ProcurementPackage {
  id: string;
  projectId: string;
  name: string;
  description: string;
  wbsId: string;
  budget: number;
  status: 'Planned' | 'Sourcing' | 'Awarded' | 'In Progress' | 'Complete';
  assignedBuyer: string; // Resource ID
  solicitationId?: string;
  contractId?: string;
}

export interface PurchaseOrder {
  id: string;
  projectId: string;
  contractId?: string;
  vendorId: string;
  number: string;
  status: 'Draft' | 'Issued' | 'Partially Received' | 'received' | 'Closed';
  amount: number;
  issueDate: string;
  description: string;
}


export interface AIAnalysisResult {
  summary: string;
  risks: string[];
  recommendations: string[];
}

export interface DataJob {
  id: string;
  type: 'Import' | 'Export';
  format: 'P6 XML' | 'CSV' | 'MPP';
  status: 'Completed' | 'In Progress' | 'Failed';
  submittedBy: string;
  timestamp: string;
  details: string;
}
