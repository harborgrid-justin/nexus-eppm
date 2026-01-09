
import React from 'react';
import { Upload, CheckCircle, Grid, FilePlus, ArrowDownCircle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { useExcelSyncLogic } from '../../../hooks/domain/useExcelSyncLogic';
import { useToast } from '../../../context/ToastContext';

export const ExcelSync: React.FC = () => {
    const theme = useTheme();
    const { success, error } = useToast();
    const {
        data,
        selectedCell,
        selectedProjectId,
        hasData,
        projects,
        setSelectedCell,
        setSelectedProjectId,
        loadTemplate,
        handleLoadProject,
        handlePaste,
        handleChange,
        handleUpload
    } = useExcelSyncLogic();

    const onUploadClick = () => {
        const res = handleUpload();
        if (res.error) {
            error("Sync Failed", res.error);
        } else {
            success("Data Staged", "Rows pushed to Import Staging. Switch to 'Data Import' to commit.");
        }
    };

    return (
        <div className={`h-full flex flex-col ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm overflow-hidden`}>
            {/* Toolbar */}
            <div className={`p-3 border-b ${theme.colors.border} flex flex-col md:flex-row justify-between items-center ${theme.colors.background} gap-3`}>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-700 font-bold">
                        <Grid size={18} />
                        <span>Excel Sync Adapter</span>
                    </div>
                    <div className={`h-6 w-px ${theme.colors.border} hidden md:block`}></div>
                    
                    <div className="flex items-center gap-2">
                        <select 
                            className={`text-xs border ${theme.colors.border} rounded-md py-1 px-2 w-40 ${theme.colors.surface} ${theme.colors.text.primary} focus:ring-1 focus:ring-nexus-500 focus:outline-none`}
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                        >
                            <option value="">Load from Project...</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <button 
                            onClick={handleLoadProject}
                            disabled={!selectedProjectId}
                            className={`p-1 ${theme.colors.text.secondary} hover:text-nexus-600 disabled:opacity-30`}
                            title="Load Project Data"
                        >
                            <ArrowDownCircle size={16}/>
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={FilePlus} onClick={loadTemplate}>Load Template</Button>
                    <Button size="sm" icon={Upload} onClick={onUploadClick} disabled={!hasData}>Push to Staging</Button>
                </div>
            </div>

            {/* Grid */}
            <div className={`flex-1 overflow-auto relative ${theme.colors.background}/10`}>
                <div className="min-w-[800px]" onPaste={handlePaste}>
                    <div className="flex">
                        {/* Row Numbers */}
                        <div className={`w-10 flex-shrink-0 ${theme.colors.background} border-r ${theme.colors.border} pt-8 select-none shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] z-10`}>
                            {data.map((_, i) => (
                                <div key={i} className={`h-8 flex items-center justify-center text-xs ${theme.colors.text.secondary} font-medium border-b ${theme.colors.border} ${theme.colors.background}`}>
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex-1">
                            {/* Column Headers */}
                            <div className={`flex h-8 ${theme.colors.background} border-b ${theme.colors.border} sticky top-0 z-20`}>
                                {data[0].map((col, i) => (
                                    <div key={i} className={`flex-1 min-w-[100px] flex items-center justify-center text-xs font-bold ${theme.colors.text.secondary} border-r ${theme.colors.border} relative`}>
                                        {col || String.fromCharCode(65 + i)}
                                    </div>
                                ))}
                            </div>

                            {/* Cells */}
                            {data.map((row, r) => (
                                <div key={r} className={`flex h-8 border-b ${theme.colors.border}`}>
                                    {row.map((cell, c) => (
                                        <input
                                            key={`${r}-${c}`}
                                            className={`flex-1 min-w-[100px] px-2 text-sm border-r ${theme.colors.border} outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 focus:bg-green-50 transition-colors ${r === 0 ? `font-bold ${theme.colors.background} ${theme.colors.text.secondary}` : `${theme.colors.text.primary} ${theme.colors.surface}`}`}
                                            value={cell}
                                            readOnly={r === 0}
                                            onClick={() => setSelectedCell({r, c})}
                                            onChange={(e) => handleChange(r, c, e.target.value)}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Bar */}
            <div className={`h-8 ${theme.colors.background} border-t ${theme.colors.border} flex items-center px-4 justify-between text-xs ${theme.colors.text.secondary} select-none`}>
                <span>{selectedCell ? `Cell: ${String.fromCharCode(65 + selectedCell.c)}${selectedCell.r + 1}` : 'Ready'}</span>
                <div className="flex gap-4">
                    <span>Rows: {Math.max(0, data.length - 1)}</span>
                    <span className="text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle size={10}/> Validation: {hasData ? 'Active' : 'Waiting for Data'}
                    </span>
                </div>
            </div>
        </div>
    );
};
