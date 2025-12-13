
import { Issue, IssueCode, RiskManagementPlan, RiskBreakdownStructureNode, PortfolioRisk } from '../../types';

export const MOCK_ISSUE_CODES: IssueCode[] = [
  { id: 'IC-01', name: 'Priority', scope: 'Global', values: [{ id: 'P-High', value: 'High', description: 'Urgent' }] }
];

export const MOCK_ISSUES: Issue[] = [
  { id: 'ISS-01', projectId: 'P1001', priority: 'High', status: 'Open', description: 'Permit delay for Zone B', assignedTo: 'Mike Ross', dateIdentified: '2024-03-10' }
];

export const MOCK_RISK_PLAN: RiskManagementPlan = {
  id: 'RMP-01', projectId: 'P1001', objectives: 'Minimize threats to critical path.', scope: 'All construction activities.', approach: 'PMI Standard', riskCategories: [{ id: 'RC-01', name: 'Technical' }], probabilityImpactScale: {}, thresholds: {}, version: 1, status: 'Approved'
};

export const MOCK_RBS: RiskBreakdownStructureNode[] = [
  { id: 'RBS-01', code: '1', name: 'Technical Risk', children: [{ id: 'RBS-01-1', code: '1.1', name: 'Requirements', children: [] }] }
];

export const MOCK_PORTFOLIO_RISKS: PortfolioRisk[] = [
  { id: 'PR-01', description: 'Supply Chain Disruption', category: 'External', probability: 'Medium', impact: 'High', score: 12, owner: 'COO', status: 'Open', mitigationPlan: 'Diversify suppliers' }
];
