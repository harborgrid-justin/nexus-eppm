
import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Project, TaskStatus, Issue } from '../types/index';
import { calculateProjectProgress } from '../utils/calculations';
import { useTheme } from '../context/ThemeContext';
import { calculateEVM } from '../utils/integrations/cost';

export const usePortfolioState = () => {
  const { state } = useData();
  const theme = useTheme();
  const { projects, issues, budgetItems } = state;

  const summary = useMemo(() => {
    const totalProjects = projects.length;
    const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
    const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    const healthCounts = {
      good: projects.filter(p => p.health === 'Good').length,
      warning: projects.filter(p => p.health === 'Warning').length,
      critical: projects.filter(p => p.health === 'Critical').length,
    };

    const totalTasks = projects.reduce((acc, p) => acc + p.tasks.length, 0);
    const totalDelayedTasks = projects.reduce((acc, p) => acc + p.tasks.filter(t => t.status === TaskStatus.DELAYED).length, 0);

    // Calculate portfolio-wide SPI
    const activeProjectsWithMetrics = projects
        .map(p => calculateEVM(p, budgetItems.filter(b => b.projectId === p.id)))
        .filter(evm => evm && evm.pv > 0);

    const portfolioSpi = activeProjectsWithMetrics.length > 0 
        ? activeProjectsWithMetrics.reduce((acc, evm) => acc + (evm?.spi || 0), 0) / activeProjectsWithMetrics.length
        : 1;

    // Calculate total critical issues
    const totalCriticalIssues = issues.filter(i => i.priority === 'Critical' || i.priority === 'High').length;


    return {
      totalProjects,
      totalBudget,
      totalSpent,
      budgetUtilization,
      healthCounts,
      totalTasks,
      totalDelayedTasks,
      portfolioSpi,
      totalCriticalIssues,
    };
  }, [projects, issues, budgetItems]);
  
  const healthDataForChart = useMemo(() => [
    { name: 'Good', value: summary.healthCounts.good },
    { name: 'Warning', value: summary.healthCounts.warning },
    { name: 'Critical', value: summary.healthCounts.critical },
  ], [summary.healthCounts]);
  
  const budgetDataForChart = useMemo(() => projects.map(p => ({
    name: p.code,
    Budget: p.budget,
    Spent: p.spent
  })), [projects]);

  return {
    projects, // Pass through for list views
    summary,
    healthDataForChart,
    budgetDataForChart,
  };
};
