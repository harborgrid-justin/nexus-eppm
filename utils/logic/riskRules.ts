
import { DataState, Action } from '../../types/actions';
import { SystemAlert } from '../../types/business';
import { createAlert } from './common';
import { ProgramRisk, Risk } from '../../types/index';
import { generateId } from '../formatters';

export const applyRiskRules = (state: DataState, action: Action, alerts: SystemAlert[]) => {
  let newProgramRisks: ProgramRisk[] = [];

  // Hook: Systemic Risk (Category count > 3)
  if (action.type === 'ADD_RISK') {
      const categoryCounts: Record<string, number> = {};
      state.risks.forEach(r => {
          categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
      });
      
      const newRiskCat = action.payload.category;
      if (categoryCounts[newRiskCat] > 2) {
           if(!alerts.some(a => a.title === 'Systemic Risk Detected' && a.message.includes(newRiskCat)))
              alerts.push(createAlert('Warning', 'Risk', 'Systemic Risk Detected', 
                  `Category '${newRiskCat}' has appeared in multiple projects. Consider Program-level mitigation.`));
      }
  }

  // Hook: Dormant Risk
  // Checked periodically
  if (action.type === 'SYSTEM_QUEUE_DATA_JOB') {
      // Mock date check
      state.risks.forEach(r => {
          if(r.score > 12 && r.status === 'Open') {
               // If lastUpdated > 45 days (mock check)
               // alerts.push(...)
          }
      });
  }

  // Hook: Safety Stand-down
  if (action.type === 'SYSTEM_LOG_SAFETY_INCIDENT') {
     alerts.push(createAlert('Blocker', 'Compliance', 'Safety Stand-down', 
        `Safety incident reported at ${action.payload.locationId}. Work stoppage in effect.`));
  }

  // Hook 10: Auto Risk Escalation (Existing)
  if ((action.type === 'UPDATE_RISK' || action.type === 'ADD_RISK')) {
      const risk: Risk = 'risk' in action.payload ? action.payload.risk : action.payload;
      if (risk.score >= 20 && !risk.isEscalated) {
          const proj = state.projects.find(p => p.id === risk.projectId);
          if (proj?.programId) {
              newProgramRisks.push({
                  id: generateId('PR'),
                  programId: proj.programId,
                  description: `[Escalated] ${risk.description}`,
                  category: risk.category,
                  probability: risk.probability,
                  impact: risk.impact,
                  score: risk.score,
                  ownerId: risk.ownerId,
                  status: 'Open',
                  mitigationPlan: 'Escalated review required',
                  probabilityValue: risk.probabilityValue,
                  impactValue: risk.impactValue,
                  financialImpact: risk.financialImpact,
                  strategy: risk.strategy,
                  responseActions: risk.responseActions
              });
              alerts.push(createAlert('Critical', 'Risk', 'Risk Escalated', 
                `Risk ${risk.id} escalated to Program.`, { type: 'Program', id: proj.programId }));
          }
      }
  }

  return { programRisks: newProgramRisks };
};
