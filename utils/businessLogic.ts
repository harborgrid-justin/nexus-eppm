
import { DataState, Action } from '../types/index';
import { applyProgramRules } from './logic/programRules';
import { applyFinancialRules } from './logic/financialRules';
import { applyRiskRules } from './logic/riskRules';
import { applyResourceRules } from './logic/resourceRules';
import { applyGovernanceRules } from './logic/governanceRules';
import { applyProjectRules } from './logic/projectRules';
import { applyProcurementRules } from './logic/procurementRules';
import { SystemAlert } from '../types/business';

/**
 * Centralized Business Rules Engine
 * Executes ~50 validation checks across all domains after every state mutation.
 */
export const applyBusinessLogic = (newState: DataState, action: Action, oldState: DataState): DataState => {
  // 1. Create a mutable copy of alerts to append new findings
  let stateWithChanges = { 
      ...newState, 
      governance: { 
          ...newState.governance, 
          alerts: [...(newState.governance.alerts || [])] 
      } 
  };
  
  const newAlerts: SystemAlert[] = stateWithChanges.governance.alerts;

  // 2. Execute Domain Logic Modules
  // These functions inspect the state and push to newAlerts if rules are broken.
  // They can also return state updates (e.g. auto-calculations).
  
  const programUpdates = applyProgramRules(stateWithChanges, action, newAlerts);
  const projectUpdates = applyProjectRules(stateWithChanges, action, newAlerts);
  const financialUpdates = applyFinancialRules(stateWithChanges, action, newAlerts);
  const riskUpdates = applyRiskRules(stateWithChanges, action, newAlerts);
  const resourceUpdates = applyResourceRules(stateWithChanges, action, newAlerts);
  const procurementUpdates = applyProcurementRules(stateWithChanges, action, newAlerts);
  const governanceUpdates = applyGovernanceRules(stateWithChanges, action, newAlerts);

  // 3. Merge State Updates from Logic Modules
  stateWithChanges = {
    ...stateWithChanges,
    ...programUpdates,
    ...projectUpdates,
    ...financialUpdates,
    ...riskUpdates,
    ...resourceUpdates,
    ...procurementUpdates,
    ...governanceUpdates,
  };

  // 4. De-duplicate Alerts based on Title + Context
  // This prevents the same alert from stacking up every keystroke
  const uniqueAlerts = Array.from(new Map(newAlerts.map(item => [item.title + (item.link?.id || ''), item])).values());
  
  // 5. Sort Alerts by Severity (Blocker > Critical > Warning > Info)
  const severityWeight = { 'Blocker': 4, 'Critical': 3, 'Warning': 2, 'Info': 1 };
  stateWithChanges.governance.alerts = uniqueAlerts.sort((a,b) => {
      const diff = severityWeight[b.severity] - severityWeight[a.severity];
      if (diff !== 0) return diff;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return stateWithChanges;
};
