import React from 'react';
import { useProjectState } from '../hooks/useProjectState';
import { useIndustry } from '../context/IndustryContext';
import { ShieldCheck, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { QualityReport } from '../types';

interface QualityManagementProps {
  projectId: string;
}

const industryContent = {
  Standard: {
    title: 'Quality Management',
    description: 'Track quality audits, tests, and compliance reports.',
    columns: ['ID', 'Type', 'Date', 'Status', 'Summary'],
    dataFormatter: (r: QualityReport) => [
      r.id, r.type, r.date, r.status, r.details.summary || 'N/A'
    ]
  },
  Construction: {
    title: 'QA/QC Inspections',
    description: 'Manage site inspections, material testing, and non-conformance reports.',
    columns: ['Report ID', 'Inspection/Test', 'Date', 'Result', 'Details'],
    dataFormatter: (r: QualityReport) => [
      r.id, r.details.testType || r.details.inspectionType, r.date, r.status, `${r.details.value || ''} ${r.details.finding || ''}`.trim()
    ]
  },
  Software: {
    title: 'Sprint Quality Assurance',
    description: 'Track test cases, bug reports, and build stability.',
    columns: ['Ticket ID', 'User Story', 'Test Status', 'Bugs Found', 'Build Version'],
     dataFormatter: (r: QualityReport) => [
      r.id, r.details.userStory || 'US-123', r.status, r.details.bugsFound || 0, r.details.buildVersion || 'v1.2.3'
    ]
  },
};

const QualityManagement: React.FC<QualityManagementProps> = ({ projectId }) => {
  const { qualityReports } = useProjectState(projectId);
  const { industry } = useIndustry();

  const content = industryContent[industry];

  const getStatusChip = (status: QualityReport['status']) => {
    switch(status) {
      case 'Pass': return <span className="flex items-center gap-1.5 text-xs font-medium text-green-700"><CheckCircle size={14}/> Pass</span>;
      case 'Fail': return <span className="flex items-center gap-1.5 text-xs font-medium text-red-700"><XCircle size={14}/> Fail</span>;
      default: return <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-700"><AlertCircle size={14}/> Conditional</span>;
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col p-6">
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-nexus-600" /> {content.title}
            </h1>
            <p className="text-slate-500">{content.description}</p>
          </div>
          <button className="px-4 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium">
             <Plus size={16} /> New Report
          </button>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
             <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 sticky top-0">
                   <tr>
                      {content.columns.map(col => (
                        <th key={col} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{col}</th>
                      ))}
                   </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {qualityReports.map(report => {
                    const rowData = content.dataFormatter(report);
                    return (
                      <tr key={report.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{rowData[0]}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{rowData[1]}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{rowData[2]}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusChip(report.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 truncate max-w-sm">{rowData[4]}</td>
                      </tr>
                    )
                  })}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default QualityManagement;