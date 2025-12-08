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
}

export type TaskType = 'Task' | 'Milestone' | 'Summary';
export type ConstraintType = 'Start No Earlier Than' | 'Finish No Later Than';
export type EffortType = 'Fixed Duration' | 'Fixed Work' | 'Fixed Units';

export interface Task {
  id: string;
  wbsCode: string;
  name: string;
  startDate: string; // ISO Date
  endDate: string; // ISO Date
  duration: number; // Working days
  status: TaskStatus;
  progress: number; // 0-100
  assignedResources: string[]; // Resource IDs
  dependencies: Dependency[];
  critical: boolean; // This will now be calculated
  description?: string;
  riskIds?: string[]; // Linked risks
  
  // Advanced Scheduling Fields
  type: TaskType;
  constraintType?: ConstraintType;
  constraintDate?: string;
  baselineStartDate?: string;
  baselineEndDate?: string;
  work?: number; // in hours
  cost?: number; // calculated or fixed
  effortType: EffortType;
}

export interface Resource {
  id: string;
  name: string;
  role: string;
  capacity: number; // Hours per week
  allocated: number; // Current allocation
  avatar?: string;
  skills?: string[];
  hourlyRate?: number;
}

export interface Risk {
  id: string;
  projectId: string;
  description: string;
  category: 'Schedule' | 'Cost' | 'Technical' | 'Resource' | 'External';
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Mitigated' | 'Closed';
  owner: string;
  mitigationPlan: string;
}

export interface WBSNode {
  id: string;
  wbsCode: string;
  name: string;
  description?: string;
  children: WBSNode[];
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

export interface Project {
  id:string;
  name: string;
  code: string;
  manager: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  tasks: Task[];
  health: 'Good' | 'Warning' | 'Critical';
  risks?: Risk[];
  wbs?: WBSNode[];
  baselines?: ProjectBaseline[];
  calendar?: ProjectCalendar;
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

export interface ProcurementPackage {
  id: string;
  projectId: string;
  name: string;
  vendor: string;
  value: number;
  status: 'Draft' | 'Bidding' | 'Awarded' | 'Complete';
  deliveryDate: string;
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
}

export interface AIAnalysisResult {
  summary: string;
  risks: string[];
  recommendations: string[];
}