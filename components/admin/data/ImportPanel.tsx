
import React, { useState, useRef, useTransition } from 'react';
import { UploadCloud, FileText, Loader2, Lock, CheckCircle } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import { usePermissions } from '../../../hooks/usePermissions';
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
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = (files: FileList | null) => { if (canExchange && files && files[0]) setImportFile(files[0]); };
    const handleDrag = (e: React.DragEvent) => {
        if (!canExchange) return;
        e.preventDefault(); e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleImport = async () => {
        if (!importFile || !canExchange) return;
        setIsImporting(true); setImportProgress(0);
        const jobId = `IMP-${Date.now()}`;

        // Pattern 20: Process import steps in transitions
        startTransition(() => {
            dispatch({ type: 'SYSTEM_QUEUE_DATA_JOB', payload: { id: jobId, type: 'Import', format: 'JSON', status: 'In Progress', submittedBy: 'Admin', timestamp: new Date().toLocaleString(), details: `Queueing ${importFile.name}...`, fileName: importFile.name, fileSize: formatBytes(importFile.size), progress: 0, isRead: false } as any });
        });

        for (let i = 1; i <= 5; i++) {
            await new Promise(resolve => setTimeout(resolve, 600));
            const progress = (i / 5) * 100;
            // Pattern 21: High-frequency progress updates handled with transition protection
            startTransition(() => {
                setImportProgress(progress);
                dispatch({ type: 'SYSTEM_UPDATE_DATA_JOB', payload: { jobId, status: 'In Progress', progress } as any });
            });
        }
        
        startTransition(() => {
            dispatch({ type: 'SYSTEM_UPDATE_DATA_JOB', payload: { jobId, status: 'Completed', progress: 100, details: `Successfully processed ${importFile.name}` } as any });
            setIsImporting(false); setImportFile(null);
        });
    };

    return (
        <div className={`${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} p-6 flex flex-col relative h-full min-h-[400px]`}>
            {!canExchange && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-slate-500 font-bold uppercase tracking-widest"><Lock size={32} className="mb-2 text-slate-400"/> Restricted</div>
            )}
            <h2 className={`${theme.typography.h2} mb-4 flex items-center gap-2`}><UploadCloud size={20} className="text-nexus-500" /> Enterprise Ingestion Engine</h2>
            <div 
                className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${dragActive ? 'border-nexus-500 bg-nexus-50 shadow-inner' : 'border-slate-300 hover:border-nexus-400 hover:bg-slate-50'}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
            >
                <input ref={fileInputRef} type="file" className="hidden" accept=".xml,.csv,.json,.xer" onChange={(e) => handleFiles(e.target.files)} />
                {importFile ? (
                    <div className="text-center w-full max-w-sm">
                        <div className="w-16 h-16 bg-nexus-50 text-nexus-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-nexus-100 shadow-sm"><FileText size={32} /></div>
                        <p className="font-bold text-slate-800 truncate px-4">{importFile.name}</p>
                        <p className="text-xs font-mono text-slate-400 mb-8">{formatBytes(importFile.size)}</p>
                        {isImporting ? (
                            <div className="space-y-3">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest"><span className="text-slate-500">Schema Map: OK</span><span className="text-nexus-600">{importProgress.toFixed(0)}%</span></div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden shadow-inner"><div className="bg-nexus-500 h-full transition-all duration-300 shadow-lg shadow-nexus-500/50" style={{ width: `${importProgress}%` }}></div></div>
                                {isPending && <p className="text-[9px] text-slate-400 animate-pulse font-bold">Synchronizing Global Indices...</p>}
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <button onClick={() => setImportFile(null)} className="flex-1 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50">Cancel</button>
                                <button onClick={handleImport} className="flex-1 px-4 py-2 bg-nexus-600 text-white rounded-lg text-xs font-bold hover:bg-nexus-700 shadow-lg shadow-nexus-600/30">Commit Import</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-100"><UploadCloud size={40} className="text-slate-300" /></div>
                        <p className="text-lg font-bold text-slate-800">Transfer Records</p>
                        <p className="text-sm text-slate-500 mt-1">Upload Primavera P6 XML, Microsoft Project, or CSV datasets.</p>
                        <button onClick={() => fileInputRef.current?.click()} className="mt-8 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:border-nexus-400 hover:text-nexus-600 transition-all shadow-sm active:scale-95">Browse Local Storage</button>
                    </div>
                )}
            </div>
        </div>
    );
};
