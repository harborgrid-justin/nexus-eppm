
import React from 'react';
import { Download, FileCode, FileSpreadsheet, Database, Lock, Loader2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useExportLogic } from '../../../hooks/domain/useExportLogic';

export const ExportPanel: React.FC = () => {
    const theme = useTheme();
    const { 
        canExchange,
        selectedExportProjects,
        exportFormat,
        setExportFormat,
        isExporting,
        handleExport,
        projects,
        toggleProjectSelection
    } = useExportLogic();

    return (
        <div className={`${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} p-6 flex flex-col relative h-full`}>
            {!canExchange && (
                <div className={`absolute inset-0 ${theme.colors.surface}/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center ${theme.colors.text.secondary}`}><Lock size={32} className="mb-2 opacity-50"/><p className="font-semibold">Access Restricted</p></div>
            )}
            <h2 className={`${theme.typography.h2} mb-4 flex items-center gap-2`}><Download size={20} className="text-nexus-500" /> Export Data</h2>
            <div className="space-y-6 flex-1 flex flex-col min-h-0">
                <div>
                    <label className={`text-sm font-bold ${theme.colors.text.primary} mb-2 block`}>1. Select Format</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[{ id: 'P6 XML', icon: FileCode, label: 'Primavera P6' }, { id: 'CSV', icon: FileSpreadsheet, label: 'Excel / CSV' }, { id: 'JSON', icon: Database, label: 'Native JSON' }].map((fmt) => (
                            <button key={fmt.id} onClick={() => setExportFormat(fmt.id as any)} className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 text-center transition-all ${exportFormat === fmt.id ? 'border-nexus-500 bg-nexus-50 text-nexus-700 ring-1 ring-nexus-500' : `${theme.colors.border} ${theme.colors.surface} ${theme.colors.text.secondary} hover:${theme.colors.background}`}`}>
                                <fmt.icon size={24} /><span className="text-xs font-medium">{fmt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col min-h-0">
                    <label className={`text-sm font-bold ${theme.colors.text.primary} mb-2 block`}>2. Select Projects</label>
                    <div className={`border ${theme.colors.border} rounded-lg flex-1 overflow-y-auto ${theme.colors.background} p-2 space-y-1 min-h-[150px]`}>
                        {projects.map(p => (
                            <label key={p.id} className={`flex items-center gap-3 p-2 hover:${theme.colors.surface} rounded cursor-pointer group transition-colors`}>
                                <input type="checkbox" className="rounded text-nexus-600 focus:ring-nexus-500 border-slate-300" checked={selectedExportProjects.includes(p.name)} onChange={() => toggleProjectSelection(p.name)} />
                                <span className={`text-sm font-medium ${theme.colors.text.secondary} group-hover:${theme.colors.text.primary}`}>{p.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className={`pt-4 border-t ${theme.colors.border} mt-auto`}>
                    <button onClick={handleExport} disabled={isExporting || selectedExportProjects.length === 0} className={`w-full py-3 ${theme.colors.accentBg} text-white font-semibold rounded-lg hover:bg-nexus-700 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all`}>
                        {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} {isExporting ? 'Generating...' : 'Download Export'}
                    </button>
                </div>
            </div>
        </div>
    );
};
