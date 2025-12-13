
import React, { useState } from 'react';
import { Plus, CheckCircle, XCircle, AlertCircle, ClipboardList, Lock, Search, Filter, ChevronRight, Camera, FileCheck, UserCheck } from 'lucide-react';
import { QualityReport } from '../../types';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../common/ProgressBar';
import StatCard from '../shared/StatCard';

interface QualityControlLogProps {
  qualityReports: QualityReport[] | undefined;
}

// Mock checklist data structure for the detail view
interface InspectionChecklist {
  id: string;
  items: { label: string; status: 'Pass' | 'Fail' | 'N/A'; comment?: string }[];
  photos: number;
  inspector: string;
  approver: string;
}

const QualityControlLog: React.FC<QualityControlLogProps> = ({ qualityReports }) => {
  const { canEditProject } = usePermissions();
  const theme = useTheme();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');

  // KPIs
  const totalInspections = qualityReports?.length || 0;
  const passed = qualityReports?.filter(r => r.status === 'Pass').length || 0;
  const passRate = totalInspections > 0 ? (passed / totalInspections) * 100 : 0;
  const openDefects = qualityReports?.filter(r => r.status === 'Fail').length || 0;

  const filteredReports = qualityReports?.filter(r => 
    filterStatus === 'All' || r.status === filterStatus
  );

  const getStatusBadge = (status: QualityReport['status']) => {
    switch(status) {
      case 'Pass': return <Badge variant="success" icon={CheckCircle}>Pass</Badge>;
      case 'Fail': return <Badge variant="danger" icon={XCircle}>Fail</Badge>;
      default: return <Badge variant="warning" icon={AlertCircle}>Conditional</Badge>;
    }
  };

  // Mock detail data generator
  const getMockChecklist = (id: string): InspectionChecklist => ({
    id,
    items: [
      { label: 'Surface Preparation', status: 'Pass' },
      { label: 'Dimensional Tolerance (+/- 5mm)', status: 'Pass' },
      { label: 'Material Certifications Verified', status: 'Pass' },
      { label: 'Installation Torque Check', status: 'Fail', comment: 'Bolt #4 under-torqued' },
      { label: 'Safety Barricades Removed', status: 'N/A' },
    ],
    photos: 3,
    inspector: 'Mike Ross',
    approver: 'Sarah Chen'
  });

  const selectedReport = filteredReports?.find(r => r.id === selectedReportId);
  const checklist = selectedReport ? getMockChecklist(selectedReport.id) : null;

  return (
    <div className="h-full flex flex-col bg-slate-50/50">
       {/* Header & Stats */}
       <div className="p-6 border-b border-slate-200 bg-white flex-shrink-0 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={theme.typography.h2}>
                  <ClipboardList className="text-nexus-600" /> Inspection & Test Log
              </h1>
              <p className={theme.typography.small}>Track daily field inspections, material receipts, and test results.</p>
            </div>
            {canEditProject() ? (
              <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium`}>
                  <Plus size={16} /> <span className="hidden sm:inline">New Inspection</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                 <Lock size={14}/> Read Only
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <StatCard title="Inspection Pass Rate" value={`${passRate.toFixed(1)}%`} icon={FileCheck} trend={passRate > 90 ? 'up' : 'down'} />
             <StatCard title="Total Inspections" value={totalInspections} icon={ClipboardList} />
             <StatCard title="Failed / Re-Inspect" value={openDefects} icon={XCircle} trend={openDefects > 0 ? 'down' : undefined} />
             <StatCard title="Avg Closure Time" value="2.4 Days" icon={UserCheck} />
          </div>
       </div>

       {/* Main Content Area */}
       <div className="flex-1 flex overflow-hidden">
          {/* List View */}
          <div className={`flex-1 flex flex-col border-r border-slate-200 bg-white ${selectedReportId ? 'hidden lg:flex lg:w-1/2 xl:w-2/3' : 'w-full'}`}>
              
              {/* Toolbar */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
                 <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input 
                      type="text" 
                      placeholder="Search inspections..." 
                      className="pl-9 pr-4 py-1.5 w-full text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-nexus-500 outline-none"
                    />
                 </div>
                 <div className="flex items-center gap-2">
                    <Filter size={14} className="text-slate-400"/>
                    <select 
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="text-sm border border-slate-300 rounded-md py-1.5 px-3 bg-white focus:ring-1 focus:ring-nexus-500 outline-none"
                    >
                      <option value="All">All Status</option>
                      <option value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                      <option value="Conditional">Conditional</option>
                    </select>
                 </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID / Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Activity</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Result</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-50">
                      {filteredReports?.map(report => (
                        <tr 
                          key={report.id} 
                          onClick={() => setSelectedReportId(report.id)}
                          className={`cursor-pointer transition-colors ${selectedReportId === report.id ? 'bg-nexus-50' : 'hover:bg-slate-50'}`}
                        >
                          <td className="px-6 py-4">
                            <div className="text-xs font-mono font-bold text-slate-600">{report.id}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{report.date}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-900">{report.type}</div>
                            <div className="text-xs text-slate-500 truncate max-w-[150px]">
                              {report.details.testType || report.details.inspectionType || 'Standard Inspection'}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {getStatusBadge(report.status)}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <ChevronRight size={16} className="text-slate-300 inline-block"/>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
              </div>
          </div>

          {/* Detail View */}
          {selectedReportId && selectedReport && (
            <div className="w-full lg:w-1/2 xl:w-1/3 bg-slate-50 flex flex-col border-l border-slate-200 overflow-hidden shadow-xl lg:shadow-none absolute inset-0 lg:relative z-20">
               <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-start">
                  <div>
                     <h3 className="font-bold text-lg text-slate-800">{selectedReport.type}</h3>
                     <p className="text-sm text-slate-500">{selectedReport.id} • {selectedReport.date}</p>
                  </div>
                  <button onClick={() => setSelectedReportId(null)} className="p-2 hover:bg-slate-100 rounded-full lg:hidden">
                    <XCircle size={20} className="text-slate-400"/>
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-lg flex items-center gap-3 border ${
                    selectedReport.status === 'Pass' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                     {selectedReport.status === 'Pass' ? <CheckCircle className="text-green-600" size={24}/> : <XCircle className="text-red-600" size={24}/>}
                     <div>
                        <h4 className={`font-bold ${selectedReport.status === 'Pass' ? 'text-green-900' : 'text-red-900'}`}>
                          Inspection Result: {selectedReport.status}
                        </h4>
                        <p className={`text-xs ${selectedReport.status === 'Pass' ? 'text-green-700' : 'text-red-700'}`}>
                          {selectedReport.status === 'Pass' ? 'All criteria met. Proceed to next stage.' : 'Defects identified. NCR generated.'}
                        </p>
                     </div>
                  </div>

                  {/* Checklist */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                     <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 text-sm">
                        Verification Checklist
                     </div>
                     <div className="divide-y divide-slate-100">
                        {checklist?.items.map((item, i) => (
                           <div key={i} className="p-3 flex items-start gap-3">
                              <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border ${
                                 item.status === 'Pass' ? 'bg-green-100 border-green-300 text-green-700' :
                                 item.status === 'Fail' ? 'bg-red-100 border-red-300 text-red-700' :
                                 'bg-slate-100 border-slate-300 text-slate-400'
                              }`}>
                                 {item.status === 'Pass' && <CheckCircle size={12}/>}
                                 {item.status === 'Fail' && <XCircle size={12}/>}
                                 {item.status === 'N/A' && <span className="text-[10px]">−</span>}
                              </div>
                              <div className="flex-1">
                                 <p className="text-sm text-slate-800">{item.label}</p>
                                 {item.comment && <p className="text-xs text-red-600 mt-1 italic">Note: {item.comment}</p>}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Evidence & Signatures */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><Camera size={14}/> Evidence</h4>
                        <div className="flex gap-2">
                           {[1,2,3].map(i => (
                              <div key={i} className="w-12 h-12 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-xs text-slate-400">IMG</div>
                           ))}
                        </div>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2"><UserCheck size={14}/> Sign-off</h4>
                        <div className="space-y-2">
                           <div className="text-xs">
                              <span className="text-slate-400">Inspector:</span> <br/>
                              <span className="font-medium text-slate-700">{checklist?.inspector}</span>
                           </div>
                           <div className="text-xs">
                              <span className="text-slate-400">Approver:</span> <br/>
                              <span className="font-medium text-slate-700">{checklist?.approver}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
       </div>
    </div>
  );
};

export default QualityControlLog;
