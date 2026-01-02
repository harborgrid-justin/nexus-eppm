
import { Expense, ExpenseCategory, BudgetLogItem, FundingSource, ProjectFunding, CostEstimate, BudgetLineItem, CostReport, CostMeeting, CostAlert, Invoice, CostBookItem, ChangeOrder } from '../../types/index';

export const MOCK_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'EC-01', name: 'Materials', scope: 'Global' },
  { id: 'EC-02', name: 'Travel', scope: 'Global' },
  { id: 'EC-03', name: 'Cloud Services', scope: 'Global' },
  { id: 'EC-04', name: 'Subcontracts', scope: 'Global' }
];

export const MOCK_EXPENSES: Expense[] = [
  // P1001
  { id: 'EXP-01', activityId: 'T-101', categoryId: 'EC-01', description: 'Steel Beams', budgetedCost: 50000, actualCost: 52000, remainingCost: 0, atCompletionCost: 52000, budgetedUnits: 10, actualUnits: 10, remainingUnits: 0, atCompletionUnits: 10 },
  // P1002
  { id: 'EXP-02', activityId: 'T-202', categoryId: 'EC-03', description: 'Azure Consumption Q1', budgetedCost: 120000, actualCost: 115000, remainingCost: 5000, atCompletionCost: 120000, budgetedUnits: 1, actualUnits: 1, remainingUnits: 0, atCompletionUnits: 1 },
  // P1003
  { id: 'EXP-03', activityId: 'T-301', categoryId: 'EC-04', description: 'Road Grading Sub', budgetedCost: 450000, actualCost: 475000, remainingCost: 0, atCompletionCost: 475000, budgetedUnits: 1, actualUnits: 1, remainingUnits: 0, atCompletionUnits: 1 }
];

export const MOCK_BUDGET_LOG: BudgetLogItem[] = [
  { id: 'BL-01', projectId: 'P1001', date: '2024-01-01', description: 'Initial Baseline', amount: 5000000, status: 'Approved', submitterId: 'System', source: 'Initial' },
  { id: 'BL-02', projectId: 'P1002', date: '2024-02-15', description: 'Baseline Load', amount: 1500000, status: 'Approved', submitterId: 'System', source: 'Initial' },
  { id: 'BL-03', projectId: 'P1003', date: '2023-08-01', description: 'Capital Approval', amount: 8500000, status: 'Approved', submitterId: 'System', source: 'Initial' }
];

export const MOCK_FUNDING_SOURCES: FundingSource[] = [
  { id: 'FS-01', name: 'Federal Grant A', description: 'Infrastructure Investment Act', type: 'Grant', totalAuthorized: 10000000 },
  { id: 'FS-02', name: 'IT Modernization Fund', description: 'Internal CapEx 2024', type: 'Internal', totalAuthorized: 5000000 },
  { id: 'FS-03', name: 'Green Bond 2023', description: 'Sustainability Initiatives', type: 'Bond', totalAuthorized: 20000000 }
];

export const MOCK_PROJECT_FUNDING: ProjectFunding[] = [
  { 
    id: 'PF-01', projectId: 'P1001', fundingSourceId: 'FS-01', amount: 3000000, fiscalYear: '2024', status: 'Authorized',
    transactions: [{ id: 'TX-001', date: '2024-01-15', type: 'Allocation', amount: 3000000, description: 'Initial allocation', approverId: 'System' }]
  },
  {
    id: 'PF-02', projectId: 'P1002', fundingSourceId: 'FS-02', amount: 1500000, fiscalYear: '2024', status: 'Released',
    transactions: [{ id: 'TX-002', date: '2024-02-28', type: 'Allocation', amount: 1500000, description: 'Full funding', approverId: 'CIO' }]
  },
  {
    id: 'PF-03', projectId: 'P1003', fundingSourceId: 'FS-03', amount: 8500000, fiscalYear: '2023', status: 'Released',
    transactions: [{ id: 'TX-003', date: '2023-09-01', type: 'Allocation', amount: 8500000, description: 'Construction Phase', approverId: 'CFO' }]
  }
];

export const MOCK_COST_ESTIMATES: CostEstimate[] = [
  { 
      id: 'CE-01', wbsId: 'WBS-01', projectId: 'P1001', version: 1, status: 'Approved', method: 'Deterministic', class: 'Class 1 (Definitive)', baseCost: 150000, contingencyPercent: 10, escalationPercent: 5, totalCost: 172500,
      items: [{ id: 'I1', description: 'Concrete Grade 40', resourceType: 'Material', quantity: 100, uom: 'CY', unitRate: 1200, total: 120000, optimistic: 1100, mostLikely: 1200, pessimistic: 1300 }], basisOfEstimate: 'Vendor Quotes', updatedAt: '2024-02-15', updaterId: 'Mike Ross'
  },
  {
      id: 'CE-02', wbsId: 'WBS-02', projectId: 'P1002', version: 1, status: 'Draft', 
      method: 'Three-Point', class: 'Class 3 (Budget)', baseCost: 500000, contingencyPercent: 15, escalationPercent: 0, totalCost: 575000,
      items: [{ id: 'I2', description: 'Cloud Compute Hours', resourceType: 'Other', quantity: 5000, uom: 'HR', unitRate: 100, total: 500000, optimistic: 90, mostLikely: 100, pessimistic: 110 }], basisOfEstimate: 'Historical Run Rate', updatedAt: '2024-03-01', updaterId: 'Jessica Pearson'
  }
];

export const MOCK_BUDGET_ITEMS: BudgetLineItem[] = [
    // P1001
    { id: 'BLI-01', projectId: 'P1001', category: 'Labor', planned: 2000000, actual: 500000 },
    { id: 'BLI-02', projectId: 'P1001', category: 'Materials', planned: 2500000, actual: 1200000 },
    { id: 'BLI-03', projectId: 'P1001', category: 'Equipment', planned: 500000, actual: 400000 },
    // P1002
    { id: 'BLI-04', projectId: 'P1002', category: 'Labor', planned: 800000, actual: 600000 },
    { id: 'BLI-05', projectId: 'P1002', category: 'Software', planned: 500000, actual: 290000 },
    // P1003
    { id: 'BLI-06', projectId: 'P1003', category: 'Construction', planned: 6000000, actual: 3500000 },
    { id: 'BLI-07', projectId: 'P1003', category: 'Materials', planned: 2500000, actual: 700000 }
];

export const MOCK_COST_REPORTS: CostReport[] = [
    { id: 'CR-01', projectId: 'P1001', period: 'September 2024', type: 'Monthly Progress', status: 'Draft', dueDate: '2024-10-05', distributedToIds: [], generatorId: 'Sarah Chen' },
    { id: 'CR-02', projectId: 'P1001', period: 'August 2024', type: 'Monthly Progress', status: 'Distributed', dueDate: '2024-09-05', distributedToIds: ['Sponsor', 'PMO'], generatorId: 'Sarah Chen', generatedDate: '2024-09-04' },
    { id: 'CR-04', projectId: 'P1003', period: 'Q2 2024', type: 'Quarterly', status: 'Distributed', dueDate: '2024-07-15', distributedToIds: ['Board'], generatorId: 'Mike Ross', generatedDate: '2024-07-10' }
];

export const MOCK_COST_MEETINGS: CostMeeting[] = [
    { id: 'CM-01', projectId: 'P1001', date: '2024-09-10', title: 'Sept Cost Review', attendeeIds: ['Sarah Chen', 'Mike Ross'], agenda: 'Review variance.', outcomes: 'Contingency approved.', actionItems: [] }
];

export const MOCK_COST_ALERTS: CostAlert[] = [
    { id: 'CAL-01', projectId: 'P1001', date: '2024-09-01', severity: 'High', metric: 'CPI', value: 0.85, threshold: 0.9, message: 'CPI < 0.9', recipientIds: ['PM'] },
    { id: 'CAL-02', projectId: 'P1003', date: '2024-06-15', severity: 'High', metric: 'Budget', value: 105, threshold: 100, message: 'Budget Overrun in Civil Works', recipientIds: ['PM'] }
];

export const MOCK_INVOICES: Invoice[] = [];

export const MOCK_COST_BOOK: CostBookItem[] = [
    { id: 'CB-01', description: 'Concrete Grade 40', type: 'Material', unit: 'CY', rate: 1200 },
    { id: 'CB-02', description: 'Senior Engineer', type: 'Labor', unit: 'HR', rate: 150 },
];

export const MOCK_CHANGE_ORDERS: ChangeOrder[] = [
    { 
        id: 'CO-001', projectId: 'P1001', title: 'Additional Excavation', description: 'Rock removal in Sector 4 required heavier equipment.', 
        justification: 'Unforeseen subsurface condition.', amount: 45000, scheduleImpactDays: 5, status: 'Approved', 
        stage: 'Execution', priority: 'High', category: 'Unforeseen Condition', submitterId: 'Mike Ross', dateSubmitted: '2024-03-10', history: []
    },
    { 
        id: 'CO-002', projectId: 'P1001', title: 'Material Upgrade', description: 'Upgrade lobby flooring to marble per client request.', 
        justification: 'Client preference.', amount: 120000, scheduleImpactDays: 10, status: 'Pending Approval', 
        stage: 'CCB Review', priority: 'Medium', category: 'Client Request', submitterId: 'Jessica Pearson', dateSubmitted: '2024-05-15', history: []
    }
];
