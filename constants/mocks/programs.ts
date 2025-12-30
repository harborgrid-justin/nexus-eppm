
import { Program, Benefit, Stakeholder, IntegratedChangeRequest, ProgramStageGate, ProgramStakeholder, ProgramCommunicationItem } from '../../types';

export const MOCK_PROGRAMS: Program[] = [
  { id: 'PRG-001', name: 'Smart City Initiative', manager: 'Jessica Pearson', description: 'Modernizing urban infrastructure and digital services.', startDate: '2023-01-01', endDate: '2027-12-31', budget: 25000000, benefits: 'Improved citizen satisfaction, reduced carbon footprint.', status: 'Active', health: 'Good', strategicImportance: 10, financialValue: 7, riskScore: 5, calculatedPriorityScore: 90, category: 'Innovation & Growth', businessCase: 'Strategic directive to improve livability.' }
];

export const MOCK_BENEFITS: Benefit[] = [
  { id: 'BEN-01', componentId: 'P1001', description: 'Reduced Commute Time', type: 'Non-Financial', value: 15, metric: 'Minutes', targetDate: '2025-12-31', status: 'Planned' }
];

export const MOCK_STAKEHOLDERS: Stakeholder[] = [
  { id: 'SH-01', projectId: 'P1001', name: 'City Council', role: 'Sponsor', interest: 'High', influence: 'High', engagementStrategy: 'Manage Closely' }
];

export const MOCK_PROGRAM_STAKEHOLDERS: ProgramStakeholder[] = [
  { id: 'PS-01', programId: 'PRG-001', name: 'City Council', role: 'Regulator', category: 'Strategic', engagementLevel: 'Supportive', influence: 'High', interest: 'High', engagementStrategy: 'Manage Closely' },
  { id: 'PS-02', programId: 'PRG-001', name: 'Local Business Assoc.', role: 'Impacted Group', category: 'Operational', engagementLevel: 'Resistant', influence: 'Medium', interest: 'High', engagementStrategy: 'Keep Informed' },
  { id: 'PS-03', programId: 'PRG-001', name: 'Engineering Corps', role: 'Execution Team', category: 'Delivery', engagementLevel: 'Supportive', influence: 'Low', interest: 'Medium', engagementStrategy: 'Monitor' }
];

export const MOCK_COMMUNICATION_PLAN: ProgramCommunicationItem[] = [
  { id: 'PC-01', programId: 'PRG-001', audience: 'City Council', content: 'Milestone Progress & Risk Report', frequency: 'Monthly', channel: 'Formal Presentation', owner: 'Program Manager' },
  { id: 'PC-02', programId: 'PRG-001', audience: 'Local Business Assoc.', content: 'Construction Disruption Schedule', frequency: 'Weekly', channel: 'Email Newsletter', owner: 'Comms Lead' }
];

export const MOCK_INTEGRATED_CHANGES: IntegratedChangeRequest[] = [
  {
    id: 'ICR-001',
    programId: 'PRG-001',
    title: 'Cloud-Native ERP Transition',
    description: 'Migration of municipal finance and HR systems to SAP S/4HANA Cloud. Requires significant process re-engineering.',
    type: 'Technology & Process',
    impactAreas: ['Systems', 'Processes', 'Data', 'Roles'],
    severity: 'High',
    status: 'In Progress',
    readinessImpact: [
      { stakeholderGroup: 'Finance Team', awareness: 85, desire: 60, knowledge: 40, ability: 30, reinforcement: 20 },
      { stakeholderGroup: 'IT Dept', awareness: 95, desire: 90, knowledge: 75, ability: 65, reinforcement: 40 },
      { stakeholderGroup: 'Dept Heads', awareness: 60, desire: 40, knowledge: 20, ability: 10, reinforcement: 10 }
    ]
  },
  {
    id: 'ICR-002',
    programId: 'PRG-001',
    title: 'Hybrid Work Policy Standardization',
    description: 'Implementing standardized remote work protocols and digital collaboration tools across all city departments.',
    type: 'Policy & Culture',
    impactAreas: ['Culture', 'Roles'],
    severity: 'Medium',
    status: 'Planned',
    readinessImpact: [
      { stakeholderGroup: 'General Staff', awareness: 70, desire: 90, knowledge: 60, ability: 80, reinforcement: 50 },
      { stakeholderGroup: 'Middle Mgmt', awareness: 80, desire: 40, knowledge: 50, ability: 40, reinforcement: 20 }
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
      approvers: ['Executive Steering Committee'],
      decisionNotes: 'Full approval granted. Proceed to planning and detailed architecture phase. Initial funding tranche released.',
      criteria: [
          { id: 'C1-1', description: 'Business Case Approved', status: 'Met' }, 
          { id: 'C1-2', description: 'Strategic Alignment Confirmed', status: 'Met' },
          { id: 'C1-3', description: 'Initial Funding Secured', status: 'Met' },
          { id: 'C1-4', description: 'Program Charter Signed', status: 'Met' },
          { id: 'C1-5', description: 'High-Level Scope Defined', status: 'Met' },
          { id: 'C1-6', description: 'Governance Plan Approved', status: 'Met' },
          { id: 'C1-7', description: 'Program Manager Assigned', status: 'Met' }
      ]
  },
  {
      id: 'PSG-02',
      programId: 'PRG-001',
      name: 'Gate 2: Architecture Lock',
      type: 'Architecture',
      plannedDate: '2024-02-01',
      actualDate: '2024-02-15',
      status: 'Conditional', 
      approvers: ['Chief Architect', 'CTO', 'Security Officer'], 
      decisionNotes: 'Conditional approval to proceed. Cybersecurity plan requires third-party audit before vendor onboarding. Pilot phase must be completed before full scale development.',
      criteria: [
          { id: 'C2-1', description: 'High-Level System Architecture Approved', status: 'Met' }, 
          { id: 'C2-2', description: 'Technology Stack Selected (Cloud, IoT Platform)', status: 'Met' },
          { id: 'C2-3', description: 'Data Governance & Privacy Framework Approved', status: 'Met' },
          { id: 'C2-4', description: 'Cybersecurity Plan Approved', status: 'Conditional', notes: 'Pending external vendor audit results' },
          { id: 'C2-5', description: 'Inter-Agency MOUs Signed', status: 'Met' },
          { id: 'C2-6', description: 'Prototype/Pilot Phase Success Criteria Met', status: 'Not Met', notes: 'Pilot delayed due to sensor availability' },
          { id: 'C2-7', description: 'Schedule Baseline Established', status: 'Met' },
          { id: 'C2-8', description: 'Cost Baseline Established', status: 'Met' }
      ]
  },
  {
      id: 'PSG-03',
      programId: 'PRG-001',
      name: 'Gate 3: Construction Mobilization',
      type: 'Scope',
      plannedDate: '2024-08-01',
      status: 'Pending', 
      approvers: ['Program Sponsor', 'Operations Dir', 'Head of Construction'],
      decisionNotes: 'Gate review pending. Key permits are still outstanding.',
      criteria: [
          { id: 'C3-1', description: 'Master Plan & Zoning Permits Acquired', status: 'Not Met', notes: 'City planning commission review delayed.' }, 
          { id: 'C3-2', description: 'General Contractor (GC) Selected & Onboarded', status: 'Met' },
          { id: 'C3-3', description: 'Bill of Materials (BOM) for Phase 1 Finalized', status: 'Met' },
          { id: 'C3-4', description: 'Long-Lead Items Procured (Sensors, Steel)', status: 'Met' },
          { id: 'C3-5', description: 'BIM Execution Plan Approved', status: 'Met' },
          { id: 'C3-6', description: 'Detailed Engineering Design (60%) Complete', status: 'Not Met', notes: 'Structural drawings are at 45%.' },
          { id: 'C3-7', description: 'Site Safety Plan Approved', status: 'Met' }
      ]
  }
];
