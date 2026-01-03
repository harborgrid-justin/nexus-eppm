
export interface DailyLogEntry {
    id: string;
    projectId: string;
    date: string;
    weather: {
        condition: string;
        temperature: string;
        wind?: string;
        precipitation?: string;
    };
    workLogs: WorkLog[];
    delays: DelayLog[];
    notes?: string;
    submittedBy: string;
}

export interface WorkLog {
    id: string;
    contractor: string;
    headcount: number;
    hours: number;
    location: string;
    description: string;
    costCode?: string;
}

export interface DelayLog {
    id: string;
    category: 'Weather' | 'Material' | 'RFI' | 'Other';
    duration: string;
    description: string;
}

export interface SafetyIncident {
    id: string;
    projectId: string;
    date: string;
    type: 'Near Miss' | 'First Aid' | 'Medical Only' | 'Lost Time' | 'Property Damage';
    description: string;
    location: string;
    status: 'Open' | 'Investigating' | 'Closed';
    reportedBy: string;
}

export interface PunchItem {
    id: string;
    projectId: string;
    description: string;
    location: string;
    assignee: string; // Vendor or User
    status: 'Open' | 'Resolved' | 'Closed';
    priority: 'High' | 'Medium' | 'Low';
    dateIdentified: string;
    image?: boolean; // Mock for now
}
