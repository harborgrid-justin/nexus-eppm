
import { Risk } from './risk';
import { Issue } from './risk'; 
import { BudgetLogItem, ProjectFunding, CostEstimate } from './finance';
import { TeamCharter, Stakeholder, StakeholderEngagement, Assumption, LessonLearned, Requirement } from './project_subtypes'; 
import { ActivityCodeScope } from './common';

export { TeamCharter, Stakeholder, StakeholderEngagement, Assumption, LessonLearned, Requirement };

export interface Project {
  id: string; // Primary Key
  programId?: string; // FK to Program
  epsId: string; // FK to EPSNode
  obsId: string; // FK to OBSNode
  calendarId: string; // FK to GlobalCalendar
  locationId?: string; // FK to Location
  
  name: string;
  code: string;
  manager: string; // Display name, ideally FK to Resource
  originalBudget: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  health: 'Good' | 'Warning' | 'Critical';
  
  // Children / Related Entities
  wbs?: WBSNode[];
  tasks: Task[];
  issues?: Issue[];
  budgetLog?: BudgetLogItem[];
  funding?: ProjectFunding[];
  costEstimates?: CostEstimate[];
  baselines?: Baseline[];
  risks?: Risk[];
  
  // Metrics & Metadata
  strategicImportance: number;
  financialValue: number;
  riskScore: number;
  resourceFeasibility: number;
  calculatedPriorityScore: number;
  category: string;
  businessCase?: string;
  
  // Governance
  teamCharter?: TeamCharter;
  stakeholderEngagement?: StakeholderEngagement[];
  reserves?: { contingencyReserve: number; managementReserve: number };
  assumptions?: Assumption[];
  lessonsLearned?: LessonLearned[];
  requirements?: Requirement[];
  costOfQuality?: { preventionCosts: number; appraisalCosts: number; internalFailureCosts: number; externalFailureCosts: number };
}

export interface Task {
  id: string;
  wbsCode: string;
  name: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: TaskStatus;
  progress: number;
  assignments: Assignment[];
  dependencies: Dependency[];
  critical: boolean;
  type: string;
  effortType: EffortType;
  work?: number;
  resourceRequirements: any[];
  activityCodeAssignments?: Record<string, string>;
  expenseIds?: string[];
  primaryConstraint?: { type: ConstraintType; date: string };
  issueIds?: string[];
  udfValues?: Record<string, any>;
  auditTrail?: any[];
  description?: string;
}

export enum TaskStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  DELAYED = 'Delayed'
}

export type ConstraintType = 'Start On or After' | 'Finish On or Before' | 'Start On' | 'Finish On' | 'Mandatory Start' | 'Mandatory Finish';
export type EffortType = 'Fixed Duration' | 'Fixed Work';

export interface Assignment {
  resourceId: string; // FK to Resource
  units: number; // Percentage
  cost?: number; // Calculated field
}

export interface Dependency {
  targetId: string; // FK to Task
  type: 'FS' | 'SS' | 'FF' | 'SF';
  lag: number;
  comment?: string;
}

export interface WBSNode {
  id: string;
  wbsCode: string;
  name: string;
  description: string;
  children: WBSNode[];
  shape?: WBSNodeShape;
}

export type WBSNodeShape = 'rectangle' | 'oval' | 'hexagon';

// Legacy ProjectCalendar removed, using GlobalCalendar instead. 
// Kept temporarily if needed for backward compat in UI logic until refactor complete.
export interface ProjectCalendar {
  id: string;
  name: string;
  workingDays: number[];
  holidays: string[];
}

export interface Baseline {
  id: string;
  name: string;
  date: string;
  taskBaselines: Record<string, { baselineStartDate: string; baselineEndDate: string }>;
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  status: 'Approved' | 'Pending Approval' | 'Rejected';
  submittedBy: string;
  dateSubmitted: string;
}

export interface QualityReport {
  id: string;
  projectId: string;
  date: string;
  type: string;
  status: 'Pass' | 'Fail' | 'Conditional';
  details: any;
}

export interface NonConformanceReport {
  id: string;
  projectId: string;
  date: string;
  description: string;
  severity: 'Critical' | 'Major' | 'Minor';
  status: string;
  assignedTo: string;
  linkedDeliverable: string;
  category: string;
  vendorId?: string;
}

export interface CommunicationLog {
  id: string;
  projectId: string;
  date: string;
  type: 'Meeting' | 'Email' | 'Call' | 'Official Letter' | 'RFI';
  subject: string;
  participants: string[];
  summary: string;
  status?: string; 
  linkedIssueId?: string;
}

export interface ActivityCode {
  id: string;
  name: string;
  scope: ActivityCodeScope;
  values: ActivityCodeValue[];
  projectId?: string;
}

export interface ActivityCodeValue {
  id: string;
  value: string;
  color?: string;
  description?: string;
}

export interface UserDefinedField {
  id: string;
  subjectArea: UDFSubjectArea;
  title: string;
  dataType: 'Text' | 'List' | 'Number' | 'Date';
  listValues?: string[];
}

export type UDFSubjectArea = 'Projects' | 'Tasks' | 'Resources' | 'Risks';

export interface QualityStandard {
  id: string;
  name: string;
  description: string;
  source: string;
  }

export interface AIAnalysisResult {
  summary: string;
  risks: string[];
  recommendations: string[];
}