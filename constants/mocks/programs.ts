
import { Program, Benefit, Stakeholder } from '../../types';

export const MOCK_PROGRAMS: Program[] = [
  { id: 'PRG-001', name: 'Smart City Initiative', manager: 'Jessica Pearson', description: 'Modernizing urban infrastructure and digital services.', startDate: '2023-01-01', endDate: '2027-12-31', budget: 25000000, benefits: 'Improved citizen satisfaction, reduced carbon footprint.', status: 'Active', health: 'Good', strategicImportance: 10, financialValue: 7, riskScore: 5, calculatedPriorityScore: 90, category: 'Innovation & Growth', businessCase: 'Strategic directive to improve livability.' }
];

export const MOCK_BENEFITS: Benefit[] = [
  { id: 'BEN-01', componentId: 'P1001', description: 'Reduced Commute Time', type: 'Non-Financial', value: 15, metric: 'Minutes', targetDate: '2025-12-31', status: 'Planned' }
];

export const MOCK_STAKEHOLDERS: Stakeholder[] = [
  { id: 'SH-01', projectId: 'P1001', name: 'City Council', role: 'Sponsor', interest: 'High', influence: 'High', engagementStrategy: 'Manage Closely' }
];
