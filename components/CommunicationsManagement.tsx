import React from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useData } from '../context/DataContext';
import { MessageCircle, Plus, Mail, Users, Phone, Lock, MessageSquare, FileText, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePermissions } from '../hooks/usePermissions';
import { PageHeader } from './common/PageHeader';
import { Button } from './ui/Button';
import { EmptyGrid } from './common/EmptyGrid';

const CommunicationsManagement: React.FC = () => {
  const { project, communicationLogs } = useProjectWorkspace();
  const { state } = useData();
  const theme = useTheme();
  const { canEditProject } = usePermissions();

  const getIcon = (type: string) => {
    switch(type) {
      case 'Meeting': return <Users size={16} className="text-blue-500" />;
      case 'Email': return <Mail size={16} className="text-red-500" />;
      case 'Call': return <Phone size={16} className="text-green-500" />;
      case 'RFI': return <FileText size={16} className="text-orange-500" />;
      default: return <MessageCircle size={16} className={theme.colors.text.tertiary} />;
    }
  };

  const getParticipantNames = (ids: string[] = []) => {
      if (!ids || !Array.isArray(ids)) return 'None';
      return ids.map(id => state.resources.find(r => r.id === id)?.name || id).join(', ');
  };

  const hasLogs = communicationLogs && communicationLogs.length > 0;

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
       <PageHeader
            title="Communication Registry"
            subtitle={`Consolidated formal engagements for ${project.code}: ${project.name}`}
            icon={MessageCircle}
            actions={canEditProject() ? (
                <Button variant="primary" icon={Plus} size="md" onClick={() => {}}>Record Engagement</Button>
              ) : (
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${theme.colors.text.tertiary} ${theme.colors.background} px-3 py-2 rounded-lg border ${theme.colors.border}`}>
                   <Lock size={14}/> Read Only Archive
                </div>
              )}
       />

       <div className={`${theme.layout.panelContainer} shadow-xl shadow-slate-900/5`}>
          {!hasLogs ? (
              <EmptyGrid 
                title="Engagement Stream Inactive" 
                description="No formal communication artifacts (RFIs, Meeting Minutes, Transmittals) have been synchronized for this project period."
                onAdd={canEditProject() ? () => {} : undefined} 
                actionLabel="Log First Engagement"
                icon={MessageSquare}
              />
          ) : (
            <div className="flex-1 overflow-auto scrollbar-thin bg-white">
                <div className="min-w-[800px]">
                    <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0" role="grid">
                        <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm border-b`}>
                        <tr>
                            <th className={theme.components.table.header + " border-b border-slate-200 py-6"}>Timeline</th>
                            <th className={theme.components.table.header + " border-b border-slate-200"}>Artifact Type</th>
                            <th className={theme.components.table.header + " border-b border-slate-200"}>Subject Area</th>
                            <th className={theme.components.table.header + " border-b border-slate-200"}>Participating Entities</th>
                            <th className={theme.components.table.header + " border-b border-slate-200 text-right pr-12"}>Actions</th>
                        </tr>
                        </thead>
                        <tbody className={`${theme.colors.surface} divide-y divide-slate-50`}>
                        {communicationLogs.map(log => (
                            <tr key={log.id} className={`nexus-table-row hover:bg-slate-50/50 transition-colors group cursor-default`}>
                            <td className={theme.components.table.cell + " font-mono text-[11px] font-bold text-slate-400 group-hover:text-nexus-600 transition-colors"}>{String(log.date)}</td>
                            <td className={theme.components.table.cell}>
                                <div className={`flex items-center gap-2 text-xs font-black uppercase text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 w-fit`}>
                                    {getIcon(log.type)} {String(log.type)}
                                </div>
                            </td>
                            <td className={theme.components.table.cell}>
                                <div className={`text-sm font-black ${theme.colors.text.primary} group-hover:text-nexus-800 transition-colors`}>{String(log.subject)}</div>
                                <div className={`text-[10px] ${theme.colors.text.tertiary} truncate max-w-md font-bold uppercase mt-1`}>{String(log.summary)}</div>
                            </td>
                            <td className={theme.components.table.cell + " text-xs font-semibold " + theme.colors.text.secondary}>
                                {getParticipantNames(log.participantIds)}
                            </td>
                            <td className={theme.components.table.cell + " text-right pr-8"}>
                                <button className="p-2 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-nexus-600">
                                    <ChevronRight size={18}/>
                                </button>
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