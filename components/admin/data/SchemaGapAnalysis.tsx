
import React from 'react';
import { Database, AlertTriangle, CheckCircle, Search, RefreshCw, Eye, GitBranch, Layers, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useSchemaGapAnalysisLogic } from '../../../hooks/domain/useSchemaGapAnalysisLogic';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { useData } from '../../../context/DataContext';

export const SchemaGapAnalysis: React.FC = () => {
    const theme = useTheme();
    const { dispatch } = useData();
    const {
        dataModel,
        searchTerm,
        setSearchTerm,
        generating,
        handleGenerateEndpoint
    } = useSchemaGapAnalysisLogic();

    const handleReIndex = () => {
        // Simulate a system job
        dispatch({
            type: 'SYSTEM_QUEUE_DATA_JOB',
            payload: {
                id: `REINDEX-${Date.now()}`,
                type: 'System',
                format: 'JSON',
                status: 'In Progress',
                submittedBy: 'Admin',
                timestamp: new Date().toLocaleString(),
                details: 'Full schema re-indexing initiated.',
                progress: 0
            }
        });
        alert("Schema Re-Index job queued in background.");
    };

    return (
        <div className="h-full flex flex-col space-y-8 bg-slate-50/50 p-1 animate-in fade-in duration-500 scrollbar-thin">
            <div className="bg-slate-900 rounded-[2.5rem] p-12 text-slate-200 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between gap-10 flex-shrink-0 border border-white/5 group">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,255,255,0.03)_1.5px,transparent_1.5px)] bg-[size:32px:32px] pointer-events-none"></div>
                <div className="absolute top-0 right-0 p-32 bg-nexus-500/10 rounded-full blur-[100px] -mr-16 -mt-16 pointer-events-none group-hover:bg-nexus-500/15 transition-colors"></div>
                
                <div className="relative z-10 flex-1">
                    <h3 className="text-4xl font-black tracking-tight flex items-center gap-5 text-white uppercase">
                        <Database className="text-nexus-400" size={40}/> Enterprise Data Topology
                    </h3>
                    <p className="text-slate-400 text-base mt-4 max-w-2xl leading-relaxed font-medium">
                        Real-time schema introspection and integrity analysis across the multi-tenant Nexus Graph. Identifying coverage gaps for unified project reporting.
                    </p>
                </div>
                <div className="relative z-10 flex flex-col items-end gap-3 justify-center shrink-0">
                     <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl backdrop-blur-md">
                         <ShieldCheck className="text-green-400" size={24}/>
                         <div>
                             <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Global Integrity</p>
                             <p className="text-xl font-black text-white font-mono leading-none">94.2%</p>
                         </div>
                     </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 px-1 flex-shrink-0">
                <div className="relative flex-1 w-full sm:w-auto sm:max-w-xl group">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-nexus-500 transition-colors"/>
                    <input 
                        type="text" 
                        placeholder="Filter schema topology by domain or entity..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-12 pr-4 py-4 w-full border ${theme.colors.border} rounded-3xl text-sm font-black focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all ${theme.colors.surface} ${theme.colors.text.primary} shadow-sm uppercase tracking-tight`}
                    />
                </div>
                <button 
                    onClick={handleReIndex}
                    className="px-6 py-4 bg-white border border-slate-200 rounded-3xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-nexus-600 hover:border-nexus-300 transition-all shadow-sm active:scale-95"
                >
                    <RefreshCw size={14} className="inline mr-2"/> Re-Index Schema
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-32 scrollbar-thin">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {dataModel.map(domain => {
                        const filteredEntities = domain.entities.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
                        if (filteredEntities.length === 0 && searchTerm) return null;

                        const domainCoverage = Math.round((domain.entities.filter(e => e.status === 'Live').length / domain.entities.length) * 100);

                        return (
                            <div key={domain.name} className={`${theme.components.card} flex flex-col overflow-hidden group hover:border-nexus-400 transition-all shadow-sm rounded-[2.5rem] bg-white`}>
                                <div className={`p-8 ${theme.colors.background} border-b ${theme.colors.border} flex justify-between items-start bg-slate-50/50`}>
                                    <div className="flex gap-5">
                                        <div className={`p-4 ${theme.colors.surface} border ${theme.colors.border} rounded-2xl ${theme.colors.text.tertiary} shadow-sm group-hover:text-nexus-600 transition-all group-hover:scale-110`}>
                                            <domain.icon size={28}/>
                                        </div>
                                        <div>
                                            <h4 className={`font-black ${theme.colors.text.primary} text-base uppercase tracking-tight`}>{domain.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{domain.entities.length} Data Objects</p>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl border shadow-sm transition-all ${domainCoverage === 100 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                        {domainCoverage}% Integrity
                                    </span>
                                </div>
                                
                                <div className={`divide-y divide-slate-50 bg-white flex-1`}>
                                    {filteredEntities.map(entity => (
                                        <div key={entity.name} className={`p-5 flex items-center justify-between group/row hover:bg-slate-50 transition-colors`}>
                                            <div className="min-w-0 flex-1 pr-6">
                                                <div className="flex items-center gap-3">
                                                    <p className={`font-black text-sm ${theme.colors.text.primary} truncate uppercase tracking-tight group-hover/row:text-nexus-600 transition-colors`}>{entity.name}</p>
                                                    {entity.status === 'Live' ? <CheckCircle size={14} className="text-green-500" /> : <AlertTriangle size={14} className="text-slate-300" />}
                                                </div>
                                            </div>
                                            
                                            {entity.status === 'Gap' ? (
                                                <button 
                                                    onClick={() => handleGenerateEndpoint(entity.name)}
                                                    disabled={generating === entity.name}
                                                    className={`px-4 py-2 bg-slate-50 hover:bg-nexus-600 hover:text-white text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-slate-200 active:scale-95 shadow-sm`}
                                                >
                                                    {generating === entity.name ? <RefreshCw size={12} className="animate-spin"/> : <GitBranch size={12}/>}
                                                    {generating === entity.name ? 'Linking...' : 'Provision API'}
                                                </button>
                                            ) : (
                                                <button className={`px-4 py-2 bg-white border border-slate-100 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 hover:text-nexus-600 hover:border-nexus-200 transition-all opacity-0 group-hover/row:opacity-100 shadow-sm active:scale-95`}>
                                                    <Eye size={14}/> Inspect Table
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    {filteredEntities.length === 0 && (
                                        <div className="p-8 text-center text-slate-400 text-xs italic">No matching entities in domain.</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
