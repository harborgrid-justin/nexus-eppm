
import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
    Program, Project, GovernanceRole, GovernanceEvent, StrategicGoal, 
    ProgramObjective, ProgramDependency, ProgramOutcome, ProgramChangeRequest, 
    ProgramRisk, ProgramBudgetAllocation, ProgramFundingGate,
    ProgramStakeholder, ProgramCommunicationItem, ProgramQualityStandard,
    ProgramAssuranceReview, ProgramTransitionItem, ProgramArchitectureStandard,
    ProgramArchitectureReview, TradeoffScenario, ProgramIssue,
    ProgramStageGate, IntegratedChangeRequest, ProgramVendorSummary
} from '../types';

export const useProgramData = (programId: string | null) => {
  const { state } = useData();

  const program = useMemo(() => 
    state.programs.find(p => p.id === programId), 
  [state.programs, programId]);

  const projects = useMemo(() => 
    state.projects.filter(p => p.programId === programId),
  [state.projects, programId]);

  // --- MOCKED PROGRAM GOVERNANCE DATA ---
  const governanceRoles: GovernanceRole[] = useMemo(() => [
    { id: 'GR-01', role: 'Sponsor', name: 'VP Infrastructure', authorityLevel: 'High', responsibilities: 'Funding approval, strategic alignment validation.' },
    { id: 'GR-02', role: 'Steering Committee', name: 'Enterprise Steering Board', authorityLevel: 'High', responsibilities: 'Gate reviews, major scope changes, risk escalation.' },
    { id: 'GR-03', role: 'Program Manager', name: program?.manager || 'Unassigned', authorityLevel: 'Medium', responsibilities: 'Day-to-day execution, dependency management, reporting.' },
  ], [program]);

  const governanceEvents: GovernanceEvent[] = useMemo(() => [
    { id: 'GE-01', name: 'Monthly Steering Committee', type: 'Steering Committee', frequency: 'Monthly', nextDate: '2024-07-15', status: 'Scheduled' },
    { id: 'GE-02', name: 'Phase 2 Gate Review', type: 'Gate Review', frequency: 'Ad-hoc', nextDate: '2024-08-01', status: 'Scheduled' },
  ], []);

  // --- MOCKED STRATEGIC DATA ---
  const strategicGoals: StrategicGoal[] = useMemo(() => [
    { id: 'SG-01', name: 'Operational Excellence', description: 'Reduce operating costs by 15% through infrastructure modernization.', programs: ['PRG-001', 'PRG-002'] },
    { id: 'SG-02', name: 'Market Expansion', description: 'Enable service delivery in 2 new metropolitan regions.', programs: ['PRG-001'] },
  ], []);

  const programObjectives: ProgramObjective[] = useMemo(() => [
    { id: 'PO-01', description: 'Increase transit capacity by 40%', linkedStrategicGoalId: 'SG-02', linkedProjectIds: ['P1001'] },
    { id: 'PO-02', description: 'Centralize city services hub', linkedStrategicGoalId: 'SG-01', linkedProjectIds: ['P1002'] },
  ], []);

  // --- MOCKED DEPENDENCIES ---
  const programDependencies: ProgramDependency[] = useMemo(() => {
      if (projects.length < 2) return [];
      return [
          { id: 'PD-01', sourceProjectId: projects[0].id, targetProjectId: projects[1]?.id || 'P-EXT', description: 'Shared utility corridor completion required before commercial hub foundation.', type: 'Technical', status: 'Critical' }
      ];
  }, [projects]);

  // --- MOCKED SCOPE & CHANGE CONTROL DATA ---
  const programOutcomes: ProgramOutcome[] = useMemo(() => [
      { id: 'OUT-01', description: 'Operational High-Speed Rail Link', targetDate: '2026-12-31', status: 'On Track', linkedProjectIds: ['P1001'] },
      { id: 'OUT-02', description: 'Integrated Digital Ticketing System', targetDate: '2025-06-30', status: 'At Risk', linkedProjectIds: ['P1001', 'P1002'] }
  ], []);

  const programChangeRequests: ProgramChangeRequest[] = useMemo(() => [
      { id: 'PCR-001', title: 'Add North Station Retail Zone', description: 'Expand scope to include 5000 sqft retail space.', submittedBy: 'Commercial Director', submittedDate: '2024-06-10', status: 'Pending PCCB', impact: { benefits: 'Increased annual revenue by $2M', cost: 1500000, schedule: 45, risk: 'Medium' } },
      { id: 'PCR-002', title: 'Defer Platform Extension', description: 'Move platform extension to Phase 2 to meet deadline.', submittedBy: 'Program Mgr', submittedDate: '2024-05-15', status: 'Approved', impact: { benefits: 'Delayed capacity increase', cost: -500000, schedule: -30, risk: 'Low' } }
  ], []);

  // --- MOCKED RISK DATA ---
  const programRisks: ProgramRisk[] = useMemo(() => [
      { id: 'PR-001', description: 'Regulatory shift in environmental compliance standards', category: 'External', probability: 'Medium', impact: 'High', score: 12, owner: 'Legal', status: 'Open', mitigationPlan: 'Engage lobbyists and prepare impact assessment.' },
      { id: 'PR-002', description: 'Resource contention between Metro and Hub projects', category: 'Resource', probability: 'High', impact: 'Medium', score: 12, owner: 'PMO', status: 'Open', mitigationPlan: 'Implement resource leveling at portfolio level.' },
      { id: 'PR-003', description: 'Governance misalignment with new Steering Committee', category: 'Governance', probability: 'Low', impact: 'High', score: 9, owner: 'Program Sponsor', status: 'Mitigated', mitigationPlan: 'Workshops to align on Terms of Reference.' }
  ], []);

  // --- MOCKED FINANCIAL DATA ---
  const programFinancials: { allocations: ProgramBudgetAllocation[], gates: ProgramFundingGate[] } = useMemo(() => {
      return {
          allocations: [
              ...projects.map(p => ({ projectId: p.id, allocated: p.budget, spent: p.spent, forecast: p.budget * 1.1 })), // Mock forecast 
              { projectId: 'Unallocated Reserve', allocated: 5000000, spent: 0, forecast: 5000000 }
          ],
          gates: [
              { id: 'FG-01', name: 'Initiation Release', amount: 5000000, releaseDate: '2023-01-15', status: 'Released', milestoneTrigger: 'Program Charter Approval' },
              { id: 'FG-02', name: 'Design Phase Funding', amount: 15000000, releaseDate: '2023-06-01', status: 'Released', milestoneTrigger: 'Concept Review' },
              { id: 'FG-03', name: 'Construction Mobilization', amount: 50000000, releaseDate: '2024-02-01', status: 'Pending', milestoneTrigger: 'Permit Acquisition' }
          ]
      };
  }, [projects]);

  // --- MOCKED STAKEHOLDER DATA ---
  const programStakeholders: ProgramStakeholder[] = useMemo(() => [
      { id: 'PS-01', name: 'City Council', role: 'Regulator', category: 'Strategic', engagementLevel: 'Supportive', influence: 'High', interest: 'High' },
      { id: 'PS-02', name: 'Local Business Assoc.', role: 'Impacted Group', category: 'Operational', engagementLevel: 'Resistant', influence: 'Medium', interest: 'High' },
      { id: 'PS-03', name: 'Engineering Corps', role: 'Execution Team', category: 'Delivery', engagementLevel: 'Supportive', influence: 'Low', interest: 'Medium' }
  ], []);

  const communicationPlan: ProgramCommunicationItem[] = useMemo(() => [
      { id: 'PC-01', audience: 'City Council', content: 'Milestone Progress & Risk Report', frequency: 'Monthly', channel: 'Formal Presentation', owner: 'Program Manager' },
      { id: 'PC-02', audience: 'Local Business Assoc.', content: 'Construction Disruption Schedule', frequency: 'Weekly', channel: 'Email Newsletter', owner: 'Comms Lead' }
  ], []);

  // --- MOCKED QUALITY DATA ---
  const qualityStandards: ProgramQualityStandard[] = useMemo(() => [
      { id: 'PQS-01', category: 'Compliance', description: 'ISO 9001 Quality Management System alignment', enforcementLevel: 'Mandatory' },
      { id: 'PQS-02', category: 'Architecture', description: 'Enterprise Data Model v4.0 adherence', enforcementLevel: 'Mandatory' },
      { id: 'PQS-03', category: 'Process', description: 'Agile delivery methodology for software components', enforcementLevel: 'Guideline' }
  ], []);

  const assuranceReviews: ProgramAssuranceReview[] = useMemo(() => [
      { id: 'PAR-01', date: '2024-03-15', type: 'Gate Review', scope: 'Phase 1 Design Completion', findings: 'Minor documentation gaps in utility mapping.', status: 'Conditional' },
      { id: 'PAR-02', date: '2024-06-20', type: 'Health Check', scope: 'Program Financial Controls', findings: 'All variance reports submitted on time.', status: 'Pass' }
  ], []);

  // --- MOCKED CLOSURE DATA ---
  const transitionItems: ProgramTransitionItem[] = useMemo(() => [
      { id: 'PT-01', category: 'Training', description: 'Train Operations team on new signal system', owner: 'Training Lead', status: 'In Progress', dueDate: '2025-11-01' },
      { id: 'PT-02', category: 'Documentation', description: 'Final As-Built Drawings handover', owner: 'Project Manager', status: 'Planned', dueDate: '2025-12-15' },
      { id: 'PT-03', category: 'Contract', description: 'Vendor contract closeout and final payments', owner: 'Procurement', status: 'Planned', dueDate: '2026-01-30' }
  ], []);

  // --- MOCKED ARCHITECTURE DATA ---
  const architectureStandards: ProgramArchitectureStandard[] = useMemo(() => [
      { id: 'PAS-01', category: 'Integration', title: 'Event-Driven Architecture', description: 'All cross-module communication must be asynchronous via message bus.', status: 'Baseline' },
      { id: 'PAS-02', category: 'Security', title: 'Zero Trust Principles', description: 'Strict identity verification for every user and device.', status: 'Baseline' },
      { id: 'PAS-03', category: 'Data', title: 'Master Data Management', description: 'Single source of truth for Project IDs and Resource records.', status: 'Draft' }
  ], []);

  const architectureReviews: ProgramArchitectureReview[] = useMemo(() => [
      { id: 'PAR-01', gate: 'Preliminary Design Review', date: '2024-02-10', status: 'Completed', notes: 'Approved with conditions on API latency.' },
      { id: 'PAR-02', gate: 'Critical Design Review', date: '2024-08-15', status: 'Scheduled', notes: 'Focus on scalability and disaster recovery.' }
  ], []);

  // --- MOCKED TRADEOFF DATA ---
  const tradeoffScenarios: TradeoffScenario[] = useMemo(() => [
      { id: 'TS-01', name: 'Accelerate Phase 2', description: 'Compress schedule by 3 months using overtime.', benefitValue: 2000000, costImpact: 500000, riskScore: 12, recommendation: 'Proceed' },
      { id: 'TS-02', name: 'Vendor Switch', description: 'Change steel supplier to reduce cost by 10%.', benefitValue: 150000, costImpact: 50000, riskScore: 20, recommendation: 'Reject' }
  ], []);

  // --- MOCKED PROGRAM ISSUES ---
  const programIssues: ProgramIssue[] = useMemo(() => [
      { id: 'PI-01', title: 'Global Supply Chain Disruption', description: 'Steel tariffs impacting all infrastructure projects.', priority: 'Critical', status: 'Open', impactedProjectIds: ['P1001', 'P1002'], owner: 'Procurement Director', resolutionPath: 'Negotiating bulk fixed-price contracts.' },
      { id: 'PI-02', title: 'PMO Resource Shortage', description: 'Lack of senior schedulers for complex integration.', priority: 'High', status: 'Escalated', impactedProjectIds: ['P1001'], owner: 'HR Director', resolutionPath: 'Hiring contractors.' }
  ], []);

  // --- MOCKED STAGE GATES ---
  const programStageGates: ProgramStageGate[] = useMemo(() => [
      {
          id: 'PSG-01', name: 'Gate 1: Initiation Approval', type: 'Funding', plannedDate: '2023-01-15', actualDate: '2023-01-20', status: 'Approved', 
          criteria: [{ id: 'C1', description: 'Business Case Signed', status: 'Met' }, { id: 'C2', description: 'Initial Funding Secured', status: 'Met' }], 
          approvers: ['Executive Steering Committee']
      },
      {
          id: 'PSG-02', name: 'Gate 2: Architecture Lock', type: 'Architecture', plannedDate: '2024-02-01', actualDate: '2024-02-15', status: 'Conditional', 
          criteria: [{ id: 'C1', description: 'High Level Design Approved', status: 'Met' }, { id: 'C2', description: 'Security Audit Passed', status: 'Not Met', notes: 'Pending pen-test results' }], 
          approvers: ['Chief Architect', 'CTO']
      },
      {
          id: 'PSG-03', name: 'Gate 3: Construction Mobilization', type: 'Scope', plannedDate: '2024-08-01', status: 'Pending', 
          criteria: [{ id: 'C1', description: 'Permits Acquired', status: 'Not Met' }, { id: 'C2', description: 'Contractor Onboarded', status: 'Met' }], 
          approvers: ['Program Sponsor', 'Operations Dir']
      }
  ], []);

  // --- MOCKED INTEGRATED CHANGE ---
  const integratedChanges: IntegratedChangeRequest[] = useMemo(() => [
      {
          id: 'ICR-001', title: 'New ERP Rollout', description: 'Transitioning finance from Legacy System to SAP.', type: 'Hybrid', 
          impactAreas: ['Systems', 'Processes', 'Data'], severity: 'High', status: 'Assessing', 
          readinessImpact: [
              { stakeholderGroup: 'Finance Team', awareness: 90, desire: 60, knowledge: 40, ability: 20, reinforcement: 10 },
              { stakeholderGroup: 'Project Managers', awareness: 50, desire: 80, knowledge: 10, ability: 10, reinforcement: 0 }
          ]
      },
      {
          id: 'ICR-002', title: 'Agile Transformation', description: 'Shifting software teams to SAFe methodology.', type: 'Organizational', 
          impactAreas: ['Roles', 'Governance'], severity: 'Medium', status: 'Implemented',
          readinessImpact: [
              { stakeholderGroup: 'Dev Teams', awareness: 100, desire: 90, knowledge: 85, ability: 80, reinforcement: 70 }
          ]
      }
  ], []);

  // --- MOCKED PROGRAM VENDORS ---
  const programVendors: ProgramVendorSummary[] = useMemo(() => [
      { vendorId: 'V-001', name: 'Steel Suppliers Inc.', totalContractValue: 12500000, activeContractsCount: 2, avgPerformanceScore: 88, criticalIssuesCount: 0, strategicAlignment: 'Medium' },
      { vendorId: 'V-002', name: 'Heavy Equipment Co.', totalContractValue: 5000000, activeContractsCount: 1, avgPerformanceScore: 95, criticalIssuesCount: 0, strategicAlignment: 'High' },
      { vendorId: 'V-Tech', name: 'TechSol Inc.', totalContractValue: 8000000, activeContractsCount: 1, avgPerformanceScore: 72, criticalIssuesCount: 2, strategicAlignment: 'High' }
  ], []);


  // Aggregate Metrics
  const aggregateMetrics = useMemo(() => {
      const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
      const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
      const riskCount = state.risks.filter(r => projects.some(p => p.id === r.projectId)).length;
      return { totalBudget, totalSpent, riskCount };
  }, [projects, state.risks]);

  return {
    program,
    projects,
    governanceRoles,
    governanceEvents,
    strategicGoals,
    programObjectives,
    programDependencies,
    programOutcomes,
    programChangeRequests,
    programRisks,
    programFinancials,
    programStakeholders,
    communicationPlan,
    qualityStandards,
    assuranceReviews,
    transitionItems,
    architectureStandards,
    architectureReviews,
    tradeoffScenarios,
    programIssues,
    programStageGates,
    integratedChanges,
    programVendors,
    aggregateMetrics
  };
};
