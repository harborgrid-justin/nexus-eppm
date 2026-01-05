
import { DataState, Action } from '../types/index';
import { applyProgramRules } from './logic/programRules';
import { applyFinancialRules } from './logic/financialRules';
import { applyRiskRules } from './logic/riskRules';
import { applyResourceRules } from './logic/resourceRules';
import { applyGovernanceRules } from './logic/governanceRules';
import { applyScheduleRules } from './logic/scheduleRules';
import { applyComplianceRules } from './logic/complianceRules';
import { applyDataRules } from './logic/dataRules';
import { SystemAlert } from '../types';

export const applyBusinessLogic = (newState: DataState, action: Action, oldState: DataState): DataState => {
  let stateWithChanges = { ...newState, governance: { ...newState.governance, alerts: [...(newState.governance.alerts || [])] } };
  const newAlerts: SystemAlert[] = stateWithChanges.governance.alerts;

  // Apply rules from different domains
  const programUpdates = applyProgramRules(stateWithChanges, action, newAlerts);
  const financialUpdates = applyFinancialRules(stateWithChanges, action, newAlerts);
  const riskUpdates = applyRiskRules(stateWithChanges, action, newAlerts);
  
  // These functions mutate alerts directly and don't return state changes in this model
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
  };

  // De-duplicate alerts
  const uniqueAlerts = Array.from(new Map(newAlerts.map(item => [item.title + item.message, item])).values());
  stateWithChanges.governance.alerts = uniqueAlerts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return stateWithChanges;
};
