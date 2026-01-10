
import { DataState, Action } from '../../types/index';
import { SystemAlert } from '../../types/business';
import { createAlert } from './common';
import { calculateEVM } from '../integrations/cost';

export const applyFinancialRules = (state: DataState, action: Action, alerts: SystemAlert[]) => {
  
  // Rule 9: Negative Budget Lines
  if (action.type === 'ADD_BUDGET_ITEM' || action.type === 'UPDATE_BUDGET_ITEM') {
      state.budgetItems.forEach(b => {
          if (b.planned < 0) {
              alerts.push(createAlert('Critical', 'Finance', 'Negative Budget', 
                  `Budget Line ${b.category} has negative value.`, { type: 'Project', id: b.projectId }));
          }
      });
  }

  // Rules 10-13: Project Financial Health
  if (action.type.startsWith('ADD_') || action.type.startsWith('UPDATE_') || action.type.startsWith('PROJECT_')) {
    state.projects.forEach(p => {
         const budgetItems = state.budgetItems.filter(b => b.projectId === p.id);
         const evm = calculateEVM(p, budgetItems);
         
         // Rule 10: EAC Breach (Forecast > Budget)
         if (evm.cpi > 0 && evm.eac > (p.budget || 0)) {
             const variance = evm.eac - p.budget;
             // Deduplicate alerts
             if (!alerts.some(a => a.title === 'Forecast Overrun' && a.link?.id === p.id)) {
                 alerts.push(createAlert('Critical', 'Finance', 'Forecast Overrun', 
                    `Project ${p.code} EAC exceeds budget by $${variance.toFixed(0)}.`, { type: 'Project', id: p.id }));
             }
         }

         // Rule 11: Rapid Burn (CPI < 0.8)
         if (evm.cpi > 0 && evm.cpi < 0.8) {
             if (!alerts.some(a => a.title === 'Cost Efficiency Low' && a.link?.id === p.id)) {
                 alerts.push(createAlert('Warning', 'Finance', 'Cost Efficiency Low', 
                    `CPI is ${evm.cpi.toFixed(2)} in ${p.code}. Cost overrun imminent.`, { type: 'Project', id: p.id }));
             }
         }

         // Rule 12: Zero Budget Active Project
         if (p.status === 'Active' && (p.budget === 0 || p.budget === undefined)) {
             if (!alerts.some(a => a.title === 'Zero Budget Activation' && a.link?.id === p.id)) {
                 alerts.push(createAlert('Blocker', 'Finance', 'Zero Budget Activation', 
                    `Active Project ${p.code} has $0.00 budget authority.`, { type: 'Project', id: p.id }));
             }
         }

         // Rule 13: Funding Solvency (Committed > Funded)
         const totalFunding = p.funding?.filter(f => f.status === 'Released').reduce((s,f) => s + f.amount, 0) || 0;
         const totalCommitted = state.purchaseOrders.filter(po => po.projectId === p.id).reduce((s,po) => s + po.amount, 0);
         
         if (totalCommitted > totalFunding) {
             if (!alerts.some(a => a.title === 'Insolvent Project' && a.link?.id === p.id)) {
                 alerts.push(createAlert('Blocker', 'Finance', 'Insolvent Project', 
                    `Project ${p.code} commitments ($${totalCommitted}) exceed released funding ($${totalFunding}).`, { type: 'Project', id: p.id }));
             }
         }
    });
  }

  // Rule 14: Change Order without Approval
  state.changeOrders.forEach(co => {
      if (co.status === 'Pending Approval' && new Date(co.dateSubmitted) < new Date(Date.now() - 14 * 86400000)) {
          if (!alerts.some(a => a.title === 'Stale Change Order' && a.message.includes(co.title))) {
              alerts.push(createAlert('Warning', 'Governance', 'Stale Change Order', 
                 `CO ${co.title} pending > 14 days.`, { type: 'Project', id: co.projectId }));
          }
      }
  });

  // Rule 15: Expense without Category
  state.expenses.forEach(exp => {
      if (!exp.categoryId) {
          alerts.push(createAlert('Info', 'Data', 'Uncategorized Expense', 
             `Expense ${exp.description} missing category.`, { type: 'Task', id: exp.activityId }));
      }
  });

  // Rule 16: Invoiced > PO Amount
  state.invoices.forEach(inv => {
      const po = state.purchaseOrders.find(p => p.id === inv.poId);
      if (po && inv.amount > po.amount) {
           alerts.push(createAlert('Critical', 'Finance', 'Overbilling Detected', 
             `Invoice ${inv.invoiceNumber} exceeds PO value.`, { type: 'Vendor', id: inv.vendorId }));
      }
  });

  // Rule 17: Retainage Release Check
  state.contracts.forEach(c => {
      if (c.status === 'Closed' && c.retainedToDate > 0) {
           alerts.push(createAlert('Warning', 'Finance', 'Unreleased Retainage', 
             `Contract ${c.id} closed but retains funds.`, { type: 'Vendor', id: c.vendorId }));
      }
  });

  // Rule 18: Duplicate Invoices
  const invNumbers = state.invoices.map(i => i.invoiceNumber);
  if (new Set(invNumbers).size !== invNumbers.length) {
       if (!alerts.some(a => a.title === 'Duplicate Invoice')) {
           alerts.push(createAlert('Critical', 'Finance', 'Duplicate Invoice', 'Duplicate invoice number detected in system.'));
       }
  }

  return {};
};
