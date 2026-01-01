
import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, Lock } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { Project } from '../../../types';
import { formatBytes } from '../../../utils/dataExchangeUtils';

export const ImportPanel: React.FC = () => {
    const { dispatch } = useData();
    const theme = useTheme();
    const { hasPermission } = usePermissions();
    const canExchange = hasPermission('system:configure');
    
    const [dragActive, setDragActive] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: FileList | null) => { if (canExchange && files && files[0]) setImportFile(files[0]); };
    const handleDrop = (e: React.DragEvent) => {
        if (!canExchange) return;
        e.preventDefault(); e.stopPropagation(); setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFiles(e.dataTransfer.files);
    };
    const handleDrag = (e: React.DragEvent) => {
        if (!canExchange) return;
        e.preventDefault(); e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleImport = async () => {
        if (!importFile || !canExchange) return;
        setIsImporting(true); setImportProgress(0);
        const jobId = `IMP-${Date.now()}`;

        dispatch({ type: 'QUEUE_DATA_JOB', payload: { id: jobId, type: 'Import', format: 'JSON', status: 'In Progress', submittedBy: 'Current User', timestamp: new Date().toLocaleString(), details: `Uploading ${importFile.name}...`, fileName: importFile.name, fileSize: formatBytes(importFile.size), progress: 0 } });

        for (let i = 1; i <= 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 600));
            const progress = (i / 5) * 100;
            setImportProgress(progress);
            dispatch({ type: 'UPDATE_DATA_JOB', payload: { jobId, status: 'In Progress', progress } });
        }
        
        // Mock success
        dispatch({ type: 'UPDATE_DATA_JOB', payload: { jobId, status: 'Completed', progress: 100, details: `Successfully processed ${importFile.name}` } });
        setIsImporting(false); setImportFile(null);
    };

    return (
        <div className={`${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} p-6 flex flex-col relative h-full`}>
            {!canExchange && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-slate-500">
                    <Lock size={32} className="mb-2 text-slate-400"/><p className="font-semibold">Access Restricted</p>
                </div>
            )}
            <h2 className={`${theme.typography.h2} mb-4 flex items-center gap-2`}><UploadCloud size={20} className="text-nexus-500" /> Import Data</h2>
            <div 
                className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all min-h-[300px] ${dragActive ? 'border-nexus-500 bg-nexus-50' : 'border-slate-300 hover:border-nexus-400 hover:bg-slate-50'}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            >
                <input ref={fileInputRef} type="file" className="hidden" accept=".xml,.csv,.json,.xer" onChange={(e) => handleFiles(e.target.files)} />
                {importFile ? (
                    <div className="text-center w-full">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"><FileText size={32} className="text-nexus-600" /></div>
                        <p className="font-bold text-slate-800 break-all px-4">{importFile.name}</p>
                        <p className="text-sm text-slate-500 mb-6">{formatBytes(importFile.size)}</p>
                        {isImporting ? (
                            <div className="w-full max-w-xs mx-auto px-4">
                                <div className="flex justify-between text-xs mb-1"><span className="text-slate-600">Processing...</span><span className="font-bold text-nexus-600">{importProgress.toFixed(0)}%</span></div>
                                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden"><div className="bg-nexus-500 h-full transition-all duration-300" style={{ width: `${importProgress}%` }}></div></div>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-3 justify-center px-4">
                                <button onClick={() => setImportFile(null)} className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 w-full sm:w-auto">Cancel</button>
                                <button onClick={handleImport} className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700 shadow-sm w-full sm:w-auto`}>Start Import</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center px-4">
                        <UploadCloud size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-lg font-semibold text-slate-700">Drag & drop files here</p>
                        <button onClick={() => fileInputRef.current?.click()} className="mt-4 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm w-full sm:w-auto">Browse Files</button>
                    </div>
                )}
            </div>
        </div>
    );
};
