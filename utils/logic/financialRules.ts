
import { DataState } from '../../context/DataContext';
import { SystemAlert } from '../../types/business';
import { createAlert } from './common';
import { calculateEVM } from '../integrationUtils';

export const applyFinancialRules = (state: DataState, action: any, alerts: SystemAlert[]) => {
  const projects = state.projects;

  // Run checks on relevant actions
  if (['UPDATE_TASK', 'ADD_INVOICE', 'APPROVE_CHANGE_ORDER'].includes(action.type)) {
      state.projects.forEach(p => {
         const budgetItems = state.budgetItems.filter(b => b.projectId === p.id);
         const evm = calculateEVM(p, budgetItems);
         
         // Hook: EAC Breach
         if (evm.cpi > 0 && (p.budget / evm.cpi) > p.budget * 1.1) {
             alerts.push(createAlert('Critical', 'Finance', 'EAC Forecast Breach', 
               `Project ${p.code} forecasted to exceed budget by >10% based on current CPI.`, { type: 'Project', id: p.id }));
         }

         // Hook: Invoice Lag (Work done, not billed)
         if (evm.ev > (evm.ac * 1.5) && evm.ev > 10000) {
             alerts.push(createAlert('Warning', 'Finance', 'Revenue Leakage', 
               `Earned Value significantly outpaces Actuals in ${p.code}. Missing invoices?`, { type: 'Project', id: p.id }));
         }

         // Hook: Contingency Low
         const remainingWork = p.budget - evm.ev;
         const remainingContingency = p.reserves?.contingencyReserve || 0; 
         if (remainingWork > 0 && (remainingContingency / remainingWork) < 0.05) {
             alerts.push(createAlert('Critical', 'Risk', 'Reserves Depleted', 
               `Contingency is <5% of remaining work for ${p.code}.`, { type: 'Project', id: p.id }));
         }
      });
  }

  // Hook: Rapid Burn Rate
  if (action.type === 'UPDATE_TASK') {
      // Mock logic: In real app, compare this month's actuals vs last month
      const isRapidBurn = false; // Placeholder
      if (isRapidBurn) {
           alerts.push(createAlert('Warning', 'Finance', 'Rapid Burn Rate', 'Burn rate increased >50% MoM.'));
      }
  }

  return { projects, alerts };
};
