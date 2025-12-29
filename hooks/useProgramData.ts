
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

  // --- PROGRAM GOVERNANCE DATA (From State) ---
  const governanceRoles = useMemo(() => 
      state.governanceRoles.filter(r => r.programId === programId),
  [state.governanceRoles, programId]);

  const governanceEvents = useMemo(() => 
      state.governanceEvents.filter(e => e.programId === programId),
  [state.governanceEvents, programId]);

  // --- STRATEGIC DATA (CONNECTED TO STATE) ---
  const strategicGoals = useMemo(() => {
      if (!programId) return state.strategicGoals;
      return state.strategicGoals.filter(g => g.programs.includes(programId));
  }, [state.strategicGoals, programId]);

  const programObjectives = useMemo(() => {
      if (!programId) return state.programObjectives;
      const projectIds = projects.map(p => p.id);
      return state.programObjectives.filter(obj => 
          obj.linkedProjectIds.some(pid => projectIds.includes(pid))
      );
  }, [state.programObjectives, projects, programId]);

  // --- MOCKED DEPENDENCIES (Still Mocked as they require complex relational data) ---
  const programDependencies: ProgramDependency[] = useMemo(() => {
      if (projects.length < 2) return [];
      return [
          { id: 'PD-01', sourceProjectId: projects[0].id, targetProjectId: projects[1]?.id || 'P-EXT', description: 'Shared utility corridor completion required before commercial hub foundation.', type: 'Technical', status: 'Critical' }
      ];
  }, [projects]);

  // --- MOCKED SCOPE (For now) ---
  const programOutcomes: ProgramOutcome[] = useMemo(() => [
      { id: 'OUT-01', description: 'Operational High-Speed Rail Link', targetDate: '2026-12-31', status: 'On Track', linkedProjectIds: ['P1001'] },
      { id: 'OUT-02', description: 'Integrated Digital Ticketing System', targetDate: '2025-06-30', status: 'At Risk', linkedProjectIds: ['P1001', 'P1002'] }
  ], []);

  const programChangeRequests: ProgramChangeRequest[] = useMemo(() => [
      { id: 'PCR-001', title: 'Add North Station Retail Zone', description: 'Expand scope to include 5000 sqft retail space.', submittedBy: 'Commercial Director', submittedDate: '2024-06-10', status: 'Pending PCCB', impact: { benefits: 'Increased annual revenue by $2M', cost: 1500000, schedule: 45, risk: 'Medium' } },
      { id: 'PCR-002', title: 'Defer Platform Extension', description: 'Move platform extension to Phase 2 to meet deadline.', submittedBy: 'Program Mgr', submittedDate: '2024-05-15', status: 'Approved', impact: { benefits: 'Delayed capacity increase', cost: -500000, schedule: -30, risk: 'Low' } }
  ], []);

  // --- RISK DATA (From State) ---
  const programRisks = useMemo(() => 
      state.programRisks.filter(r => r.programId === programId),
  [state.programRisks, programId]);

  const programIssues = useMemo(() => 
      state.programIssues.filter(i => i.programId === programId),
  [state.programIssues, programId]);

  // --- FINANCIAL DATA (From State + Projects) ---
  const programFinancials = useMemo(() => {
      return {
          allocations: state.programAllocations.filter(a => a.programId === programId),
          gates: state.programFundingGates.filter(g => g.programId === programId)
      };
  }, [state.programAllocations, state.programFundingGates, programId]);

  // --- MOCKED STAKEHOLDER DATA (Still Mocked) ---
  const programStakeholders: ProgramStakeholder[] = useMemo(() => [
      { id: 'PS-01', projectId: programId || 'PRG-001', programId: programId || 'PRG-001', name: 'City Council', role: 'Regulator', category: 'Strategic', engagementLevel: 'Supportive', influence: 'High', interest: 'High', engagementStrategy: 'Manage Closely' },
      { id: 'PS-02', projectId: programId || 'PRG-001', programId: programId || 'PRG-001', name: 'Local Business Assoc.', role: 'Impacted Group', category: 'Operational', engagementLevel: 'Resistant', influence: 'Medium', interest: 'High', engagementStrategy: 'Keep Informed' },
      { id: 'PS-03', projectId: programId || 'PRG-001', programId: programId || 'PRG-001', name: 'Engineering Corps', role: 'Execution Team', category: 'Delivery', engagementLevel: 'Supportive', influence: 'Low', interest: 'Medium', engagementStrategy: 'Monitor' }
  ], [programId]);

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
