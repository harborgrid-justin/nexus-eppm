import React from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useData } from '../context/DataContext';
import { MessageCircle, Plus, Mail, Users, Phone, Lock, MessageSquare } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePermissions } from '../hooks/usePermissions';
import { PageHeader } from './common/PageHeader';
import { FieldPlaceholder } from './common/FieldPlaceholder';

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
      default: return <MessageCircle size={16} className={theme.colors.text.tertiary} />;
    }
  };

  const getParticipantNames = (ids: string[] = []) => {
      if (!ids || !Array.isArray(ids)) return 'None';
      return ids.map(id => state.resources.find(r => r.id === id)?.name || id).join(', ');
  };

  const hasLogs = communicationLogs && communicationLogs.length > 0;

  return (
    <div className={`${theme.layout.pagePadding} flex flex-col h-full bg-transparent`}>
       <PageHeader
            title="Communication Registry"
            subtitle="Centralized archive of RFIs, stakeholder engagements, and meeting minutes."
            icon={MessageCircle}
            actions={canEditProject() ? (
                <button className={`px-5 py-2.5 ${theme.colors.primary} text-white rounded-xl flex items-center gap-2 hover:brightness-110 shadow-lg text-xs font-black uppercase tracking-widest transition-all active:scale-95`}>
                   <Plus size={16} /> New Entry
                </button>
              ) : (
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${theme.colors.text.tertiary} ${theme.colors.background} px-3 py-2 rounded-lg border ${theme.colors.border}`}>
                   <Lock size={14}/> Registry Locked
                </div>
              )}
       />

       <div className={`${theme.components.card} flex-1 overflow-hidden flex flex-col`}>
          {!hasLogs ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12">
                  <FieldPlaceholder 
                    label="No communications recorded for this project." 
                    onAdd={canEditProject() ? () => {} : undefined} 
                    icon={MessageSquare}
                  />
              </div>
          ) : (
            <div className="flex-1 overflow-auto scrollbar-thin">
                <div className="min-w-[800px]">
                    <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                        <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm`}>
                        <tr>
                            <th className={theme.components.table.header + " border-b"}>Timeline</th>
                            <th className={theme.components.table.header + " border-b"}>Artifact Type</th>
                            <th className={theme.components.table.header + " border-b"}>Subject Area</th>
                            <th className={theme.components.table.header + " border-b"}>Participating Entities</th>
                        </tr>
                        </thead>
                        <tbody className={`${theme.colors.surface} divide-y divide-slate-50`}>
                        {communicationLogs.map(log => (
                            <tr key={log.id} className={`${theme.components.table.row} hover:${theme.colors.background} transition-colors group`}>
                            <td className={theme.components.table.cell + " font-mono text-xs font-bold " + theme.colors.text.tertiary}>{String(log.date)}</td>
                            <td className={theme.components.table.cell}>
                                <div className={`flex items-center gap-2 text-sm font-bold ${theme.colors.text.primary}`}>
                                {getIcon(log.type)} {String(log.type)}
                                </div>
                            </td>
                            <td className={theme.components.table.cell}>
                                <div className={`text-sm font-black ${theme.colors.text.primary} group-hover:text-nexus-600 transition-colors`}>{String(log.subject)}</div>
                                <div className={`text-[10px] ${theme.colors.text.tertiary} truncate max-w-md font-medium mt-0.5`}>{String(log.summary)}</div>
                            </td>
                            <td className={theme.components.table.cell + " text-xs font-semibold " + theme.colors.text.secondary}>
                                {getParticipantNames(log.participantIds)}
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
          )}
       </div>
    </div>
  );
};

export default CommunicationsManagement;