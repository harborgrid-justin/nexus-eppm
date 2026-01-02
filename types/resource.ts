
export interface Resource {
  id: string;
  userId?: string; // Link to System User (Auth)
  name: string;
  role: string;
  type: 'Human' | 'Equipment' | 'Material' | 'Labor' | 'Non-Labor'; // Expanded to cover all uses
  status: 'Active' | 'Inactive';
  capacity: number; // For Humans/Equipment (hrs)
  allocated: number;
  hourlyRate: number;
  skills: string[];
  costRates: any[];
  calendarId: string;
  
  // Physical Resource Extension
  unitOfMeasure?: string; // For Materials (e.g., TONS, CY, EA)
  availableQuantity?: number; // Current Stock
  minQuantity?: number; // Reorder Point
  location?: string; // Physical Site/Warehouse
  
  // Equipment Specific
  maintenanceStatus?: 'Good' | 'Service Required' | 'Down';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  serialNumber?: string;
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
