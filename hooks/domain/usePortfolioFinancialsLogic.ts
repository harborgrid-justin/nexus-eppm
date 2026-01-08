
import { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Project } from '../../types';

export const usePortfolioFinancialsLogic = (projects: Project[]) => {
  const { state } = useData();

  // --- 1. Cost vs Value Analysis Data ---
  const scatterData = useMemo(() => projects.map(p => ({
    name: p.code,
    budget: p.budget,
    // Normalize value score (0-200 scale based on weighted importance)
    value: (p.financialValue * 10) + (p.strategicImportance * 10),
    risk: p.riskScore * 50, // Bubble size
    category: p.category || 'Unassigned'
  })), [projects]);

  // --- 2. Multi-Year Budget Data (Calculated from Project Dates) ---
  const annualData = useMemo(() => {
      // Determine year range from projects
      const years = new Set<number>();
      const currentYear = new Date().getFullYear();
      
      projects.forEach(p => {
          const start = new Date(p.startDate);
          const end = new Date(p.endDate);
          if (!isNaN(start.getFullYear())) years.add(start.getFullYear());
          if (!isNaN(end.getFullYear())) years.add(end.getFullYear());
      });

      // Default range if empty
      if (years.size === 0) {
          years.add(currentYear);
          years.add(currentYear + 1);
      }
      
      const sortedYears = Array.from(years).sort();

      return sortedYears.map(year => {
          let budget = 0;
          let actuals = 0;
          let forecast = 0;

          projects.forEach(p => {
              const start = new Date(p.startDate);
              const end = new Date(p.endDate);
              const pStartYear = start.getFullYear();
              const pEndYear = end.getFullYear();

              // Simple linear allocation if project overlaps year
              if (year >= pStartYear && year <= pEndYear) {
                  const durationYears = Math.max(1, pEndYear - pStartYear + 1);
                  const yearlyBudget = p.budget / durationYears;
                  budget += yearlyBudget;

                  // Apply actuals only if year is passed or current
                  if (year <= currentYear) {
                       const yearlySpent = p.spent / durationYears; // Approximation
                       actuals += yearlySpent;
                  }
                  
                  // Forecast logic: Baseline + 5% variance for future years
                  forecast += yearlyBudget * 1.05; 
              }
          });

          return { 
              year, 
              Budget: Math.round(budget), 
              Actuals: Math.round(actuals), 
              Forecast: Math.round(forecast) 
          };
      });
  }, [projects]);

  // --- 3. Aggregate Stats ---
  const stats = useMemo(() => {
    const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
    const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
    const remaining = totalBudget - totalSpent;
    return { totalBudget, totalSpent, remaining };
  }, [projects]);

  // --- 4. Funding Gates (Dynamic) ---
  const fundingGates = useMemo(() => {
      // Sort gates by date
      const allGates = state.programStageGates
          .filter(g => g.type === 'Funding')
          .sort((a,b) => new Date(a.plannedDate).getTime() - new Date(b.plannedDate).getTime())
          .slice(0, 5);

      return allGates.map(g => ({
          id: g.id,
          name: g.name,
          date: g.actualDate || g.plannedDate,
          status: g.status,
          // Deriving amount from associated program context if possible, or defaulting for visualization
          amount: g.status === 'Approved' ? 'Released' : 'Pending' 
      }));
  }, [state.programStageGates]);

  return {
      scatterData,
      annualData,
      stats,
      fundingGates,
      hasData: projects.length > 0
  };
};
