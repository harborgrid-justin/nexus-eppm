
import { DataState, Action, ProgramRisk, Risk } from '../../types/index';
import { SystemAlert } from '../../types/business';
import { createAlert } from './common';
import { generateId } from '../../utils/formatters';

export const applyRiskRules = (state: DataState, action: Action, alerts: SystemAlert[]) => {
  let newProgramRisks: ProgramRisk[] = [];
  let newAuditLogs: any[] = [];

  // Rule 27: Systemic Risk (Category count > 3)
  const categoryCounts: Record<string, number> = {};
  state.risks.forEach(r => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });
  Object.entries(categoryCounts).forEach(([cat, count]) => {
      if (count > 5) {
          if(!alerts.some(a => a.title === 'Systemic Risk Detected' && a.message.includes(cat)))
            alerts.push(createAlert('Warning', 'Risk', 'Systemic Risk Detected', 
              `Category '${cat}' appears in ${count} risk entries. Consider Program-level mitigation.`));
      }
  });

  // Rule 28: Stale Risks
  state.risks.forEach(r => {
      if (r.status === 'Open' && r.score >= 10) {
          // Mock date check - assume risks created at init are getting old
      }
  });

  // Rule 29: High Score without Mitigation
  state.risks.forEach(r => {
      if (r.score >= 12 && (!r.mitigationPlan || r.mitigationPlan.length < 10)) {
          alerts.push(createAlert('Critical', 'Risk', 'Unmitigated Exposure', 
              `High scoring risk ${r.id} has no mitigation plan.`, { type: 'Risk', id: r.id }));
      }
  });

  // Rule 30: Missing Risk Owner
  state.risks.forEach(r => {
      if (!r.ownerId || r.ownerId === 'Unassigned') {
           alerts.push(createAlert('Warning', 'Governance', 'Risk Orphan', 
              `Risk ${r.id} has no owner assigned.`, { type: 'Risk', id: r.id }));
      }
  });

  // Rule 31: Financial Impact exceeds Budget
  state.risks.forEach(r => {
      const proj = state.projects.find(p => p.id === r.projectId);
      if (proj && (r.financialImpact || 0) > proj.budget * 0.5) {
           alerts.push(createAlert('Critical', 'Risk', 'Catastrophic Risk', 
              `Risk ${r.id} impact exceeds 50% of project budget.`, { type: 'Risk', id: r.id }));
      }
  });

  // Rule 32: Probability/Impact Missing
  state.risks.forEach(r => {
      if (!r.probabilityValue || !r.impactValue) {
          alerts.push(createAlert('Info', 'Data', 'Incomplete Risk Analysis', 
              `Risk ${r.id} missing qualitative scoring.`, { type: 'Risk', id: r.id }));
      }
  });

  // Rule 33: Safety Stand-down (Triggered by Incident)
  if (action.type === 'FIELD_ADD_INCIDENT' || action.type === 'SYSTEM_LOG_SAFETY_INCIDENT') {
     const incident = 'payload' in action ? action.payload : null; 
     if (incident) {
        alerts.push(createAlert('Blocker', 'Compliance', 'Safety Stand-down', 
            `Safety incident reported. Work stoppage may be in effect.`, { type: 'Project', id: incident.projectId }));
     }
  }

  // Rule 34: Auto Risk Escalation (with Audit)
  if ((action.type === 'UPDATE_RISK' || action.type === 'ADD_RISK')) {
      const payload = 'risk' in action.payload ? action.payload.risk : action.payload;
      
      // Check if it is a Project Risk (has projectId) and perform escalation logic
      if ('projectId' in payload) {
        const risk = payload as Risk;
        
        // Check if already escalated to prevent duplicates
        const alreadyEscalated = state.programRisks.some(pr => pr.description.includes(risk.id));

        if (risk.score >= 20 && !risk.isEscalated && !alreadyEscalated) {
            const proj = state.projects.find(p => p.id === risk.projectId);
            if (proj?.programId) {
                const pRisk: ProgramRisk = {
                    id: generateId('PR'),
                    programId: proj.programId,
                    description: `[Escalated from ${risk.id}] ${risk.description}`,
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
                    responseActions: risk.responseActions,
                    isEscalated: true
                };
                newProgramRisks.push(pRisk);
                
                // Audit the System Action
                newAuditLogs.push({
                    date: new Date().toISOString(),
                    user: 'System Rule Engine',
                    action: 'AUTO_ESCALATION',
                    details: `Risk ${risk.id} score (${risk.score}) exceeded threshold. Escalated to Program.`
                });

                alerts.push(createAlert('Critical', 'Risk', 'Risk Escalated', 
                    `Risk ${risk.id} escalated to Program level due to high severity.`, { type: 'Program', id: proj.programId }));
            }
        }
      }
  }

  // Apply state updates
  let updates: Partial<DataState> = {};
  if (newProgramRisks.length > 0) updates.programRisks = [...state.programRisks, ...newProgramRisks];
  
  if (newAuditLogs.length > 0) {
      updates.governance = {
          ...state.governance,
          auditLog: [...newAuditLogs, ...(state.governance.auditLog || [])]
      };
  }

  return updates;
};
