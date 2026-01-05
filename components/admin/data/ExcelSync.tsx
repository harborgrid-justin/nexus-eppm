
import React from 'react';
import { Upload, CheckCircle, Grid, FilePlus, ArrowDownCircle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { useExcelSyncLogic } from '../../../hooks/domain/useExcelSyncLogic';

export const ExcelSync: React.FC = () => {
    const theme = useTheme();
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
        if (res.error) alert(res.error);
        else alert("Data pushed to Import Staging Area. Please switch to 'Data Import' tab to review and commit.");
    };

    return (
        <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {/* Toolbar */}
            <div className="p-3 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center bg-slate-50 gap-3">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-green-700 font-bold">
                        <Grid size={18} />
                        <span>Excel Sync Adapter</span>
                    </div>
                    <div className="h-6 w-px bg-slate-300 hidden md:block"></div>
                    
                    <div className="flex items-center gap-2">
                        <select 
                            className="text-xs border border-slate-300 rounded-md py-1 px-2 w-40"
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                        >
                            <option value="">Load from Project...</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <button 
                            onClick={handleLoadProject}
                            disabled={!selectedProjectId}
                            className="p-1 text-slate-500 hover:text-nexus-600 disabled:opacity-30"
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
            <div className="flex-1 overflow-auto relative bg-slate-50/10">
                <div className="min-w-[800px]" onPaste={handlePaste}>
                    <div className="flex">
                        {/* Row Numbers */}
                        <div className="w-10 flex-shrink-0 bg-slate-100 border-r border-slate-300 pt-8 select-none shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] z-10">
                            {data.map((_, i) => (
                                <div key={i} className="h-8 flex items-center justify-center text-xs text-slate-500 font-medium border-b border-slate-200 bg-slate-50">
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        
                        <div className="flex-1">
                            {/* Column Headers */}
                            <div className="flex h-8 bg-slate-100 border-b border-slate-300 sticky top-0 z-20">
                                {data[0].map((col, i) => (
                                    <div key={i} className="flex-1 min-w-[100px] flex items-center justify-center text-xs font-bold text-slate-600 border-r border-slate-200 relative">
                                        {col || String.fromCharCode(65 + i)}
                                    </div>
                                ))}
                            </div>

                            {/* Cells */}
                            {data.map((row, r) => (
                                <div key={r} className="flex h-8 border-b border-slate-200">
                                    {row.map((cell, c) => (
                                        <input
                                            key={`${r}-${c}`}
                                            className={`flex-1 min-w-[100px] px-2 text-sm border-r border-slate-100 outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 focus:bg-green-50 transition-colors ${r === 0 ? 'font-bold bg-slate-50 text-slate-700' : 'text-slate-800 bg-white'}`}
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
            <div className="h-8 bg-slate-50 border-t border-slate-200 flex items-center px-4 justify-between text-xs text-slate-500 select-none">
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
