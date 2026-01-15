
import { useState, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { usePermissions } from '../usePermissions';
import { ExportService, ExportFormat } from '../../services/ExportService';

export const useExportLogic = () => {
    const { state, dispatch } = useData();
    const { hasPermission } = usePermissions();
    const canExchange = hasPermission('system:configure');

    const [selectedExportProjects, setSelectedExportProjects] = useState<string[]>([]);
    const [exportFormat, setExportFormat] = useState<ExportFormat>('P6 XML');
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = useCallback(async () => {
        if (!canExchange) return;
        if (selectedExportProjects.length === 0) return alert("Select at least one project artifact.");

        setIsExporting(true);
        const jobId = `EXP-${Date.now()}`;
        
        dispatch({ type: 'SYSTEM_QUEUE_DATA_JOB', payload: { id: jobId, type: 'Export', format: exportFormat, status: 'In Progress', submittedBy: 'System', timestamp: new Date().toLocaleString(), details: `Exporting ${selectedExportProjects.length} entities...`, progress: 0 } });

        const projectsToExport = state.projects.filter(p => selectedExportProjects.includes(p.name));
        try {
            await ExportService.exportProjects(projectsToExport, exportFormat);
            dispatch({ type: 'SYSTEM_UPDATE_DATA_JOB', payload: { jobId, status: 'Completed', progress: 100, details: `Successfully exported ${selectedExportProjects.length} projects` } });
        } catch (e) {
            dispatch({ type: 'SYSTEM_UPDATE_DATA_JOB', payload: { jobId, status: 'Failed', details: 'Serialization fault.' } });
        } finally {
            setIsExporting(false);
        }
    }, [canExchange, selectedExportProjects, exportFormat, state.projects, dispatch]);

    return {
        canExchange, selectedExportProjects, exportFormat, setExportFormat, isExporting, handleExport,
        projects: state.projects,
        toggleProjectSelection: (name: string) => setSelectedExportProjects(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
    };
};
