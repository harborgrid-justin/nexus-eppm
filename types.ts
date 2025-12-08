export enum TaskStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
  DELAYED = "Delayed"
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

export interface Task {
  id: string;
  wbsCode: string;
  name: string;
  startDate: string; // ISO Date
  endDate: string; // ISO Date
  duration: number; // Days
  status: TaskStatus;
  progress: number; // 0-100
  assignedResources: string[]; // Resource IDs
  predecessors: string[]; // Task IDs
  critical: boolean;
  description?: string;
  riskIds?: string[]; // Linked risks
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

export interface Project {
  id: string;
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

export interface AIAnalysisResult {
  summary: string;
  risks: string[];
  recommendations: string[];
}