
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { 
    MessageSquare, Calendar, FileText, Send, CheckCircle, 
    Clock, AlertTriangle, Users, Download, Eye, Bell 
} from 'lucide-react';
import { MOCK_COST_REPORTS, MOCK_COST_MEETINGS, MOCK_COST_ALERTS } from '../../constants/mocks/finance';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

interface CostCommunicationsProps {
  projectId: string;
}

const CostCommunications: React.FC<CostCommunicationsProps> = ({ projectId }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'reports' | 'meetings' | 'alerts'>('reports');

  // Filter mocks by project ID (using mock data for now as it's not fully in State yet)
  const reports = MOCK_COST_REPORTS.filter(r => r.projectId === projectId);
  const meetings = MOCK_COST_MEETINGS.filter(m => m.projectId === projectId);
  const alerts = MOCK_COST_ALERTS.filter(a => a.projectId === projectId);

  const getReportStatusColor = (status: string) => {
      switch(status) {
          case 'Distributed': return 'success';
          case 'Draft': return 'warning';
          case 'In Review': return 'info';
          default: return 'neutral';
      }
  };

  const renderReports = () => (
      <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                  <h3 className="font-bold text-slate-800 text-lg">Reporting Cycle: Month End Close</h3>
                  <p className="text-sm text-slate-500 mt-1">Next Deadline: <span className="font-bold text-red-600">Oct 5, 2024</span></p>
              </div>
              <div className="flex items-center gap-2">
                  {[
                      { step: 'Data Cutoff', status: 'done' },
                      { step: 'Accruals', status: 'done' },
                      { step: 'Variance Analysis', status: 'active' },
                      { step: 'Review', status: 'pending' },
                      { step: 'Distribution', status: 'pending' }
                  ].map((s, i) => (
                      <div key={i} className="flex items-center">
                          <div className={`flex flex-col items-center gap-1 ${s.status === 'active' ? 'opacity-100' : 'opacity-60'}`}>
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                                  s.status === 'done' ? 'bg-green-100 border-green-500 text-green-700' :
                                  s.status === 'active' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-400'
                              }`}>
                                  {s.status === 'done' ? <CheckCircle size={14}/> : i + 1}
                              </div>
                              <span className="text-[10px] font-medium uppercase tracking-wide">{s.step}</span>
                          </div>
                          {i < 4 && <div className="w-8 h-0.5 bg-slate-200 mx-2 -mt-4"></div>}
                      </div>
                  ))}
              </div>
          </div>

          <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Cost Report Archive</h3>
                  <button className="text-xs font-medium text-nexus-600 hover:underline flex items-center gap-1">
                      <FileText size={14}/> View Templates
                  </button>
              </div>
              <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-white">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Period</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Distributed To</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                      {reports.map(report => (
                          <tr key={report.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4">
                                  <div className="font-bold text-sm text-slate-900">{report.period}</div>
                                  <div className="text-xs text-slate-500">Due: {report.dueDate}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">{report.type}</td>
                              <td className="px-6 py-4">
                                  <Badge variant={getReportStatusColor(report.status)}>{report.status}</Badge>
                              </td>
                              <td className="px-6 py-4 text-xs text-slate-500">
                                  {report.distributedTo.length > 0 ? report.distributedTo.join(', ') : '-'}
                              </td>
                              <td className="px-6 py-4 text-right flex justify-end gap-2">
                                  <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Preview"><Eye size={16}/></button>
                                  {report.status === 'Draft' ? (
                                      <button className="p-1.5 hover:bg-nexus-50 rounded text-nexus-600" title="Distribute"><Send size={16}/></button>
                                  ) : (
                                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Download"><Download size={16}/></button>
                                  )}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );

  const renderMeetings = () => (
      <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {meetings.map(meeting => (
                  <div key={meeting.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-nexus-300 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                  <Calendar size={20}/>
                              </div>
                              <div>
                                  <h4 className="font-bold text-slate-800 text-sm">{meeting.title}</h4>
                                  <p className="text-xs text-slate-500">{meeting.date}</p>
                              </div>
                          </div>
                      </div>
                      
                      <div className="space-y-3">
                          <div className="bg-slate-50 p-3 rounded text-xs text-slate-600">
                              <strong>Outcome:</strong> {meeting.outcomes}
                          </div>
                          
                          {meeting.actionItems.length > 0 && (
                              <div>
                                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Action Items</p>
                                  <ul className="space-y-2">
                                      {meeting.actionItems.map(item => (
                                          <li key={item.id} className="flex items-start gap-2 text-xs">
                                              <input type="checkbox" checked={item.status === 'Closed'} readOnly className="mt-0.5 rounded text-nexus-600"/>
                                              <span className={item.status === 'Closed' ? 'line-through text-slate-400' : 'text-slate-700'}>
                                                  {item.description} <span className="text-slate-400">({item.assignedTo})</span>
                                              </span>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          )}
                      </div>
                  </div>
              ))}
              {meetings.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                      <Users size={32} className="mx-auto mb-2 opacity-50"/>
                      <p>No cost review meetings recorded.</p>
                  </div>
              )}
          </div>
      </div>
  );

  const renderAlerts = () => (
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Bell size={16}/> Automated Alerts Log</h3>
              <button className="text-xs font-medium text-slate-500 hover:text-slate-700">Configure Thresholds</button>
          </div>
          <div className="divide-y divide-slate-100">
              {alerts.map(alert => (
                  <div key={alert.id} className="p-4 flex items-start gap-4 hover:bg-slate-50">
                      <div className={`mt-1 p-2 rounded-full ${
                          alert.severity === 'High' ? 'bg-red-100 text-red-600' : 
                          alert.severity === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                          <AlertTriangle size={16}/>
                      </div>
                      <div className="flex-1">
                          <div className="flex justify-between">
                              <h4 className="font-bold text-sm text-slate-900">{alert.metric} Threshold Breach</h4>
                              <span className="text-xs text-slate-400">{alert.date}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                          <div className="mt-2 flex gap-4 text-xs text-slate-500">
                              <span>Value: <strong className="text-slate-800">{alert.metric === 'Variance' ? formatCurrency(alert.value) : alert.value}</strong></span>
                              <span>Limit: {alert.metric === 'Variance' ? formatCurrency(alert.threshold) : alert.threshold}</span>
                              <span>Sent to: {alert.recipients.join(', ')}</span>
                          </div>
                      </div>
                  </div>
              ))}
              {alerts.length === 0 && (
                  <div className="p-8 text-center text-slate-400 text-sm">No alerts triggered.</div>
              )}
          </div>
      </div>
  );

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className={theme.typography.h1}>
                    <MessageSquare className="text-nexus-600" /> Cost Communications
                </h1>
                <p className={theme.typography.small}>Manage financial reporting cycles, reviews, and automated alerts.</p>
            </div>
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <button 
                    onClick={() => setActiveTab('reports')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'reports' ? 'bg-nexus-100 text-nexus-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <FileText size={16}/> Reports
                </button>
                <button 
                    onClick={() => setActiveTab('meetings')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'meetings' ? 'bg-nexus-100 text-nexus-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Users size={16}/> Meetings
                </button>
                <button 
                    onClick={() => setActiveTab('alerts')}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === 'alerts' ? 'bg-nexus-100 text-nexus-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                    <Bell size={16}/> Alert Log
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'meetings' && renderMeetings()}
            {activeTab === 'alerts' && renderAlerts()}
        </div>
    </div>
  );
};

export default CostCommunications;
