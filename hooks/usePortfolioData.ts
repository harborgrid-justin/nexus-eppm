
import { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { PortfolioScenario, StrategicDriver, GovernanceDecision, ESGMetric } from '../types';

export const usePortfolioData = () => {
  const { state } = useData();

  // --- MOCK STRATEGIC DRIVERS ---
  const drivers: StrategicDriver[] = useMemo(() => [
    { id: 'SD-01', name: 'Market Expansion', weight: 40, description: 'Enter 2 new international markets.' },
    { id: 'SD-02', name: 'Digital Transformation', weight: 30, description: 'Modernize legacy infrastructure.' },
    { id: 'SD-03', name: 'Operational Excellence', weight: 20, description: 'Reduce OpEx by 15%.' },
    { id: 'SD-04', name: 'Sustainability', weight: 10, description: 'Achieve net-zero carbon by 2030.' },
  ], []);

  // --- MOCK SCENARIOS ---
  const [scenarios, setScenarios] = useState<PortfolioScenario[]>([
    {
        id: 'SCN-01',
        name: 'Growth Aggressive',
        description: 'Maximize market share with higher risk tolerance.',
        budgetConstraint: 100000000,
        resourceConstraint: 50000,
        selectedComponentIds: ['P1001', 'P1002'],
        metrics: { totalROI: 145, strategicAlignmentScore: 92, riskProfileScore: 65 }
    },
    {
        id: 'SCN-02',
        name: 'Conservative Fiscal',
        description: 'Minimize risk and preserve cash flow.',
        budgetConstraint: 60000000,
        resourceConstraint: 35000,
        selectedComponentIds: ['P1001'],
        metrics: { totalROI: 110, strategicAlignmentScore: 85, riskProfileScore: 30 }
    }
  ]);

  // --- MOCK GOVERNANCE DECISIONS ---
  const governanceDecisions: GovernanceDecision[] = useMemo(() => [
      { id: 'GD-01', title: 'Q3 Budget Release', date: '2024-06-15', decision: 'Approved', authority: 'Investment Committee', notes: 'Full funding released for Project Alpha.' },
      { id: 'GD-02', title: 'Project Beta Expansion', date: '2024-05-20', decision: 'Deferred', componentId: 'P1002', authority: 'Steering Group', notes: 'Pending clearer ROI analysis.' },
      { id: 'GD-03', title: 'Tech Stack Standardization', date: '2024-04-10', decision: 'Approved', authority: 'Architecture Board', notes: 'Mandatory adoption of React/Node.' }
  ], []);

  // --- MOCK ESG METRICS ---
  const esgMetrics: ESGMetric[] = useMemo(() => [
      { componentId: 'P1001', environmentalScore: 85, socialScore: 90, governanceScore: 88, complianceStatus: 'Compliant', lastAuditDate: '2024-01-15' },
      { componentId: 'P1002', environmentalScore: 65, socialScore: 75, governanceScore: 82, complianceStatus: 'At Risk', lastAuditDate: '2024-03-10' }
  ], []);

  const aggregatedFinancials = useMemo(() => {
      const totalBudget = state.projects.reduce((sum, p) => sum + p.budget, 0);
      const totalActuals = state.projects.reduce((sum, p) => sum + p.spent, 0);
      return { totalBudget, totalActuals, variance: totalBudget - totalActuals };
  }, [state.projects]);

  return {
      projects: state.projects,
      programs: state.programs,
      drivers,
      scenarios,
      setScenarios,
      governanceDecisions,
      esgMetrics,
      aggregatedFinancials
  };
};
