
import { ActivityCodeScope } from './common';

export interface CostEstimate {
  id: string;
  wbsId: string;
  amount: number;
  basisOfEstimate: string;
  type: 'Preliminary' | 'Definitive' | 'ROM';
  confidence: 'High' | 'Medium' | 'Low';
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
  description?: string;
}

export interface ProjectFunding {
  id: string;
  projectId: string;
  fundingSourceId: string;
  amount: number;
}

export interface BudgetLineItem {
  id: string;
  projectId: string;
  category: string;
  planned: number;
  actual: number;
}