
import React, { useState } from 'react';
import { Bug, Plus, Lock, AlertOctagon } from 'lucide-react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { DefectList } from './defects/DefectList';
import { DefectDetailView } from './defects/DefectDetailView';
import { DefectFormPanel } from './defects/DefectFormPanel';
import { NonConformanceReport } from '../../types/index';

const DefectTracking: React.FC = () => {
    const { project, nonConformanceReports } = useProjectWorkspace();
    const { canEditProject } = usePermissions();
    const theme = useTheme();
    const [selectedDefectId, setSelectedDefectId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    
    const filteredDefects = (nonConformanceReports || []).filter(d => 
        d.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        d.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const selectedDefect = filteredDefects.find(d => d.id === selectedDefectId);

    const handleSave = (defect: Partial<NonConformanceReport>) => {
        // In real app: dispatch action
        console.log("Saving defect", defect);
        setIsPanelOpen(false);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50/50">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                <div>
                    <h3 className="font-semibold text-slate-700 text-lg flex items-center gap-2">
                        <Bug size={20} className="text-red-500" /> Non-Conformance Reports (NCR)
                    </h3>
                    <p className="text-xs text-slate-500">Track defects and corrective actions.</p>
                </div>
                {canEditProject() && <button onClick={() => setIsPanelOpen(true)} className="px-3 py-2 bg-nexus-600 rounded-lg text-sm text-white flex items-center gap-2"><Plus size={16}/> New NCR</button>}
            </div>

            <div className="flex-1 flex overflow-hidden">
                <DefectList 
                    defects={filteredDefects}
                    selectedDefectId={selectedDefectId}
                    onSelectDefect={setSelectedDefectId}
                    searchTerm={searchTerm}
                    onSearch={setSearchTerm}
                />
                
                {selectedDefect ? (
                    <div className="flex-1 bg-slate-50 overflow-y-auto p-6">
                        <DefectDetailView 
                            defect={selectedDefect} 
                            onClose={() => setSelectedDefectId(null)}
                        />
                    </div>
                ) : (
                    <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-50 text-slate-400">
                        <div className="text-center"><AlertOctagon size={48} className="mx-auto mb-4 opacity-50"/><p>Select an NCR to view details.</p></div>
                    </div>
                )}
            </div>
            
            <DefectFormPanel 
                isOpen={isPanelOpen} 
                onClose={() => setIsPanelOpen(false)} 
                onSave={handleSave} 
                projectId={project.id}
            />
        </div>
    );
};

export default DefectTracking;