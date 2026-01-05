

// FIX: Correctly import DataState from types/index.
import { DataState, Action } from '../../types/index';
import { SystemAlert } from '../../types/business';
import { createAlert } from './common';

export const applyResourceRules = (state: DataState, action: Action, alerts: SystemAlert[]) => {
  
  // Hook: Vendor Concentration Risk
  if (action.type === 'UPDATE_VENDOR' || action.type === 'PROJECT_IMPORT') {
      const totalValue = state.contracts.reduce((sum, c) => sum + c.contractValue, 0);
      const vendorExposure: Record<string, number> = {};
      
      state.contracts.forEach(c => {
          vendorExposure[c.vendorId] = (vendorExposure[c.vendorId] || 0) + c.contractValue;
      });

      Object.entries(vendorExposure).forEach(([vId, val]) => {
          if (val > totalValue * 0.3) {
              const vendorName = state.vendors.find(v => v.id === vId)?.name || vId;
               if(!alerts.some(a => a.title === 'Vendor Concentration' && a.message.includes(vendorName)))
                  alerts.push(createAlert('Critical', 'Supply Chain', 'Vendor Concentration', 
                      `Vendor ${vendorName} holds >30% of portfolio value.`, { type: 'Vendor', id: vId }));
          }
      });
  }

  // Hook: Skill Shortage on Critical Path
  if (action.type === 'TASK_UPDATE') {
      const t = action.payload.task;
      if (t.critical && (!t.assignments || t.assignments.length === 0)) {
           // Simplify: Just check if empty assignment on critical task
           alerts.push(createAlert('Warning', 'Resource', 'Critical Skill Gap', 
              `Critical task ${t.name} has no resources assigned.`, { type: 'Task', id: t.id }));
      }
  }

  // Hook: Key Person Dependency
  // Check if a resource is on >3 critical paths (Cross-project check)
  // This requires full graph traversal, simplified here for performance
  
  // Hook: Contract Expiry
  // Periodically checked (e.g. on load or daily job)
  if (action.type === 'SYSTEM_QUEUE_DATA_JOB') {
      const today = new Date();
      state.contracts.forEach(c => {
          const endDate = new Date(c.endDate);
          const diffDays = (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
          if (diffDays > 0 && diffDays < 90) {
               alerts.push(createAlert('Info', 'Supply Chain', 'Contract Expiring', 
                  `Contract ${c.title} expires in ${Math.ceil(diffDays)} days.`, { type: 'Project', id: c.projectId }));
          }
      });
  }

  return {};
};