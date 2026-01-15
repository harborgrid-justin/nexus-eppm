
import React from 'react';
import { useProgramStakeholdersLogic } from '../../hooks/domain/useProgramStakeholdersLogic';
import { Users, MessageSquare, Shield, Plus, Edit2, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { EmptyGrid } from '../common/EmptyGrid';

interface ProgramStakeholdersProps {
  programId: string;
}

const ProgramStakeholders: React.FC<ProgramStakeholdersProps> = ({ programId }) => {
  const theme = useTheme();
  // Fixed: Destructured setEditingStakeholder and setEditingCommItem from the logic hook
  const {
      programStakeholders,
      communicationPlan,
      isStakeholderPanelOpen,
      editingStakeholder,
      isCommPanelOpen,
      editingCommItem,
      setIsStakeholderPanelOpen,
      setIsCommPanelOpen,
      setEditingStakeholder,
      setEditingCommItem,
      handleOpenStakeholderPanel,
      handleSaveStakeholder,
      handleDeleteStakeholder,
      handleOpenCommPanel,
      handleSaveCommItem,
      handleDeleteCommItem
  } = useProgramStakeholdersLogic(programId);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300 scrollbar-thin`}>
        <div className="flex items-center gap-2 mb-2">
            <Users className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Stakeholder Engagement & Communication</h2>
        </div>

        <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col min-h-[300px]`}>
            <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.background} flex justify-between items-center`}>
                <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-[10px] tracking-widest"><Shield size={18} className="text-blue-500"/> Stakeholder Salience Register</h3>
                <Button size="sm" icon={Plus} onClick={() => handleOpenStakeholderPanel()}>Identify Stakeholder</Button>
            </div>
            {programStakeholders.length > 0 ? (
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                        <thead className="bg-white">
                            <tr>
                                <th className={theme.components.table.header + " pl-6"}>Stakeholder Designation</th>
                                <th className={theme.components.table.header}>Classification</th>
                                <th className={theme.components.table.header}>Power / Interest</th>
                                <th className={theme.components.table.header}>Engagement Posture</th>
                                <th className={theme.components.table.header + " text-right pr-6"}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {programStakeholders.map(s => (
                                <tr key={s.id} className="nexus-table-row transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="font-black text-slate-900 text-sm uppercase tracking-tight">{s.name}</div>
                                        <div className="text-xs text-slate-500 font-bold">{s.role}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg border shadow-sm ${
                                            s.category === 'Strategic' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                            s.category === 'Operational' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-700 border-slate-200'
                                        }`}>{s.category}</span>
                                    </td>
                                    <td className={`px-6 py-4 text-xs font-black ${theme.colors.text.tertiary} uppercase tracking-tighter`}>
                                        INF: {s.influence} / INT: {s.interest}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={
                                            s.engagementLevel === 'Supportive' || s.engagementLevel === 'Leading' ? 'success' :
                                            s.engagementLevel === 'Resistant' ? 'danger' : 'neutral'
                                        }>{s.engagementLevel}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right pr-6">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenStakeholderPanel(s)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-nexus-600"><Edit2 size={14}/></button>
                                            <button onClick={() => handleDeleteStakeholder(s.id)} className="p-1.5 hover:bg-red-50 rounded text-slate-500 hover:text-red-500"><Trash2 size={14}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex-1 flex flex-col justify-center">
                    <EmptyGrid 
                        title="Stakeholder Register Neutral" 
                        description="Identify and register key program stakeholders to monitor salience and manage strategic engagement."
                        icon={Users}
                        actionLabel="Register Stakeholder"
                        onAdd={() => handleOpenStakeholderPanel()}
                    />
                </div>
            )}
        </div>

        <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col min-h-[300px]`}>
            <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.background} flex justify-between items-center`}>
                <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase text-[10px] tracking-widest"><MessageSquare size={18} className="text-green-500"/> Integrated Communication Plan</h3>
                <Button size="sm" icon={Plus} onClick={() => handleOpenCommPanel()}>Establish Frequency</Button>
            </div>
            {communicationPlan.length > 0 ? (
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                        <thead className="bg-white">
                            <tr>
                                <th className={theme.components.table.header + " pl-6"}>Target Audience</th>
                                <th className={theme.components.table.header}>Information Payload</th>
                                <th className={theme.components.table.header}>Frequency</th>
                                <th className={theme.components.table.header}>Primary Channel</th>
                                <th className={theme.components.table.header}>Owner</th>
                                <th className={theme.components.table.header + " text-right pr-6"}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {communicationPlan.map(c => (
                                <tr key={c.id} className="nexus-table-row group transition-all">
                                    <td className="px-6 py-4 text-sm font-black text-slate-800 uppercase tracking-tight">{c.audience}</td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{c.content}</td>
                                    <td className="px-6 py-4 text-[10px] font-black uppercase text-slate-500">{c.frequency}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                            <MessageSquare size={12} className="text-nexus-400"/> {c.channel}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[10px] font-mono font-black text-slate-400">{c.ownerId}</td>
                                    <td className="px-6 py-4 text-right pr-6">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenCommPanel(c)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-nexus-600"><Edit2 size={14}/></button>
                                            <button onClick={() => handleDeleteCommItem(c.id)} className="p-1.5 hover:bg-red-50 rounded text-slate-500 hover:text-red-500"><Trash2 size={14}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex-1 flex flex-col justify-center">
                    <EmptyGrid 
                        title="No Communication Strategy" 
                        description="Define the cadence and channels for information distribution across the program hierarchy."
                        icon={MessageSquare}
                        actionLabel="Plan Communication"
                        onAdd={() => handleOpenCommPanel()}
                    />
                </div>
            )}
        </div>

        {isStakeholderPanelOpen && (
            <SidePanel
                isOpen={isStakeholderPanelOpen}
                onClose={() => setIsStakeholderPanelOpen(false)}
                title={editingStakeholder?.id ? "Edit Stakeholder Profile" : "Register Stakeholder"}
                footer={<>
                    <Button variant="secondary" onClick={() => setIsStakeholderPanelOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleSaveStakeholder(editingStakeholder!)}>Commit Record</Button>
                </>}
            >
                <div className="space-y-6 animate-nexus-in">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Identity Designation</label>
                        <Input value={editingStakeholder?.name || ''} onChange={(e) => setEditingStakeholder && setEditingStakeholder({...editingStakeholder!, name: e.target.value})} placeholder="Stakeholder Name"/>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Enterprise Role</label>
                        <Input value={editingStakeholder?.role || ''} onChange={(e) => setEditingStakeholder && setEditingStakeholder({...editingStakeholder!, role: e.target.value})} placeholder="Job Title / Function"/>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Strategic Domain</label>
                            <select className={`w-full p-3 border ${theme.colors.border} rounded-xl text-sm font-bold bg-slate-50`} value={editingStakeholder?.category} onChange={e => setEditingStakeholder && setEditingStakeholder({...editingStakeholder!, category: e.target.value as any})}>
                                <option>Strategic</option><option>Operational</option><option>External</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Engagement Level</label>
                            <select className={`w-full p-3 border ${theme.colors.border} rounded-xl text-sm font-bold bg-slate-50`} value={editingStakeholder?.engagementLevel} onChange={e => setEditingStakeholder && setEditingStakeholder({...editingStakeholder!, engagementLevel: e.target.value as any})}>
                                <option>Leading</option><option>Supportive</option><option>Neutral</option><option>Resistant</option>
                            </select>
                         </div>
                    </div>
                </div>
            </SidePanel>
        )}

        {isCommPanelOpen && (
            <SidePanel
                isOpen={isCommPanelOpen}
                onClose={() => setIsCommPanelOpen(false)}
                title={editingCommItem?.id ? "Edit Transmission Parameter" : "Establish Communication"}
                footer={<>
                    <Button variant="secondary" onClick={() => setIsCommPanelOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleSaveCommItem(editingCommItem!)}>Commit Frequency</Button>
                </>}
            >
                <div className="space-y-6 animate-nexus-in">
                    <Input label="Target Audience" value={editingCommItem?.audience || ''} onChange={(e) => setEditingCommItem && setEditingCommItem({...editingCommItem!, audience: e.target.value})} placeholder="e.g. Steering Committee"/>
                    <Input label="Information Payload" value={editingCommItem?.content || ''} onChange={(e) => setEditingCommItem && setEditingCommItem({...editingCommItem!, content: e.target.value})} placeholder="e.g. Monthly Status Briefing"/>
                    <div className="grid grid-cols-2 gap-6">
                        <Input label="Frequency" value={editingCommItem?.frequency || ''} onChange={(e) => setEditingCommItem && setEditingCommItem({...editingCommItem!, frequency: e.target.value})} />
                        <Input label="Primary Channel" value={editingCommItem?.channel || ''} onChange={(e) => setEditingCommItem && setEditingCommItem({...editingCommItem!, channel: e.target.value})} />
                    </div>
                    <Input label="Owner Principal (ID)" value={editingCommItem?.ownerId || ''} onChange={(e) => setEditingCommItem && setEditingCommItem({...editingCommItem!, ownerId: e.target.value})} />
                </div>
            </SidePanel>
        )}
    </div>
  );
};

export default ProgramStakeholders;
