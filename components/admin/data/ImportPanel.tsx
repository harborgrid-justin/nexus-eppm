import React, { useState, useRef, useTransition } from 'react';
import { UploadCloud, FileText, Loader2, Lock, CheckCircle, AlertTriangle, ArrowRight, X, Database, Play } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import { usePermissions } from '../../../hooks/usePermissions';
import { formatBytes } from '../../../utils/dataExchangeUtils';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';

// Mock validation function
const validateRows = (rows: any[]) => {
    return rows.map(r => {
        const errors = [];
        if (!r.Name) errors.push('Missing Name');
        if (r.Budget && isNaN(Number(r.Budget))) errors.push('Invalid Budget');
        return { ...r, _status: errors.length ? 'Error' : 'Valid', _errors: errors };
    });
};

export const ImportPanel: React.FC = () => {
    const { dispatch } = useData();
    const theme = useTheme();
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
            // Simulate parsing
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

    if (!canExchange) {
        return (
            <div className="h-full flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                <div className="text-center">
                    <Lock size={48} className="mx-auto mb-4 opacity-50"/>
                    <p className="font-bold uppercase tracking-widest">Access Restricted</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} flex flex-col h-full overflow-hidden`}>
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${step === 'complete' ? 'bg-green-100 text-green-600' : 'bg-nexus-50 text-nexus-600'}`}>
                        {step === 'complete' ? <CheckCircle size={24}/> : <UploadCloud size={24}/>}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Data Import Wizard</h2>
                        <p className="text-sm text-slate-500">Bulk create or update records via CSV/JSON.</p>
                    </div>
                </div>
                {step === 'staging' && (
                    <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                         <span className="text-slate-500">Total: {stagedData.length}</span>
                         <span className="text-green-600">Valid: {stagedData.filter(r => r._status === 'Valid').length}</span>
                         <span className="text-red-600">Errors: {stagedData.filter(r => r._status === 'Error').length}</span>
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="flex-1 p-8 bg-slate-50/50 overflow-hidden flex flex-col relative">
                
                {/* STEP 1: UPLOAD */}
                {step === 'upload' && (
                    <div 
                        className="flex-1 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center hover:border-nexus-400 hover:bg-nexus-50/10 transition-all cursor-pointer bg-white group"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                    >
                        <input ref={fileInputRef} type="file" className="hidden" accept=".csv,.json,.xml" onChange={(e) => handleFiles(e.target.files)} />
                        <div className="w-20 h-20 bg-nexus-50 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                            <UploadCloud size={40} className="text-nexus-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Drop files here or click to browse</h3>
                        <p className="text-sm text-slate-400 mt-2">Supports .CSV, .JSON, .XML (Max 50MB)</p>
                    </div>
                )}

                {/* STEP 2: STAGING GRID */}
                {step === 'staging' && (
                    <div className="flex-1 flex flex-col overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex-1 overflow-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Name</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Budget</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Issues</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {stagedData.map((row, idx) => (
                                        <tr key={idx} className={row._status === 'Error' ? 'bg-red-50' : 'hover:bg-slate-50'}>
                                            <td className="px-4 py-3">
                                                {row._status === 'Valid' ? 
                                                    <CheckCircle size={16} className="text-green-500"/> : 
                                                    <AlertTriangle size={16} className="text-red-500"/>
                                                }
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono text-slate-600">{row.ID}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-800">{row.Name || <span className="text-red-400 italic">Missing</span>}</td>
                                            <td className="px-4 py-3 text-sm font-mono text-slate-600">{row.Budget}</td>
                                            <td className="px-4 py-3 text-xs text-red-600 font-bold">
                                                {row._errors?.join(', ')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* STEP 3: IMPORTING */}
                {step === 'importing' && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-full max-w-md text-center">
                             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg border border-slate-100 relative">
                                 <Database size={32} className="text-nexus-600" />
                                 <div className="absolute inset-0 border-4 border-nexus-100 rounded-full"></div>
                                 <div className="absolute inset-0 border-4 border-nexus-600 rounded-full border-t-transparent animate-spin"></div>
                             </div>
                             <h3 className="text-xl font-bold text-slate-800 mb-2">Importing Data...</h3>
                             <p className="text-slate-500 mb-6">Writing records to the enterprise ledger.</p>
                             <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                 <div className="h-full bg-nexus-600 transition-all duration-300" style={{ width: `${importProgress}%` }}></div>
                             </div>
                             <p className="text-xs font-mono text-slate-400 mt-2">{importProgress.toFixed(0)}% Complete</p>
                        </div>
                    </div>
                )}

                {/* STEP 4: COMPLETE */}
                {step === 'complete' && (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in">
                            <CheckCircle size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Import Successful</h3>
                        <p className="text-slate-500 max-w-sm text-center mb-8">
                            The data has been successfully mapped, validated, and committed to the database.
                        </p>
                        <Button onClick={reset} icon={ArrowRight}>Import More</Button>
                    </div>
                )}
            </div>

            {/* Footer Actions (Only for Staging) */}
            {step === 'staging' && (
                <div className="p-6 bg-white border-t border-slate-200 flex justify-end gap-3">
                    <Button variant="secondary" onClick={reset}>Cancel</Button>
                    <Button onClick={handleCommit} icon={Play}>Commit Valid Records</Button>
                </div>
            )}
        </div>
    );
};