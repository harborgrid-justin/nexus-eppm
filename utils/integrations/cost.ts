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

  const bac = project.originalBudget;
  const ac = project.spent;
  const schedulePercent = totalProjectDays > 0 ? Math.min(1, Math.max(0, daysElapsed / totalProjectDays)) : 0;
  const pv = bac * schedulePercent;
  const percentComplete = calculateProjectProgress(project);
  const ev = bac * (percentComplete / 100);
  const sv = ev - pv;
  const cv = ev - ac;
  const spi = pv > 0 ? (ev / pv) : 1;
  const cpi = ac > 0 ? (ev / ac) : 1;
  const eac = cpi > 0 ? (bac / cpi) : bac;
  const etc = eac - ac;
  const vac = bac - eac;
  const workRemaining = bac - ev;
  const fundsRemaining = bac - ac;
  const tcpi = fundsRemaining > 0 ? (workRemaining / fundsRemaining) : 0;

  return {
    pv, ev, ac, sv, cv, spi, cpi, bac, eac, etc, vac, tcpi,
    status: spi > 1.05 ? 'Ahead' : spi < 0.95 ? 'Behind' : 'On Track',
    costStatus: cpi > 1.05 ? 'Under Budget' : cpi < 0.95 ? 'Over Budget' : 'On Budget'
  };
};