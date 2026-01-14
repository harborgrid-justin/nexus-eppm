import React from 'react';
import { Download, FileCode, FileSpreadsheet, Database, Lock, Loader2, Target, Briefcase } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useExportLogic } from '../../../hooks/domain/useExportLogic';
import { Badge } from '../../ui/Badge';
import { EmptyGrid } from '../../common/EmptyGrid';

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
        <div className={`rounded-2xl shadow-sm border ${theme.colors.border} flex flex-col relative h-full bg-white overflow-hidden`}>
            {!canExchange && (
                <div className={`absolute inset-0 bg-white/70 backdrop-blur-sm z-[30] flex flex-col items-center justify-center ${theme.colors.text.secondary} nexus-empty-pattern`}>
                    <Lock size={48} className="mb-4 opacity-30 text-slate-400"/>
                    <p className="font-black uppercase tracking-widest text-xs">Security Protocol Restricted</p>
                </div>
            )}
            
            <div className={`p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-nexus-600 text-white rounded-xl shadow-lg shadow-nexus-500/10"><Download size={24}/></div>
                    <div>
                         <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Outbound Payload Generator</h2>
                         <p className="text-xs text-slate-500 font-medium">Construct localized data exports for external stakeholder analysis.</p>
                    </div>
                </div>
                <Badge variant="neutral" className="font-mono">VER_2.4_READY</Badge>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col p-10 space-y-10 scrollbar-thin bg-white">
                <div>
                    <label className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block`}>1. Transmission Format</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[{ id: 'P6 XML', icon: FileCode, label: 'Primavera P6 Binary' }, { id: 'CSV', icon: FileSpreadsheet, label: 'Standard Ledger (CSV)' }, { id: 'JSON', icon: Database, label: 'Nexus Native JSON' }].map((fmt) => (
                            <button key={fmt.id} onClick={() => setExportFormat(fmt.id as any)} className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 text-center transition-all group ${exportFormat === fmt.id ? 'border-nexus-500 bg-nexus-50 text-nexus-700 shadow-lg shadow-nexus-500/5' : `${theme.colors.border} bg-white text-slate-400 hover:border-slate-300 hover:bg-slate-50`}`}>
                                <fmt.icon size={28} className={exportFormat === fmt.id ? 'text-nexus-600' : 'group-hover:text-slate-600'} />
                                <span className="text-[11px] font-black uppercase tracking-tight">{fmt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                    <label className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block`}>2. Payload Scope (Entity Selection)</label>
                    <div className={`border ${theme.colors.border} rounded-2xl flex-1 overflow-y-auto ${theme.colors.background}/50 p-4 space-y-1 min-h-[200px] shadow-inner nexus-empty-pattern`}>
                        {projects.length > 0 ? projects.map(p => (
                            <label key={p.id} className={`flex items-center gap-4 p-4 hover:bg-white rounded-xl cursor-pointer group transition-all border border-transparent hover:border-slate-200 hover:shadow-sm ${selectedExportProjects.includes(p.name) ? 'bg-white border-nexus-200 shadow-md ring-1 ring-nexus-500/5' : ''}`}>
                                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-nexus-600 focus:ring-nexus-500 transition-all" checked={selectedExportProjects.includes(p.name)} onChange={() => toggleProjectSelection(p.name)} />
                                <div className="flex-1 min-w-0">
                                    <span className={`text-sm font-bold ${selectedExportProjects.includes(p.name) ? 'text-slate-900' : 'text-slate-600'} uppercase tracking-tight`}>{p.name}</span>
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{p.code}</div>
                                </div>
                                <Badge variant="neutral" className="scale-75 origin-right">{p.category}</Badge>
                            </label>
                        )) : (
                            <div className="h-full flex flex-col justify-center opacity-40">
                                <EmptyGrid title="Scope Target Null" description="No active projects identified in the strategic ledger for export." icon={Target} />
                            </div>
                        )}
                    </div>
                </div>

                <div className={`pt-6 border-t border-slate-100 flex justify-between items-center`}>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                         Selection: {selectedExportProjects.length} Entities
                    </div>
                    <button onClick={handleExport} disabled={isExporting || selectedExportProjects.length === 0} className={`px-10 py-4 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-black shadow-2xl transition-all disabled:opacity-30 disabled:grayscale flex items-center gap-3 active:scale-95`}>
                        {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />} {isExporting ? 'Packaging Payload...' : 'Trigger Transmission'}
                    </button>
                </div>
            </div>
        </div>
    );
};