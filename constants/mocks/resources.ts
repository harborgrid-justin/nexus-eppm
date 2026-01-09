
import { Resource, Timesheet } from '../../types';

export const MOCK_RESOURCES: Resource[] = [
  // --- LEADERSHIP ---
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
    skills: ['Scheduling', 'P6', 'Risk Mgmt'], 
    costRates: [], 
    calendarId: 'CAL-STD' 
  },
  { 
    id: 'R-003', 
    userId: 'U-004', 
    name: 'Louis Litt', 
    role: 'Financial Controller', 
    type: 'Human', 
    status: 'Active', 
    capacity: 160, 
    allocated: 150, 
    hourlyRate: 200, 
    skills: ['Cost Controls', 'Auditing'], 
    costRates: [], 
    calendarId: 'CAL-STD' 
  },

  // --- CONSTRUCTION CREW ---
  {
    id: 'R-CON-01',
    name: 'Site Foreman (General)',
    role: 'Superintendent',
    type: 'Human',
    status: 'Active',
    capacity: 180,
    allocated: 160,
    hourlyRate: 110,
    skills: ['Safety', 'Logistics'],
    costRates: [],
    calendarId: 'CAL-STD'
  },
  {
    id: 'R-CON-02',
    name: 'Civil Crew A',
    role: 'Civil Team',
    type: 'Labor',
    status: 'Active',
    capacity: 640, // 4 people * 160
    allocated: 400,
    hourlyRate: 85,
    skills: ['Excavation', 'Concrete'],
    costRates: [],
    calendarId: 'CAL-STD'
  },
  {
    id: 'R-CON-03',
    name: 'Ironworkers Local 4',
    role: 'Structural Team',
    type: 'Labor',
    status: 'Active',
    capacity: 800, // 5 people
    allocated: 0,
    hourlyRate: 120,
    skills: ['Welding', 'Rigging'],
    costRates: [],
    calendarId: 'CAL-STD'
  },
  {
    id: 'R-CON-04',
    name: 'MEP Engineers',
    role: 'MEP Team',
    type: 'Labor',
    status: 'Active',
    capacity: 320,
    allocated: 100,
    hourlyRate: 145,
    skills: ['Electrical', 'HVAC', 'Plumbing'],
    costRates: [],
    calendarId: 'CAL-STD'
  },

  // --- SOFTWARE TEAM ---
  {
    id: 'R-SW-01',
    name: 'Sarah Chen',
    role: 'Senior Architect',
    type: 'Human',
    status: 'Active',
    capacity: 160,
    allocated: 140,
    hourlyRate: 180,
    skills: ['Cloud Architecture', 'System Design'],
    costRates: [],
    calendarId: 'CAL-STD'
  },
  {
    id: 'R-SW-02',
    name: 'Frontend Squad Alpha',
    role: 'Development Team',
    type: 'Labor',
    status: 'Active',
    capacity: 480, // 3 devs
    allocated: 400,
    hourlyRate: 110,
    skills: ['React', 'TypeScript', 'Tailwind'],
    costRates: [],
    calendarId: 'CAL-STD'
  },
  {
    id: 'R-SW-03',
    name: 'Backend Squad Beta',
    role: 'Development Team',
    type: 'Labor',
    status: 'Active',
    capacity: 480,
    allocated: 420,
    hourlyRate: 115,
    skills: ['Node.js', 'Python', 'SQL'],
    costRates: [],
    calendarId: 'CAL-STD'
  },

  // --- EQUIPMENT ---
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
    calendarId: 'CAL-247',
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

  // --- MATERIALS ---
  { 
    id: 'MAT-001', 
    name: 'Ready-Mix Concrete Grade 40', 
    role: 'Foundation Material', 
    type: 'Material', 
    status: 'Active', 
    capacity: 0, 
    allocated: 0, 
    hourlyRate: 120, // Unit Price
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
    hourlyRate: 850, // Unit Price
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
