


import React from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useData } from '../context/DataContext';
import { MessageCircle, Plus, Mail, Users, Phone, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePermissions } from '../hooks/usePermissions';
import { PageHeader } from './common/PageHeader';
// FIX: Corrected import path for CommunicationLog type to resolve module resolution error.
import { CommunicationLog } from '../types/index';

const CommunicationsManagement: React.FC = () => {
  const { communicationLogs } = useProjectWorkspace();
  const { state } = useData();
  const theme = useTheme();
  const { canEditProject } = usePermissions();

  const getIcon = (type: string) => {
    switch(type) {
      case 'Meeting': return <Users size={16} className="text-blue-500" />;
      case 'Email': return <Mail size={16} className="text-red-500" />;
      case 'Call': return <Phone size={16} className="text-green-500" />;
      default: return <MessageCircle size={16} className="text-slate-500" />;
    }
  };

  const getParticipantNames = (ids: string[] = []) => {
      if (!ids || !Array.isArray(ids)) return 'None';
      return ids.map(id => state.resources.find(r => r.id === id)?.name || id).join(', ');
  };

  return (
    <div className={`${theme.layout.pagePadding} flex flex-col h-full`}>
       <PageHeader
            title="Communications Log"
            subtitle="Record and track all formal project communications."
            icon={MessageCircle}
            actions={canEditProject() ? (
                <button className={`px-4 py-2 ${theme.colors.primary} text-white rounded-lg flex items-center gap-2 ${theme.colors.primaryHover} shadow-sm text-sm font-medium`}>
                   <Plus size={16} /> <span className="hidden sm:inline">New Log Entry</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                   <Lock size={14}/> Read Only
                </div>
              )}
       />

       <div className={`${theme.components.card} flex-1 overflow-hidden flex flex-col`}>
          <div className="flex-1 overflow-auto">
             <div className="min-w-[800px]">
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
                      {(communicationLogs || []).map(log => (
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
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                               {getParticipantNames(log.participantIds)}
                           </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
             </div>
          </div>
       </div>
    </div>
  );
};

export default CommunicationsManagement;