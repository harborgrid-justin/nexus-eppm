
// FIX: Correctly import DataState from types/actions.
import { DataState, Action } from '../../types/actions';
import { SystemAlert } from '../../types/business';
import { createAlert } from './common';

export const applyGovernanceRules = (state: DataState, action: Action, alerts: SystemAlert[]) => {
  
  // Hook: Scope Creep Velocity
  if (action.type === 'APPROVE_CHANGE_ORDER') {
      const projId = action.payload.projectId;
      const recentCos = state.changeOrders.filter(co => 
          co.projectId === projId && co.status === 'Approved'
          // && date is within last 30 days (mocked)
      );
      
      if (recentCos.length >= 2) {
          alerts.push(createAlert('Warning', 'Governance', 'Scope Creep Velocity', 
              `Project has had multiple change orders approved recently. Review baseline.`, { type: 'Project', id: projId }));
      }
  }

  // Hook: ESG Breach
  if (action.type === 'TASK_UPDATE') { // Triggered on updates usually
      // Mock ESG check
      const esgScore = 65; // Would come from project metadata
      if (esgScore < 70) {
           // alerts.push(...) // Debounce to avoid spam
      }
  }

  // Hook: Strategic Drift
  if (action.type === 'GOVERNANCE_UPDATE_STRATEGIC_GOAL') {
      // If goals change, check all projects for alignment
      alerts.push(createAlert('Info', 'Strategy', 'Strategic Realignment', 
          'Strategic Goals updated. Please review project alignment scores.'));
  }

  // Hook: Gate Skipping
  if (action.type === 'TASK_UPDATE' && action.payload.task.status === 'In Progress') {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project && project.status === 'Planned') {
           alerts.push(createAlert('Blocker', 'Governance', 'Gate Skipping', 
               `Task started in ${project.code} before project moved to Execution phase.`, { type: 'Project', id: project.id }));
      }
  }

  return {};
};
