
export type BPType = 'Cost' | 'Document' | 'Simple' | 'LineItem';
export type DataType = 'String' | 'Number' | 'Date' | 'Currency' | 'Picker' | 'Boolean' | 'Textarea';

export interface BPFieldDefinition {
  key: string;
  label: string;
  type: DataType;
  required: boolean;
  formula?: string; // e.g., "qty * unit_price"
  pickerSource?: string; // e.g., "cost_codes"
  defaultValue?: any;
  readOnly?: boolean;
}

export interface BPWorkflowStep {
  name: string;
  assignees: string[]; // Role IDs
  actions: string[]; // e.g., "Approve", "Reject", "Request Info"
  editableFields: string[]; // Fields editable at this step
}

export interface BPDefinition {
  id: string;
  name: string;
  type: BPType;
  prefix: string; // e.g., "RFI", "PAY"
  fields: BPFieldDefinition[];
  workflow: BPWorkflowStep[];
  costImpact?: {
    affectsColumn: string; // Which column in Cost Sheet
    operator: 'Add' | 'Subtract' | 'Replace';
  };
  lineItemDefinition?: BPFieldDefinition[]; // For Line Item BPs
}

export interface BPLineItem {
    id: string;
    [key: string]: any;
}

export interface BPRecord {
  id: string;
  bpDefId: string; // Link to Definition
  projectId: string;
  status: string; // Workflow Step
  title: string;
  data: Record<string, any>;
  lineItems: BPLineItem[];
  auditTrail: {
    date: string;
    user: string;
    action: string;
    comment?: string;
  }[];
  workflowHistory: {
    step: string;
    actor: string;
    action: string;
    date: string;
  }[];
}

export interface CostSheetColumn {
  id: string;
  name: string;
  type: 'Direct' | 'Formula';
  formula?: string; // e.g. "col_1 + col_2"
  dataSource?: string; // e.g., "base_budget"
  isTotal?: boolean;
}

export interface CostSheetRow {
  wbsCode: string;
  costCode: string;
  description: string;
  parentId?: string | null; // Hierarchy support
  [columnId: string]: any; // Values for dynamic columns
}

export interface CashFlowCurve {
    id: string;
    projectId: string;
    name: string;
    type: 'Baseline' | 'Forecast' | 'Actuals';
    dataPoints: { date: string; amount: number }[];
}

export interface FundAllocation {
    id: string;
    fundId: string;
    projectId: string;
    order: number;
    amount: number;
    consumed: number;
}

export interface UnifierState {
    definitions: BPDefinition[];
    records: BPRecord[];
    costSheet: {
        columns: CostSheetColumn[];
        rows: CostSheetRow[];
    };
    cashFlowCurves: CashFlowCurve[];
    fundAllocations: FundAllocation[];
}
