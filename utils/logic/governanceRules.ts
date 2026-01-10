
import { DataState, Action } from '../../types/index';
import { SystemAlert } from '../../types/business';
import { createAlert } from './common';

export const applyGovernanceRules = (state: DataState, action: Action, alerts: SystemAlert[]) => {
  
  // Rule 43: Scope Creep Velocity (Multiple COs)
  state.projects.forEach(p => {
      const cos = state.changeOrders.filter(c => c.projectId === p.id && c.status === 'Approved');
      if (cos.length > 5) {
          if (!alerts.some(a => a.title === 'Scope Creep Velocity' && a.link?.id === p.id))
            alerts.push(createAlert('Warning', 'Governance', 'Scope Creep Velocity', 
              `Project ${p.code} has >5 approved change orders. Baseline relevance at risk.`, { type: 'Project', id: p.id }));
      }
  });

  // Rule 44: Gate Skipping
  if (action.type === 'TASK_UPDATE' && action.payload.task.status === 'In Progress') {
      const project = state.projects.find(p => p.id === action.payload.projectId);
      if (project && project.status === 'Planned') {
           alerts.push(createAlert('Blocker', 'Governance', 'Gate Skipping', 
               `Task started in ${project.code} before project moved to Execution phase.`, { type: 'Project', id: project.id }));
      }
  }

  // Rule 45: Missing Charter
  state.projects.forEach(p => {
      if (p.status === 'Active' && (!p.businessCase || p.businessCase.length < 10)) {
           alerts.push(createAlert('Warning', 'Governance', 'Missing Charter', 
               `Active project ${p.code} lacks a defined business case/charter.`, { type: 'Project', id: p.id }));
      }
  });

  // Rule 46: Strategic Drift (Alignment)
  if (action.type === 'GOVERNANCE_UPDATE_STRATEGIC_GOAL') {
      alerts.push(createAlert('Info', 'Strategy', 'Strategic Realignment', 
          'Strategic Goals updated. Please review project alignment scores.'));
  }

  // Rule 47: Data Integrity - Null IDs
  // Scan core arrays for ID integrity
  const hasNullIds = state.projects.some(p => !p.id || p.tasks.some(t => !t.id));
  if (hasNullIds) {
      alerts.push(createAlert('Critical', 'IT', 'Data Corruption', 'Entities detected with null IDs. Database integrity check required.'));
  }

  // Rule 48: Duplicate Codes
  const projectCodes = state.projects.map(p => p.code);
  const uniqueCodes = new Set(projectCodes);
  if (projectCodes.length !== uniqueCodes.size) {
      alerts.push(createAlert('Critical', 'Data', 'Duplicate Project Code', 'Non-unique Project ID detected in registry.'));
  }

  // Rule 49: Future Dates in History
  const today = new Date();
  state.governance.auditLog.forEach(log => {
      if (new Date(log.date) > today) {
           alerts.push(createAlert('Warning', 'IT', 'Time Traveler Detected', 'Audit log contains future dates. Check server clock sync.'));
      }
  });

  // Rule 50: Orphaned WBS Nodes
  state.projects.forEach(p => {
      if (p.wbs) {
         p.wbs.forEach(node => {
             // Logic to check if parent exists in flat list or tree
             // Simplified check:
             if (node.parentId && !p.wbs?.find(n => n.id === node.parentId)) {
                 alerts.push(createAlert('Warning', 'Data', 'Orphan WBS', `Node ${node.wbsCode} has invalid parent ref.`, { type: 'Project', id: p.id }));
             }
         });
      }
  });

  return {};
};
