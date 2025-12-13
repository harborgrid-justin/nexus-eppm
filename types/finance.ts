
import { ActivityCodeScope } from './common';

export interface CostManagementPlan {
  estimatingMethodology: string;
  precisionLevel: string;
  unitsOfMeasure: string;
  controlThresholds: string;
  reportingFormats: string;
  fundingStrategy: string;
  status: 'Draft' | 'In Review' | 'Approved';
  version: string;
  lastUpdated: string;
}

export interface CostEstimate {
  id: string;
  wbsId: string;
  projectId: string;
  version: number;
  status: 'Draft' | 'Approved' | 'Archived';
  method: 'Deterministic' | 'Parametric' | 'Three-Point';
  class: 'Class 5 (ROM)' | 'Class 4 (Preliminary)' | 'Class 3 (Budget)' | 'Class 2 (Control)' | 'Class 1 (Definitive)';
  baseCost: number;
  contingencyPercent: number;
  escalationPercent: number;
  totalCost: number;
  items: CostEstimateItem[];
  basisOfEstimate: string;
  updatedAt: string;
  updatedBy: string;
}

export interface CostEstimateItem {
  id: string;
  description: string;
  resourceType: 'Labor' | 'Material' | 'Equipment' | 'Subcontract' | 'Other';
  quantity: number;
  uom: string; // Unit of Measure
  unitRate: number;
  total: number;
  // For Three-Point / PERT
  optimistic?: number;
  mostLikely?: number;
  pessimistic?: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  scope: ActivityCodeScope;
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

export interface BudgetLogItem {
  id: string;
  projectId: string;
  date: string;
  description: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Not Approved';
  submittedBy: string;
  source?: string;
  linkedChangeOrderId?: string;
}

export interface FundingSource {
  id: string;
  name: string;
  type: 'Internal' | 'Grant' | 'Bond' | 'Client';
  description?: string;
  totalAuthorized: number;
}

export interface ProjectFunding {
  id: string;
  projectId: string;
  fundingSourceId: string;
  amount: number; // Current allocated amount
  fiscalYear: string;
  status: 'Planned' | 'Authorized' | 'Released' | 'Closed';
  restrictions?: string;
  transactions: FundingTransaction[];
}

export interface FundingTransaction {
  id: string;
  date: string;
  type: 'Allocation' | 'Drawdown' | 'Transfer' | 'Adjustment';
  amount: number;
  description: string;
  approvedBy: string;
}

export interface BudgetLineItem {
  id: string;
  projectId: string;
  category: string;
  planned: number;
  actual: number;
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  title: string;
  description: string;
  amount: number;
  scheduleImpactDays: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Implemented';
  stage: 'Initiation' | 'Technical Review' | 'CCB Review' | 'Execution';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Client Request' | 'Design Error' | 'Unforeseen Condition' | 'Regulatory';
  submittedBy: string;
  dateSubmitted: string;
  justification?: string;
  approvers?: string[];
  history?: ChangeOrderHistoryItem[];
}

export interface ChangeOrderHistoryItem {
  date: string;
  user: string;
  action: string;
  comment?: string;
}

export interface CostReport {
  id: string;
  projectId: string;
  period: string; // e.g. "October 2024"
  type: 'Monthly Progress' | 'Quarterly Executive' | 'Flash Report';
  status: 'Draft' | 'In Review' | 'Distributed';
  dueDate: string;
  distributedTo: string[]; // List of roles/emails
  generatedBy: string;
  generatedDate?: string;
}

export interface CostMeeting {
  id: string;
  projectId: string;
  date: string;
  title: string;
  attendees: string[];
  agenda: string;
  outcomes: string;
  actionItems: CostActionItem[];
}

export interface CostActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'Open' | 'Closed';
}

export interface CostAlert {
  id: string;
  projectId: string;
  date: string;
  severity: 'High' | 'Medium' | 'Low';
  metric: string; // e.g., "CPI"
  value: number;
  threshold: number;
  message: string;
  recipients: string[];
}
