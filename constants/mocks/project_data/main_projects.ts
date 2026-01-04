
// FIX: Direct import to avoid circular dependency
import { Project, TaskStatus } from '../../../types/project';

export const MOCK_PROJECT_1: Project = {
    id: 'P1001',
    name: 'Downtown Metro Hub',
    code: 'P-24-001',
    managerId: 'R-002',
    programId: 'PRG-001', // Linked to Smart City Initiative
    epsId: 'EPS-INFRA',
    obsId: 'OBS-NA',
    calendarId: 'CAL-STD',
    locationId: 'LOC-NY',
    status: 'Active',
    health: 'Good',
    budget: 5000000,
    spent: 1250000,
    originalBudget: 4800000,
    startDate: '2024-01-15',
    endDate: '2025-06-30',
    description: 'Central transport hub renovation including platform extension and retail concourse.',
    strategicImportance: 9,
    financialValue: 8,
    riskScore: 12,
    resourceFeasibility: 7,
    calculatedPriorityScore: 85,
    category: 'Infrastructure',
    businessCase: 'Capacity expansion required for 2026 demands.',
    tasks: [
        { id: 'T-100', wbsCode: '1', name: 'Project Management', startDate: '2024-01-15', endDate: '2025-06-30', duration: 380, status: TaskStatus.IN_PROGRESS, progress: 35, dependencies: [], critical: false, type: 'Summary', effortType: 'Fixed Duration', assignments: [] },
        { id: 'T-101', wbsCode: '1.1', name: 'Site Clearing', startDate: '2024-01-15', endDate: '2024-02-15', duration: 20, status: TaskStatus.COMPLETED, progress: 100, dependencies: [], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [{resourceId: 'R-002', units: 100}, {resourceId: 'EQ-001', units: 100}] },
        { id: 'T-102', wbsCode: '1.2', name: 'Foundation Pour', startDate: '2024-02-16', endDate: '2024-03-30', duration: 30, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'T-101', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-103', wbsCode: '1.3', name: 'Steel Framing', startDate: '2024-04-01', endDate: '2024-06-15', duration: 55, status: TaskStatus.IN_PROGRESS, progress: 60, dependencies: [{ targetId: 'T-102', type: 'FS', lag: 5 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-104', wbsCode: '1.4', name: 'MEP Rough-in', startDate: '2024-05-15', endDate: '2024-08-01', duration: 55, status: TaskStatus.IN_PROGRESS, progress: 20, dependencies: [{ targetId: 'T-103', type: 'SS', lag: 10 }], critical: false, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-105', wbsCode: '1.5', name: 'Exterior Cladding', startDate: '2024-06-20', endDate: '2024-09-15', duration: 60, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-103', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-106', wbsCode: '1.6', name: 'Interior Finishes', startDate: '2024-08-15', endDate: '2024-12-01', duration: 75, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-104', type: 'FS', lag: 0 }], critical: false, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-107', wbsCode: '1.7', name: 'Systems Testing', startDate: '2024-11-15', endDate: '2025-01-30', duration: 50, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-106', type: 'SS', lag: 0 }], critical: false, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-108', wbsCode: '1.8', name: 'Final Inspection', startDate: '2025-02-01', endDate: '2025-02-15', duration: 10, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-107', type: 'FS', lag: 0 }, { targetId: 'T-105', type: 'FS', lag: 0 }], critical: true, type: 'Milestone', effortType: 'Fixed Duration', assignments: [] }
    ],
    wbs: [
        {
            id: 'WBS-01', wbsCode: '1', name: 'Downtown Metro Hub', description: 'Root Node', children: [
                { id: 'WBS-02', wbsCode: '1.1', name: 'Site Work', description: 'Prep', children: [] },
                { id: 'WBS-03', wbsCode: '1.2', name: 'Structure', description: 'Concrete & Steel', children: [] },
                { id: 'WBS-04', wbsCode: '1.3', name: 'MEP', description: 'Mechanical Electrical Plumbing', children: [] },
                { id: 'WBS-05', wbsCode: '1.4', name: 'Finishes', description: 'Interior/Exterior', children: [] },
            ]
        }
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
    ]
};

export const MOCK_PROJECT_2: Project = {
    id: 'P1002',
    name: 'Global ERP Migration',
    code: 'IT-24-005',
    managerId: 'R-001',
    programId: 'PRG-001', // Linked to Smart City Initiative (as Backend Infrastructure)
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
    tasks: [
        { id: 'T-201', wbsCode: '1.1', name: 'Requirements Gathering', startDate: '2023-09-01', endDate: '2023-11-30', duration: 65, status: TaskStatus.COMPLETED, progress: 100, dependencies: [], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-202', wbsCode: '1.2', name: 'System Architecture', startDate: '2023-12-01', endDate: '2024-02-28', duration: 60, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'T-201', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-203', wbsCode: '1.3', name: 'Data Migration - EMEA', startDate: '2024-03-01', endDate: '2024-05-30', duration: 65, status: TaskStatus.DELAYED, progress: 45, dependencies: [{ targetId: 'T-202', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-204', wbsCode: '1.4', name: 'UAT Phase 1', startDate: '2024-06-01', endDate: '2024-07-15', duration: 30, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [{ targetId: 'T-203', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] }
    ],
    wbs: [
        { id: 'WBS-IT-01', wbsCode: '1', name: 'ERP Migration', description: 'Root', children: [] }
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
    tasks: [
        { id: 'T-301', wbsCode: '1.1', name: 'Land Acquisition', startDate: '2023-06-01', endDate: '2023-12-31', duration: 150, status: TaskStatus.COMPLETED, progress: 100, dependencies: [], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-302', wbsCode: '1.2', name: 'Permitting', startDate: '2024-01-01', endDate: '2024-04-30', duration: 85, status: TaskStatus.DELAYED, progress: 60, dependencies: [{ targetId: 'T-301', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] }
    ]
};
