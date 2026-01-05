
import React from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, Play, Lock, Trash2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { useImportLogic } from '../../../hooks/domain/useImportLogic';

export const ImportPanel: React.FC = () => {
    const theme = useTheme();
    const {
        step,
        records,
        summary,
        fileInputRef,
        canExchange,
        handleFiles,
        handleCommit,
        handleClear,
        triggerFileUpload
    } = useImportLogic();

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
                         <span className="text-slate-500">Total: {summary.total}</span>
                         <span className="text-green-600">Valid: {summary.valid}</span>
                         <span className="text-red-600">Errors: {summary.error}</span>
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="flex-1 p-8 bg-slate-50/50 overflow-hidden flex flex-col relative">
                
                {/* STEP 1: UPLOAD */}
                {step === 'upload' && (
                    <div 
                        className="flex-1 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center hover:border-nexus-400 hover:bg-nexus-50/10 transition-all cursor-pointer bg-white group"
                        onClick={triggerFileUpload}
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
                                    {records.map((row, idx) => (
                                        <tr key={idx} className={row.status === 'Error' ? 'bg-red-50' : 'hover:bg-slate-50'}>
                                            <td className="px-4 py-3">
                                                {row.status === 'Valid' ? 
                                                    <CheckCircle size={16} className="text-green-500"/> : 
                                                    <AlertTriangle size={16} className="text-red-500"/>
                                                }
                                            </td>
                                            <td className="px-4 py-3 text-sm font-mono text-slate-600">{row.data.ID}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-slate-800">{row.data.Name || <span className="text-red-400 italic">Missing</span>}</td>
                                            <td className="px-4 py-3 text-sm font-mono text-slate-600">{row.data.Budget}</td>
                                            <td className="px-4 py-3 text-xs text-red-600 font-bold">
                                                {row.errors?.join(', ')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions (Only for Staging) */}
            {step === 'staging' && (
                <div className="p-6 bg-white border-t border-slate-200 flex justify-end gap-3">
                    <Button variant="danger" onClick={handleClear} icon={Trash2}>Discard</Button>
                    <Button onClick={handleCommit} icon={Play}>Commit Valid Records</Button>
                </div>
            )}
        </div>
    );
};
