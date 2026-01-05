

import { useMemo } from 'react';
import { useData } from '../context/DataContext';

export const usePortfolioData = () => {
  const { state, dispatch } = useData();

  const aggregatedFinancials = useMemo(() => {
      const totalBudget = state.projects.reduce((sum, p) => sum + p.budget, 0);
      const totalActuals = state.projects.reduce((sum, p) => sum + p.spent, 0);
      return { totalBudget, totalActuals, variance: totalBudget - totalActuals };
  }, [state.projects]);

  // Wrapper to allow components to update scenarios via dispatch (mocking the action for now as hook interface)
  const setScenarios = (newScenarios: any[]) => {
      // In a real app, this would iterate and dispatch UPDATE_PORTFOLIO_SCENARIO
      // For now, this is a placeholder to satisfy the interface if components expect a setter
      console.warn("Direct scenario set not supported in global state mode. Dispatch actions instead.");
  };

  return {
      projects: state.projects,
      programs: state.programs,
      drivers: state.strategicDrivers, // From Global State
      scenarios: state.portfolioScenarios, // From Global State
      setScenarios, 
      governanceDecisions: state.governanceDecisions, // From Global State
      esgMetrics: state.esgMetrics, // From Global State
      // FIX: Export strategicGoals
      strategicGoals: state.strategicGoals,
      aggregatedFinancials
  };
};