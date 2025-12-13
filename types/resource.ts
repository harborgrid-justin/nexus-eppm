
export interface Resource {
  id: string;
  name: string;
  role: string;
  type: 'Human' | 'Equipment' | 'Material';
  status: 'Active' | 'Inactive';
  capacity: number;
  allocated: number;
  hourlyRate: number;
  skills: string[];
  costRates: any[];
  calendarId: string;
}

export interface EnterpriseRole {
    id: string;
    title: string;
    description: string;
    requiredSkills: string[];
}

export interface EnterpriseSkill {
    id: string;
    name: string;
    category: string;
}

export interface Timesheet {
  id: string;
  resourceId: string;
  periodStart: string; // ISO Date of the Monday
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  totalHours: number;
  rows: TimesheetRow[];
}

export interface TimesheetRow {
  taskId: string;
  projectId: string;
  taskName: string; // Denormalized for display
  projectName: string; // Denormalized for display
  hours: number[]; // Array of 7 numbers (Mon-Sun)
  comment?: string;
}
