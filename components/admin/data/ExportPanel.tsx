
import React, { useState } from 'react';
import { Download, FileCode, FileSpreadsheet, Database, Lock, Loader2 } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { ExportService, ExportFormat } from '../../../services/ExportService';

export const ExportPanel: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const { hasPermission } = usePermissions();
    const canExchange = hasPermission('system:configure');

    const [selectedExportProjects, setSelectedExportProjects] = useState<string[]>([]);
    const [exportFormat, setExportFormat] = useState<ExportFormat>('P6 XML');
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (!canExchange) return;
        if (selectedExportProjects.length === 0) { alert("Please select at least one project."); return; }

        setIsExporting(true);
        const jobId = `EXP-${Date.now()}`;
        
        dispatch({ type: 'QUEUE_DATA_JOB', payload: { id: jobId, type: 'Export', format: exportFormat, status: 'In Progress', submittedBy: 'Current User', timestamp: new Date().toLocaleString(), details: `Exporting ${selectedExportProjects.length} projects...`, progress: 0 } });

        const projectsToExport = state.projects.filter(p => selectedExportProjects.includes(p.name));
        try {
            await ExportService.exportProjects(projectsToExport, exportFormat);
            dispatch({ type: 'UPDATE_DATA_JOB', payload: { jobId, status: 'Completed', progress: 100, details: `Successfully exported ${selectedExportProjects.length} projects` } });
        } catch (e) {
            dispatch({ type: 'UPDATE_DATA_JOB', payload: { jobId, status: 'Failed', details: 'Failed to generate export file.' } });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className={`${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} p-6 flex flex-col relative h-full`}>
            {!canExchange && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-slate-500"><Lock size={32} className="mb-2 text-slate-400"/><p className="font-semibold">Access Restricted</p></div>
            )}
            <h2 className={`${theme.typography.h2} mb-4 flex items-center gap-2`}><Download size={20} className="text-nexus-500" /> Export Data</h2>
            <div className="space-y-6 flex-1 flex flex-col min-h-0">
                <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">1. Select Format</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[{ id: 'P6 XML', icon: FileCode, label: 'Primavera P6' }, { id: 'CSV', icon: FileSpreadsheet, label: 'Excel / CSV' }, { id: 'JSON', icon: Database, label: 'Native JSON' }].map((fmt) => (
                            <button key={fmt.id} onClick={() => setExportFormat(fmt.id as any)} className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 text-center transition-all ${exportFormat === fmt.id ? 'border-nexus-500 bg-nexus-50 text-nexus-700 ring-1 ring-nexus-500' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                                <fmt.icon size={24} /><span className="text-xs font-medium">{fmt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col min-h-0">
                    <label className="text-sm font-bold text-slate-700 mb-2 block">2. Select Projects</label>
                    <div className="border border-slate-200 rounded-lg flex-1 overflow-y-auto bg-slate-50 p-2 space-y-1 min-h-[150px]">
                        {state.projects.map(p => (
                            <label key={p.id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer group transition-colors">
                                <input type="checkbox" className="rounded text-nexus-600 focus:ring-nexus-500 border-slate-300" checked={selectedExportProjects.includes(p.name)} onChange={(e) => { if (e.target.checked) setSelectedExportProjects(prev => [...prev, p.name]); else setSelectedExportProjects(prev => prev.filter(n => n !== p.name)); }} />
                                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{p.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-auto">
                    <button onClick={handleExport} disabled={isExporting || selectedExportProjects.length === 0} className={`w-full py-3 ${theme.colors.accentBg} text-white font-semibold rounded-lg hover:bg-nexus-700 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all`}>
                        {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} {isExporting ? 'Generating...' : 'Download Export'}
                    </button>
                </div>
            </div>
        </div>
    );
};
