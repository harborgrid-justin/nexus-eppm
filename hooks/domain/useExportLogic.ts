
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
        if (selectedExportProjects.length === 0) { alert("Please select at least one project."); return; }

        setIsExporting(true);
        const jobId = `EXP-${Date.now()}`;
        
        dispatch({ type: 'SYSTEM_QUEUE_DATA_JOB', payload: { id: jobId, type: 'Export', format: exportFormat, status: 'In Progress', submittedBy: 'Current User', timestamp: new Date().toLocaleString(), details: `Exporting ${selectedExportProjects.length} projects...`, progress: 0 } });

        const projectsToExport = state.projects.filter(p => selectedExportProjects.includes(p.name));
        try {
            await ExportService.exportProjects(projectsToExport, exportFormat);
            dispatch({ type: 'SYSTEM_UPDATE_DATA_JOB', payload: { jobId, status: 'Completed', progress: 100, details: `Successfully exported ${selectedExportProjects.length} projects` } });
        } catch (e) {
            dispatch({ type: 'SYSTEM_UPDATE_DATA_JOB', payload: { jobId, status: 'Failed', details: 'Failed to generate export file.' } });
        } finally {
            setIsExporting(false);
        }
    }, [canExchange, selectedExportProjects, exportFormat, state.projects, dispatch]);

    const toggleProjectSelection = useCallback((projectName: string) => {
        setSelectedExportProjects(prev => prev.includes(projectName) ? prev.filter(n => n !== projectName) : [...prev, projectName]);
    }, []);

    return {
        canExchange,
        selectedExportProjects,
        exportFormat,
        setExportFormat,
        isExporting,
        handleExport,
        projects: state.projects,
        toggleProjectSelection
    };
};
