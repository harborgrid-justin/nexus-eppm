
import React from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useData } from '../context/DataContext';
import { MessageCircle, Plus, Mail, Users, Phone, Lock, MessageSquare, FileText, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePermissions } from '../hooks/usePermissions';
import { Button } from './ui/Button';
import { EmptyGrid } from './common/EmptyGrid';
import { PanelContainer } from './layout/standard/PanelContainer';

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

  const hasLogs = communicationLogs && communicationLogs.length > 0;

  if (!project) return null;

  // We are already inside a PanelContainer provided by ProjectWorkspace via PageLayout
  // So we just need to render the content.
  // Actually, we moved ProjectWorkspace to use PageLayout, which puts content in a PanelContainer.
  // But wait, PageLayout -> PanelContainer structure.
  // CommunicationManagement should just fill the space.

  return (
    <div className="flex flex-col h-full bg-white">
        <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center bg-slate-50/50 flex-shrink-0`}>
             <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase tracking-widest">
                <MessageSquare size={16} className="text-nexus-600"/> Communication Registry
             </h3>
             {canEditProject() ? (
                <Button variant="primary" icon={Plus} size="sm" onClick={() => {}}>Record Engagement</Button>
            ) : (
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${theme.colors.text.tertiary} ${theme.colors.background} px-4 py-2 rounded-xl border ${theme.colors.border} shadow-sm`}>
                   <Lock size={14}/> Read Only Archive
                </div>
            )}
        </div>

        <div className="flex-1 overflow-hidden relative">
          {!hasLogs ? (
              <div className="flex-1 flex h-full items-center justify-center p-8">
                  <EmptyGrid 
                    title="Engagement Stream Inactive" 
                    description="No formal communication artifacts (RFIs, Meeting Minutes, Transmittals) have been synchronized for this project period."
                    onAdd={canEditProject() ? () => {} : undefined} 
                    actionLabel="Log First Engagement"
                    icon={MessageSquare}
                  />
              </div>
          ) : (
            <div className="flex-1 overflow-auto scrollbar-thin bg-white">
                <div className="min-w-[800px]">
                    <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0" role="grid">
                        <thead className={`bg-slate-50/80 sticky top-0 z-10 backdrop-blur-md shadow-sm`}>
                        <tr>
                            <th className={theme.components.table.header + " py-6 pl-8"}>Timeline</th>
                            <th className={theme.components.table.header}>Artifact Type</th>
                            <th className={theme.components.table.header}>Subject Area</th>
                            <th className={theme.components.table.header}>Participating Entities</th>
                            <th className={theme.components.table.header + " text-right pr-12"}>Actions</th>
                        </tr>
                        </thead>
                        <tbody className={`${theme.colors.surface} divide-y divide-slate-50`}>
                        {communicationLogs.map(log => (
                            <tr key={log.id} className={`nexus-table-row hover:bg-slate-50/50 transition-colors group cursor-default`}>
                            <td className={theme.components.table.cell + " pl-8 font-mono text-[11px] font-bold text-slate-400 group-hover:text-nexus-600 transition-colors"}>{String(log.date)}</td>
                            <td className={theme.components.table.cell}>
                                <div className={`flex items-center gap-2 text-[10px] font-black uppercase text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 w-fit shadow-sm`}>
                                    {getIcon(log.type)} {String(log.type)}
                                </div>
                            </td>
                            <td className={theme.components.table.cell}>
                                <div className={`text-sm font-black ${theme.colors.text.primary} group-hover:text-nexus-800 transition-colors`}>{String(log.subject)}</div>
                                <div className={`text-[10px] ${theme.colors.text.tertiary} truncate max-w-md font-bold uppercase mt-1 tracking-tight`}>{String(log.summary)}</div>
                            </td>
                            <td className={theme.components.table.cell}>
                                <div className="flex flex-wrap gap-1.5">
                                    {log.participantIds?.map(id => (
                                        <span key={id} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                            {state.resources.find(r => r.id === id)?.name || id}
                                        </span>
                                    ))}
                                    {(!log.participantIds || log.participantIds.length === 0) && <span className="text-xs text-slate-300 italic">None</span>}
                                </div>
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
