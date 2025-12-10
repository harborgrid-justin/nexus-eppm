import React from 'react';
import { Plus, CheckCircle, XCircle, AlertCircle, ClipboardList } from 'lucide-react';
import { QualityReport } from '../../types';

interface QualityControlLogProps {
  qualityReports: QualityReport[] | undefined;
}

const QualityControlLog: React.FC<QualityControlLogProps> = ({ qualityReports }) => {

  const getStatusChip = (status: QualityReport['status']) => {
    switch(status) {
      case 'Pass': return <span className="flex items-center gap-1.5 text-xs font-medium text-green-700"><CheckCircle size={14}/> Pass</span>;
      case 'Fail': return <span className="flex items-center gap-1.5 text-xs font-medium text-red-700"><XCircle size={14}/> Fail</span>;
      default: return <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-700"><AlertCircle size={14}/> Conditional</span>;
    }
  }

  return (
    <div className="h-full flex flex-col">
       <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between">
          <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
              <ClipboardList size={16} /> Inspection & Test Log
          </h3>
          <button className="px-3 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium">
             <Plus size={16} /> New QC Record
          </button>
       </div>

       <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-slate-200">
             <thead className="bg-slate-50 sticky top-0">
                <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Record ID</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity Type</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
                </tr>
             </thead>
             <tbody className="bg-white divide-y divide-slate-100">
               {qualityReports && qualityReports.map(report => (
                 <tr key={report.id} className="hover:bg-slate-50">
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{report.id}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{report.type}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{report.date}</td>
                   <td className="px-6 py-4 whitespace-nowrap">{getStatusChip(report.status)}</td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 truncate max-w-sm">
                     {report.details.testType || report.details.inspectionType || 'N/A'}
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
       </div>
    </div>
  );
};

export default QualityControlLog;
