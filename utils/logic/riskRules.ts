
import { DataState } from '../../context/DataContext';
import { SystemAlert } from '../../types/business';
import { createAlert } from './common';
import { ProgramRisk } from '../../types';
import { generateId } from '../formatters';

export const applyRiskRules = (state: DataState, action: any, alerts: SystemAlert[]) => {
  const programRisks: ProgramRisk[] = [];

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
  if (action.type === 'QUEUE_DATA_JOB') {
      // Mock date check
      state.risks.forEach(r => {
          if(r.score > 12 && r.status === 'Open') {
               // If lastUpdated > 45 days (mock check)
               // alerts.push(...)
          }
      });
  }

  // Hook: Quality Trend (3 consecutive fails)
  // Simplified check on latest report addition
  if (action.type === 'UPDATE_TASK') { 
     // Logic would normally inspect history. 
  }

  // Hook: Safety Stand-down
  if (action.type === 'LOG_SAFETY_INCIDENT') {
     alerts.push(createAlert('Blocker', 'Compliance', 'Safety Stand-down', 
        `Safety incident reported at ${action.payload.locationId}. Work stoppage in effect.`));
  }

  // Hook 10: Auto Risk Escalation (Existing)
  if ((action.type === 'UPDATE_RISK' || action.type === 'ADD_RISK')) {
      const risk = action.payload.risk || action.payload;
      if (risk.score >= 20 && !risk.isEscalated) {
          const proj = state.projects.find(p => p.id === risk.projectId);
          if (proj?.programId) {
              programRisks.push({
                  id: generateId('PR'),
                  programId: proj.programId,
                  description: `[Escalated] ${risk.description}`,
                  category: risk.category,
                  probability: risk.probability,
                  impact: risk.impact,
                  score: risk.score,
                  owner: risk.owner,
                  status: 'Open',
                  mitigationPlan: 'Escalated review required',
                  strategy: risk.strategy
              });
              alerts.push(createAlert('Critical', 'Risk', 'Risk Escalated', 
                `Risk ${risk.id} escalated to Program.`, { type: 'Program', id: proj.programId }));
          }
      }
  }

  return { programRisks, alerts };
};
