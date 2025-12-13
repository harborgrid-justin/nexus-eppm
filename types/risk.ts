
import { ActivityCodeScope } from './common';

export interface Risk {
  id: string;
  projectId: string;
  activityId?: string;
  priority?: string;
  status: 'Draft' | 'Open' | 'Mitigated' | 'Closed';
  description: string;
  assignedTo?: string;
  dateIdentified?: string;
  category: string;
  
  // Qualitative Analysis
  probability: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  probabilityValue: number; // 1-5
  impactValue: number; // 1-5
  score: number; // Prob * Impact
  
  // Quantitative Analysis
  financialImpact: number; // Estimated cost impact in $
  emv?: number; // Expected Monetary Value (Financial * Prob %)
  
  // Response
  strategy: 'Avoid' | 'Mitigate' | 'Transfer' | 'Accept' | 'Escalate';
  owner: string;
  mitigationPlan?: string;
  responseActions: RiskResponseAction[];
  contingencyReserve?: number;
  
  // Meta
  linkedTaskId?: string;
  linkedRiskIds?: string[];
  isEscalated?: boolean;
  proximity?: 'Near-term' | 'Medium-term' | 'Long-term';
  
  // History
  history?: RiskHistoryItem[];
}

export interface RiskHistoryItem {
  date: string;
  user: string;
  action: string;
  change?: string;
}

export interface RiskResponseAction {
  id: string;
  description: string;
  owner: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Complete';
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