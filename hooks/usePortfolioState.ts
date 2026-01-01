


import { useMemo } from 'react';
import { useData } from '../context/DataContext';
// FIX: Corrected import path for types to resolve module resolution errors.
import { Project, TaskStatus } from '../types/index';
import { calculateProjectProgress } from '../utils/calculations';
import { useTheme } from '../context/ThemeContext';

export const usePortfolioState = () => {
  const { state } = useData();
  const theme = useTheme();
  const { projects } = state;

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

    return {
      totalProjects,
      totalBudget,
      totalSpent,
      budgetUtilization,
      healthCounts,
      totalTasks,
      totalDelayedTasks,
    };
  }, [projects]);
  
  const healthDataForChart = useMemo(() => [
    { name: 'Good', value: summary.healthCounts.good, color: theme.charts.palette[1] },
    { name: 'Warning', value: summary.healthCounts.warning, color: theme.charts.palette[2] },
    { name: 'Critical', value: summary.healthCounts.critical, color: theme.charts.palette[3] },
  ], [summary.healthCounts, theme]);
  
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