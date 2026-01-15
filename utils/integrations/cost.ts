
import { Project } from '../../types/project';
import { BudgetLineItem, ChangeOrder, EVMMetrics } from '../../types/finance';
import { PurchaseOrder } from '../../types/procurement';
import { getDaysDiff } from '../dateUtils';
import { calculateProjectProgress } from '../calculations';

export const calculateScopeCreep = (originalBudget: number, changeOrders: ChangeOrder[]): number => {
  if (originalBudget === 0) return 0;
  const approvedChangeValue = changeOrders
    .filter(co => co.status === 'Approved')
    .reduce((sum, co) => sum + co.amount, 0);
  return (approvedChangeValue / originalBudget) * 100;
};

export const calculateCommittedCost = (purchaseOrders: PurchaseOrder[], budgetLineItemId: string): number => {
    return purchaseOrders
      .filter(po => po.linkedBudgetLineItemId === budgetLineItemId && po.status === 'Issued')
      .reduce((sum, po) => sum + po.amount, 0);
};

export const checkFundingSolvency = (actuals: number, committed: number, totalFunding: number): 'Solvent' | 'At Risk' | 'Insolvent' => {
    const totalExposure = actuals + committed;
    if (totalFunding < actuals) return 'Insolvent';
    if (totalFunding < totalExposure) return 'At Risk';
    return 'Solvent';
};

export const calculateEVM = (project: Project, budgetItems: BudgetLineItem[]): EVMMetrics => {
  const today = new Date();
  const projectStart = new Date(project.startDate);
  const totalProjectDays = getDaysDiff(projectStart, new Date(project.endDate));
  const daysElapsed = getDaysDiff(projectStart, today);

  // 1. Budget at Completion (BAC)
  const bac = project.originalBudget;
  
  // 2. Actual Cost (AC)
  const ac = project.spent;

  // 3. Planned Value (PV)
  // Standard linear distribution approximation for the baseline
  const schedulePercent = totalProjectDays > 0 ? Math.min(1, Math.max(0, daysElapsed / totalProjectDays)) : 0;
  // Apply a slight S-curve weighting for realism if mid-project
  const curveFactor = schedulePercent < 0.5 ? 2 * schedulePercent * schedulePercent : -1 + (4 - 2 * schedulePercent) * schedulePercent;
  const pv = bac * curveFactor;

  // 4. Earned Value (EV)
  const percentComplete = calculateProjectProgress(project);
  const ev = bac * (percentComplete / 100);

  // 5. Variances
  const sv = ev - pv; // Schedule Variance
  const cv = ev - ac; // Cost Variance

  // 6. Performance Indices
  const spi = pv > 0 ? (ev / pv) : 1;
  const cpi = ac > 0 ? (ev / ac) : 1;

  // 7. Forecasting
  // EAC = BAC / CPI (Typical formula assuming current variance continues)
  // Guard against divide by zero or extreme early project CPI
  const validCpi = cpi === 0 ? 0.1 : cpi; // Avoid infinity
  const eac = validCpi > 0 ? (bac / validCpi) : bac;
  
  const etc = Math.max(0, eac - ac);
  const vac = bac - eac;

  // 8. To Complete Performance Index (TCPI)
  // (BAC - EV) / (BAC - AC) -> Efficiency needed to finish on budget
  const workRemaining = bac - ev;
  const fundsRemaining = bac - ac;
  const tcpi = fundsRemaining > 0 ? (workRemaining / fundsRemaining) : 0;

  return {
    pv, ev, ac, sv, cv, spi, cpi, bac, eac, etc, vac, tcpi,
    status: spi > 1.05 ? 'Ahead' : spi < 0.95 ? 'Behind' : 'On Track',
    costStatus: cpi > 1.05 ? 'Under Budget' : cpi < 0.95 ? 'Over Budget' : 'On Budget'
  };
};
