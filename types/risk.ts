
import { ActivityCodeScope } from './common';

export interface Risk {
  id: string;
  projectId: string;
  activityId?: string;
  priority?: string;
  status: string;
  description: string;
  assignedTo?: string;
  dateIdentified?: string;
  category: string;
  probability: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  probabilityValue?: number;
  impactValue?: number;
  score: number;
  owner: string;
  mitigationPlan?: string;
  responseActions: RiskResponseAction[];
  linkedTaskId?: string;
  linkedRiskIds?: string[];
}

export interface RiskResponseAction {
  id: string;
  description: string;
  dueDate: string;
}

export interface RiskManagementPlan {
  id: string;
  projectId: string;
  objectives: string;
  scope: string;
  approach: string;
  riskCategories: { id: string; name: string }[];
  probabilityImpactScale: any;
  thresholds: any;
  version: number;
  status: string;
}

export interface RiskBreakdownStructureNode {
  id: string;
  code: string;
  name: string;
  children: RiskBreakdownStructureNode[];
}

export interface IssueCode {
  id: string;
  name: string;
  scope: ActivityCodeScope;
  values: { id: string; value: string; description: string }[];
}

export interface Issue {
  id: string;
  projectId: string;
  activityId?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: string;
  description: string;
  assignedTo: string;
  dateIdentified: string;
}

export interface PortfolioRisk {
  id: string;
  description: string;
  category: string;
  probability: string;
  impact: string;
  score: number;
  owner: string;
  status: string;
  mitigationPlan: string;
}