
import { BPRecord, BPDefinition, BPWorkflowStep } from '../../types/unifier';
import { DataState } from '../../types/actions';

export const getNextSteps = (record: BPRecord, def: BPDefinition): string[] => {
  const currentStepInfo = def.workflow.find(s => s.name === record.status);
  return currentStepInfo ? currentStepInfo.actions : [];
};

export const transitionRecord = (
  state: DataState, 
  recordId: string, 
  action: string, 
  user: any
): { updatedRecord: BPRecord, costUpdates: any } => {
  
  const record = state.unifier.records.find(r => r.id === recordId);
  const def = state.unifier.definitions.find(d => d.id === record?.bpDefId);

  if (!record || !def) throw new Error("Record or Definition not found");

  const currentStepIndex = def.workflow.findIndex(s => s.name === record.status);
  if (currentStepIndex === -1) throw new Error("Invalid Workflow State");

  // Simple linear workflow logic for demo (Draft -> Review -> Approved)
  // In real Unifier, this is a complex graph traversal
  let nextStatus = record.status;
  if (action === 'Submit') nextStatus = def.workflow[1]?.name || record.status;
  else if (action === 'Approve' || action === 'Certify') nextStatus = def.workflow[2]?.name || 'Closed';
  else if (action === 'Reject') nextStatus = def.workflow[0]?.name || 'Draft';

  const updatedRecord: BPRecord = {
    ...record,
    status: nextStatus,
    workflowHistory: [
      ...record.workflowHistory,
      { step: record.status, actor: user.name, action, date: new Date().toISOString() }
    ],
    auditTrail: [
      ...record.auditTrail,
      { date: new Date().toISOString(), user: user.name, action: `Transition: ${record.status} -> ${nextStatus} via ${action}` }
    ]
  };

  // Determine Cost Sheet Updates
  let costUpdates = null;
  
  // If we reached a terminal state (e.g. Approved) and the BP has cost impact
  if ((action === 'Approve' || action === 'Certify') && def.costImpact) {
     costUpdates = {
       projectId: record.projectId,
       costCode: record.data.cost_code || '10-000', // Default if missing
       columnId: def.costImpact.affectsColumn,
       amount: Number(record.data.amount || record.data.total_claimed || 0),
       operator: def.costImpact.operator
     };
  }

  return { updatedRecord, costUpdates };
};

export const evaluateFormula = (formula: string, row: any): number => {
  // Simple parser: "col_budget + col_approved"
  // Replaces IDs with values
  let expression = formula;
  Object.keys(row).forEach(key => {
    if (expression.includes(key)) {
      expression = expression.replace(new RegExp(key, 'g'), String(row[key] || 0));
    }
  });
  
  try {
    // eslint-disable-next-line no-new-func
    return Function(`"use strict"; return (${expression})`)();
  } catch (e) {
    return 0;
  }
};
