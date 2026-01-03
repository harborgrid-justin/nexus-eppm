
export interface QualityReport {
  id: string;
  projectId: string;
  date: string;
  type: 'Inspection' | 'Test' | 'Audit';
  status: 'Pass' | 'Fail' | 'Conditional';
  inspector: string;
  summary: string;
}

export interface NonConformanceReport {
  id: string;
  projectId: string;
  date: string;
  description: string;
  severity: 'Critical' | 'Major' | 'Minor';
  status: 'Open' | 'In Progress' | 'Closed';
  linkedTaskId?: string;
  category: string;
  vendorId?: string;
}

export interface InspectionChecklist {
  id: string;
  items: { label: string; status: 'Pass' | 'Fail' | 'N/A'; comment?: string }[];
  photos: number;
  inspector: string;
  approver: string;
}
