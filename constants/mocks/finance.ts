
import { Expense, ExpenseCategory, BudgetLogItem, FundingSource, ProjectFunding, CostEstimate, BudgetLineItem } from '../../types';

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
  { id: 'FS-01', name: 'Federal Grant A', description: 'Infrastructure Investment Act' }
];

export const MOCK_PROJECT_FUNDING: ProjectFunding[] = [
  { id: 'PF-01', projectId: 'P1001', fundingSourceId: 'FS-01', amount: 3000000 }
];

export const MOCK_COST_ESTIMATES: CostEstimate[] = [
  { id: 'CE-01', wbsId: 'WBS-01', amount: 150000, basisOfEstimate: 'Vendor Quotes', type: 'Definitive', confidence: 'High' }
];

// Added missing MOCK_BUDGET_ITEMS for Context to load
export const MOCK_BUDGET_ITEMS: BudgetLineItem[] = [
    { id: 'BLI-01', projectId: 'P1001', category: 'Labor', planned: 2000000, actual: 500000 },
    { id: 'BLI-02', projectId: 'P1001', category: 'Materials', planned: 2500000, actual: 1200000 },
    { id: 'BLI-03', projectId: 'P1001', category: 'Equipment', planned: 500000, actual: 400000 }
];
