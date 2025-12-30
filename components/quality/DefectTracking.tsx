
import React, { useState } from 'react';
import { NonConformanceReport } from '../../types';
import { Bug, Plus, Lock, Search, Filter, AlertOctagon, CheckSquare, GitPullRequest, ArrowRight, UserCircle, Calendar, Save } from 'lucide-react';
import { useProjectState } from '../../hooks/useProjectState';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

interface DefectTrackingProps {
    projectId: string;
}

const DefectTracking: React.FC<DefectTrackingProps> = ({ projectId }) => {
    const { nonConformanceReports } = useProjectState(projectId);
    const { canEditProject } = usePermissions();
    const theme = useTheme();
    const [selectedDefectId, setSelectedDefectId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Panel State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newDefect, setNewDefect] = useState<Partial<NonConformanceReport>>({
        description: '',
        severity: 'Minor',
        category: 'Workmanship',
        status: 'Open',
        assignedTo: '',
        linkedDeliverable: ''
    });

    const selectedDefect = nonConformanceReports.filter(d => d.id === selectedDefectId)[0];

    const getSeverityColor = (severity: NonConformanceReport['severity']) => {
        if (severity === 'Critical') return 'danger';
        if (severity === 'Major') return 'warning';
        return 'info';
    };

    const filteredDefects = nonConformanceReports.filter(d => {
        const searchLower = searchTerm.toLowerCase();
        return d.description.toLowerCase().indexOf(searchLower) !== -1 ||
               d.id.toLowerCase().indexOf(searchLower) !== -1;
    });

    const handleSaveDefect = () => {
        if (!newDefect.description) return;
        // In real app: dispatch action
        console.log("Saving defect", newDefect);
        setIsCreateOpen(false);
        setNewDefect({
            description: '',
            severity: 'Minor',
            category: 'Workmanship',
            status: 'Open',
            assignedTo: '',
            linkedDeliverable: ''
        });
    };

    return (
        <div className="h-full flex flex-col bg-slate-50/50">
            {/* Toolbar */}
            <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between bg-white">
                <div>
                    <h3 className="font-semibold text-slate-700 text-lg flex items-center gap-2">
                        <Bug size={20} className="text-red-500" /> Non-Conformance Reports (NCR)
                    </h3>
                    <p className="text-xs text-slate-500">Track defects, root causes, and corrective actions.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input 
                            type="text" 
                            placeholder="Search NCRs..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-64 focus:ring-1 focus:ring-nexus-500"
                        />
                    </div>
                    {canEditProject() ? (
                        <Button onClick={() => setIsCreateOpen(true)} icon={Plus}>New NCR</Button>
                    ) : (
                        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                            <Lock size={14}/> Read Only
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* List View */}
                <div className={`flex-col border-r border-slate-200 bg-white ${selectedDefectId ? 'hidden lg:flex w-1/3' : 'flex w-full'}`}>
                    <div className="flex-1 overflow-y-auto">
                        {filteredDefects.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {filteredDefects.map(d => (
                                    <div 
                                        key={d.id} 
                                        onClick={() => setSelectedDefectId(d.id)}
                                        className={`p-4 hover:bg-slate-50 cursor-pointer border-l-4 transition-colors ${
                                            selectedDefectId === d.id ? 'bg-nexus-50 border-l-nexus-500' : 'border-l-transparent'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-mono text-xs font-bold text-slate-500">{d.id}</span>
                                            <Badge variant={getSeverityColor(d.severity)}>{d.severity}</Badge>
                                        </div>
                                        <h4 className="font-bold text-sm text-slate-800 mb-1 line-clamp-1">{d.description}</h4>
                                        <div className="flex justify-between items-center text-xs text-slate-500">
                                            <span>{d.date}</span>
                                            <span>{d.status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-400">No defects found.</div>
                        )}
                    </div>
                </div>

                {/* Detail View */}
                {selectedDefect ? (
                    <div className="flex-1 bg-slate-50 overflow-y-auto p-6">
                        <div className="max-w-4xl mx-auto space-y-6">
                            {/* Header Card */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-bold text-slate-900">{selectedDefect.id}</h2>
                                            <Badge variant={getSeverityColor(selectedDefect.severity)}>{selectedDefect.severity}</Badge>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                selectedDefect.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                                            }`}>{selectedDefect.status}</span>
                                        </div>
                                        <p className="text-lg text-slate-700 mt-2">{selectedDefect.description}</p>
                                    </div>
                                    <button onClick={() => setSelectedDefectId(null)} className="lg:hidden text-slate-400">Back</button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-t border-slate-100 pt-4">
                                    <div>
                                        <span className="block text-xs font-bold text-slate-400 uppercase">Category</span>
                                        <span className="font-medium text-slate-800">{selectedDefect.category}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-slate-400 uppercase">Detected On</span>
                                        <span className="font-medium text-slate-800">{selectedDefect.date}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-slate-400 uppercase">Deliverable</span>
                                        <span className="font-medium text-slate-800 font-mono">{selectedDefect.linkedDeliverable}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-slate-400 uppercase">Assigned To</span>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <UserCircle size={14} className="text-slate-400"/>
                                            <span className="font-medium text-slate-800">{selectedDefect.assignedTo}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Root Cause Analysis (5 Whys) */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <GitPullRequest size={18} className="text-nexus-600"/> Root Cause Analysis (5 Whys)
                                </h3>
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold border border-slate-200">
                                                {i}
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder={`Why? ${i === 1 ? '(Direct Cause)' : ''}`}
                                                className="flex-1 text-sm border-b border-slate-200 focus:border-nexus-500 outline-none pb-1 transition-colors"
                                                disabled={!canEditProject()}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Determined Root Cause</label>
                                    <textarea 
                                        className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-nexus-500" 
                                        placeholder="Summarize the fundamental reason for the defect..."
                                        disabled={!canEditProject()}
                                    />
                                </div>
                            </div>

                            {/* CAPA Plan */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <CheckSquare size={18} className="text-green-600"/> Corrective & Preventive Actions (CAPA)
                                    </h3>
                                    {canEditProject() && (
                                        <button className="text-xs font-bold text-nexus-600 flex items-center gap-1 hover:underline">
                                            <Plus size={12}/> Add Action
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <input type="checkbox" className="rounded text-nexus-600 focus:ring-nexus-500" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-800">Rework foundation section B</p>
                                            <p className="text-xs text-slate-500">Owner: Site Foreman • Due: Tomorrow</p>
                                        </div>
                                        <Badge variant="warning">Corrective</Badge>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                        <input type="checkbox" className="rounded text-nexus-600 focus:ring-nexus-500" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-800">Update pouring procedure SOP-104</p>
                                            <p className="text-xs text-slate-500">Owner: Quality Mgr • Due: Next Week</p>
                                        </div>
                                        <Badge variant="info">Preventive</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-50 text-slate-400">
                        <div className="text-center">
                            <AlertOctagon size={48} className="mx-auto mb-4 opacity-50"/>
                            <p>Select a defect to view details and RCA.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Create Panel */}
            <SidePanel
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                title="Raise Non-Conformance Report"
                width="md:w-[500px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveDefect} icon={Save}>Create NCR</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description of Non-Conformance</label>
                        <textarea 
                            className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500"
                            placeholder="Detailed description of what requirement was not met..."
                            value={newDefect.description}
                            onChange={e => setNewDefect({...newDefect, description: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
                            <select 
                                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500"
                                value={newDefect.severity}
                                onChange={e => setNewDefect({...newDefect, severity: e.target.value as any})}
                            >
                                <option>Minor</option>
                                <option>Major</option>
                                <option>Critical</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select 
                                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500"
                                value={newDefect.category}
                                onChange={e => setNewDefect({...newDefect, category: e.target.value})}
                            >
                                <option>Workmanship</option>
                                <option>Material</option>
                                <option>Documentation</option>
                                <option>Design</option>
                            </select>
                        </div>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Linked Deliverable / WBS</label>
                         <Input 
                            placeholder="e.g. WBS-1.2 Foundation" 
                            value={newDefect.linkedDeliverable}
                            onChange={e => setNewDefect({...newDefect, linkedDeliverable: e.target.value})}
                         />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
                         <Input 
                            placeholder="Responsible Person" 
                            value={newDefect.assignedTo}
                            onChange={e => setNewDefect({...newDefect, assignedTo: e.target.value})}
                         />
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default DefectTracking;
