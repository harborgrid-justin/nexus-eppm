
import { useMemo } from 'react';
import { Project, BudgetLineItem, ChangeOrder, PurchaseOrder } from '../../types/index';
import { calculateEVM, calculateCommittedCost, checkFundingSolvency } from '../../utils/integrations/cost';

export const useProjectFinancials = (
  project: Project | undefined, 
  budgetItems: BudgetLineItem[], 
  changeOrders: ChangeOrder[],
  purchaseOrders: PurchaseOrder[]
) => {
  return useMemo(() => {
    if (!project) return null;

    const evmMetrics = calculateEVM(project, budgetItems);
    const totalPlanned = budgetItems.reduce((acc, item) => acc + item.planned, 0);
    const totalActual = budgetItems.reduce((acc, item) => acc + item.actual, 0);
    
    const totalCommitted = budgetItems.reduce((acc, item) => acc + calculateCommittedCost(purchaseOrders, item.id), 0);

    const approvedCO = changeOrders.filter(co => co.status === 'Approved').reduce((acc, co) => acc + co.amount, 0);
    const pendingCO = changeOrders.filter(co => co.status === 'Pending Approval').reduce((acc, co) => acc + co.amount, 0);

    const revisedBudget = (project.originalBudget || 0) + approvedCO;
    const budgetUtilization = revisedBudget > 0 ? ((totalActual + totalCommitted) / revisedBudget) * 100 : 0;
    const totalFunding = project.funding?.reduce((sum, f) => sum + f.amount, 0) || 0;

    return {
      totalPlanned, totalActual, totalCommitted,
      variance: revisedBudget - (totalActual + totalCommitted), 
      approvedCOAmount: approvedCO, pendingCOAmount: pendingCO,
      revisedBudget, budgetUtilization, evm: evmMetrics,
      solvency: checkFundingSolvency(totalActual, totalCommitted, totalFunding)
    };
  }, [budgetItems, changeOrders, project, purchaseOrders]);
};
