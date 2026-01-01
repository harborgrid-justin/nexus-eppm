
import { 
    Stakeholder, UserDefinedField, DataJob, CommunicationLog, 
    QualityReport, NonConformanceReport 
} from '../../../types/index';

export const MOCK_STAKEHOLDERS: Stakeholder[] = [
  { id: 'SH-01', projectId: 'P1001', name: 'City Council', role: 'Sponsor', interest: 'High', influence: 'High', engagementStrategy: 'Manage Closely' },
  { id: 'SH-02', projectId: 'P1001', name: 'Local Residents', role: 'Community', interest: 'High', influence: 'Low', engagementStrategy: 'Keep Informed' },
];

export const MOCK_UDFS: UserDefinedField[] = [
  { id: 'UDF-01', subjectArea: 'Tasks', title: 'Safety Check Required', dataType: 'List', listValues: ['Yes', 'No'] },
  { id: 'UDF-02', subjectArea: 'Projects', title: 'Funding Source', dataType: 'Text' },
];

export const MOCK_DATA_JOBS: DataJob[] = [
  { id: 'JOB-102', type: 'Import', format: 'P6 XML', status: 'Completed', submittedBy: 'System', timestamp: '2024-06-15 14:30', details: 'Imported 142 tasks.' },
  { id: 'JOB-101', type: 'Export', format: 'CSV', status: 'Completed', submittedBy: 'Mike Ross', timestamp: '2024-06-14 09:15', details: 'Exported Cost Sheet.' },
];

export const MOCK_COMM_LOGS: CommunicationLog[] = [
  { id: 'COM-01', projectId: 'P1001', date: '2024-06-01', type: 'Meeting', subject: 'Kickoff Meeting', summary: 'Aligned on scope and timeline.', participantIds: ['R-001', 'R-002'] },
  { id: 'COM-02', projectId: 'P1001', date: '2024-06-05', type: 'Email', subject: 'Budget Approval', summary: 'Finance approved Q3 spend.', participantIds: ['R-003'] },
];

export const MOCK_QUALITY_REPORTS: QualityReport[] = [
  { id: 'QR-01', projectId: 'P1001', date: '2024-05-20', type: 'Inspection', status: 'Pass', inspector: 'Quality Mgr', summary: 'Foundation pouring verified.' },
  { id: 'QR-02', projectId: 'P1001', date: '2024-06-10', type: 'Audit', status: 'Conditional', inspector: 'External', summary: 'Minor documentation gaps.' },
  { id: 'QR-03', projectId: 'P1003', date: '2024-06-12', type: 'Test', status: 'Fail', inspector: 'Site Lead', summary: 'Pressure test failed on Valve A.' },
];

export const MOCK_DEFECTS: NonConformanceReport[] = [
  { id: 'NCR-001', projectId: 'P1001', date: '2024-05-22', description: 'Concrete slump test failure', severity: 'Major', status: 'Closed', category: 'Material', vendorId: 'V-02' },
  { id: 'NCR-002', projectId: 'P1003', date: '2024-06-12', description: 'Leaking valve seal', severity: 'Critical', status: 'Open', category: 'Workmanship', linkedTaskId: 'T-305' },
];
