
import { Expense, ExpenseCategory, BudgetLogItem, FundingSource, ProjectFunding, CostEstimate, BudgetLineItem, CostReport, CostMeeting, CostAlert } from '../../types';

export const MOCK_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  { id: 'EC-01', name: 'Materials', scope: 'Global' },
  { id: 'EC-02', name: 'Travel', scope: 'Global' }
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'EXP-01', activityId: 'T-101', categoryId: 'EC-01', description: 'Steel Beams', budgetedCost: 50000, actualCost: 52000, remainingCost: 0, atCompletionCost: 52000, budgetedUnits: 10, actualUnits: 10, remainingUnits: 0, atCompletionUnits: 10 }
];

export const MOCK_BUDGET_LOG: BudgetLogItem[] = [
  { id: 'BL-01', projectId: 'P1001', date: '2024-01-01', description: 'Initial Baseline', amount: 5000000, status: 'Approved', submittedBy: 'System', source: 'Initial' }
];

export const MOCK_FUNDING_SOURCES: FundingSource[] = [
  { 
    id: 'FS-01', 
    name: 'Federal Grant A', 
    description: 'Infrastructure Investment Act',
    type: 'Grant',
    totalAuthorized: 10000000
  }
];

export const MOCK_PROJECT_FUNDING: ProjectFunding[] = [
  { 
    id: 'PF-01', 
    projectId: 'P1001', 
    fundingSourceId: 'FS-01', 
    amount: 3000000,
    fiscalYear: '2024',
    status: 'Authorized',
    transactions: [
      {
        id: 'TX-001',
        date: '2024-01-15',
        type: 'Allocation',
        amount: 3000000,
        description: 'Initial allocation for Q1',
        approvedBy: 'System'
      }
    ]
  }
];

export const MOCK_COST_ESTIMATES: CostEstimate[] = [
  { 
      id: 'CE-01', 
      wbsId: 'WBS-01', 
      projectId: 'P1001',
      version: 1,
      status: 'Approved',
      method: 'Deterministic',
      class: 'Class 1 (Definitive)',
      baseCost: 150000,
      contingencyPercent: 10,
      escalationPercent: 5,
      totalCost: 172500,
      items: [
          { id: 'I1', description: 'Concrete Grade 40', resourceType: 'Material', quantity: 100, uom: 'CY', unitRate: 1200, total: 120000 },
          { id: 'I2', description: 'Formwork Labor', resourceType: 'Labor', quantity: 500, uom: 'HR', unitRate: 60, total: 30000 }
      ],
      basisOfEstimate: 'Based on vendor quotes received in Q1 2024.',
      updatedAt: '2024-02-15',
      updatedBy: 'Mike Ross'
  }
];

export const MOCK_BUDGET_ITEMS: BudgetLineItem[] = [
    { id: 'BLI-01', projectId: 'P1001', category: 'Labor', planned: 2000000, actual: 500000 },
    { id: 'BLI-02', projectId: 'P1001', category: 'Materials', planned: 2500000, actual: 1200000 },
    { id: 'BLI-03', projectId: 'P1001', category: 'Equipment', planned: 500000, actual: 400000 }
];

export const MOCK_COST_REPORTS: CostReport[] = [
    { id: 'CR-01', projectId: 'P1001', period: 'September 2024', type: 'Monthly Progress', status: 'Draft', dueDate: '2024-10-05', distributedTo: [], generatedBy: 'Sarah Chen' },
    { id: 'CR-02', projectId: 'P1001', period: 'August 2024', type: 'Monthly Progress', status: 'Distributed', dueDate: '2024-09-05', distributedTo: ['Sponsor', 'Client', 'PMO'], generatedBy: 'Sarah Chen', generatedDate: '2024-09-04' },
    { id: 'CR-03', projectId: 'P1001', period: 'Q2 2024', type: 'Quarterly Executive', status: 'Distributed', dueDate: '2024-07-15', distributedTo: ['Board'], generatedBy: 'Justin Saadein', generatedDate: '2024-07-14' },
];

export const MOCK_COST_MEETINGS: CostMeeting[] = [
    { 
        id: 'CM-01', projectId: 'P1001', date: '2024-09-10', title: 'Sept Cost Review', attendees: ['Sarah Chen', 'Mike Ross', 'Client Rep'], 
        agenda: 'Review concrete variance and forecast labor run-rate.', 
        outcomes: 'Approved usage of contingency for concrete escalation.', 
        actionItems: [
            { id: 'CAI-01', description: 'Issue Change Order for concrete', assignedTo: 'Mike Ross', dueDate: '2024-09-15', status: 'Open' }
        ] 
    }
];

export const MOCK_COST_ALERTS: CostAlert[] = [
    { id: 'CAL-01', projectId: 'P1001', date: '2024-09-01', severity: 'High', metric: 'CPI', value: 0.85, threshold: 0.9, message: 'Cost Performance Index fell below 0.9 threshold.', recipients: ['Project Manager', 'Cost Controller'] },
    { id: 'CAL-02', projectId: 'P1001', date: '2024-09-05', severity: 'Medium', metric: 'Variance', value: 50000, threshold: 25000, message: 'WBS 1.2 Material Variance exceeded $25k.', recipients: ['Cost Controller'] }
];
