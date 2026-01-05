
// FIX: Correctly import all necessary risk-related types.
import { Issue, IssueCode, RiskManagementPlan, RiskBreakdownStructureNode, PortfolioRisk, Risk } from '../../types/index';

export const MOCK_ISSUE_CODES: IssueCode[] = [
  { id: 'IC-01', name: 'Priority', scope: 'Global', values: [{ id: 'P-High', value: 'High', description: 'Urgent' }] }
];

export const MOCK_ISSUES: Issue[] = [
  { id: 'ISS-01', projectId: 'P1001', priority: 'High', status: 'Open', description: 'Permit delay for Zone B', assigneeId: 'R-002', dateIdentified: '2024-03-10' },
  { id: 'ISS-02', projectId: 'P1002', priority: 'Medium', status: 'In Progress', description: 'API Latency Spikes', assigneeId: 'R-001', dateIdentified: '2024-05-20' },
  { id: 'ISS-03', projectId: 'P1003', priority: 'Critical', status: 'Open', description: 'Inverter supply shortage', assigneeId: 'R-002', dateIdentified: '2024-06-12' }
];

export const MOCK_RISK_PLAN: RiskManagementPlan = {
  id: 'RMP-01', projectId: 'P1001', objectives: 'Minimize threats to critical path.', scope: 'All construction activities.', approach: 'PMI Standard', riskCategories: [{ id: 'RC-01', name: 'Technical' }], probabilityImpactScale: {}, thresholds: {}, version: 1, status: 'Approved'
};

export const MOCK_RBS: RiskBreakdownStructureNode[] = [
  { id: 'RBS-01', code: '1', name: 'Technical Risk', children: [{ id: 'RBS-01-1', code: '1.1', name: 'Requirements', children: [] }] }
];

export const MOCK_PORTFOLIO_RISKS: PortfolioRisk[] = [
  { id: 'PR-01', description: 'Supply Chain Disruption', category: 'External', probability: 'Medium', impact: 'High', score: 12, ownerId: 'R-004', status: 'Open', mitigationPlan: 'Diversify suppliers' }
];

export const MOCK_RISKS: Risk[] = [
    // P1001
    {
        id: 'R-001', projectId: 'P1001', description: 'Unforeseen subsurface soil conditions', category: 'Technical', status: 'Open', probability: 'Medium', impact: 'High', probabilityValue: 3, impactValue: 4, score: 12, financialImpact: 150000, emv: 45000, ownerId: 'R-002', strategy: 'Mitigate', mitigationPlan: 'Conduct advanced geotechnical survey', responseActions: []
    },
    {
        id: 'R-002', projectId: 'P1001', description: 'Structural steel delivery delay', category: 'Schedule', status: 'Open', probability: 'High', impact: 'Medium', probabilityValue: 4, impactValue: 3, score: 12, financialImpact: 50000, emv: 25000, ownerId: 'R-004', strategy: 'Transfer', mitigationPlan: 'Includes penalty clauses in contract', responseActions: []
    },
    // P1002
    {
        id: 'R-003', projectId: 'P1002', description: 'Data Migration Data Loss', category: 'Technical', status: 'Open', probability: 'Low', impact: 'High', probabilityValue: 2, impactValue: 5, score: 10, financialImpact: 500000, emv: 100000, ownerId: 'R-001', strategy: 'Mitigate', mitigationPlan: 'Full backups and dry runs', responseActions: []
    },
    // P1003
    {
        id: 'R-004', projectId: 'P1003', description: 'EPA Permit Revocation', category: 'External', status: 'Open', probability: 'Medium', impact: 'High', probabilityValue: 3, impactValue: 5, score: 15, financialImpact: 2000000, emv: 600000, ownerId: 'R-002', strategy: 'Avoid', mitigationPlan: 'Strict compliance monitoring', responseActions: [], isEscalated: true
    }
];
