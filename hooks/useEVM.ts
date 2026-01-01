
import { useMemo } from 'react';
// FIX: Correctly import Project and BudgetLineItem types.
import { Project } from '../types/project';
import { BudgetLineItem, EVMMetrics } from '../types/finance';
import { calculateProjectProgress } from '../utils/calculations';
import { getDaysDiff } from '../utils/dateUtils';

export { EVMMetrics };

export const useEVM = (project: Project | undefined, budgetItems: BudgetLineItem[] = []) => {
  const metrics = useMemo<EVMMetrics | null>(() => {
    if (!project) return null;

    const today = new Date();
    const projectStart = new Date(project.startDate);
    const totalProjectDays = getDaysDiff(projectStart, new Date(project.endDate));
    const daysElapsed = getDaysDiff(projectStart, today);

    // 1. Core Variables
    const bac = project.originalBudget;
    const ac = project.spent;

    // 2. Planned Value (PV)
    // In a real P6 import, PV is derived from resource-loaded baselines. 
    // Here we assume a linear burn rate for the baseline duration.
    const schedulePercent = totalProjectDays > 0 ? Math.min(1, Math.max(0, daysElapsed / totalProjectDays)) : 0;
    const pv = bac * schedulePercent;

    // 3. Earned Value (EV)
    // Based on physical % complete of tasks
    const percentComplete = calculateProjectProgress(project);
    const ev = bac * (percentComplete / 100);

    // 4. Variances
    const sv = ev - pv;
    const cv = ev - ac;

    // 5. Indices
    const spi = pv > 0 ? (ev / pv) : 1;
    const cpi = ac > 0 ? (ev / ac) : 1;

    // 6. Forecasting
    // EAC = BAC / CPI (Assuming current performance continues)
    const eac = cpi > 0 ? (bac / cpi) : bac;
    const etc = eac - ac;
    const vac = bac - eac;

    // 7. TCPI (To Complete Performance Index)
    // Work Remaining / Funds Remaining
    const workRemaining = bac - ev;
    const fundsRemaining = bac - ac;
    const tcpi = fundsRemaining > 0 ? (workRemaining / fundsRemaining) : 0;

    return {
      pv, ev, ac, sv, cv, spi, cpi, bac, eac, etc, vac, tcpi,
      status: spi > 1.05 ? 'Ahead' : spi < 0.95 ? 'Behind' : 'On Track',
      costStatus: cpi > 1.05 ? 'Under Budget' : cpi < 0.95 ? 'Over Budget' : 'On Budget'
    };
  }, [project, budgetItems]);

  return metrics;
};
