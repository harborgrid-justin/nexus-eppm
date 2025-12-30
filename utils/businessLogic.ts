
import { DataState, Action } from '../context/DataContext';
import { applyProgramRules } from './logic/programRules';
import { applyFinancialRules } from './logic/financialRules';
import { applyRiskRules } from './logic/riskRules';
import { applyResourceRules } from './logic/resourceRules';
import { applyGovernanceRules } from './logic/governanceRules';

export const applyBusinessLogic = (newState: DataState, action: Action, oldState: DataState): DataState => {
  let alerts = [...(newState.governance?.alerts || [])];
  
  // 1. Program & Portfolio Rules (Dependency, Budget Cap, Imbalance)
  const progResult = applyProgramRules(newState, action, alerts);
  let programs = progResult.programs;
  alerts = progResult.alerts;

  // 2. Financial Rules (EAC, Invoice Lag, Reserves)
  const finResult = applyFinancialRules(newState, action, alerts);
  let projects = finResult.projects;
  alerts = finResult.alerts;

  // 3. Risk Rules (Systemic, Dormant, Safety)
  const riskResult = applyRiskRules(newState, action, alerts);
  let programRisks = [...newState.programRisks, ...riskResult.programRisks];
  alerts = riskResult.alerts;

  // 4. Resource Rules (Vendor Risk, Skill Gap, Burnout)
  const resResult = applyResourceRules(newState, action, alerts);
  alerts = resResult.alerts;

  // 5. Governance Rules (Scope Creep, ESG, Gates)
  const govResult = applyGovernanceRules(newState, action, alerts);
  alerts = govResult.alerts;

  // De-duplicate alerts based on ID/Content to prevent spam
  const uniqueAlerts = Array.from(new Map(alerts.map(item => [item.title + item.message, item])).values());

  return {
    ...newState,
    projects,
    programs,
    programRisks,
    governance: {
        ...newState.governance,
        alerts: uniqueAlerts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  };
};
