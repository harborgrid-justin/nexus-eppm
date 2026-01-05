
import { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { usePermissions } from '../usePermissions';

export const useImportLogic = () => {
    const { state, dispatch } = useData();
    const { hasPermission } = usePermissions();
    const canExchange = hasPermission('system:configure');
    
    // Derived from Global State
    const { records, summary, activeImportId } = state.staging;
    const step = !activeImportId ? 'upload' : (records.length > 0 ? 'staging' : 'complete'); 

    const fileInputRef = useRef<HTMLInputElement>(null);

    const parseCSV = (text: string): Record<string, string>[] => {
        const lines = text.split('\n');
        if (lines.length < 2) return [];
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        
        return lines.slice(1)
            .filter(line => line.trim() !== '')
            .map(line => {
                // Handle basic quoted CSV segments if needed, simple split for now
                const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                return headers.reduce((obj, header, index) => {
                    obj[header] = values[index] || '';
                    return obj;
                }, {} as Record<string, string>);
            });
    };

    const handleFiles = (files: FileList | null) => { 
        if (canExchange && files && files[0]) {
            const file = files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target?.result as string;
                let parsedData: Record<string, string>[] = [];

                if (file.name.endsWith('.csv')) {
                    parsedData = parseCSV(content);
                } else if (file.name.endsWith('.json')) {
                    try {
                        parsedData = JSON.parse(content);
                        if (!Array.isArray(parsedData)) throw new Error("JSON must be an array of objects");
                    } catch (err) {
                        console.error("JSON Parse Error", err);
                        alert("Invalid JSON format");
                        return;
                    }
                } else {
                    alert("Unsupported file format. Please use CSV or JSON.");
                    return;
                }

                // Map raw keys to schema expected by Staging Reducer (Basic Normalization)
                // In production, we'd use the ETL Mappings here. For now, we normalize common keys.
                const normalizedData = parsedData.map(row => ({
                    ID: row.ID || row.id || row.Code || `IMP-${Math.floor(Math.random()*10000)}`,
                    Name: row.Name || row.name || row.Title || 'Untitled Record',
                    Budget: row.Budget || row.budget || '0',
                    Status: row.Status || row.status || 'Planned',
                    Start: row.Start || row.startDate || new Date().toISOString().split('T')[0],
                    Finish: row.Finish || row.endDate || '',
                    Duration: row.Duration || row.duration || '0'
                }));

                dispatch({ type: 'STAGING_INIT', payload: { type: 'Project', data: normalizedData } });
            };

            reader.readAsText(file);
        }
    };

    const handleCommit = () => {
        // Dispatch commit action for selected records
        const idsToCommit = records.filter(r => r.status === 'Valid').map(r => r.id);
        dispatch({ type: 'STAGING_COMMIT_SELECTED', payload: idsToCommit });
        
        // Log job
        dispatch({ 
            type: 'SYSTEM_QUEUE_DATA_JOB', 
            payload: { 
                id: `IMP-${Date.now()}`, 
                type: 'Import', 
                format: 'CSV', 
                status: 'Completed', 
                submittedBy: 'Admin', 
                timestamp: new Date().toLocaleString(), 
                details: `Imported ${idsToCommit.length} records.`, 
                progress: 100 
            } 
        });
    };

    const handleClear = () => {
        dispatch({ type: 'STAGING_CLEAR' });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return {
        step,
        records,
        summary,
        fileInputRef,
        canExchange,
        handleFiles,
        handleCommit,
        handleClear,
        triggerFileUpload
    };
};
