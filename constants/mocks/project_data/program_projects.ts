
// FIX: Direct import to avoid circular dependency
import { Project, TaskStatus } from '../../../types/project';

export const MOCK_SCI_PROJECTS: Project[] = [
  {
      id: 'P1004',
      programId: 'PRG-001',
      name: 'Smart Streetlights',
      code: 'SCI-01',
      managerId: 'R-001',
      epsId: 'EPS-INFRA',
      obsId: 'OBS-NA',
      calendarId: 'CAL-STD',
      status: 'Active',
      health: 'Good',
      budget: 5000000,
      spent: 1200000,
      originalBudget: 5000000,
      startDate: '2023-03-01',
      endDate: '2024-12-31',
      strategicImportance: 8,
      financialValue: 6,
      riskScore: 4,
      resourceFeasibility: 8,
      calculatedPriorityScore: 80,
      category: 'Innovation & Growth',
      tasks: [
        { id: 'T-401', wbsCode: '1', name: 'Installation Phase 1', startDate: '2023-03-01', endDate: '2023-08-30', duration: 120, status: TaskStatus.COMPLETED, progress: 100, dependencies: [], critical: false, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-402', wbsCode: '2', name: 'Sensor Calibration', startDate: '2023-09-01', endDate: '2023-11-30', duration: 60, status: TaskStatus.COMPLETED, progress: 100, dependencies: [{ targetId: 'T-401', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] }
      ]
  },
  {
      id: 'P1005',
      programId: 'PRG-001',
      name: 'Traffic AI Control',
      code: 'SCI-02',
      managerId: 'R-002',
      epsId: 'EPS-IT',
      obsId: 'OBS-PMO',
      calendarId: 'CAL-STD',
      status: 'Active',
      health: 'Warning',
      budget: 8000000,
      spent: 6500000,
      originalBudget: 7500000,
      startDate: '2023-06-01',
      endDate: '2025-03-30',
      strategicImportance: 9,
      financialValue: 8,
      riskScore: 14,
      resourceFeasibility: 5,
      calculatedPriorityScore: 88,
      category: 'Innovation & Growth',
      tasks: [
        { id: 'T-501', wbsCode: '1', name: 'Algorithm Dev', startDate: '2023-06-01', endDate: '2023-12-31', duration: 150, status: TaskStatus.COMPLETED, progress: 100, dependencies: [], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] },
        { id: 'T-502', wbsCode: '2', name: 'Intersection Deployment', startDate: '2024-01-01', endDate: '2024-06-30', duration: 130, status: TaskStatus.DELAYED, progress: 40, dependencies: [{ targetId: 'T-501', type: 'FS', lag: 0 }], critical: true, type: 'Task', effortType: 'Fixed Work', assignments: [] }
      ]
  }
];
