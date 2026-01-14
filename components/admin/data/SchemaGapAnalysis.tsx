import React from 'react';
import { 
    Database, AlertTriangle, CheckCircle, Search, 
    RefreshCw, Eye, GitBranch, Table, Layers, PieChart, Briefcase, DollarSign, Users, HardHat, Settings, LayoutTemplate
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useSchemaGapAnalysisLogic } from '../../../hooks/domain/useSchemaGapAnalysisLogic';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Column } from '../../../types';
import { SidePanel } from '../../ui/SidePanel';

export const SchemaGapAnalysis: React.FC = () => {
    const theme = useTheme();
    const {
        dataModel,
        searchTerm,
        setSearchTerm,
        generating,
        handleGenerateEndpoint
    } = useSchemaGapAnalysisLogic();

    return (
        <div className="h-full flex flex-col space-y-6 bg-slate-50/30 p-1">
            {/* Top Analysis Card */}
            <div className="bg-slate-900 rounded-[2rem] p-8 text-slate-200 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between gap-8 flex-shrink-0 border border-white/5">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
                <div className="relative z-10 flex-1">
                    <h3 className="text-3xl font-black tracking-tight flex items-center gap-4 text-white">
                        <Database className="text-nexus-400" size={32}/> Enterprise Data Topology
                    </h3>
                    <p className="text-slate-400 text-sm mt-3 max-w-2xl leading-relaxed font-medium">
                        Real-time schema introspection across the Nexus Graph. Tracking live synchronization status for <strong>{dataModel.length} functional partitions</strong> within the immutable project ledger.
                    </p>
                </div>
                <div className="relative z-10 flex items-center">
                    <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-center shadow-inner backdrop-blur-md">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Schema</p>
                        <p className="text-2xl font-black text-white font-mono mt-1">v1.2.0-STABLE</p>
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-4 px-1 flex-shrink-0">
                <div className="relative flex-1 w-full sm:w-auto sm:max-w-lg">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"/>
                    <input 
                        type="text" 
                        placeholder="Search schema topology by entity or domain..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-11 pr-4 py-3 w-full border ${theme.colors.border} rounded-2xl text-sm font-bold focus:ring-4 focus:ring-nexus-500/10 outline-none transition-all ${theme.colors.surface} ${theme.colors.text.primary} shadow-sm`}
                    />
                </div>
            </div>

            {/* Domain Grid */}
            <div className="flex-1 overflow-y-auto pb-20 scrollbar-thin">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {dataModel.map(domain => {
                        const filteredEntities = domain.entities.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
                        if (filteredEntities.length === 0 && searchTerm) return null;

                        const domainCoverage = Math.round((domain.entities.filter(e => e.status === 'Live').length / domain.entities.length) * 100);

                        return (
                            <div key={domain.name} className={`${theme.components.card} flex flex-col overflow-hidden group hover:border-nexus-300 transition-all shadow-sm border-slate-200 rounded-[2rem]`}>
                                <div className={`p-6 ${theme.colors.background} border-b ${theme.colors.border} flex justify-between items-start bg-slate-50/50`}>
                                    <div className="flex gap-4">
                                        <div className={`p-3 ${theme.colors.surface} border ${theme.colors.border} rounded-2xl ${theme.colors.text.tertiary} shadow-sm group-hover:text-nexus-600 transition-colors`}>
                                            <domain.icon size={22}/>
                                        </div>
                                        <div>
                                            <h4 className={`font-black ${theme.colors.text.primary} text-sm uppercase tracking-tight`}>{domain.name}</h4>
                                            <p className={`text-[10px] ${theme.colors.text.secondary} leading-tight mt-1 font-medium max-w-[180px]`}>{domain.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${domainCoverage === 100 ? 'bg-green-50 text-green-700 border-green-200 shadow-sm' : 'bg-slate-100 text-slate-500 border-slate-200 shadow-inner'}`}>
                                            {domainCoverage}% Integrity
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className={`h-1.5 w-full bg-slate-100`}>
                                    <div className={`h-full transition-all duration-700 ${domainCoverage === 100 ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-nexus-500'}`} style={{ width: `${domainCoverage}%` }}></div>
                                </div>

                                <div className={`divide-y ${theme.colors.border.replace('border-', 'divide-')} bg-white`}>
                                    {filteredEntities.map(entity => (
                                        <div key={entity.name} className={`p-4 flex items-center justify-between group/row hover:bg-slate-50/50 transition-colors`}>
                                            <div className="min-w-0 flex-1 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-bold text-xs ${theme.colors.text.primary} truncate uppercase tracking-tight`} title={entity.name}>{entity.name}</p>
                                                    {entity.status === 'Live' ? (
                                                        <CheckCircle size={12} className="text-green-500" />
                                                    ) : (
                                                        <AlertTriangle size={12} className={`text-slate-300 group-hover/row:text-amber-500 transition-colors`} />
                                                    )}
                                                </div>
                                                <p className={`text-[9px] text-slate-400 mt-1 font-mono font-black uppercase tracking-widest`}>
                                                    {entity.records.toLocaleString()} Artifacts
                                                </p>
                                            </div>
                                            
                                            {entity.status === 'Gap' ? (
                                                <button 
                                                    onClick={() => handleGenerateEndpoint(entity.name)}
                                                    disabled={generating === entity.name}
                                                    className={`px-3 py-1.5 bg-slate-50 hover:bg-nexus-600 hover:text-white text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border border-slate-200 active:scale-95`}
                                                >
                                                    {generating === entity.name ? (
                                                        <RefreshCw size={10} className="animate-spin"/>
                                                    ) : (
                                                        <GitBranch size={10}/> 
                                                    )}
                                                    {generating === entity.name ? 'Syncing...' : 'Provision API'}
                                                </button>
                                            ) : (
                                                <button className={`px-2.5 py-1.5 bg-white border border-slate-200 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:bg-slate-50 hover:text-nexus-600 transition-all opacity-0 group-hover/row:opacity-100 shadow-sm active:scale-95`}>
                                                    <Eye size={12}/> Inspect
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};