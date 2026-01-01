
import { PortfolioScenario, GovernanceDecision, StrategicDriver, ESGMetric } from '../../types/index';

export const MOCK_PORTFOLIO_SCENARIOS: PortfolioScenario[] = [
    {
      id: 'SCENARIO-1',
      name: 'Aggressive Growth',
      description: 'Focus on high-ROI, high-risk innovation projects.',
      selectedComponentIds: ['P1003', 'P1005'],
      metrics: {
          totalCost: 20000000,
          totalROI: 25.5,
          strategicAlignmentScore: 92,
          riskExposure: 78
      }
    },
    {
      id: 'SCENARIO-2',
      name: 'Conservative',
      description: 'Focus on low-risk, operational efficiency projects.',
      selectedComponentIds: ['P1001', 'P1004'],
      metrics: {
          totalCost: 10000000,
          totalROI: 12.1,
          strategicAlignmentScore: 75,
          riskExposure: 45
      }
    }
];

export const MOCK_GOVERNANCE_DECISIONS: GovernanceDecision[] = [
    { id: 'DEC-01', date: '2024-05-15', title: 'Approve P1001 Charter', authorityId: 'Steering Committee', decision: 'Approved', notes: 'Budget approved at $5M.' },
    { id: 'DEC-02', date: '2024-06-01', title: 'Defer P1002 Phase 2', authorityId: 'Investment Committee', decision: 'Deferred', notes: 'Re-evaluate after Q3 market analysis.' },
];

export const MOCK_STRATEGIC_DRIVERS: StrategicDriver[] = [
    { id: 'SD-01', name: 'Market Expansion', description: 'Grow market share in new regions.' },
    { id: 'SD-02', name: 'Operational Efficiency', description: 'Reduce operational costs and improve margins.' },
    { id: 'SD-03', name: 'Innovation', description: 'Develop new products and services.' },
];

export const MOCK_ESG_METRICS: ESGMetric[] = [
    { componentId: 'P1001', environmentalScore: 85, socialScore: 90, governanceScore: 95, complianceStatus: 'Compliant' },
    { componentId: 'P1003', environmentalScore: 95, socialScore: 88, governanceScore: 92, complianceStatus: 'Compliant' },
];
