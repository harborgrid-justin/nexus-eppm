
import React from 'react';
import { 
    Database, AlertTriangle, CheckCircle, Search, 
    RefreshCw, Eye, GitBranch, Table
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useSchemaGapAnalysisLogic } from '../../../hooks/domain/useSchemaGapAnalysisLogic';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import DataTable, { Column } from '../../common/DataTable';
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
        <div className="h-full flex flex-col space-y-6">
            {/* Top Analysis Card */}
            <div className="bg-slate-800 rounded-xl p-6 text-slate-200 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between gap-6 flex-shrink-0">
                <div className="relative z-10">
                    <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                        <Database className="text-nexus-400" size={28}/> Enterprise Data Topology
                    </h3>
                    <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
                        Real-time schema introspection of the Nexus Data Graph. 
                        Tracking <strong>{dataModel.length} functional domains</strong> across the distributed ledger.
                    </p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex flex-col sm:flex-row items-center gap-4 px-1 flex-shrink-0">
                <div className="relative flex-1 w-full sm:w-auto sm:max-w-md">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input 
                        type="text" 
                        placeholder="Search schema entities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-9 pr-4 py-2 w-full border ${theme.colors.border} rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 outline-none transition-all ${theme.colors.surface} ${theme.colors.text.primary}`}
                    />
                </div>
            </div>

            {/* Domain Grid */}
            <div className="flex-1 overflow-y-auto pr-2 pb-10 scrollbar-thin">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {dataModel.map(domain => {
                        const filteredEntities = domain.entities.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()));
                        if (filteredEntities.length === 0 && searchTerm) return null;

                        const domainCoverage = Math.round((domain.entities.filter(e => e.status === 'Live').length / domain.entities.length) * 100);

                        return (
                            <div key={domain.name} className={`${theme.components.card} flex flex-col overflow-hidden group hover:border-nexus-300 transition-colors`}>
                                <div className={`p-4 ${theme.colors.background} border-b ${theme.colors.border} flex justify-between items-start`}>
                                    <div className="flex gap-3">
                                        <div className={`p-2 ${theme.colors.surface} border ${theme.colors.border} rounded-lg ${theme.colors.text.tertiary} shadow-sm`}>
                                            <domain.icon size={20}/>
                                        </div>
                                        <div>
                                            <h4 className={`font-bold ${theme.colors.text.primary} text-sm`}>{domain.name}</h4>
                                            <p className={`text-[10px] ${theme.colors.text.secondary} leading-tight mt-0.5 max-w-[150px]`}>{domain.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-xs font-black px-2 py-1 rounded border ${domainCoverage === 100 ? `${theme.colors.semantic.success.bg} ${theme.colors.semantic.success.text} ${theme.colors.semantic.success.border}` : `${theme.colors.semantic.neutral.bg} ${theme.colors.semantic.neutral.text} ${theme.colors.semantic.neutral.border}`}`}>
                                            {domainCoverage}%
                                        </span>
                                    </div>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className={`h-1 w-full ${theme.colors.background}`}>
                                    <div className={`h-full ${domainCoverage === 100 ? theme.colors.semantic.success.bg.replace('-50', '-500') : theme.colors.primary}`} style={{ width: `${domainCoverage}%` }}></div>
                                </div>

                                <div className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                                    {filteredEntities.map(entity => (
                                        <div key={entity.name} className={`p-3 flex items-center justify-between group/row hover:${theme.colors.background} transition-colors`}>
                                            <div className="min-w-0 flex-1 pr-4">
                                                <div className="flex items-center gap-2">
                                                    <p className={`font-bold text-xs ${theme.colors.text.primary} truncate`} title={entity.name}>{entity.name}</p>
                                                    {entity.status === 'Live' ? (
                                                        <CheckCircle size={12} className={theme.colors.semantic.success.icon} />
                                                    ) : (
                                                        <AlertTriangle size={12} className={`${theme.colors.text.tertiary} group-hover/row:text-amber-500 transition-colors`} />
                                                    )}
                                                </div>
                                                <p className={`text-[9px] ${theme.colors.text.tertiary} mt-0.5 font-mono uppercase tracking-wider`}>
                                                    {entity.records.toLocaleString()} Records
                                                </p>
                                            </div>
                                            
                                            {entity.status === 'Gap' ? (
                                                <button 
                                                    onClick={() => handleGenerateEndpoint(entity.name)}
                                                    disabled={generating === entity.name}
                                                    className={`px-2 py-1 ${theme.colors.background} hover:${theme.colors.primary} hover:${theme.colors.text.inverted} ${theme.colors.text.secondary} rounded text-[10px] font-bold transition-all flex items-center gap-1 border ${theme.colors.border}`}
                                                >
                                                    {generating === entity.name ? (
                                                        <RefreshCw size={10} className="animate-spin"/>
                                                    ) : (
                                                        <GitBranch size={10}/> 
                                                    )}
                                                    {generating === entity.name ? '...' : 'Gen API'}
                                                </button>
                                            ) : (
                                                <button className={`px-2 py-1 ${theme.colors.surface} border ${theme.colors.border} ${theme.colors.text.tertiary} rounded text-[10px] font-bold flex items-center gap-1 hover:bg-slate-50 hover:text-nexus-600 transition-colors opacity-0 group-hover/row:opacity-100`}>
                                                    <Eye size={10}/> Inspect
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
