
import { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { usePermissions } from '../usePermissions';
import { formatBytes } from '../../utils/dataExchangeUtils';

const validateRows = (rows: any[]) => {
    return rows.map(r => {
        const errors = [];
        if (!r.Name) errors.push('Missing Name');
        if (r.Budget && isNaN(Number(r.Budget))) errors.push('Invalid Budget');
        return { ...r, _status: errors.length ? 'Error' : 'Valid', _errors: errors };
    });
};

export const useImportLogic = () => {
    const { dispatch } = useData();
    const { hasPermission } = usePermissions();
    const canExchange = hasPermission('system:configure');
    
    const [step, setStep] = useState<'upload' | 'staging' | 'importing' | 'complete'>('upload');
    const [importFile, setImportFile] = useState<File | null>(null);
    const [stagedData, setStagedData] = useState<any[]>([]);
    const [importProgress, setImportProgress] = useState(0);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: FileList | null) => { 
        if (canExchange && files && files[0]) {
            setImportFile(files[0]);
            // Simulate parsing logic
            setTimeout(() => {
                const mockParsed = [
                    { ID: 'P-101', Name: 'Alpha Project', Budget: '50000', Status: 'Active' },
                    { ID: 'P-102', Name: 'Beta Project', Budget: 'Invalid', Status: 'Planning' }, // Error row
                    { ID: 'P-103', Name: '', Budget: '120000', Status: 'Active' }, // Error row
                    { ID: 'P-104', Name: 'Gamma Expansion', Budget: '750000', Status: 'Active' },
                ];
                setStagedData(validateRows(mockParsed));
                setStep('staging');
            }, 800);
        }
    };

    const handleCommit = async () => {
        setStep('importing');
        setImportProgress(0);
        const jobId = `IMP-${Date.now()}`;
        
        const validRows = stagedData.filter(r => r._status === 'Valid');

        dispatch({ type: 'SYSTEM_QUEUE_DATA_JOB', payload: { id: jobId, type: 'Import', format: 'JSON', status: 'In Progress', submittedBy: 'Admin', timestamp: new Date().toLocaleString(), details: `Importing ${validRows.length} records...`, fileName: importFile?.name, fileSize: importFile ? formatBytes(importFile.size) : '0B', progress: 0, isRead: false } as any });

        // Simulate Async Import Process
        for (let i = 1; i <= 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 300));
            const progress = i * 10;
            setImportProgress(progress);
            dispatch({ type: 'SYSTEM_UPDATE_DATA_JOB', payload: { jobId, status: 'In Progress', progress } as any });
        }
        
        dispatch({ type: 'SYSTEM_UPDATE_DATA_JOB', payload: { jobId, status: 'Completed', progress: 100, details: `Successfully imported ${validRows.length} records.` } as any });
        setStep('complete');
    };

    const reset = () => {
        setStep('upload');
        setImportFile(null);
        setStagedData([]);
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    return {
        step,
        importFile,
        stagedData,
        importProgress,
        fileInputRef,
        canExchange,
        handleFiles,
        handleCommit,
        reset,
        triggerFileUpload
    };
};
