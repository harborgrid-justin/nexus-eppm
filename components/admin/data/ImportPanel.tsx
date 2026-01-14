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
            <div className={`h-full flex items-center justify-center ${theme.colors.background} border-2 border-dashed ${theme.colors.border} rounded-3xl ${theme.colors.text.tertiary} m-6`}>
                <div className="text-center">
                    <Lock size={48} className="mx-auto mb-4 opacity-50"/>
                    <p className="font-black uppercase tracking-widest text-xs">Security Protocol: Access Restricted</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-xl shadow-sm border ${theme.colors.border} flex flex-col h-full overflow-hidden bg-white`}>
            {/* Header */}
            <div className={`p-6 border-b ${theme.colors.border} ${theme.colors.surface} flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50/50 gap-4`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl shadow-lg ${step === 'complete' ? 'bg-green-100 text-green-600' : 'bg-nexus-600 text-white'}`}>
                        {step === 'complete' ? <CheckCircle size={24}/> : <UploadCloud size={24}/>}
                    </div>
                    <div>
                        <h2 className={`text-xl font-black ${theme.colors.text.primary} tracking-tight uppercase`}>Data Ingestion Hub</h2>
                        <p className={`text-xs ${theme.colors.text.secondary} font-medium mt-1`}>Bulk schema transformation for Primavera XML and project CSVs.</p>
                    </div>
                </div>
                {step === 'staging' && (
                    <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.15em]">
                         <span className={`text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full`}>Thread Count: {summary.total}</span>
                         <span className="text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">Valid: {summary.valid}</span>
                         <span className="text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">Faults: {summary.error}</span>
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className={`flex-1 p-10 ${theme.colors.background}/50 overflow-hidden flex flex-col relative`}>
                
                {/* STEP 1: UPLOAD */}
                {step === 'upload' && (
                    <div 
                        className={`flex-1 border-2 border-dashed ${theme.colors.border} rounded-[2rem] flex flex-col items-center justify-center hover:border-nexus-400 hover:bg-white transition-all cursor-pointer group shadow-inner nexus-empty-pattern`}
                        onClick={triggerFileUpload}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                    >
                        <input ref={fileInputRef} type="file" className="hidden" accept=".csv,.json,.xml" onChange={(e) => handleFiles(e.target.files)} />
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-xl border border-slate-100 group-hover:scale-110 transition-transform rotate-3 group-hover:rotate-0 duration-500">
                            <UploadCloud size={40} className="text-nexus-500" />
                        </div>
                        <h3 className={`text-xl font-black ${theme.colors.text.primary} uppercase tracking-tighter`}>Drop Artifacts to Ingest</h3>
                        <p className={`text-sm ${theme.colors.text.secondary} mt-3 font-medium opacity-70`}>Supports .CSV, .JSON, .XML, and .XER binaries (Max 50MB)</p>
                    </div>
                )}

                {/* STEP 2: STAGING GRID */}
                {step === 'staging' && (
                    <div className={`flex-1 flex flex-col overflow-hidden ${theme.colors.surface} rounded-2xl border ${theme.colors.border} shadow-sm bg-white`}>
                        <div className="flex-1 overflow-auto scrollbar-thin">
                            <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                                <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm border-b`}>
                                    <tr>
                                        <th className={theme.components.table.header + " pl-8"}>Inference</th>
                                        <th className={theme.components.table.header}>Primary ID</th>
                                        <th className={theme.components.table.header}>Entity Designation</th>
                                        <th className={theme.components.table.header}>Fiscal Basis</th>
                                        <th className={theme.components.table.header + " text-right pr-8"}>Validation Result</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y divide-slate-50`}>
                                    {records.map((row, idx) => (
                                        <tr key={idx} className={row.status === 'Error' ? 'bg-red-50/50' : `hover:bg-slate-50 transition-colors`}>
                                            <td className="px-6 py-4 pl-8">
                                                {row.status === 'Valid' ? 
                                                    <CheckCircle size={16} className="text-green-500"/> : 
                                                    <AlertTriangle size={16} className="text-red-500"/>
                                                }
                                            </td>
                                            <td className={`px-6 py-4 text-[11px] font-mono font-black text-slate-400 uppercase`}>{row.data.ID}</td>
                                            <td className={`px-6 py-4 font-bold text-sm text-slate-800`}>{row.data.Name || <span className="text-red-400 italic">Unresolved Designation</span>}</td>
                                            <td className={`px-6 py-4 font-mono text-xs font-black text-slate-600`}>{row.data.Budget}</td>
                                            <td className={`px-6 py-4 text-right pr-8 text-red-600 font-black uppercase text-[9px] tracking-widest`}>
                                                {row.errors?.join(' | ') || <span className="text-green-600">CLEARED ✓</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            {step === 'staging' && (
                <div className={`p-6 ${theme.colors.surface} border-t ${theme.colors.border} flex justify-end gap-3 bg-slate-50/50`}>
                    <Button variant="danger" onClick={handleClear} icon={Trash2} className="font-bold uppercase tracking-widest text-[10px]">Discard Thread</Button>
                    <Button onClick={handleCommit} icon={Play} className="font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-nexus-500/20">Commit to Warehouse</Button>
                </div>
            )}
        </div>
    );
};