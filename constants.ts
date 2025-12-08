import { Project, TaskStatus, Resource } from './types';

export const MOCK_RESOURCES: Resource[] = [
  { id: 'R1', name: 'Sarah Chen', role: 'Project Manager', capacity: 40, allocated: 35 },
  { id: 'R2', name: 'Mike Ross', role: 'Civil Engineer', capacity: 40, allocated: 42 },
  { id: 'R3', name: 'Jessica Pearson', role: 'Architect', capacity: 30, allocated: 10 },
  { id: 'R4', name: 'Harvey Specter', role: 'Legal Counsel', capacity: 20, allocated: 15 },
  { id: 'R5', name: 'Louis Litt', role: 'Financial Analyst', capacity: 40, allocated: 38 },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'P1001',
    name: 'Metro Line Extension - Phase 2',
    code: 'NY-MET-002',
    manager: 'Sarah Chen',
    budget: 45000000,
    spent: 12500000,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    health: 'Warning',
    tasks: [
      {
        id: 'T1',
        wbsCode: '1.1',
        name: 'Environmental Impact Study',
        startDate: '2024-01-05',
        endDate: '2024-02-15',
        duration: 41,
        status: TaskStatus.COMPLETED,
        progress: 100,
        assignedResources: ['R2', 'R4'],
        predecessors: [],
        critical: true
      },
      {
        id: 'T2',
        wbsCode: '1.2',
        name: 'Foundation Design Approval',
        startDate: '2024-02-16',
        endDate: '2024-03-30',
        duration: 43,
        status: TaskStatus.COMPLETED,
        progress: 100,
        assignedResources: ['R3', 'R2'],
        predecessors: ['T1'],
        critical: true
      },
      {
        id: 'T3',
        wbsCode: '2.1',
        name: 'Site Preparation & Excavation',
        startDate: '2024-04-01',
        endDate: '2024-06-15',
        duration: 75,
        status: TaskStatus.IN_PROGRESS,
        progress: 65,
        assignedResources: ['R2'],
        predecessors: ['T2'],
        critical: true
      },
      {
        id: 'T4',
        wbsCode: '2.2',
        name: 'Procurement of Steel',
        startDate: '2024-04-10',
        endDate: '2024-05-20',
        duration: 40,
        status: TaskStatus.DELAYED,
        progress: 40,
        assignedResources: ['R5'],
        predecessors: ['T2'],
        critical: false
      },
      {
        id: 'T5',
        wbsCode: '3.1',
        name: 'Substructure Construction',
        startDate: '2024-06-16',
        endDate: '2024-09-30',
        duration: 106,
        status: TaskStatus.NOT_STARTED,
        progress: 0,
        assignedResources: ['R2', 'R3'],
        predecessors: ['T3'],
        critical: true
      },
       {
        id: 'T6',
        wbsCode: '3.2',
        name: 'Electrical Systems Rough-in',
        startDate: '2024-08-01',
        endDate: '2024-10-15',
        duration: 75,
        status: TaskStatus.NOT_STARTED,
        progress: 0,
        assignedResources: ['R2'],
        predecessors: ['T3'],
        critical: false
      }
    ]
  },
  {
    id: 'P1002',
    name: 'Downtown Commercial Hub',
    code: 'CHI-COM-088',
    manager: 'David Lee',
    budget: 12000000,
    spent: 500000,
    startDate: '2024-05-01',
    endDate: '2026-02-28',
    health: 'Good',
    tasks: []
  }
];
