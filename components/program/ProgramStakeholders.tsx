
import React, { useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Users, MessageSquare, Volume2, Shield, Plus, Edit2, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useData } from '../../context/DataContext';
import { ProgramStakeholder, ProgramCommunicationItem } from '../../types';
import { generateId } from '../../utils/formatters';

interface ProgramStakeholdersProps {
  programId: string;
}

const ProgramStakeholders: React.FC<ProgramStakeholdersProps> = ({ programId }) => {
  const { programStakeholders, communicationPlan } = useProgramData(programId);
  const theme = useTheme();
  const { dispatch } = useData();

  // State for Stakeholder Panel
  const [isStakeholderPanelOpen, setIsStakeholderPanelOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<Partial<ProgramStakeholder> | null>(null);

  // State for Communication Panel
  const [isCommPanelOpen, setIsCommPanelOpen] = useState(false);
  const [editingCommItem, setEditingCommItem] = useState<Partial<ProgramCommunicationItem> | null>(null);

  // --- Stakeholder CRUD Handlers ---
  const handleOpenStakeholderPanel = (stakeholder?: ProgramStakeholder) => {
    setEditingStakeholder(stakeholder || {});
    setIsStakeholderPanelOpen(true);
  };

  const handleSaveStakeholder = () => {
    if (!editingStakeholder?.name) return;
    const stakeholderToSave: ProgramStakeholder = {
      id: editingStakeholder.id || generateId('PS'),
      programId,
      ...editingStakeholder,
    } as ProgramStakeholder;

    dispatch({
      type: editingStakeholder.id ? 'PROGRAM_UPDATE_STAKEHOLDER' : 'PROGRAM_ADD_STAKEHOLDER',
      payload: stakeholderToSave
    });
    setIsStakeholderPanelOpen(false);
  };

  const handleDeleteStakeholder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this stakeholder?')) {
      dispatch({ type: 'PROGRAM_DELETE_STAKEHOLDER', payload: id });
    }
  };

  // --- Communication Item CRUD Handlers ---
  const handleOpenCommPanel = (item?: ProgramCommunicationItem) => {
    setEditingCommItem(item || {});
    setIsCommPanelOpen(true);
  };

  const handleSaveCommItem = () => {
    if (!editingCommItem?.audience || !editingCommItem?.content) return;
    const itemToSave: ProgramCommunicationItem = {
      id: editingCommItem.id || generateId('PCI'),
      programId,
      ...editingCommItem,
    } as ProgramCommunicationItem;
    
    dispatch({
        type: editingCommItem.id ? 'PROGRAM_UPDATE_COMM_ITEM' : 'PROGRAM_ADD_COMM_ITEM',
        payload: itemToSave
    });
    setIsCommPanelOpen(false);
  };

  const handleDeleteCommItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this communication item?')) {
        dispatch({ type: 'PROGRAM_DELETE_COMM_ITEM', payload: id });
    }
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Users className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Stakeholder Engagement & Communication</h2>
        </div>

        {/* Stakeholder Register */}
        <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Shield size={18} className="text-blue-500"/> Stakeholder Register</h3>
                <Button size="sm" icon={Plus} onClick={() => handleOpenStakeholderPanel()}>Add Stakeholder</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Stakeholder</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Influence / Interest</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Engagement Level</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {programStakeholders.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50 group focus-within:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                                    <div className="text-xs text-slate-500">{s.role}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        s.category === 'Strategic' ? 'bg-purple-100 text-purple-700' :
                                        s.category === 'Operational' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                    }`}>{s.category}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {s.influence} / {s.interest}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={
                                        s.engagementLevel === 'Supportive' ? 'success' :
                                        s.engagementLevel === 'Resistant' ? 'danger' : 'neutral'
                                    }>{s.engagementLevel}</Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                                        <button onClick={() => handleOpenStakeholderPanel(s)} className="p-1 text-slate-500 hover:text-nexus-600 focus:outline-none focus:ring-2 focus:ring-nexus-500 rounded"><Edit2 size={14}/></button>
                                        <button onClick={() => handleDeleteStakeholder(s.id)} className="p-1 text-slate-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"><Trash2 size={14}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Communication Plan */}
        <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Volume2 size={18} className="text-green-500"/> Communication Strategy</h3>
                <Button size="sm" icon={Plus} onClick={() => handleOpenCommPanel()}>Add Item</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Audience</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Content / Information</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Frequency</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Channel</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Owner</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {communicationPlan.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50 group focus-within:bg-slate-50">
                                <td className="px-6 py-4 text-sm font-medium text-slate-900">{c.audience}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{c.content}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{c.frequency}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                                    <MessageSquare size={14} className="text-slate-400"/> {c.channel}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{c.owner}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                                        <button onClick={() => handleOpenCommPanel(c)} className="p-1 text-slate-500 hover:text-nexus-600 focus:outline-none focus:ring-2 focus:ring-nexus-500 rounded"><Edit2 size={14}/></button>
                                        <button onClick={() => handleDeleteCommItem(c.id)} className="p-1 text-slate-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"><Trash2 size={14}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Stakeholder Form Panel */}
        {isStakeholderPanelOpen && (
            <SidePanel
                isOpen={isStakeholderPanelOpen}
                onClose={() => setIsStakeholderPanelOpen(false)}
                title={editingStakeholder?.id ? "Edit Stakeholder" : "Add Stakeholder"}
                footer={<>
                    <Button variant="secondary" onClick={() => setIsStakeholderPanelOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveStakeholder}>Save</Button>
                </>}
            >
                <div className="space-y-4">
                    <Input label="Name" value={editingStakeholder?.name || ''} onChange={(e) => setEditingStakeholder({...editingStakeholder, name: e.target.value})} />
                    <Input label="Role" value={editingStakeholder?.role || ''} onChange={(e) => setEditingStakeholder({...editingStakeholder, role: e.target.value})} />
                    {/* Add more inputs for other fields as needed */}
                </div>
            </SidePanel>
        )}

        {/* Communication Form Panel */}
        {isCommPanelOpen && (
            <SidePanel
                isOpen={isCommPanelOpen}
                onClose={() => setIsCommPanelOpen(false)}
                title={editingCommItem?.id ? "Edit Communication Item" : "Add Communication Item"}
                footer={<>
                    <Button variant="secondary" onClick={() => setIsCommPanelOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveCommItem}>Save</Button>
                </>}
            >
                <div className="space-y-4">
                    <Input label="Audience" value={editingCommItem?.audience || ''} onChange={(e) => setEditingCommItem({...editingCommItem, audience: e.target.value})} />
                    <Input label="Content" value={editingCommItem?.content || ''} onChange={(e) => setEditingCommItem({...editingCommItem, content: e.target.value})} />
                    {/* Add more inputs for other fields as needed */}
                </div>
            </SidePanel>
        )}
    </div>
  );
};

export default ProgramStakeholders;