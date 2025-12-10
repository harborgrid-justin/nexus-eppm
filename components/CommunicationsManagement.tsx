
import React from 'react';
import { useProjectState } from '../hooks';
import { MessageCircle, Plus, Mail, Users, Phone } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CommunicationsManagementProps {
  projectId: string;
}

const CommunicationsManagement: React.FC<CommunicationsManagementProps> = ({ projectId }) => {
  const { communicationLogs } = useProjectState(projectId);
  const theme = useTheme();

  const getIcon = (type: string) => {
    switch(type) {
      case 'Meeting': return <Users size={16} className="text-blue-500" />;
      case 'Email': return <Mail size={16} className="text-red-500" />;
      case 'Call': return <Phone size={16} className="text-green-500" />;
      default: return <MessageCircle size={16} className="text-slate-500" />;
    }
  }

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
       <div className={theme.layout.header}>
          <div>
            <h1 className={theme.typography.h1}>
              <MessageCircle className="text-nexus-600" /> Communications Log
            </h1>
            <p className={theme.typography.small}>Record and track all formal project communications.</p>
          </div>
          <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium`}>
             <Plus size={16} /> New Log Entry
          </button>
       </div>

       <div className={theme.layout.panelContainer}>
          <div className="flex-1 overflow-auto">
             <table className="min-w-full divide-y divide-slate-200">
                <thead className={`${theme.colors.background} sticky top-0`}>
                   <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-32">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-24">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Participants</th>
                   </tr>
                </thead>
                <tbody className={`${theme.colors.surface} divide-y divide-slate-100`}>
                  {communicationLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{log.date}</td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                         <div className="flex items-center gap-2">
                           {getIcon(log.type)} {log.type}
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <div className="text-sm font-semibold text-slate-900">{log.subject}</div>
                         <div className="text-xs text-slate-500 truncate max-w-md">{log.summary}</div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{log.participants.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default CommunicationsManagement;
