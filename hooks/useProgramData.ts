import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
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
      const projectIds = projects.map(p => p.id);
      return state.programDependencies.filter(d => projectIds.includes(d.sourceProjectId) || projectIds.includes(d.targetProjectId));
  }, [state.programDependencies, projects]);

  const programOutcomes = useMemo(() => 
      state.programOutcomes.filter(o => o.programId === programId),
  [state.programOutcomes, programId]);

  const programChangeRequests = useMemo(() =>
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

  // --- COMPUTED PROGRAM VENDORS ---
  const programVendors: ProgramVendorSummary[] = useMemo(() => {
      const projectIds = projects.map(p => p.id);
      // Find all contracts related to projects in this program
      const relevantContracts = state.contracts.filter(c => projectIds.includes(c.projectId));
      
      // Group by Vendor
      const vendorMap = new Map<string, ProgramVendorSummary>();

      relevantContracts.forEach(contract => {
          if (!vendorMap.has(contract.vendorId)) {
              const vendor = state.vendors.find(v => v.id === contract.vendorId);
              vendorMap.set(contract.vendorId, {
                  vendorId: contract.vendorId,
                  name: vendor?.name || contract.vendorId,
                  totalContractValue: 0,
                  activeContractsCount: 0,
                  avgPerformanceScore: vendor?.performanceScore || 0,
                  criticalIssuesCount: 0, // Would need Issue -> Vendor link for precision, defaulting 0
                  strategicAlignment: vendor?.riskLevel === 'Low' ? 'High' : 'Medium'
              });
          }
          
          const entry = vendorMap.get(contract.vendorId)!;
          entry.totalContractValue += contract.contractValue;
          if (contract.status === 'Active') {
              entry.activeContractsCount += 1;
          }
      });

      return Array.from(vendorMap.values());
  }, [state.contracts, state.vendors, projects]);

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