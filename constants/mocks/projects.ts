
import { Project, UserDefinedField, DataJob, CommunicationLog, QualityReport, NonConformanceReport, TaskStatus } from '../../types';
import { MOCK_BUDGET_LOG, MOCK_PROJECT_FUNDING, MOCK_COST_ESTIMATES } from './finance';
import { MOCK_RISKS } from './risks';

// IMPORTANT: Cross-reference with MOCK_RESOURCES in resources.ts
// R-001: Sarah Chen
// R-002: Mike Ross
// R-003: Excavator EX-250

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'P1001',
    name: 'Downtown Metro Hub',
    code: 'DMH-24',
    epsId: 'EPS-INFRA', // Links to Infrastructure EPS
    obsId: 'OBS-NA',    // Links to North America OBS
    calendarId: 'CAL-STD', // Links to Standard Calendar
    locationId: 'LOC-NY',
    manager: 'Sarah Chen',
    originalBudget: 5000000,
    budget: 5200000,
    spent: 2100000,
    startDate: '2024-01-15',
    endDate: '2025-06-30',
    health: 'Good',
    strategicImportance: 9,
    financialValue: 8,
    riskScore: 4,
    resourceFeasibility: 7,
    calculatedPriorityScore: 85,
    category: 'Infrastructure',
    businessCase: 'Central transport node for city expansion.',
    
    // WBS Structure (Critical for Cost Estimating & Scope)
    wbs: [
        {
            id: 'WBS-01',
            wbsCode: '1',
            name: 'Downtown Metro Hub',
            description: 'Overall project container',
            costAccount: 'CA-100.0',
            owner: 'Sarah Chen',
            children: [
                {
                    id: 'WBS-01-01',
                    wbsCode: '1.1',
                    name: 'Site Preparation',
                    description: 'Demolition, clearing, and grading of the main terminal site.',
                    costAccount: 'CA-101.1',
                    owner: 'Mike Ross',
                    children: []
                },
                {
                    id: 'WBS-01-02',
                    wbsCode: '1.2',
                    name: 'Substructure',
                    description: 'Foundations, piling, and basement excavation.',
                    costAccount: 'CA-102.0',
                    owner: 'Mike Ross',
                    children: []
                },
                {
                    id: 'WBS-01-03',
                    wbsCode: '1.3',
                    name: 'Superstructure',
                    description: 'Steel framework, decking, and concrete pours for levels 1-4.',
                    costAccount: 'CA-102.1',
                    owner: 'Structural Lead',
                    children: []
                },
                 {
                    id: 'WBS-01-04',
                    wbsCode: '1.4',
                    name: 'MEP Systems',
                    description: 'Mechanical, Electrical, and Plumbing rough-in and finish.',
                    costAccount: 'CA-102.3',
                    owner: 'Sarah Chen',
                    riskIds: ['R-001'],
                    children: []
                }
            ]
        }
    ],

    tasks: [
        { 
            id: 'T-101', 
            wbsCode: '1.1', 
            name: 'Site Clearing', 
            startDate: '2024-01-15', 
            endDate: '2024-02-01', 
            duration: 15, 
            status: TaskStatus.COMPLETED, 
            progress: 100, 
            dependencies: [], 
            critical: true, 
            type: 'Task', 
            effortType: 'Fixed Duration',
            assignments: [
                { resourceId: 'R-003', units: 100 }, // Excavator
                { resourceId: 'R-002', units: 50 }   // Mike Ross
            ],
            resourceRequirements: [],
            activityCodeAssignments: { 'AC-PHASE': 'PH-07', 'AC-DISC': 'DISC-CIV' }
        },
        { 
            id: 'T-102', 
            wbsCode: '1.2', 
            name: 'Foundation Pour', 
            startDate: '2024-02-02', 
            endDate: '2024-03-15', 
            duration: 30, 
            status: TaskStatus.IN_PROGRESS, 
            progress: 45, 
            dependencies: [{ targetId: 'T-101', type: 'FS', lag: 0 }], 
            critical: true, 
            type: 'Task', 
            effortType: 'Fixed Duration',
            assignments: [
                { resourceId: 'R-002', units: 100 } // Mike Ross
            ],
            resourceRequirements: [],
            activityCodeAssignments: { 'AC-PHASE': 'PH-07', 'AC-DISC': 'DISC-CON' }
        },
        {
            id: 'T-105',
            wbsCode: '1.3', 
            name: 'Steel Framework',
            startDate: '2024-03-20',
            endDate: '2024-05-30',
            duration: 50,
            status: TaskStatus.NOT_STARTED,
            progress: 0,
            dependencies: [{ targetId: 'T-102', type: 'FS', lag: 5 }],
            critical: true, 
            type: 'Task', 
            effortType: 'Fixed Duration',
            assignments: [],
            resourceRequirements: [],
            activityCodeAssignments: { 'AC-PHASE': 'PH-08', 'AC-DISC': 'DISC-STR' }
        },
        {
            id: 'T-106',
            wbsCode: '1.4', 
            name: 'HVAC Rough-in',
            startDate: '2024-06-01',
            endDate: '2024-06-20',
            duration: 20,
            status: TaskStatus.NOT_STARTED,
            progress: 0,
            dependencies: [],
            critical: false, 
            type: 'Task', 
            effortType: 'Fixed Duration',
            assignments: [],
            resourceRequirements: [],
            activityCodeAssignments: { 'AC-PHASE': 'PH-08', 'AC-DISC': 'DISC-MEC' }
        }
    ],
    
    // Sub-Entities with FKs
    risks: MOCK_RISKS.filter(r => r.projectId === 'P1001'), 
    budgetLog: MOCK_BUDGET_LOG,
    funding: MOCK_PROJECT_FUNDING,
    costEstimates: MOCK_COST_ESTIMATES,
    issues: [], // Populated in risks.ts
    
    // Detailed Attributes
    assumptions: [
        { id: 'ASM-01', description: 'Permits approved by Q1', owner: 'Legal', status: 'Active' }
    ],
    lessonsLearned: [
        { id: 'LL-01', category: 'Procurement', situation: 'Steel delay', recommendation: 'Order 3 months early' }
    ],
    requirements: [
        { id: 'REQ-01', description: 'Capacity for 50k daily passengers', source: 'City Plan', verificationMethod: 'Simulation', status: 'Active' }
    ],
    reserves: { contingencyReserve: 250000, managementReserve: 100000 },
    teamCharter: {
        values: ['Safety First', 'Transparency', 'Agility'],
        communicationGuidelines: 'Weekly standups, Monthly steering.',
        decisionMakingProcess: 'Consensus for low impact, PM for medium, Sponsor for high.',
        conflictResolutionProcess: 'Escalation ladder: Lead -> PM -> Sponsor.'
    },
    costOfQuality: {
        preventionCosts: 15000,
        appraisalCosts: 25000,
        internalFailureCosts: 5000,
        externalFailureCosts: 0
    },
    costPlan: {
        estimatingMethodology: 'Bottom-up',
        precisionLevel: 'Level 2 (Control)',
        unitsOfMeasure: 'Imperial',
        controlThresholds: '10% Variance',
        reportingFormats: 'EVM Standard',
        fundingStrategy: 'Quarterly Grant Drawdown',
        status: 'Approved',
        version: '1.0',
        lastUpdated: '2024-01-10'
    }
  }
];

// Activity Codes moved to ./activityCodes.ts

export const MOCK_UDFS: UserDefinedField[] = [
  { id: 'UDF-01', subjectArea: 'Tasks', title: 'Safety Check Required', dataType: 'List', listValues: ['Yes', 'No'] }
];

export const MOCK_DATA_JOBS: DataJob[] = [
  { id: 'DJ-01', type: 'Import', format: 'P6 XML', status: 'Completed', submittedBy: 'System', timestamp: '2024-05-20 10:00 AM', details: 'Initial baseline import.' }
];

export const MOCK_COMM_LOGS: CommunicationLog[] = [
  { id: 'CL-01', projectId: 'P1001', date: '2024-02-20', type: 'Meeting', subject: 'Kickoff Meeting', participants: ['Team', 'Sponsor'], summary: 'Project formally initiated.' }
];

export const MOCK_QUALITY_REPORTS: QualityReport[] = [
  { id: 'QR-01', projectId: 'P1001', date: '2024-04-15', type: 'Inspection', status: 'Pass', details: { inspectionType: 'Foundation Pour' } }
];

export const MOCK_DEFECTS: NonConformanceReport[] = [
  { id: 'NCR-01', projectId: 'P1001', date: '2024-05-01', description: 'Concrete slump deviation', severity: 'Minor', status: 'Closed', assignedTo: 'Site Engineer', linkedDeliverable: 'T-102', category: 'Material' }
];
