
import { Issue, IssueCode, RiskManagementPlan, RiskBreakdownStructureNode, PortfolioRisk, Risk } from '../../types';

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

export const MOCK_RISKS: Risk[] = [
    {
        id: 'R-001',
        projectId: 'P1001',
        description: 'Unforeseen subsurface soil conditions',
        category: 'Technical',
        status: 'Open',
        probability: 'Medium',
        impact: 'High',
        probabilityValue: 3,
        impactValue: 4,
        score: 12,
        financialImpact: 150000,
        emv: 45000,
        owner: 'Civil Lead',
        strategy: 'Mitigate',
        mitigationPlan: 'Conduct advanced geotechnical survey',
        responseActions: []
    },
    {
        id: 'R-002',
        projectId: 'P1001',
        description: 'Structural steel delivery delay',
        category: 'Schedule',
        status: 'Open',
        probability: 'High',
        impact: 'Medium',
        probabilityValue: 4,
        impactValue: 3,
        score: 12,
        financialImpact: 50000,
        emv: 25000,
        owner: 'Procurement Mgr',
        strategy: 'Transfer',
        mitigationPlan: 'Includes penalty clauses in contract',
        responseActions: []
    }
];
