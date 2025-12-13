
import { Project, UserDefinedField, DataJob, CommunicationLog, QualityReport, NonConformanceReport, TaskStatus } from '../../types';

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
        }
    ],
    
    // Sub-Entities with FKs
    risks: [], // Populated in risks.ts, but linked via projectId='P1001'
    budgetLog: [], // Populated in finance.ts
    funding: [],
    costEstimates: [],
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
