
export interface ExpenseCategory {
  id: string;
  name: string;
  scope: 'Global' | 'Project';
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
  submitterId: string;
  source: string;
  linkedChangeOrderId?: string;
}

export interface FundingSource {
  id: string;
  name: string;
  type: 'Internal' | 'Grant' | 'Bond' | 'Other';
  totalAuthorized: number;
  description: string;
}

export interface ProjectFunding {
  id: string;
  projectId: string;
  fundingSourceId: string;
  amount: number;
  status: 'Planned' | 'Authorized' | 'Released';
  fiscalYear: string;
  transactions: {
    id: string;
    date: string;
    type: 'Allocation' | 'Drawdown';
    amount: number;
    description: string;
    approverId: string;
  }[];
}

export interface CostEstimateItem {
  id: string;
  description: string;
  resourceType: 'Labor' | 'Material' | 'Equipment' | 'Subcontract' | 'Other';
  quantity: number;
  uom: string;
  unitRate: number;
  total: number;
  optimistic?: number;
  mostLikely?: number;
  pessimistic?: number;
}

export interface CostEstimate {
  id: string;
  projectId: string;
  wbsId: string;
  version: number;
  status: 'Draft' | 'In Review' | 'Approved';
  method: 'Deterministic' | 'Three-Point';
  class: 'Class 5 (ROM)' | 'Class 4 (Preliminary)' | 'Class 3 (Budget)' | 'Class 2 (Control)' | 'Class 1 (Definitive)';
  baseCost: number;
  contingencyPercent: number;
  escalationPercent: number;
  totalCost: number;
  items: CostEstimateItem[];
  basisOfEstimate: string;
  updatedAt: string;
  updaterId: string;
}

export interface BudgetLineItem {
  id: string;
  projectId: string;
  category: string;
  planned: number;
  actual: number;
}

export interface ChangeOrderHistoryItem {
  date: string;
  userId: string;
  action: string;
  comment?: string;
}

export interface ChangeOrder {
  id: string;
  projectId: string;
  title: string;
  description: string;
  justification?: string;
  amount: number;
  scheduleImpactDays: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected';
  stage: 'Initiation' | 'Technical Review' | 'CCB Review' | 'Execution';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: 'Client Request' | 'Design Error' | 'Unforeseen Condition' | 'Regulatory' | 'Value Engineering';
  submitterId: string;
  dateSubmitted: string;
  history: ChangeOrderHistoryItem[];
}

export interface CostManagementPlan {}
export interface PaymentApplication {}

export interface CostReport {
    id: string;
    projectId: string;
    period: string;
    type: 'Monthly Progress' | 'Quarterly' | 'Ad-Hoc';
    status: 'Draft' | 'In Review' | 'Distributed';
    dueDate: string;
    distributedToIds: string[];
    generatorId: string;
    generatedDate?: string;
}

export interface CostMeeting {
    id: string;
    projectId: string;
    date: string;
    title: string;
    attendeeIds: string[];
    agenda: string;
    outcomes: string;
    actionItems: any[];
}

export interface CostAlert {
    id: string;
    projectId: string;
    date: string;
    severity: 'High' | 'Medium' | 'Low';
    metric: string;
    value: number;
    threshold: number;
    message: string;
    recipientIds: string[];
}

export interface Invoice {
  id: string;
  vendorId: string;
  projectId: string;
  poId: string;
  invoiceNumber: string;
  amount: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Paid' | 'Disputed';
  issueDate: string;
  dueDate: string;
}

export interface EVMMetrics {
  pv: number;
  ev: number;
  ac: number;
  sv: number;
  cv: number;
  spi: number;
  cpi: number;
  bac: number;
  eac: number;
  etc: number;
  vac: number;
  tcpi: number;
  status: 'Ahead' | 'Behind' | 'On Track';
  costStatus: 'Under Budget' | 'Over Budget' | 'On Budget';
}

export interface CostBookItem {
    id: string;
    description: string;
    type: 'Labor' | 'Material' | 'Equipment' | 'Subcontract';
    unit: string;
    rate: number;
}
