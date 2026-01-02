
import { 
    Program, Benefit, IntegratedChangeRequest, ProgramStageGate, 
    ProgramStakeholder, ProgramCommunicationItem, ProgramDependency, 
    ProgramOutcome, ProgramChangeRequest, ProgramQualityStandard, 
    ProgramAssuranceReview, ProgramTransitionItem, ProgramArchitectureStandard, 
    ProgramArchitectureReview, TradeoffScenario,
    ProgramIssue, ProgramRisk, ProgramObjective
} from '../../types/index';

export const MOCK_PROGRAMS: Program[] = [
  { id: 'PRG-001', name: 'Smart City Initiative', managerId: 'R-001', description: 'Modernizing urban infrastructure and digital services.', startDate: '2023-01-01', endDate: '2027-12-31', budget: 25000000, benefits: 'Improved citizen satisfaction.', status: 'Active', health: 'Good', strategicImportance: 10, financialValue: 7, riskScore: 5, calculatedPriorityScore: 90, category: 'Innovation & Growth', businessCase: 'Strategic directive to improve livability.' }
];

export const MOCK_BENEFITS: Benefit[] = [
  { id: 'BEN-01', componentId: 'P1001', description: 'Reduced Commute Time', type: 'Non-Financial', value: 15, realizedValue: 0, metric: 'Minutes', targetDate: '2025-12-31', status: 'Planned' }
];

export const MOCK_PROGRAM_STAKEHOLDERS: ProgramStakeholder[] = [
  { id: 'PS-01', programId: 'PRG-001', name: 'City Council', role: 'Regulator', category: 'Strategic', engagementLevel: 'Supportive', influence: 'High', interest: 'High', engagementStrategy: 'Manage Closely' }
];

export const MOCK_COMMUNICATION_PLAN: ProgramCommunicationItem[] = [
  { id: 'PC-01', programId: 'PRG-001', audience: 'City Council', content: 'Milestone Progress Report', frequency: 'Monthly', channel: 'Formal Presentation', ownerId: 'R-001' }
];

export const MOCK_INTEGRATED_CHANGES: IntegratedChangeRequest[] = [
  {
    id: 'ICR-001',
    programId: 'PRG-001',
    title: 'Cloud-Native ERP Transition',
    description: 'Migration of municipal finance to SAP S/4HANA Cloud.',
    type: 'Technology',
    impactAreas: ['Systems', 'Data'],
    severity: 'High',
    status: 'In Progress',
    readinessImpact: [
      { stakeholderGroup: 'Finance Team', awareness: 85, desire: 60, knowledge: 40, ability: 30, reinforcement: 20 }
    ]
  }
];

export const MOCK_PROGRAM_STAGE_GATES: ProgramStageGate[] = [
  {
      id: 'PSG-01',
      programId: 'PRG-001',
      name: 'Gate 1: Initiation Approval',
      type: 'Funding',
      plannedDate: '2023-01-15',
      actualDate: '2023-01-20',
      status: 'Approved', 
      approverIds: ['U-001'],
      decisionNotes: 'Full approval granted.',
      criteria: [
          { id: 'C1-1', description: 'Business Case Approved', status: 'Met', notes: '' }
      ]
  }
];

export const MOCK_PROGRAM_OBJECTIVES: ProgramObjective[] = [
    {
        id: 'PO-001',
        description: 'Digitize 100% of municipal payment workflows.',
        linkedStrategicGoalId: 'SG-02', 
        linkedProjectIds: ['P1005']
    }
];

export const MOCK_PROGRAM_RISKS: ProgramRisk[] = [
    { 
        id: 'PR-001', programId: 'PRG-001', description: 'Public adoption resistance', category: 'External', 
        probability: 'Medium', impact: 'High', score: 15, ownerId: 'R-003', status: 'Open', mitigationPlan: 'Community outreach program.',
        probabilityValue: 3, impactValue: 5, financialImpact: 250000, strategy: 'Mitigate', responseActions: []
    }
];

export const MOCK_PROGRAM_ISSUES: ProgramIssue[] = [
    { 
        id: 'PI-001', programId: 'PRG-001', title: 'Data Privacy Legislation', description: 'New state laws regarding citizen data.', 
        priority: 'High', status: 'Open', ownerId: 'R-001', resolutionPath: 'Legal review initiated.', impactedProjectIds: ['P1005']
    }
];

export const MOCK_PROGRAM_DEPENDENCIES: ProgramDependency[] = [];
export const MOCK_PROGRAM_OUTCOMES: ProgramOutcome[] = [];
export const MOCK_PROGRAM_CHANGE_REQUESTS: ProgramChangeRequest[] = [];
export const MOCK_PROGRAM_QUALITY_STANDARDS: ProgramQualityStandard[] = [];
export const MOCK_PROGRAM_ASSURANCE_REVIEWS: ProgramAssuranceReview[] = [];
export const MOCK_PROGRAM_TRANSITION_ITEMS: ProgramTransitionItem[] = [];
export const MOCK_PROGRAM_ARCHITECTURE_STANDARDS: ProgramArchitectureStandard[] = [];
export const MOCK_PROGRAM_ARCHITECTURE_REVIEWS: ProgramArchitectureReview[] = [];
export const MOCK_TRADEOFF_SCENARIOS: TradeoffScenario[] = [];
