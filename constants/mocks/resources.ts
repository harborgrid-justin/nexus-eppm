
import { Resource, Timesheet } from '../../types';

export const MOCK_RESOURCES: Resource[] = [
  { 
    id: 'R-001', 
    userId: 'U-003', 
    name: 'Jessica Pearson', 
    role: 'Portfolio Manager', 
    type: 'Human', 
    status: 'Active', 
    capacity: 160, 
    allocated: 120, 
    hourlyRate: 250, 
    skills: ['Portfolio Mgmt', 'Strategy'], 
    costRates: [], 
    calendarId: 'CAL-STD' 
  },
  { 
    id: 'R-002', 
    userId: 'U-002', 
    name: 'Mike Ross', 
    role: 'Project Manager', 
    type: 'Human', 
    status: 'Active', 
    capacity: 160, 
    allocated: 180, 
    hourlyRate: 150, 
    skills: ['Scheduling', 'P6'], 
    costRates: [], 
    calendarId: 'CAL-STD' 
  },
  // --- EQUIPMENT (Matching Request: 50% Availability) ---
  { 
    id: 'EQ-001', 
    name: 'Caterpillar 320 GC', 
    role: 'Excavator', 
    type: 'Equipment', 
    status: 'Active', 
    capacity: 160, 
    allocated: 140, 
    hourlyRate: 450, 
    skills: [], 
    costRates: [], 
    calendarId: '24/7',
    maintenanceStatus: 'Good',
    location: 'Sector A-4',
    serialNumber: 'CAT-320-99X'
  },
  { 
    id: 'EQ-002', 
    name: 'Liebherr LTM 11200', 
    role: 'Heavy Crane', 
    type: 'Equipment', 
    status: 'Active', 
    capacity: 160, 
    allocated: 0, 
    hourlyRate: 1200, 
    skills: [], 
    costRates: [], 
    calendarId: 'CAL-STD',
    maintenanceStatus: 'Down',
    location: 'Yard 2',
    serialNumber: 'LB-HEAVY-01'
  },
  // --- MATERIALS (Matching Request) ---
  { 
    id: 'MAT-001', 
    name: 'Ready-Mix Concrete Grade 40', 
    role: 'Foundation Material', 
    type: 'Material', 
    status: 'Active', 
    capacity: 0, 
    allocated: 0, 
    hourlyRate: 0, 
    skills: [], 
    costRates: [], 
    calendarId: 'CAL-STD',
    unitOfMeasure: 'CY',
    availableQuantity: 450,
    minQuantity: 1000, 
    location: 'North Silo'
  },
  { 
    id: 'MAT-002', 
    name: 'Structural Steel Rebar #4', 
    role: 'Reinforcement', 
    type: 'Material', 
    status: 'Active', 
    capacity: 0, 
    allocated: 0, 
    hourlyRate: 0, 
    skills: [], 
    costRates: [], 
    calendarId: 'CAL-STD',
    unitOfMeasure: 'TONS',
    availableQuantity: 85,
    minQuantity: 20,
    location: 'Warehouse B'
  }
];

export const MOCK_TIMESHEETS: Timesheet[] = [
    {
        id: 'TS-001',
        resourceId: 'R-002',
        periodStart: '2024-06-03',
        status: 'Submitted',
        totalHours: 42,
        rows: [
            { taskId: 'T-101', projectId: 'P1001', taskName: 'Site Clearing', projectName: 'Downtown Metro Hub', hours: [8, 8, 8, 8, 8, 0, 0] },
            { taskId: 'T-ADM', projectId: 'INT-001', taskName: 'Admin / Meetings', projectName: 'Internal', hours: [1, 0, 1, 0, 0, 0, 0] }
        ]
    },
    {
        id: 'TS-002',
        resourceId: 'R-003',
        periodStart: '2024-06-03',
        status: 'Approved',
        totalHours: 40,
        rows: [
            { taskId: 'T-101', projectId: 'P1001', taskName: 'Site Clearing', projectName: 'Downtown Metro Hub', hours: [8, 8, 8, 8, 8, 0, 0] }
        ]
    }
];
