
import { Risk, Issue } from './risk';
import { BudgetLogItem, ProjectFunding, CostEstimate, ChangeOrder } from './finance';
import { TeamCharter, StakeholderEngagement, Assumption, LessonLearned, Requirement } from './project_subtypes'; 

export enum TaskStatus {
  NOT_STARTED = 'Not Started',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  DELAYED = 'Delayed',
  ON_HOLD = 'On Hold',
}

export type EffortType = 'Fixed Duration' | 'Fixed Work' | 'Fixed Units/Time';

export interface Dependency {
  targetId: string;
  type: 'FS' | 'SS' | 'FF' | 'SF';
  lag: number;
}

export interface ActivityStep {
    id: string;
    name: string;
    weight: number; // 0-1 or 1-100, used to calculate physical % complete
    completed: boolean;
    completedDate?: string;
}

export interface Task {
  id: string;
  wbsCode: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: TaskStatus;
  progress: number;
  dependencies: Dependency[];
  critical: boolean;
  type: 'Task' | 'Milestone' | 'Summary';
  effortType: EffortType;
  work?: number;
  assignments: { resourceId: string; units: number }[];
  issueIds?: string[];
  expenseIds?: string[];
  activityCodeAssignments?: Record<string, string>;
  udfValues?: Record<string, any>;
  primaryConstraint?: { type: string; date: string };
  totalFloat?: number;
  freeFloat?: number;
  steps?: ActivityStep[]; // P6 Parity: Activity Steps
  notebooks?: any[];
  // CPM Calculated fields
  earlyStart?: Date;
  earlyFinish?: Date;
  lateStart?: Date;
  lateFinish?: Date;
}

export interface Baseline {
    id: string;
    name: string;
    type: 'Initial' | 'Revised' | 'Customer Approved';
    date: string;
    taskBaselines: Record<string, {
        baselineStartDate: string;
        baselineEndDate: string;
        baselineDuration: number;
    }>;
}

export type WBSNodeShape = 'rectangle' | 'oval' | 'hexagon';

export interface WBSNode {
  id: string;
  wbsCode: string;
  name: string;
  description: string;
  children: WBSNode[];
  shape?: WBSNodeShape;
  parentId?: string | null;
}

export interface Project {
  id: string;
  programId?: string;
  epsId: string;
  obsId: string;
  calendarId: string;
  locationId?: string;
  primaryDriverId?: string;
  name: string;
  code: string;
  managerId: string;
  originalBudget: number;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  health: 'Good' | 'Warning' | 'Critical';
  status?: string;
  wbs?: WBSNode[];
  tasks: Task[];
  issues?: Issue[];
  budgetLog?: BudgetLogItem[];
  funding?: ProjectFunding[];
  paymentApplications?: any[];
  costEstimates?: CostEstimate[];
  baselines?: Baseline[];
  risks?: Risk[];
  strategicImportance: number;
  financialValue: number;
  riskScore: number;
  resourceFeasibility: number;
  calculatedPriorityScore: number;
  category: string;
  businessCase?: string;
  lastUpdated?: string;
  updatedBy?: string;
  teamCharter?: TeamCharter;
  stakeholderEngagement?: StakeholderEngagement[];
  reserves?: { contingencyReserve: number; managementReserve: number; };
  costOfQuality?: {
      preventionCosts: number;
      appraisalCosts: number;
      internalFailureCosts: number;
      externalFailureCosts: number;
  };
  coqHistory?: any[];
  requirements?: Requirement[];
  assumptions?: Assumption[];
  lessonsLearned?: LessonLearned[];
  qualityPlan?: any;
  costPlan?: any;
  notebooks?: any[];
  percentCompleteType?: 'Duration' | 'Physical' | 'Units';
  dataDate?: string;
  totalFloat?: number;
  description?: string;
  
  // Reflection / What-If Props
  isReflection?: boolean;
  sourceProjectId?: string;
}
