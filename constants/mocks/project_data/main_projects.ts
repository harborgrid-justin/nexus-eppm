
// FIX: Direct import to avoid circular dependency
import { Project, TaskStatus } from '../../../types/project';

// ==========================================
// PROJECT 1: CONSTRUCTION (Deep Structure)
// ==========================================
export const MOCK_PROJECT_1: Project = {
    id: 'P1001',
    name: 'Downtown Metro Hub',
    code: 'P-24-001',
    managerId: 'R-002',
    programId: 'PRG-001', 
    epsId: 'EPS-INFRA',
    obsId: 'OBS-NA',
    calendarId: 'CAL-STD',
    locationId: 'LOC-NY',
    status: 'Active',
    health: 'Good',
    budget: 15500000,
    spent: 4250000,
    originalBudget: 14800000,
    startDate: '2024-01-01',
    endDate: '2025-08-30',
    description: 'Central transport hub renovation including platform extension, retail concourse, and LEED Gold certification.',
    strategicImportance: 9,
    financialValue: 8,
    riskScore: 12,
    resourceFeasibility: 7,
    calculatedPriorityScore: 85,
    category: 'Infrastructure',
    businessCase: 'Capacity expansion required for 2026 demands. NPV $45M.',
    tasks: [
        // --- MILESTONES ---
        { id: 'M-100', wbsCode: '0.0', name: 'Notice to Proceed (NTP)', startDate: '2024-01-01', endDate: '2024-01-01', duration: 0, status: TaskStatus.COMPLETED, progress: 100, dependencies: [], critical: true, type: 'Milestone', effortType: 'Fixed Duration', assignments: [] },
        
        // --- PHASE 1: PRE-CONSTRUCTION ---
        { id: 'T-101', wbsCode: '1.1', name: 'Mobilization & Site Securement', startDate: '2024-01-02', endDate: '2024-01-15', duration: 10, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'M-100', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Duration', assignments: [{resourceId: 'R-CON-01', units: 100}] },
        { id: 'T-102', wbsCode: '1.2', name: 'Permitting & Approvals', startDate: '2024-01-05', endDate: '2024-02-20', duration: 32, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'M-100', type: 'FS', lag: 3 }], critical: false, type: 'Task', effortType: 'Fixed Duration', assignments: [{resourceId: 'R-002', units: 50}] },
        { id: 'T-103', wbsCode: '1.3', name: 'Site Clearing & Demolition', startDate: '2024-01-16', endDate: '2024-02-15', duration: 22, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'T-101', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-CON-02', units: 100}, {resourceId: 'EQ-001', units: 100}] },
        
        // --- PHASE 2: SUBSTRUCTURE ---
        { id: 'T-201', wbsCode: '2.1', name: 'Excavation for Foundations', startDate: '2024-02-16', endDate: '2024-03-15', duration: 20, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'T-103', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-CON-02', units: 100}, {resourceId: 'EQ-001', units: 100}] },
        { id: 'T-202', wbsCode: '2.2', name: 'Install Rebar & Formwork', startDate: '2024-03-18', endDate: '2024-04-10', duration: 18, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'T-201', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-CON-02', units: 100}, {resourceId: 'MAT-002', units: 0}] }, // Material assignment units 0 as cost is direct
        { id: 'T-203', wbsCode: '2.3', name: 'Pour Concrete Footings', startDate: '2024-04-11', endDate: '2024-04-15', duration: 4, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'T-202', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-CON-02', units: 100}, {resourceId: 'MAT-001', units: 0}] },
        { id: 'T-204', wbsCode: '2.4', name: 'Curing Time', startDate: '2024-04-16', endDate: '2024-04-22', duration: 5, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'T-203', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Duration', assignments: [] },
        
        // --- PHASE 3: SUPERSTRUCTURE ---
        { id: 'T-301', wbsCode: '3.1', name: 'Erect Structural Steel', startDate: '2024-04-23', endDate: '2024-06-30', duration: 48, status: TaskStatus.IN_PROGRESS, progress: 65, dependencies: [{ targetId: 'T-204', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-CON-03', units: 100}, {resourceId: 'EQ-002', units: 100}] },
        { id: 'T-302', wbsCode: '3.2', name: 'Metal Decking Install', startDate: '2024-05-15', endDate: '2024-07-15', duration: 42, status: TaskStatus.IN_PROGRESS, progress: 40, dependencies: [{ targetId: 'T-301', type: 'SS', lag: 15 }], critical: false, totalFloat: 5, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-CON-03', units: 100}] },
        { id: 'T-303', wbsCode: '3.3', name: 'Concrete Slab Pours (Elevated)', startDate: '2024-06-01', endDate: '2024-08-01', duration: 42, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-302', type: 'SS', lag: 10 }], critical: false, totalFloat: 12, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-CON-02', units: 100}] },
        
        // --- PHASE 4: ENCLOSURE ---
        { id: 'T-401', wbsCode: '4.1', name: 'Exterior Curtain Wall', startDate: '2024-07-01', endDate: '2024-09-30', duration: 64, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-301', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-402', wbsCode: '4.2', name: 'Roofing Systems', startDate: '2024-08-01', endDate: '2024-10-15', duration: 53, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-303', type: 'FS', lag: 0 }], critical: false, totalFloat: 10, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        
        // --- PHASE 5: SYSTEMS (MEP) ---
        { id: 'T-501', wbsCode: '5.1', name: 'Rough-In Plumbing', startDate: '2024-07-15', endDate: '2024-09-15', duration: 44, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-303', type: 'FS', lag: 0 }], critical: false, totalFloat: 20, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-CON-04', units: 100}] },
        { id: 'T-502', wbsCode: '5.2', name: 'Rough-In Electrical', startDate: '2024-07-20', endDate: '2024-10-01', duration: 50, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-501', type: 'SS', lag: 5 }], critical: false, totalFloat: 18, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-CON-04', units: 100}] },
        { id: 'T-503', wbsCode: '5.3', name: 'HVAC Ductwork', startDate: '2024-08-01', endDate: '2024-11-01', duration: 65, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-401', type: 'SS', lag: 20 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-CON-04', units: 100}] },
        
        // --- PHASE 6: INTERIORS ---
        { id: 'T-601', wbsCode: '6.1', name: 'Framing & Drywall', startDate: '2024-10-01', endDate: '2024-12-15', duration: 53, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-401', type: 'FS', lag: 0 }, { targetId: 'T-502', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-602', wbsCode: '6.2', name: 'Interior Finishes (Flooring/Paint)', startDate: '2024-12-16', endDate: '2025-02-28', duration: 53, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-601', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        
        // --- PHASE 7: CLOSEOUT ---
        { id: 'T-701', wbsCode: '7.1', name: 'Commissioning & Testing', startDate: '2025-03-01', endDate: '2025-04-30', duration: 43, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-602', type: 'FS', lag: 0 }, { targetId: 'T-503', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-CON-04', units: 50}] },
        { id: 'T-702', wbsCode: '7.2', name: 'Punch List', startDate: '2025-05-01', endDate: '2025-05-30', duration: 21, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-701', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-002', units: 100}] },
        { id: 'M-799', wbsCode: '0.0', name: 'Substantial Completion', startDate: '2025-05-30', endDate: '2025-05-30', duration: 0, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-702', type: 'FS', lag: 0 }], critical: true, type: 'Milestone', effortType: 'Fixed Duration', assignments: [] }
    ],
    wbs: [
        {
            id: 'WBS-01', wbsCode: '1', name: 'Pre-Construction', description: 'Mobilization', children: [
                { id: 'WBS-1.1', wbsCode: '1.1', name: 'Mobilization', description: 'Logistics', children: [] },
                { id: 'WBS-1.2', wbsCode: '1.2', name: 'Permits', description: 'Regulatory', children: [] },
                { id: 'WBS-1.3', wbsCode: '1.3', name: 'Site Work', description: 'Clearing', children: [] }
            ]
        },
        {
            id: 'WBS-02', wbsCode: '2', name: 'Substructure', description: 'Foundations', children: [
                 { id: 'WBS-2.1', wbsCode: '2.1', name: 'Excavation', description: 'Earthwork', children: [] },
                 { id: 'WBS-2.2', wbsCode: '2.2', name: 'Rebar', description: 'Reinforcement', children: [] },
                 { id: 'WBS-2.3', wbsCode: '2.3', name: 'Concrete', description: 'Pour', children: [] }
            ]
        },
        {
            id: 'WBS-03', wbsCode: '3', name: 'Superstructure', description: 'Steel & Decking', children: [
                 { id: 'WBS-3.1', wbsCode: '3.1', name: 'Steel Erection', description: 'Primary Iron', children: [] },
                 { id: 'WBS-3.2', wbsCode: '3.2', name: 'Decking', description: 'Metal Deck', children: [] }
            ]
        },
        { id: 'WBS-04', wbsCode: '4', name: 'Enclosure', description: 'Skin', children: [] },
        { id: 'WBS-05', wbsCode: '5', name: 'MEP Systems', description: 'Mechanical/Electrical', children: [] },
        { id: 'WBS-06', wbsCode: '6', name: 'Interiors', description: 'Fit-out', children: [] },
        { id: 'WBS-07', wbsCode: '7', name: 'Closeout', description: 'Handover', children: [] }
    ],
    reserves: { contingencyReserve: 250000, managementReserve: 150000 },
    costOfQuality: {
        preventionCosts: 25000,
        appraisalCosts: 15000,
        internalFailureCosts: 5000,
        externalFailureCosts: 0
    },
    coqHistory: [
        { period: 'Q1', preventionCosts: 5000, appraisalCosts: 5000, internalFailureCosts: 15000, externalFailureCosts: 2000 },
        { period: 'Q2', preventionCosts: 8000, appraisalCosts: 7000, internalFailureCosts: 12000, externalFailureCosts: 1000 },
        { period: 'Q3', preventionCosts: 12000, appraisalCosts: 8000, internalFailureCosts: 6000, externalFailureCosts: 500 },
        { period: 'Q4', preventionCosts: 15000, appraisalCosts: 8000, internalFailureCosts: 4000, externalFailureCosts: 0 },
    ],
    baselines: [
        {
            id: 'BL-001',
            name: 'Contract Award Baseline',
            type: 'Initial',
            date: '2023-12-15',
            taskBaselines: {
                'M-100': { baselineStartDate: '2024-01-01', baselineEndDate: '2024-01-01', baselineDuration: 0 },
                'T-101': { baselineStartDate: '2024-01-02', baselineEndDate: '2024-01-15', baselineDuration: 10 },
                'T-301': { baselineStartDate: '2024-04-15', baselineEndDate: '2024-06-15', baselineDuration: 44 }, // Shows drift in live
                'M-799': { baselineStartDate: '2025-05-01', baselineEndDate: '2025-05-01', baselineDuration: 0 },
            }
        }
    ]
};

// ==========================================
// PROJECT 2: SOFTWARE (Agile / Hybrid)
// ==========================================
export const MOCK_PROJECT_2: Project = {
    id: 'P1002',
    name: 'Global ERP Migration',
    code: 'IT-24-005',
    managerId: 'R-001',
    programId: 'PRG-001', 
    epsId: 'EPS-IT',
    obsId: 'OBS-PMO',
    calendarId: 'CAL-STD',
    locationId: 'LOC-LON',
    status: 'Active',
    health: 'Warning',
    budget: 2200000,
    spent: 1800000,
    originalBudget: 2000000,
    startDate: '2023-09-01',
    endDate: '2024-12-31',
    strategicImportance: 8,
    financialValue: 6,
    riskScore: 18,
    resourceFeasibility: 4,
    calculatedPriorityScore: 72,
    category: 'IT / Software',
    businessCase: 'Consolidate legacy systems into SAP S/4HANA Cloud.',
    tasks: [
        // --- PHASE 1: DISCOVERY ---
        { id: 'S-101', wbsCode: '1.1', name: 'Requirements Workshops', startDate: '2023-09-01', endDate: '2023-10-15', duration: 32, status: TaskStatus.COMPLETED, progress: 100, dependencies: [], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-SW-01', units: 100}] },
        { id: 'S-102', wbsCode: '1.2', name: 'Solution Architecture Definition', startDate: '2023-10-16', endDate: '2023-11-30', duration: 33, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'S-101', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-SW-01', units: 100}] },
        
        // --- PHASE 2: DEVELOPMENT ---
        { id: 'S-201', wbsCode: '2.1', name: 'Core Schema Config', startDate: '2023-12-01', endDate: '2024-01-31', duration: 44, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'S-102', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-SW-03', units: 100}] },
        { id: 'S-202', wbsCode: '2.2', name: 'API Middleware Dev', startDate: '2024-01-15', endDate: '2024-03-30', duration: 54, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'S-201', type: 'SS', lag: 10 }], critical: false, totalFloat: 15, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-SW-03', units: 100}] },
        { id: 'S-203', wbsCode: '2.3', name: 'Frontend Dashboard UI', startDate: '2024-02-01', endDate: '2024-04-15', duration: 53, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'S-201', type: 'FS', lag: 0 }], critical: false, totalFloat: 30, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-SW-02', units: 100}] },
        
        // --- PHASE 3: DATA MIGRATION ---
        { id: 'S-301', wbsCode: '3.1', name: 'Data Mapping & ETL', startDate: '2024-02-01', endDate: '2024-05-15', duration: 74, status: TaskStatus.IN_PROGRESS, progress: 85, dependencies: [{ targetId: 'S-201', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-SW-03', units: 100}] },
        { id: 'S-302', wbsCode: '3.2', name: 'Mock Migration Run 1', startDate: '2024-05-16', endDate: '2024-05-30', duration: 10, status: TaskStatus.DELAYED, progress: 20, dependencies: [{ targetId: 'S-301', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-SW-03', units: 100}] },
        
        // --- PHASE 4: TESTING ---
        { id: 'S-401', wbsCode: '4.1', name: 'Integration Testing (SIT)', startDate: '2024-06-01', endDate: '2024-07-15', duration: 32, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'S-302', type: 'FS', lag: 0 }, { targetId: 'S-202', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-SW-02', units: 50}, {resourceId: 'R-SW-03', units: 50}] },
        { id: 'S-402', wbsCode: '4.2', name: 'UAT', startDate: '2024-07-16', endDate: '2024-08-30', duration: 33, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'S-401', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-001', units: 25}] },
        
        // --- MILESTONES ---
        { id: 'M-500', wbsCode: '5.0', name: 'Go-Live Cutover', startDate: '2024-09-01', endDate: '2024-09-01', duration: 0, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'S-402', type: 'FS', lag: 0 }], critical: true, type: 'Milestone', effortType: 'Fixed Duration', assignments: [] }
    ],
    wbs: [
        {
            id: 'WBS-IT-01', wbsCode: '1', name: 'Discovery', description: 'Requirements', children: []
        },
        {
            id: 'WBS-IT-02', wbsCode: '2', name: 'Development', description: 'Build', children: []
        },
        {
            id: 'WBS-IT-03', wbsCode: '3', name: 'Data', description: 'Migration', children: []
        },
        {
            id: 'WBS-IT-04', wbsCode: '4', name: 'Quality Assurance', description: 'Testing', children: []
        }
    ]
};

export const MOCK_PROJECT_3: Project = {
    id: 'P1003',
    name: 'Solar Farm Alpha',
    code: 'NRG-23-010',
    managerId: 'R-002',
    // Deliberately no Program ID (Standalone Project)
    epsId: 'EPS-INFRA',
    obsId: 'OBS-NA',
    calendarId: 'CAL-247',
    status: 'Active',
    health: 'Critical',
    budget: 12000000,
    spent: 4500000,
    originalBudget: 12000000,
    startDate: '2023-06-01',
    endDate: '2025-06-01',
    strategicImportance: 10,
    financialValue: 9,
    riskScore: 22,
    resourceFeasibility: 3,
    calculatedPriorityScore: 95,
    category: 'Innovation & Growth',
    businessCase: 'Renewable energy credits & grid stabilization.',
    tasks: [
        { id: 'T-301', wbsCode: '1.1', name: 'Land Acquisition', startDate: '2023-06-01', endDate: '2023-12-31', duration: 150, status: TaskStatus.COMPLETED, progress: 100, dependencies: [], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-302', wbsCode: '1.2', name: 'Permitting', startDate: '2024-01-01', endDate: '2024-04-30', duration: 85, status: TaskStatus.DELAYED, progress: 60, dependencies: [{ targetId: 'T-301', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-303', wbsCode: '2.1', name: 'Panel Procurement', startDate: '2024-02-01', endDate: '2024-05-30', duration: 85, status: TaskStatus.IN_PROGRESS, progress: 30, dependencies: [{ targetId: 'T-301', type: 'FS', lag: 0 }], critical: false, totalFloat: 20, type: 'Task', effortType: 'Fixed Work', assignments: [] }
    ]
};
