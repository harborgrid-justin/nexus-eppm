
import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Database, ChevronRight, Table, FileJson, Eye, Download, Plus, Shield, Search, Filter, History } from 'lucide-react';
import { Button } from '../ui/Button';
import DataTable from '../common/DataTable';
import { Input } from '../ui/Input';
import { SidePanel } from '../ui/SidePanel';
import { formatCurrency } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { useWarehouseExplorerLogic } from '../../hooks/domain/useWarehouseExplorerLogic';
import { EmptyGrid } from '../common/EmptyGrid';

export const WarehouseExplorer: React.FC = () => {
    const theme = useTheme();
    const {
        activeDomain,
        activeEntity,
        searchTerm,
        setSearchTerm,
        selectedRecord,
        setSelectedRecord,
        handleDomainChange,
        setActiveEntity,
        filteredData,
        DOMAIN_MAP
    } = useWarehouseExplorerLogic();
    
    const currentData = filteredData;

    const columns = useMemo(() => {
        if (!currentData || currentData.length === 0) return [];
        
        // Heuristic header generation based on dynamic keys
        const sample = currentData[0];
        const keys = Object.keys(sample).filter(k => 
            typeof sample[k] !== 'object' || sample[k] === null || (Array.isArray(sample[k]) && sample[k].length === 0)
        ).slice(0, 7); 

        const prioritizedKeys = [
            ...keys.filter(k => ['id', 'code', 'number', 'date', 'status', 'name', 'title'].includes(k.toLowerCase())),
            ...keys.filter(k => !['id', 'code', 'number', 'date', 'status', 'name', 'title'].includes(k.toLowerCase()))
        ].slice(0, 6);

        const gridCols = prioritizedKeys.map(key => ({
            key,
            header: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase()),
            sortable: true,
            render: (item: any) => {
                const val = item[key];
                
                if (typeof val === 'number') {
                    if (key.toLowerCase().includes('budget') || key.toLowerCase().includes('cost') || key.toLowerCase().includes('amount') || key.toLowerCase().includes('price')) {
                        return <span className="font-mono text-nexus-700 font-black">{formatCurrency(val)}</span>;
                    }
                    return <span className="font-mono font-bold text-slate-700">{val}</span>;
                }
                
                if (typeof val === 'string') {
                    if (val.match(/^\d{4}-\d{2}-\d{2}/)) {
                        return <span className="text-slate-500 text-xs font-mono font-bold bg-slate-50 px-2 py-0.5 rounded border">{val.split('T')[0]}</span>;
                    }
                    if (key.toLowerCase() === 'status' || key.toLowerCase() === 'health' || key.toLowerCase() === 'priority') {
                         let variant: any = 'neutral';
                         const v = val.toLowerCase();
                         if (['active', 'approved', 'open', 'good', 'completed', 'success', 'on track', 'pass', 'live'].includes(v)) variant = 'success';
                         else if (['warning', 'pending', 'draft', 'medium', 'at risk', 'major'].includes(v)) variant = 'warning';
                         else if (['critical', 'rejected', 'error', 'failed', 'high', 'off track', 'blocker'].includes(v)) variant = 'danger';
                         
                         return <Badge variant={variant} className="font-black">{val}</Badge>;
                    }
                }
                
                return <span className="truncate block max-w-xs text-sm font-medium text-slate-600" title={String(val)}>{String(val ?? '-')}</span>;
            }
        }));

        gridCols.push({
            key: '__actions__',
            header: '',
            sortable: false,
            render: (item: any) => (
                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedRecord(item); }}
                        className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-nexus-600 transition-all active:scale-90"
                        title="Inspect Record"
                    >
                        <Eye size={18}/>
                    </button>
                </div>
            )
        });

        return gridCols;
    }, [currentData, theme]);

    const entityLabel = useMemo(() => {
        return activeEntity.split('.').pop()?.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase()) || 'Entities';
    }, [activeEntity]);

    return (
        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-white">
            {/* Desktop Sidebar Navigation */}
            <div className={`hidden md:flex w-80 border-r ${theme.colors.border} bg-slate-50/50 flex-col shrink-0`}>
                <div className="p-6 border-b border-slate-200 bg-white">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">Enterprise Domain Graph</h3>
                    <div className="space-y-1.5">
                        {(Object.keys(DOMAIN_MAP) as (keyof typeof DOMAIN_MAP)[]).map(domain => {
                            const Icon = DOMAIN_MAP[domain].icon;
                            return (
                                <button
                                    key={domain}
                                    onClick={() => handleDomainChange(domain)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-tight transition-all duration-300 ${
                                        activeDomain === domain ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 scale-[1.02] z-10' : 'text-slate-500 hover:bg-white hover:text-nexus-600 hover:shadow-sm'
                                    }`}
                                >
                                    <span className="flex items-center gap-3"><Icon size={18}/>{domain}</span>
                                    {activeDomain === domain && <ChevronRight size={14} className="text-nexus-400" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
                {activeDomain && (
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                        <div className="flex justify-between items-center px-2 mb-4 mt-2">
                             <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Data Tables</h4>
                             <Badge variant="neutral" className="scale-75 origin-right">{DOMAIN_MAP[activeDomain].entities.length}</Badge>
                        </div>
                        <div className="space-y-1">
                            {DOMAIN_MAP[activeDomain].entities.map(entity => (
                                <button
                                    key={entity}
                                    onClick={() => setActiveEntity(entity)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 group ${
                                        activeEntity === entity ? 'bg-white text-nexus-700 shadow-md border border-slate-200 ring-4 ring-nexus-500/5' : 'text-slate-500 hover:bg-white/50 hover:text-slate-900 border border-transparent'
                                    }`}
                                >
                                    <Table size={14} className={`transition-colors ${activeEntity === entity ? 'text-nexus-600' : 'text-slate-300 group-hover:text-slate-400'}`}/>
                                    <span className="truncate uppercase tracking-tighter" title={entity}>{entity.split('.').pop()?.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="p-6 border-t border-slate-200 bg-white">
                     <div className="p-4 bg-slate-950 rounded-2xl text-white relative overflow-hidden shadow-xl">
                         <div className="relative z-10">
                            <h5 className="text-[9px] font-black text-nexus-400 uppercase tracking-widest mb-1">Integrity Pulse</h5>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Immutable state ledger verified. All partitions synced.</p>
                         </div>
                         <History size={60} className="absolute -right-4 -bottom-4 opacity-5 text-white rotate-12" />
                     </div>
                </div>
            </div>

            {/* Main Grid Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <div className={`p-5 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white z-10 gap-4 shadow-sm`}>
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                         <div className="p-3 bg-nexus-600 text-white rounded-2xl shadow-lg shadow-nexus-500/20 shrink-0">
                            <Database size={20}/>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight truncate">{entityLabel} Registry</h3>
                            <p className="text-[10px] text-slate-400 font-mono hidden sm:block truncate opacity-70">sys_resource_path: state.{activeEntity}</p>
                        </div>
                        <div className="h-8 w-px bg-slate-100 mx-2 hidden lg:block"></div>
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-[10px] font-black border border-slate-200 shrink-0 shadow-inner">{currentData?.length || 0} RECORDS COMMITTED</span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64 group">
                            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-nexus-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Filter partition nodes..." 
                                value={searchTerm} 
                                onChange={e => setSearchTerm(e.target.value)} 
                                className="w-full pl-11 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none transition-all bg-slate-50 focus:bg-white"
                            />
                        </div>
                        <Button variant="outline" size="md" icon={Download} className="shrink-0 rounded-xl px-4 font-black uppercase text-[10px] tracking-widest">Export Ledger</Button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-hidden p-0 md:p-6 bg-slate-50/30 relative">
                    <div className="absolute inset-0 nexus-empty-pattern opacity-40"></div>
                    <div className="relative h-full flex flex-col">
                        {currentData && currentData.length > 0 ? (
                            <DataTable 
                                data={currentData}
                                columns={columns}
                                keyField="id" 
                                rowsPerPage={20}
                                onRowClick={(item) => setSelectedRecord(item)}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center p-12 bg-white/50 backdrop-blur-sm border border-slate-200 rounded-[3rem] shadow-inner">
                                <EmptyGrid 
                                    title={`${entityLabel} Database Neutral`}
                                    description={`The organizational partition for ${activeDomain} contains zero records in this data store.`}
                                    icon={Database}
                                    actionLabel={`Initialize First ${entityLabel.replace(/s$/, '')} Node`}
                                    onAdd={() => {}}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Record Inspector Panel */}
            <SidePanel
                isOpen={!!selectedRecord}
                onClose={() => setSelectedRecord(null)}
                title={<div className="flex items-center gap-3 font-black text-sm uppercase tracking-[0.2em] text-slate-500"><FileJson size={20} className="text-nexus-600"/> Master Record Inspector</div>}
                width="md:w-[650px]"
                footer={<Button onClick={() => setSelectedRecord(null)} className="font-black uppercase tracking-widest text-[10px] h-10 px-8">Close Inspector</Button>}
            >
                <div className="space-y-8 animate-nexus-in">
                    <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                        <div>
                             <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{selectedRecord?.id || 'NO_ID'}</h4>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Immutable GUID: {selectedRecord?.id || 'UNDEFINED_ARTIFACT_TOKEN'}</p>
                        </div>
                        <Badge variant="success">Integrity Verified ✓</Badge>
                    </div>

                    <div className="p-6 bg-slate-950 rounded-3xl border border-slate-800 font-mono text-[12px] overflow-auto max-h-[65vh] shadow-2xl relative group">
                        <div className="absolute top-4 right-6 flex gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-lg shadow-red-500/20"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-lg shadow-yellow-500/20"></div>
                             <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-lg shadow-green-500/20"></div>
                        </div>
                        <pre className="text-blue-400 whitespace-pre-wrap leading-relaxed">
                            {JSON.stringify(selectedRecord, null, 2)}
                        </pre>
                        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(rgba(0,255,0,0.02)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                    </div>
                    
                    <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex gap-5 items-start shadow-sm group hover:border-blue-200 transition-all">
                        <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform duration-500"><Shield size={22}/></div>
                        <div className="space-y-1">
                            <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest">Security & Governance Assertion</h4>
                            <p className="text-sm text-blue-800 leading-relaxed font-medium">
                                Direct state introspection enabled. All changes to this record must be processed through an authorized <strong>Business Process (BP)</strong> or a <strong>Global Change Rule</strong> to preserve the audit trail integrity.
                            </p>
                        </div>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};
