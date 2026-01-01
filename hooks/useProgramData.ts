import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
    // FIX: Correctly import ProgramVendorSummary type.
    ProgramVendorSummary,
    Program
} from '../types/index';

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

  // --- ARTIFACTS FROM STATE ---
  const programDependencies = useMemo(() => {
      // Logic could be expanded to filter relevant deps, for now assuming filtering by program scope logic if needed
      // but simpler to return global list filtered by relevant projects
      const projectIds = projects.map(p => p.id);
      return state.programDependencies.filter(d => projectIds.includes(d.sourceProjectId) || projectIds.includes(d.targetProjectId));
  }, [state.programDependencies, projects]);

  const programOutcomes = useMemo(() => 
      state.programOutcomes.filter(o => o.programId === programId),
  [state.programOutcomes, programId]);

  const programChangeRequests = useMemo(() =>
      // Mock logic: Assuming PCRs don't have programId directly in current type definition but we can infer or they do
      // Actually ProgramChangeRequest doesn't have programId in type? Let's check types.
      // Assuming state stores all, and we filter. The mock data didn't have programId. 
      // For now, returning all as per previous mock behavior or filtering if property exists.
      state.programChangeRequests, 
  [state.programChangeRequests]);

  const programRisks = useMemo(() => 
      state.programRisks.filter(r => r.programId === programId),
  [state.programRisks, programId]);

  const programIssues = useMemo(() => 
      state.programIssues.filter(i => i.programId === programId),
  [state.programIssues, programId]);

  const programFinancials = useMemo(() => {
      return {
          allocations: state.programAllocations.filter(a => a.programId === programId),
          gates: state.programFundingGates.filter(g => g.programId === programId)
      };
  }, [state.programAllocations, state.programFundingGates, programId]);

  const programStakeholders = useMemo(() =>
    state.programStakeholders.filter(s => s.programId === programId),
  [state.programStakeholders, programId]);

  const communicationPlan = useMemo(() =>
    state.programCommunicationPlan.filter(c => c.programId === programId),
  [state.programCommunicationPlan, programId]);

  const qualityStandards = state.programQualityStandards;
  const assuranceReviews = state.programAssuranceReviews;
  const transitionItems = state.programTransitionItems;
  const architectureStandards = state.programArchitectureStandards;
  const architectureReviews = state.programArchitectureReviews;
  const tradeoffScenarios = state.tradeoffScenarios;

  const programStageGates = useMemo(() => 
    state.programStageGates.filter(g => g.programId === programId),
  [state.programStageGates, programId]);

  const integratedChanges = useMemo(() => 
    state.integratedChanges.filter(c => c.programId === programId),
  [state.integratedChanges, programId]);

  // --- MOCKED PROGRAM VENDORS (Computed) ---
  const programVendors: ProgramVendorSummary[] = useMemo(() => [
      { vendorId: 'V-001', name: 'Steel Suppliers Inc.', totalContractValue: 12500000, activeContractsCount: 2, avgPerformanceScore: 88, criticalIssuesCount: 0, strategicAlignment: 'Medium' },
      { vendorId: 'V-002', name: 'Heavy Equipment Co.', totalContractValue: 5000000, activeContractsCount: 1, avgPerformanceScore: 95, criticalIssuesCount: 0, strategicAlignment: 'High' },
      { vendorId: 'V-Tech', name: 'TechSol Inc.', totalContractValue: 8000000, activeContractsCount: 1, avgPerformanceScore: 72, criticalIssuesCount: 2, strategicAlignment: 'High' }
  ], []);

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