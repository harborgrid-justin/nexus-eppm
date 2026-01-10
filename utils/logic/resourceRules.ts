
import { DataState, Action } from '../../types/index';
import { SystemAlert } from '../../types/business';
import { createAlert } from './common';

export const applyResourceRules = (state: DataState, action: Action, alerts: SystemAlert[]) => {
  
  const resources = state.resources;

  // Rule 19: Resource Over-allocation
  resources.forEach(r => {
      if (r.capacity > 0 && r.allocated > r.capacity) {
          alerts.push(createAlert('Warning', 'Resource', 'Over-allocation', 
              `${r.name} is allocated at ${((r.allocated/r.capacity)*100).toFixed(0)}%.`, { type: 'Resource', id: r.id }));
      }
  });

  // Rule 20: Missing Standard Rate
  resources.forEach(r => {
      if (r.type === 'Human' && r.status === 'Active' && (!r.hourlyRate || r.hourlyRate <= 0)) {
          alerts.push(createAlert('Info', 'Finance', 'Missing Cost Rate', 
              `Resource ${r.name} has no hourly rate defined.`, { type: 'Resource', id: r.id }));
      }
  });

  // Rule 21: Role Mismatch
  // Checked when assignments happen
  state.projects.forEach(p => {
      p.tasks.forEach(t => {
          t.assignments.forEach(a => {
             const res = resources.find(r => r.id === a.resourceId);
             // Assuming task has a 'role' field in a real app, logic would go here.
             // Mock logic: If resource is inactive but assigned
             if (res && res.status === 'Inactive') {
                 alerts.push(createAlert('Critical', 'Resource', 'Inactive Resource Assigned', 
                     `${res.name} is Inactive but assigned to ${t.name}.`, { type: 'Task', id: t.id }));
             }
          });
      });
  });

  // Rule 22: Time logged on Closed Project
  state.timesheets.forEach(ts => {
      ts.rows.forEach(row => {
          const proj = state.projects.find(p => p.id === row.projectId);
          if (proj && (proj.status === 'Closed' || proj.status === 'Archived')) {
               alerts.push(createAlert('Warning', 'Compliance', 'Late Time Entry', 
                  `Time logged against closed project ${proj.code}.`, { type: 'Project', id: proj.id }));
          }
      });
  });

  // Rule 23: No Manager Assigned to Department (OBS)
  state.obs.forEach(node => {
      if (!node.managerId) {
          alerts.push(createAlert('Info', 'Governance', 'OBS Empty Chair', 
              `OBS Node ${node.name} has no responsible manager.`, { type: 'Resource', id: node.id }));
      }
  });

  // Rule 24: Generic Resource Overuse
  const genericCount = resources.filter(r => r.name.toLowerCase().includes('tbd') || r.name.toLowerCase().includes('new hire')).length;
  if (genericCount > 5) {
      alerts.push(createAlert('Info', 'Resource', 'Placeholder Saturation', 
          `High number of TBD resources (${genericCount}). Impact on scheduling accuracy.`));
  }

  // Rule 25: Maintenance Overdue (Equipment)
  const today = new Date();
  resources.filter(r => r.type === 'Equipment').forEach(eq => {
      if (eq.nextMaintenanceDate && new Date(eq.nextMaintenanceDate) < today) {
           alerts.push(createAlert('Warning', 'Supply Chain', 'Maintenance Overdue', 
              `Equipment ${eq.name} is past due for service.`, { type: 'Resource', id: eq.id }));
      }
  });

  // Rule 26: Vendor Concentration Risk (Resources)
  // If > 50% of resources belong to one vendor (mocked via skill/tag)
  // Placeholder logic

  return {};
};
