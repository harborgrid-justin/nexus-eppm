import { Project, TaskStatus, Resource, Extension, WBSNode, Stakeholder, ProcurementPackage, QualityReport, CommunicationLog, Task, RiskManagementPlan, RiskBreakdownStructureNode, ActivityCode, IssueCode, Issue, ExpenseCategory, Expense, BudgetLogItem, FundingSource, ProjectFunding, UserDefinedField, DataJob, ProcurementPlan, Vendor, Solicitation, Contract } from './types';

export const MOCK_RESOURCES: Resource[] = [
  { id: 'R1', name: 'Sarah Chen', role: 'Project Manager', type: 'Human', status: 'Active', capacity: 40, allocated: 35, hourlyRate: 150, skills: [], costRates: [], calendarId: 'CAL_R1' },
  { id: 'R2', name: 'Mike Ross', role: 'Civil Engineer', type: 'Human', status: 'Active', capacity: 40, allocated: 42, hourlyRate: 120, skills: [], costRates: [], calendarId: 'CAL_R2' },
  { id: 'R3', name: 'Jessica Pearson', role: 'Architect', type: 'Human', status: 'Active', capacity: 30, allocated: 10, hourlyRate: 180, skills: [], costRates: [], calendarId: 'CAL_R3' },
  { id: 'R4', name: 'Harvey Specter', role: 'Legal Counsel', type: 'Human', status: 'Active', capacity: 20, allocated: 15, hourlyRate: 250, skills: [], costRates: [], calendarId: 'CAL_R4' },
  { id: 'R5', name: 'Louis Litt', role: 'Financial Analyst', type: 'Human', status: 'Active', capacity: 40, allocated: 38, hourlyRate: 110, skills: [], costRates: [], calendarId: 'CAL_R5' },
  { id: 'EQ1', name: 'Excavator EX-250', role: 'Heavy Equipment', type: 'Equipment', status: 'Active', capacity: 40, allocated: 40, hourlyRate: 300, skills: [], costRates: [], calendarId: 'CAL_EQ1' },
];

export const MOCK_ACTIVITY_CODES: ActivityCode[] = [
  {
    id: 'AC_GLOBAL_DISCIPLINE',
    name: 'Discipline',
    scope: 'Global',
    values: [
      { id: 'ACV_DISC_CIVIL', value: 'Civil', color: '#3b82f6' },
      { id: 'ACV_DISC_MECH', value: 'Mechanical', color: '#f97316' },
      { id: 'ACV_DISC_ELEC', value: 'Electrical', color: '#eab308' },
    ]
  },
  {
    id: 'AC_GLOBAL_RESP',
    name: 'Responsibility',
    scope: 'Global',
    values: [
      { id: 'ACV_RESP_CONTRACTOR', value: 'Contractor' },
      { id: 'ACV_RESP_CLIENT', value: 'Client' },
      { id: 'ACV_RESP_ENGINEER', value: 'Engineer' },
    ]
  },
  {
    id: 'AC_PROJ_P1001_AREA',
    name: 'Station Area',
    scope: 'Project',
    projectId: 'P1001',
    values: [
      { id: 'ACV_AREA_NORTH', value: 'North Station' },
      { id: 'ACV_AREA_CENTRAL', value: 'Central Tunnel' },
      { id: 'ACV_AREA_SOUTH', value: 'South Station' },
    ]
  }
];

export const MOCK_UDFS: UserDefinedField[] = [
    { id: 'UDF_TASK_CAPEX', subjectArea: 'Tasks', title: 'Capex ID', dataType: 'Text' },
    { id: 'UDF_TASK_PHASE', subjectArea: 'Tasks', title: 'Funding Phase', dataType: 'List', listValues: ['Phase 1', 'Phase 2', 'Phase 3'] },
    { id: 'UDF_PROJ_PRIORITY', subjectArea: 'Projects', title: 'Strategic Priority', dataType: 'Number' },
];

export const MOCK_DATA_JOBS: DataJob[] = [
    { id: 'DJ-001', type: 'Import', format: 'P6 XML', status: 'Completed', submittedBy: 'Sarah Chen', timestamp: '2024-07-10 10:05 AM', details: 'Imported P1002 from legacy system.' },
    { id: 'DJ-002', type: 'Export', format: 'CSV', status: 'Completed', submittedBy: 'Louis Litt', timestamp: '2024-07-09 03:20 PM', details: 'Exported task list for P1001.' },
    { id: 'DJ-003', type: 'Import', format: 'MPP', status: 'Failed', submittedBy: 'Sarah Chen', timestamp: '2024-07-08 11:00 AM', details: 'Validation Error: Unsupported calendar type.' },
];

export const MOCK_ISSUE_CODES: IssueCode[] = [
  {
    id: 'IC_GLOBAL_SEVERITY', name: 'Severity', scope: 'Global', values: [
      { id: 'ICV_SEV_HIGH', value: 'High', description: 'Immediate action required.' },
      { id: 'ICV_SEV_MED', value: 'Medium', description: 'Action required before next phase.' },
      { id: 'ICV_SEV_LOW', value: 'Low', description: 'Monitor and address when possible.' },
    ]
  }
];

export const MOCK_ISSUES: Issue[] = [
  { id: 'ISS-001', projectId: 'P1001', activityId: 'T4', priority: 'High', status: 'Open', description: 'Steel supplier has indicated potential for a 2-week delivery delay.', assignedTo: 'Louis Litt', dateIdentified: '2024-05-18' },
  { id: 'ISS-002', projectId: 'P1001', activityId: 'T3', priority: 'Medium', status: 'In Progress', description: 'Unexpected groundwater encountered during excavation, requiring additional dewatering.', assignedTo: 'Mike Ross', dateIdentified: '2024-05-22' }
];

export const MOCK_EXPENSE_CATEGORIES: ExpenseCategory[] = [
    { id: 'EC_TRAVEL', name: 'Travel & Accommodation', scope: 'Global' },
    { id: 'EC_TRAINING', name: 'Training & Certification', scope: 'Global' },
    { id: 'EC_MATERIALS', name: 'Consumable Materials', scope: 'Global' },
    { id: 'EC_PERMITS', name: 'Permits & Fees', scope: 'Project', projectId: 'P1001' },
];

export const MOCK_EXPENSES: Expense[] = [
    { id: 'EXP-001', activityId: 'T1', categoryId: 'EC_PERMITS', description: 'Environmental Impact Study Filing Fee', budgetedCost: 5000, actualCost: 5250, remainingCost: 0, atCompletionCost: 5250, budgetedUnits: 1, actualUnits: 1, remainingUnits: 0, atCompletionUnits: 1 },
    { id: 'EXP-002', activityId: 'T3', categoryId: 'EC_MATERIALS', description: 'Site Signage & Safety Barriers', budgetedCost: 2000, actualCost: 1800, remainingCost: 200, atCompletionCost: 2000, budgetedUnits: 1, actualUnits: 0, remainingUnits: 1, atCompletionUnits: 1 },
];

export const MOCK_BUDGET_LOG: BudgetLogItem[] = [
  { id: 'BLI-01', projectId: 'P1001', date: '2024-02-10', description: 'Initial funding release', amount: 42000000, status: 'Approved', submittedBy: 'System' },
  { id: 'BLI-02', projectId: 'P1001', date: '2024-04-05', description: 'Contingency release for soil conditions', amount: 3000000, status: 'Approved', submittedBy: 'Sarah Chen' },
  { id: 'BLI-03', projectId: 'P1001', date: '2024-06-20', description: 'Additional scope for North Wing (pending)', amount: 4500000, status: 'Pending', submittedBy: 'Sarah Chen' },
];

export const MOCK_FUNDING_SOURCES: FundingSource[] = [
    { id: 'FS-01', name: 'Federal Transportation Grant' },
    { id: 'FS-02', name: 'State Infrastructure Bond' },
    { id: 'FS-03', name: 'Municipal Capital Fund' },
];

export const MOCK_PROJECT_FUNDING: ProjectFunding[] = [
    { id: 'PF-01', projectId: 'P1001', fundingSourceId: 'FS-01', amount: 25000000 },
    { id: 'PF-02', projectId: 'P1001', fundingSourceId: 'FS-02', amount: 15000000 },
    { id: 'PF-03', projectId: 'P1001', fundingSourceId: 'FS-03', amount: 5150000 },
];

export const MOCK_STAKEHOLDERS: Stakeholder[] = [
  { id: 'STK-01', projectId: 'P1001', name: 'City Transit Authority', role: 'Client', interest: 'High', influence: 'High', engagementStrategy: 'Manage Closely - Weekly progress meetings.' },
  { id: 'STK-02', projectId: 'P1001', name: 'State Environmental Dept.', role: 'Regulator', interest: 'Medium', influence: 'High', engagementStrategy: 'Keep Satisfied - Monthly compliance reports.' },
  { id: 'STK-03', projectId: 'P1001', name: 'Local Community Board', role: 'End User Rep', interest: 'High', influence: 'Medium', engagementStrategy: 'Keep Informed - Bi-weekly newsletters.' },
  { id: 'STK-04', projectId: 'P1001', name: 'Steel Suppliers Inc.', role: 'Vendor', interest: 'Low', influence: 'Low', engagementStrategy: 'Monitor - Regular PO follow-ups.' },
];

export const MOCK_QUALITY_REPORTS: QualityReport[] = [
  { id: 'QR-01', projectId: 'P1001', date: '2024-05-10', type: 'Test', status: 'Pass', details: { testType: 'Concrete Cylinder Break', reference: 'ASTM C39', value: '4200 PSI', requirement: '4000 PSI' } },
  { id: 'QR-02', projectId: 'P1001', date: '2024-05-15', type: 'Inspection', status: 'Fail', details: { inspectionType: 'Rebar Placement', finding: 'Incorrect spacing at grid line C', correctiveAction: 'Adjust spacing per drawing S-101' } },
  { id: 'QR-03', projectId: 'P1001', date: '2024-05-20', type: 'Audit', status: 'Pass', details: { auditType: 'Safety Compliance', summary: 'All PPE requirements met.' } },
  { id: 'QR-04', projectId: 'P1001', date: '2024-05-25', type: 'Test', status: 'Pass', details: { testType: 'Soil Compaction', reference: 'Proctor Test', value: '98%', requirement: '>95%' } },
];

export const MOCK_COMM_LOGS: CommunicationLog[] = [
  { id: 'CL-01', projectId: 'P1001', date: '2024-06-01', type: 'Meeting', subject: 'Weekly Progress Review', participants: ['Sarah Chen', 'City Transit Authority'], summary: 'Reviewed schedule progress, no major issues. CTA requested update on steel procurement.' },
  { id: 'CL-02', projectId: 'P1001', date: '2024-06-03', type: 'Email', subject: 'RE: Steel Procurement Status', participants: ['Sarah Chen', 'Louis Litt'], summary: 'Confirmed PO issued and delivery date is on track for July 15.' },
  { id: 'CL-03', projectId: 'P1001', date: '2024-06-05', type: 'Official Letter', subject: 'Environmental Compliance Report #5', participants: ['Harvey Specter', 'State Environmental Dept.'], summary: 'Submitted monthly dust control and water runoff report.' },
];

export const MOCK_RISK_PLAN: RiskManagementPlan = {
  id: 'RMP-P1001',
  projectId: 'P1001',
  objectives: 'To proactively identify, analyze, and manage risks to ensure project objectives are met within budget and schedule.',
  scope: 'This plan covers all technical, external, organizational, and project management risks for the duration of the Metro Line Extension - Phase 2 project.',
  approach: 'A combination of qualitative and quantitative analysis will be used. Risk reviews will be held bi-weekly with the project core team.',
  riskCategories: [
    { id: 'cat-tech', name: 'Technical' },
    { id: 'cat-ext', name: 'External' },
    { id: 'cat-org', name: 'Organizational' },
    { id: 'cat-pm', name: 'Project Management' },
  ],
  probabilityImpactScale: {
    levels: [
      { label: 'Very Low', value: 1, description: 'Negligible impact' },
      { label: 'Low', value: 2, description: 'Minor impact' },
      { label: 'Medium', value: 3, description: 'Moderate impact' },
      { label: 'High', value: 4, description: 'Significant impact' },
      { label: 'Very High', value: 5, description: 'Critical impact' },
    ]
  },
  thresholds: {
    low: 5,
    medium: 12,
    high: 20
  },
  version: 1,
  status: 'Approved'
};

export const MOCK_RBS: RiskBreakdownStructureNode[] = [
  { id: 'rbs-1', code: '1', name: 'Technical', children: [
    { id: 'rbs-1.1', code: '1.1', name: 'Requirements', children: [] },
    { id: 'rbs-1.2', code: '1.2', name: 'Technology & Design', children: [] },
  ]},
  { id: 'rbs-2', code: '2', name: 'External', children: [
    { id: 'rbs-2.1', code: '2.1', name: 'Regulatory', children: [] },
    { id: 'rbs-2.2', code: '2.2', name: 'Market', children: [] },
    { id: 'rbs-2.3', code: '2.3', name: 'Suppliers', children: [] },
  ]},
];


const MOCK_WBS: WBSNode[] = [
  { id: 'WBS-1', wbsCode: '1', name: 'Project Management & Design', description: 'Overall project management, administration, engineering, and design work.', children: [
    { id: 'WBS-1.1', wbsCode: '1.1', name: 'Permitting and Environmental', description: 'All activities related to securing permits and ensuring environmental compliance.', children: [] },
    { id: 'WBS-1.2', wbsCode: '1.2', name: 'Detailed Design', description: 'Finalizing architectural and engineering drawings and specifications.', children: [] },
  ]},
  { id: 'WBS-2', wbsCode: '2', name: 'Site Work', description: 'Preparation of the construction site.', children: [
    { id: 'WBS-2.1', wbsCode: '2.1', name: 'Excavation', description: 'Earthwork and excavation for the new metro line foundations.', children: [] },
    { id: 'WBS-2.2', wbsCode: '2.2', name: 'Utilities', description: 'Relocation and installation of all necessary site utilities.', children: [] },
  ]},
  { id: 'WBS-3', wbsCode: '3', name: 'Construction', description: 'Physical construction of the metro line extension.', children: [
     { id: 'WBS-3.1', wbsCode: '3.1', name: 'Substructure', description: 'Foundation and below-ground structural work.', children: [] },
     { id: 'WBS-3.2', wbsCode: '3.2', name: 'Superstructure', description: 'Above-ground structural work, including stations and track.', children: [] },
  ]},
];

const MOCK_TASKS: Task[] = [
      {
        id: 'T1',
        wbsCode: '1.1',
        name: 'Environmental Impact Study',
        startDate: '2024-01-05',
        endDate: '2024-02-15',
        duration: 29, // Working days
        status: TaskStatus.COMPLETED,
        progress: 100,
        assignments: [{ resourceId: 'R2', units: 50 }, { resourceId: 'R4', units: 50 }],
        dependencies: [],
        critical: true,
        type: 'Task',
        effortType: 'Fixed Duration',
        work: 240, // hours
        resourceRequirements: [],
        activityCodeAssignments: {
          'AC_GLOBAL_DISCIPLINE': 'ACV_DISC_CIVIL',
          'AC_GLOBAL_RESP': 'ACV_RESP_ENGINEER'
        },
        expenseIds: ['EXP-001'],
        primaryConstraint: { type: 'Start On or After', date: '2024-01-05' },
      },
      {
        id: 'T2',
        wbsCode: '1.2',
        name: 'Design Approval Milestone',
        startDate: '2024-03-30',
        endDate: '2024-03-30',
        duration: 0,
        status: TaskStatus.COMPLETED,
        progress: 100,
        assignments: [{ resourceId: 'R3', units: 100 }, { resourceId: 'R2', units: 100 }],
        dependencies: [{ targetId: 'T1', type: 'FS', lag: 0 }],
        critical: true,
        type: 'Milestone',
        effortType: 'Fixed Duration',
        resourceRequirements: [],
        primaryConstraint: { type: 'Mandatory Finish', date: '2024-03-30' },
      },
      {
        id: 'T3',
        wbsCode: '2.1',
        name: 'Site Preparation & Excavation',
        startDate: '2024-04-01',
        endDate: '2024-06-15',
        duration: 54, // Working days
        status: TaskStatus.IN_PROGRESS,
        progress: 65,
        assignments: [{ resourceId: 'R2', units: 100 }, { resourceId: 'EQ1', units: 100 }],
        dependencies: [{ targetId: 'T2', type: 'FS', lag: 0 }],
        critical: true,
        type: 'Task',
        effortType: 'Fixed Work',
        work: 400,
        resourceRequirements: [],
        activityCodeAssignments: {
          'AC_GLOBAL_DISCIPLINE': 'ACV_DISC_CIVIL',
          'AC_GLOBAL_RESP': 'ACV_RESP_CONTRACTOR',
          'AC_PROJ_P1001_AREA': 'ACV_AREA_NORTH'
        },
        issueIds: ['ISS-002'],
        expenseIds: ['EXP-002'],
      },
      {
        id: 'T4',
        wbsCode: '2.2',
        name: 'Procurement of Steel',
        startDate: '2024-04-10',
        endDate: '2024-05-20',
        duration: 29, // Working days
        status: TaskStatus.DELAYED,
        progress: 40,
        assignments: [{ resourceId: 'R5', units: 100 }],
        dependencies: [{ targetId: 'T2', type: 'FS', lag: 5, comment: "Client review period before procurement can start." }],
        critical: false,
        type: 'Task',
        effortType: 'Fixed Duration',
        work: 160,
        resourceRequirements: [],
        issueIds: ['ISS-001'],
        udfValues: {
          'UDF_TASK_CAPEX': 'CAPEX-2024-07B',
          'UDF_TASK_PHASE': 'Phase 1'
        },
        auditTrail: [
          { timestamp: '2024-05-18 09:00 AM', user: 'Sarah Chen', field: 'Status', oldValue: 'In Progress', newValue: 'Delayed' },
          { timestamp: '2024-05-18 09:00 AM', user: 'Sarah Chen', field: 'End Date', oldValue: '2024-05-15', newValue: '2024-05-20' },
          { timestamp: '2024-04-10 08:30 AM', user: 'Scheduler', field: 'Status', oldValue: 'Not Started', newValue: 'In Progress' },
          { timestamp: '2024-02-15 02:10 PM', user: 'System', field: 'Task', oldValue: '', newValue: 'Created' },
        ]
      },
      {
        id: 'T5',
        wbsCode: '3.1',
        name: 'Substructure Construction',
        startDate: '2024-06-16',
        endDate: '2024-09-30',
        duration: 75, // Working days
        status: TaskStatus.NOT_STARTED,
        progress: 0,
        assignments: [{ resourceId: 'R2', units: 100 }, { resourceId: 'R3', units: 25 }],
        dependencies: [{ targetId: 'T3', type: 'FS', lag: 0 }],
        critical: true,
        type: 'Task',
        effortType: 'Fixed Work',
        work: 1200,
        resourceRequirements: [],
      },
       {
        id: 'T6',
        wbsCode: '3.2',
        name: 'Electrical Systems Rough-in',
        startDate: '2024-08-01',
        endDate: '2024-10-15',
        duration: 54, // Working days
        status: TaskStatus.NOT_STARTED,
        progress: 0,
        assignments: [{ resourceId: 'R2', units: 75 }],
        dependencies: [{ targetId: 'T3', type: 'FS', lag: 30 }],
        critical: false,
        type: 'Task',
        effortType: 'Fixed Work',
        work: 600,
        resourceRequirements: [],
        activityCodeAssignments: {
          'AC_GLOBAL_DISCIPLINE': 'ACV_DISC_ELEC',
          'AC_GLOBAL_RESP': 'ACV_RESP_CONTRACTOR',
          'AC_PROJ_P1001_AREA': 'ACV_AREA_CENTRAL'
        }
      }
    ];

// --- MOCK PROCUREMENT DATA ---
export const MOCK_PROCUREMENT_PLANS: ProcurementPlan[] = [
  { id: 'PP-P1001', projectId: 'P1001', objectives: 'To acquire all necessary materials and subcontractors in a timely and cost-effective manner.', scope: 'Covers all external procurement for the Metro Line Extension.', approach: 'Competitive bidding for major packages, RFQs for commodities.', procurementMethods: ['RFP', 'RFQ'], status: 'Approved', version: 2 }
];

export const MOCK_VENDORS: Vendor[] = [
  { id: 'V-001', name: 'Steel Suppliers Inc.', category: 'Materials', status: 'Active', performanceScore: 88, riskLevel: 'Medium', contact: { name: 'John Doe', email: 'j.doe@steelinc.com', phone: '123-456-7890' }},
  { id: 'V-002', name: 'Heavy Equipment Co.', category: 'Equipment', status: 'Preferred', performanceScore: 95, riskLevel: 'Low', contact: { name: 'Jane Smith', email: 'j.smith@heavyco.com', phone: '123-456-7891' }},
  { id: 'V-003', name: 'Concrete Experts LLC', category: 'Subcontractor', status: 'Prequalified', performanceScore: 91, riskLevel: 'Low', contact: { name: 'Peter Jones', email: 'p.jones@concrete.com', phone: '123-456-7892' }},
  { id: 'V-004', name: 'Faulty Wiring Corp', category: 'Subcontractor', status: 'Blacklisted', performanceScore: 32, riskLevel: 'High', contact: { name: 'Bad Actor', email: 'bad@actor.com', phone: '111-222-3333' }}
];

export const MOCK_PROCUREMENT_PACKAGES: ProcurementPackage[] = [
  { id: 'PKG-01', projectId: 'P1001', name: 'Structural Steel Supply', description: 'Supply of all structural steel beams and columns per spec S-01.', wbsId: 'WBS-3.2', budget: 8500000, status: 'Awarded', assignedBuyer: 'R5', solicitationId: 'SOL-01', contractId: 'CTR-01' },
  { id: 'PKG-02', projectId: 'P1001', name: 'Tunnel Boring Machine Lease', description: 'Lease of one TBM for a duration of 12 months.', wbsId: 'WBS-2.1', budget: 12000000, status: 'Sourcing', assignedBuyer: 'R5', solicitationId: 'SOL-02' },
  { id: 'PKG-03', projectId: 'P1001', name: 'Signaling System', description: 'Design and install of the complete signaling system.', wbsId: 'WBS-3.2', budget: 4200000, status: 'Planned', assignedBuyer: 'R5' },
];

export const MOCK_SOLICITATIONS: Solicitation[] = [
    { id: 'SOL-01', projectId: 'P1001', packageId: 'PKG-01', type: 'RFP', title: 'RFP for Structural Steel Supply', issueDate: '2024-03-01', deadline: '2024-03-30', status: 'Awarded', invitedVendorIds: ['V-001'] },
    { id: 'SOL-02', projectId: 'P1001', packageId: 'PKG-02', type: 'RFP', title: 'RFP for TBM Lease', issueDate: '2024-05-15', deadline: '2024-06-15', status: 'Bidding', invitedVendorIds: ['V-002'] }
];

export const MOCK_CONTRACTS: Contract[] = [
    { id: 'CTR-01', projectId: 'P1001', vendorId: 'V-001', solicitationId: 'SOL-01', contractValue: 8250000, status: 'Active', startDate: '2024-04-15', endDate: '2025-04-14' }
];

// --- END MOCK PROCUREMENT DATA ---

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'P1001',
    name: 'Metro Line Extension - Phase 2',
    code: 'NY-MET-002',
    manager: 'Sarah Chen',
    originalBudget: 42000000,
    budget: 45000000,
    spent: 12500000,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    health: 'Warning',
    wbs: MOCK_WBS,
    issues: MOCK_ISSUES,
    budgetLog: MOCK_BUDGET_LOG,
    funding: MOCK_PROJECT_FUNDING,
    calendar: { id: 'CAL1', name: 'Standard', workingDays: [1, 2, 3, 4, 5], holidays: [] },
    baselines: [{
      id: 'BL1',
      name: 'Initial Baseline',
      date: '2024-01-15',
      taskBaselines: {
        'T1': { baselineStartDate: '2024-01-05', baselineEndDate: '2024-02-15' },
        'T2': { baselineStartDate: '2024-02-16', baselineEndDate: '2024-03-30' },
        'T3': { baselineStartDate: '2024-04-01', baselineEndDate: '2024-06-10' }, // Was 10, now 15
        'T4': { baselineStartDate: '2024-04-10', baselineEndDate: '2024-05-15' }, // Was 15, now 20
        'T5': { baselineStartDate: '2024-06-11', baselineEndDate: '2024-09-25' },
        'T6': { baselineStartDate: '2024-08-01', baselineEndDate: '2024-10-15' },
      }
    }],
    tasks: MOCK_TASKS
  },
  {
    id: 'P1002',
    name: 'Downtown Commercial Hub',
    code: 'CHI-COM-088',
    manager: 'David Lee',
    originalBudget: 12000000,
    budget: 12000000,
    spent: 500000,
    startDate: '2024-05-01',
    endDate: '2026-02-28',
    health: 'Good',
    tasks: []
  }
];

export const EXTENSIONS_REGISTRY: Extension[] = [
  // Construction Tech
  { id: 'ext_bim', name: 'BIM 360 Viewer', category: 'Construction', description: 'Interactive 3D model viewer and clash detection.', icon: 'Box', status: 'Available', version: '2.1', viewType: 'viewer3d' },
  { id: 'ext_drones', name: 'Drone Deploy', category: 'Construction', description: 'Aerial site surveys and photogrammetry integration.', icon: 'Plane', status: 'Available', version: '1.4', viewType: 'map' },
  { id: 'ext_iot', name: 'IoT Site Sensors', category: 'Operations', description: 'Real-time environmental and equipment telemetry.', icon: 'Radio', status: 'Installed', version: '3.0', installedDate: '2023-11-15', viewType: 'dashboard' },
  
  // Financials
  { id: 'ext_est', name: 'ProEstimator', category: 'Financials', description: 'Detailed quantity takeoff and cost estimation.', icon: 'Calculator', status: 'Available', version: '4.2', viewType: 'grid' },
  { id: 'ext_inv', name: 'Invoice AI', category: 'Financials', description: 'Automated invoice processing and approval workflows.', icon: 'Receipt', status: 'Active', version: '2.0', installedDate: '2023-10-01', viewType: 'grid' },
  { id: 'ext_pay', name: 'Payroll Connect', category: 'Financials', description: 'Sync timesheets with external payroll providers.', icon: 'Banknote', status: 'Available', version: '1.1', viewType: 'grid' },
  { id: 'ext_cash', name: 'Cash Flow Forecast', category: 'Financials', description: 'Predictive cash flow analysis based on schedule.', icon: 'TrendingUp', status: 'Available', version: '1.5', viewType: 'dashboard' },

  // Supply Chain
  { id: 'ext_proc', name: 'Procurement Hub', category: 'Operations', description: 'Manage RFQs, POs, and vendor performance.', icon: 'ShoppingCart', status: 'Available', version: '2.3', viewType: 'grid' },
  { id: 'ext_mat', name: 'Material Track', category: 'Operations', description: 'QR-code based material inventory and tracking.', icon: 'Package', status: 'Available', version: '1.0', viewType: 'grid' },
  { id: 'ext_fleet', name: 'Fleet Command', category: 'Operations', description: 'Heavy equipment GPS tracking and maintenance.', icon: 'Truck', status: 'Available', version: '3.1', viewType: 'map' },
  
  // Field Operations
  { id: 'ext_daily', name: 'Daily Site Log', category: 'Construction', description: 'Digital daily construction reports and weather logs.', icon: 'Clipboard', status: 'Active', version: '5.0', installedDate: '2024-01-10', viewType: 'form' },
  { id: 'ext_punch', name: 'Punch List Pro', category: 'Construction', description: 'Mobile-first deficiency management and closeout.', icon: 'CheckSquare', status: 'Available', version: '2.2', viewType: 'grid' },
  { id: 'ext_rfi', name: 'RFI Manager', category: 'Construction', description: 'Streamlined Request for Information workflows.', icon: 'MessageSquare', status: 'Available', version: '1.8', viewType: 'grid' },
  { id: 'ext_sub', name: 'Submittal Exchange', category: 'Construction', description: 'Manage shop drawing approvals and revisions.', icon: 'FileInput', status: 'Available', version: '1.6', viewType: 'grid' },

  // Compliance & HSE
  { id: 'ext_safe', name: 'Safety First', category: 'Compliance', description: 'Incident reporting, JHAs, and safety audits.', icon: 'Shield', status: 'Active', version: '3.3', installedDate: '2023-09-20', viewType: 'dashboard' },
  { id: 'ext_permit', name: 'Permit Tracker', category: 'Compliance', description: 'Municipal permit statuses and expiration alerts.', icon: 'FileBadge', status: 'Available', version: '1.2', viewType: 'grid' },
  { id: 'ext_green', name: 'LEED Calculator', category: 'Compliance', description: 'Sustainability scoring and carbon footprint tracking.', icon: 'Leaf', status: 'Available', version: '2.0', viewType: 'dashboard' },
  { id: 'ext_qual', name: 'Quality Matrix', category: 'Compliance', description: 'ITP management and non-conformance reports.', icon: 'Award', status: 'Available', version: '1.4', viewType: 'grid' },

  // Analytics & Risk
  { id: 'ext_monte', name: 'Monte Carlo Sim', category: 'Analytics', description: 'Probabilistic schedule and cost risk analysis.', icon: 'ScatterChart', status: 'Available', version: '2.5', viewType: 'dashboard' },
  { id: 'ext_evm', name: 'EVM Engine', category: 'Analytics', description: 'Advanced Earned Value Management metrics.', icon: 'BarChart2', status: 'Available', version: '1.9', viewType: 'dashboard' },
  // FIX: Added missing 'status' property and corrected 'icon' from 'Installed' to a valid icon name 'BarChart2'.
  { id: 'ext_powerbi', name: 'PowerBI Connect', category: 'Analytics', description: 'Embed PowerBI dashboards directly.', icon: 'BarChart2', status: 'Installed', version: '4.0', installedDate: '2024-02-15', viewType: 'dashboard' },
  
  // Admin
  { id: 'ext_meet', name: 'Meeting Minutes', category: 'Operations', description: 'Track meeting items and assign action items.', icon: 'Users', status: 'Available', version: '1.1', viewType: 'grid' },
  { id: 'ext_photo', name: 'Photo Gallery', category: 'Construction', description: 'Geo-tagged project photo timeline.', icon: 'Camera', status: 'Available', version: '1.3', viewType: 'grid' },
  { id: 'ext_spec', name: 'Spec Reader', category: 'Design', description: 'AI-assisted specification analysis.', icon: 'BookOpen', status: 'Available', version: '0.9', viewType: 'viewer3d' },
  { id: 'ext_warr', name: 'Warranty Mgr', category: 'Operations', description: 'Post-construction warranty claims tracking.', icon: 'Umbrella', status: 'Available', version: '1.0', viewType: 'grid' },
  { id: 'ext_bid', name: 'Bid Leveler', category: 'Financials', description: 'Compare subcontractor bids side-by-side.', icon: 'Scale', status: 'Available', version: '2.1', viewType: 'grid' },
  { id: 'ext_time', name: 'Time Kiosk', category: 'Operations', description: 'Tablet-based clock-in/out for field labor.', icon: 'Watch', status: 'Available', version: '3.0', viewType: 'form' },
  { id: 'ext_weath', name: 'Weather Log', category: 'Construction', description: 'Historical and forecast weather impact analysis.', icon: 'CloudRain', status: 'Available', version: '1.5', viewType: 'dashboard' },
  { id: 'ext_clash', name: 'Clash Detect', category: 'Design', description: 'Automated geometric conflict resolution.', icon: 'AlertOctagon', status: 'Available', version: '2.2', viewType: 'viewer3d' },
  { id: 'ext_mark', name: 'Draw Markup', category: 'Design', description: 'Redline drawings and PDF overlays.', icon: 'PenTool', status: 'Available', version: '1.7', viewType: 'viewer3d' }
];