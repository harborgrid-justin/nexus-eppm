
import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Project } from '../types/index';
import { calculateProjectProgress } from '../utils/calculations';

export const useFinancials = (project: Project | undefined) => {
  const { state } = useData();

  const metrics = useMemo(() => {
    if (!project) return null;
    
    // Calculate Monthly Burn Rate
    const burnRate = project.spent / (new Date().getMonth() + 1); // Simple YTD avg
    
    // Forecast to Complete (EAC)
    const etc = project.budget - project.spent;
    const eac = project.spent + etc;
    const variance = project.budget - eac;
    
    // Cash Flow Projection (Next 6 Months)
    const cashFlowForecast = Array.from({ length: 6 }).map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        projectedSpend: burnRate * (1 + (i * 0.05)), // 5% monthly escalation mock
        committed: 50000 // Mock committed costs
      };
    });

    const percentComplete = calculateProjectProgress(project);

    return {
      burnRate,
      eac,
      variance,
      cashFlowForecast,
      cpi: project.spent > 0 ? (project.budget * (percentComplete / 100)) / project.spent : 1
    };
  }, [project]);

  return metrics;
};
