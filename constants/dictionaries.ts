
export const ESTIMATE_CLASSES = [
    { id: 'Class 5 (ROM)', label: 'Class 5: Rough Order of Magnitude', accuracy: '-50% to +100%', contingency: 30, description: 'Concept screening (0-2% definition)' },
    { id: 'Class 4 (Preliminary)', label: 'Class 4: Preliminary / Feasibility', accuracy: '-30% to +50%', contingency: 20, description: 'Study or feasibility (1-15% definition)' },
    { id: 'Class 3 (Budget)', label: 'Class 3: Budget Authorization', accuracy: '-20% to +30%', contingency: 15, description: 'Budget authorization (10-40% definition)' },
    { id: 'Class 2 (Control)', label: 'Class 2: Control / Bid', accuracy: '-15% to +20%', contingency: 10, description: 'Control or bid/tender (30-75% definition)' },
    { id: 'Class 1 (Definitive)', label: 'Class 1: Definitive / Check', accuracy: '-10% to +15%', contingency: 5, description: 'Check estimate or change order (65-100% definition)' },
];

export const RESOURCE_TYPES = ['Labor', 'Material', 'Equipment', 'Subcontract', 'Other'];

export const PORTFOLIO_CATEGORY_COLORS: Record<string, string> = {
  'Innovation & Growth': '#0ea5e9', 
  'Operational Efficiency': '#22c55e',
  'Regulatory & Compliance': '#eab308', 
  'Keep the Lights On': '#64748b'
};

export const PORTFOLIO_CATEGORIES = [
  'Innovation & Growth',
  'Operational Efficiency',
  'Regulatory & Compliance',
  'Keep the Lights On'
];

export const NEXUS_SCHEMAS: Record<string, string[]> = {
    'Project': ['id', 'name', 'status', 'budget', 'startDate', 'endDate', 'managerId'],
    'Task': ['id', 'name', 'duration', 'progress', 'status', 'wbsCode'],
    'Resource': ['id', 'name', 'role', 'rate', 'capacity'],
    'Risk': ['id', 'description', 'probability', 'impact', 'score'],
    'Financials': ['id', 'costCode', 'amount', 'vendor', 'invoiceDate']
};

export const DEFAULT_NOTIFICATION_PREFERENCES = [
    { id: 'fin', label: 'Financial Breaches', email: true, app: true, sms: false },
    { id: 'risk', label: 'New High Risks', email: true, app: true, sms: true },
    { id: 'sched', label: 'Schedule Delays', email: false, app: true, sms: false },
    { id: 'qual', label: 'NCR Findings', email: true, app: true, sms: false },
    { id: 'gov', label: 'Governance Decisions', email: true, app: true, sms: false },
    { id: 'system', label: 'System Maintenance', email: true, app: false, sms: false },
];
