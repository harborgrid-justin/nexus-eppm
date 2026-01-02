
import { BPDefinition, BPRecord, CostSheetColumn, CostSheetRow } from '../../types/unifier';

// --- 1. DEFINITIONS (The "U-Designer" Metadata) ---

export const BP_DEF_CHANGE_ORDER: BPDefinition = {
  id: 'bp_co',
  name: 'Change Order',
  type: 'Cost',
  prefix: 'CO',
  fields: [
    { key: 'amount', label: 'Amount', type: 'Currency', required: true },
    { key: 'reason', label: 'Justification', type: 'String', required: true },
    { key: 'cost_code', label: 'Cost Code', type: 'Picker', required: true, pickerSource: 'cbs' }
  ],
  workflow: [
    { name: 'Draft', assignees: ['Project Manager'], actions: ['Submit'], editableFields: ['amount', 'reason', 'cost_code'] },
    { name: 'Review', assignees: ['Program Manager'], actions: ['Approve', 'Reject', 'Clarify'], editableFields: ['reason'] },
    { name: 'Approved', assignees: [], actions: [], editableFields: [] }
  ],
  costImpact: { affectsColumn: 'col_approved_changes', operator: 'Add' }
};

export const BP_DEF_PAY_APP: BPDefinition = {
  id: 'bp_pay',
  name: 'Payment Application',
  type: 'Cost',
  prefix: 'PAY',
  fields: [
    { key: 'period_start', label: 'Period Start', type: 'Date', required: true },
    { key: 'period_end', label: 'Period End', type: 'Date', required: true },
    { key: 'vendor', label: 'Vendor', type: 'Picker', required: true, pickerSource: 'vendors' },
    { key: 'total_claimed', label: 'Total Claimed', type: 'Currency', required: true }
  ],
  workflow: [
    { name: 'Vendor Submit', assignees: ['Vendor'], actions: ['Submit'], editableFields: ['period_start', 'period_end', 'total_claimed'] },
    { name: 'PM Approval', assignees: ['Project Manager'], actions: ['Certify', 'Reject'], editableFields: [] },
    { name: 'Certified', assignees: [], actions: [], editableFields: [] }
  ],
  costImpact: { affectsColumn: 'col_actuals', operator: 'Add' }
};

export const MOCK_BP_DEFS: BPDefinition[] = [BP_DEF_CHANGE_ORDER, BP_DEF_PAY_APP];

// --- 2. RECORDS (The Actual Data) ---

export const MOCK_BP_RECORDS: BPRecord[] = [
  {
    id: 'CO-001',
    bpDefId: 'bp_co',
    projectId: 'P1001',
    status: 'Approved',
    title: 'Additional Excavation',
    data: { amount: 45000, reason: 'Hit rock', cost_code: '10-000' },
    auditTrail: [],
    workflowHistory: []
  },
  {
    id: 'PAY-001',
    bpDefId: 'bp_pay',
    projectId: 'P1001',
    status: 'Certified',
    title: 'Pay App #1 - June',
    data: { period_start: '2024-06-01', period_end: '2024-06-30', total_claimed: 125000, vendor: 'Acme Corp' },
    auditTrail: [],
    workflowHistory: []
  }
];

// --- 3. COST SHEET STRUCTURE ---

export const COST_SHEET_COLUMNS: CostSheetColumn[] = [
  { id: 'col_budget', name: 'Original Budget', type: 'Direct' },
  { id: 'col_approved_changes', name: 'Approved COs', type: 'Direct' }, // Fed by BP
  { id: 'col_revised_budget', name: 'Revised Budget', type: 'Formula', formula: 'col_budget + col_approved_changes' },
  { id: 'col_commits', name: 'Commitments', type: 'Direct' },
  { id: 'col_actuals', name: 'Actuals', type: 'Direct' }, // Fed by BP
  { id: 'col_remaining', name: 'Remaining', type: 'Formula', formula: 'col_revised_budget - col_actuals' }
];

export const COST_SHEET_DATA: CostSheetRow[] = [
  { wbsCode: '1.1', costCode: '10-000', description: 'Excavation', col_budget: 500000, col_approved_changes: 45000, col_commits: 545000, col_actuals: 125000 },
  { wbsCode: '1.2', costCode: '20-000', description: 'Concrete', col_budget: 1200000, col_approved_changes: 0, col_commits: 1100000, col_actuals: 400000 },
  { wbsCode: '1.3', costCode: '30-000', description: 'Steel', col_budget: 800000, col_approved_changes: 0, col_commits: 800000, col_actuals: 0 },
];
