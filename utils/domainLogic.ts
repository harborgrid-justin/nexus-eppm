
import { DataState, Action } from '../types/index';
import { applyProgramRules } from './logic/programRules';
import { applyFinancialRules } from './logic/financialRules';
import { applyRiskRules } from './logic/riskRules';
import { applyResourceRules } from './logic/resourceRules';
import { applyGovernanceRules } from './logic/governanceRules';
import { applyScheduleRules } from './logic/scheduleRules';
import { applyComplianceRules } from './logic/complianceRules';
import { applyDataRules } from './logic/dataRules';
import { SystemAlert, Project, WBSNode, Task, TaskStatus, ChangeOrder, BudgetLogItem } from '../types/index';
import { findAndModifyNode, findAndReparentNode } from './treeUtils';

export const approveChangeOrderInState = (
  projects: Project[], 
  changeOrders: ChangeOrder[], 
  projectId: string, 
  changeOrderId: string
): { updatedProjects: Project[], updatedChangeOrders: ChangeOrder[] } => {
  
  const co = changeOrders.find(c => c.id === changeOrderId && c.projectId === projectId);
  if (!co || co.status !== 'Pending Approval') {
    return { updatedProjects: projects, updatedChangeOrders: changeOrders };
  }

  const updatedChangeOrders = changeOrders.map(c => 
    c.id === changeOrderId ? { ...c, status: 'Approved' as const } : c
  );

  const newLogItem: BudgetLogItem = {
    id: `BLI-${Date.now()}`,
    projectId,
    date: new Date().toISOString().split('T')[0],
    description: `Approved Change Order: ${co.title}`,
    amount: co.amount,
    status: 'Approved',
    submitterId: 'System',
    source: 'Change Order',
    linkedChangeOrderId: co.id,
  };

  const updatedProjects = projects.map(p => {
    if (p.id !== projectId) return p;
    return {
      ...p,
      budget: p.budget + co.amount,
      budgetLog: [...(p.budgetLog || []), newLogItem]
    };
  });

  return { updatedProjects, updatedChangeOrders };
};

export const applyBusinessLogic = (newState: DataState, action: Action, oldState: DataState): DataState => {
  let stateWithChanges = { ...newState, governance: { ...newState.governance, alerts: [...(newState.governance.alerts || [])] } };
  const newAlerts: SystemAlert[] = stateWithChanges.governance.alerts;

  // Apply rules from different domains
  const programUpdates = applyProgramRules(stateWithChanges, action, newAlerts);
  const financialUpdates = applyFinancialRules(stateWithChanges, action, newAlerts);
  const riskUpdates = applyRiskRules(stateWithChanges, action, newAlerts);
  
  applyResourceRules(stateWithChanges, action, newAlerts);
  applyGovernanceRules(stateWithChanges, action, newAlerts);
  applyScheduleRules(stateWithChanges, action, newAlerts);
  applyComplianceRules(stateWithChanges, action, newAlerts);
  applyDataRules(stateWithChanges, action, newAlerts);

  // Combine state updates
  stateWithChanges = {
    ...stateWithChanges,
    ...programUpdates,
    ...financialUpdates,
    ...riskUpdates,
    programRisks: [...stateWithChanges.programRisks, ...riskUpdates.programRisks]
  };

  // De-duplicate alerts
  const uniqueAlerts = Array.from(new Map(newAlerts.map(item => [item.title + item.message, item])).values());
  stateWithChanges.governance.alerts = uniqueAlerts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return stateWithChanges;
};
