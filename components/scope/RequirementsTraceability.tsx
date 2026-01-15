
import React, { useState } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useData } from '../../context/DataContext';
import { ListChecks, Plus, Link, CheckCircle, Search, Lock, Edit2, Trash2, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Badge } from '../ui/Badge';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';
import { SidePanel } from '../ui/SidePanel';
import { Input } from '../ui/Input';
import { Requirement } from '../../types/project_subtypes';
import { generateId } from '../../utils/formatters';

const RequirementsTraceability: React.FC = () => {
    const { project } = useProjectWorkspace();
    const { dispatch } = useData();
    const theme = useTheme();
    const { canEditProject } = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');
    
    // Panel State
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingReq, setEditingReq] = useState<Partial<Requirement> | null>(null);

    const filteredReqs = project?.requirements?.filter(r => 
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Verified': return 'success';
            case 'Active': return 'info';
            case 'Draft': return 'neutral';
            default: return 'warning';
        }
    };

    const handleOpenPanel = (req?: Requirement) => {
        setEditingReq(req ? { ...req } : { description: '', source: '', verificationMethod: 'Test', status: 'Draft' });
        setIsPanelOpen(true);
    };

    const handleSave = () => {
        if (!editingReq?.description || !project) return;
        
        const reqToSave: Requirement = {
            id: editingReq.id || generateId('REQ'),
            description: editingReq.description,
            source: editingReq.source || 'Stakeholder',
            verificationMethod: editingReq.verificationMethod || 'Test',
            status: editingReq.status || 'Draft'
        };

        const existingReqs = project.requirements || [];
        let updatedReqs;

        if (editingReq.id) {
            updatedReqs = existingReqs.map(r => r.id === editingReq.id ? reqToSave : r);
        } else {
            updatedReqs = [...existingReqs, reqToSave];
        }

        dispatch({
            type: 'PROJECT_UPDATE',
            payload: {
                projectId: project.id,
                updatedData: { requirements: updatedReqs }
            }
        });
        setIsPanelOpen(false);
    };

    const handleDelete = (id: string) => {
        if (!project) return;
        if (confirm("Delete requirement?")) {
             const updatedReqs = (project.requirements || []).filter(r => r.id !== id);
             dispatch({
                type: 'PROJECT_UPDATE',
                payload: {
                    projectId: project.id,
                    updatedData: { requirements: updatedReqs }
                }
            });
        }
    };

    return (
        <div className={`h-full flex flex-col ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center ${theme.colors.background}/50 flex-shrink-0`}>
                <div className="flex items-center gap-4">
                    <h3 className={`font-semibold ${theme.colors.text.primary} text-sm flex items-center gap-2`}>
                        <ListChecks size={18} className="text-nexus-600"/> Requirements Traceability Matrix (RTM)
                    </h3>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input 
                            type="text" 
                            placeholder="Search requirements..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-9 pr-4 py-1.5 text-sm border ${theme.colors.border} rounded-md focus:ring-1 focus:ring-nexus-500 outline-none w-64 ${theme.colors.background} ${theme.colors.text.primary}`}
                        />
                    </div>
                </div>
                {canEditProject() ? (
                    <button onClick={() => handleOpenPanel()} className={`flex items-center gap-2 px-3 py-2 ${theme.colors.accent} text-white rounded-lg text-sm font-medium hover:brightness-110 shadow-sm`}>
                        <Plus size={14}/> Add Requirement
                    </button>
                ) : (
                    <div className={`flex items-center gap-2 px-3 py-2 ${theme.colors.background} border ${theme.colors.border} rounded-lg text-sm ${theme.colors.text.tertiary}`}>
                        <Lock size={14}/> Read Only
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-auto">
                {filteredReqs.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm`}>
                            <tr>
                                <th className={theme.components.table.header}>ID</th>
                                <th className={theme.components.table.header}>Requirement Description</th>
                                <th className={theme.components.table.header}>Source</th>
                                <th className={theme.components.table.header}>Verification</th>
                                <th className={`${theme.components.table.header} text-center`}>Status</th>
                                <th className={`${theme.components.table.header} text-right`}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`${theme.colors.surface} divide-y ${theme.colors.border.replace('border-', 'divide-')}50`}>
                            {filteredReqs.map(req => (
                                <tr key={req.id} className={`hover:${theme.colors.background} transition-colors group`}>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${theme.colors.text.tertiary}`}>{req.id}</td>
                                    <td className={`px-6 py-4 text-sm ${theme.colors.text.primary} font-medium`}>{req.description}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme.colors.text.secondary}`}>{req.source}</td>
                                    <td className={`px-6 py-4 text-sm ${theme.colors.text.secondary}`}>{req.verificationMethod}</td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant={getStatusColor(req.status) as any}>{req.status}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {canEditProject() && (
                                                <>
                                                    <button onClick={() => handleOpenPanel(req)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500"><Edit2 size={14}/></button>
                                                    <button onClick={() => handleDelete(req.id)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 size={14}/></button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyGrid 
                        title="No Requirements Defined"
                        description="Traceability matrix is empty. Define technical or functional requirements to track validation."
                        icon={ListChecks}
                        actionLabel="Add Requirement"
                        onAdd={canEditProject() ? () => handleOpenPanel() : undefined}
                    />
                )}
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingReq?.id ? "Edit Requirement" : "Add Requirement"}
                footer={<><Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button><Button onClick={handleSave} icon={Save}>Save</Button></>}
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                        <textarea 
                            className={`w-full p-3 border ${theme.colors.border} rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none resize-none`}
                            value={editingReq?.description}
                            onChange={e => setEditingReq({...editingReq, description: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Source</label>
                            <Input value={editingReq?.source} onChange={e => setEditingReq({...editingReq, source: e.target.value})} placeholder="e.g. Contract, Stakeholder" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Verification Method</label>
                            <select className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-white`} value={editingReq?.verificationMethod} onChange={e => setEditingReq({...editingReq, verificationMethod: e.target.value})}>
                                <option>Test</option><option>Inspection</option><option>Analysis</option><option>Demonstration</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                        <select className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm bg-white`} value={editingReq?.status} onChange={e => setEditingReq({...editingReq, status: e.target.value})}>
                            <option>Draft</option><option>Active</option><option>Verified</option>
                        </select>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default RequirementsTraceability;
