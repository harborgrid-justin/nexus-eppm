
import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
// Added Shield to the lucide-react import list.
import { Database, ChevronRight, Table, FileJson, Eye, Download, Plus, Shield } from 'lucide-react';
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
        
        const sample = currentData[0];
        const keys = Object.keys(sample).filter(k => 
            typeof sample[k] !== 'object' || sample[k] === null || (Array.isArray(sample[k]) && sample[k].length === 0)
        ).slice(0, 6); 

        const prioritizedKeys = [
            ...keys.filter(k => ['id', 'code', 'number'].includes(k.toLowerCase())),
            ...keys.filter(k => ['name', 'title', 'description', 'label'].includes(k.toLowerCase())),
            ...keys.filter(k => !['id', 'code', 'name', 'title', 'description', 'number', 'label'].includes(k.toLowerCase()))
        ].slice(0, 6);

        const gridCols = prioritizedKeys.map(key => ({
            key,
            header: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase()),
            sortable: true,
            render: (item: any) => {
                const val = item[key];
                
                if (typeof val === 'number') {
                    if (key.toLowerCase().includes('budget') || key.toLowerCase().includes('cost') || key.toLowerCase().includes('amount') || key.toLowerCase().includes('price')) {
                        return <span className="font-mono text-nexus-700 font-bold">{formatCurrency(val)}</span>;
                    }
                    return <span className="font-mono">{val}</span>;
                }
                
                if (typeof val === 'string') {
                    if (val.match(/^\d{4}-\d{2}-\d{2}/)) {
                        return <span className="text-slate-500 text-xs font-mono">{val.split('T')[0]}</span>;
                    }
                    if (key.toLowerCase() === 'status' || key.toLowerCase() === 'health' || key.toLowerCase() === 'priority') {
                         let variant: any = 'neutral';
                         const v = val.toLowerCase();
                         if (['active', 'approved', 'open', 'good', 'completed', 'success', 'on track'].includes(v)) variant = 'success';
                         else if (['warning', 'pending', 'draft', 'medium', 'at risk'].includes(v)) variant = 'warning';
                         else if (['critical', 'rejected', 'error', 'failed', 'high', 'off track'].includes(v)) variant = 'danger';
                         
                         return <Badge variant={variant}>{val}</Badge>;
                    }
                }
                
                return <span className="truncate block max-w-xs text-sm" title={String(val)}>{String(val ?? '-')}</span>;
            }
        }));

        gridCols.push({
            key: '__actions__',
            header: '',
            sortable: false,
            render: (item: any) => (
                <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedRecord(item); }}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-nexus-600 transition-colors"
                    title="Inspect Record"
                >
                    <Eye size={16}/>
                </button>
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
            <div className={`hidden md:flex w-72 border-r ${theme.colors.border} bg-slate-50 flex-col shrink-0`}>
                <div className="p-4 border-b border-slate-200 bg-white">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Enterprise Domains</h3>
                    <div className="space-y-1">
                        {(Object.keys(DOMAIN_MAP) as (keyof typeof DOMAIN_MAP)[]).map(domain => {
                            const Icon = DOMAIN_MAP[domain].icon;
                            return (
                                <button
                                    key={domain}
                                    onClick={() => handleDomainChange(domain)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                        activeDomain === domain ? 'bg-nexus-600 text-white shadow-lg shadow-nexus-500/20' : 'text-slate-500 hover:bg-slate-200'
                                    }`}
                                >
                                    <span className="flex items-center gap-2"><Icon size={16}/>{domain}</span>
                                    {activeDomain === domain && <ChevronRight size={14} />}
                                </button>
                            );
                        })}
                    </div>
                </div>
                {activeDomain && (
                    <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
                        <h4 className="px-2 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 mt-2">Data Tables</h4>
                        <div className="space-y-0.5">
                            {DOMAIN_MAP[activeDomain].entities.map(entity => (
                                <button
                                    key={entity}
                                    onClick={() => setActiveEntity(entity)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-3 ${
                                        activeEntity === entity ? 'bg-white text-nexus-700 shadow-sm border border-slate-200 ring-4 ring-nexus-500/5' : 'text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent'
                                    }`}
                                >
                                    <Table size={14} className={activeEntity === entity ? 'text-nexus-600' : 'opacity-40'}/>
                                    <span className="truncate" title={entity}>{entity.split('.').pop()?.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Main Grid Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white z-10 gap-3`}>
                    <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
                         <div className="p-2 bg-nexus-50 text-nexus-600 rounded-lg shrink-0 border border-nexus-100">
                            <Database size={18}/>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight truncate">{entityLabel}</h3>
                            <p className="text-[10px] text-slate-400 font-mono hidden sm:block truncate">sys_path: state.{activeEntity}</p>
                        </div>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-black border border-slate-200 ml-2 shrink-0">{currentData?.length || 0} RECORDS</span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Input isSearch placeholder="Filter warehouse..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64" />
                        <Button variant="outline" size="sm" icon={Download} className="shrink-0">Export</Button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-hidden p-0 md:p-4 bg-slate-50/50">
                    {currentData && currentData.length > 0 ? (
                        <DataTable 
                            data={currentData}
                            columns={columns}
                            keyField="id" 
                            rowsPerPage={15}
                            onRowClick={(item) => setSelectedRecord(item)}
                        />
                    ) : (
                        <div className="h-full">
                            <EmptyGrid 
                                title={`${entityLabel} Registry Null`}
                                description={`No master records identified for the ${activeDomain} domain in the current data partition.`}
                                icon={Database}
                                actionLabel={`Register New ${entityLabel.replace(/s$/, '')}`}
                                onAdd={() => {}} // CRUD action path
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Record Inspector Panel */}
            <SidePanel
                isOpen={!!selectedRecord}
                onClose={() => setSelectedRecord(null)}
                title={<div className="flex items-center gap-2 font-black text-sm uppercase tracking-widest"><FileJson size={18} className="text-nexus-500"/> Data Inspector</div>}
                width="md:w-[600px]"
                footer={<Button onClick={() => setSelectedRecord(null)}>Close Inspector</Button>}
            >
                <div className="space-y-6 animate-nexus-in">
                    <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 font-mono text-[11px] overflow-auto max-h-[70vh] shadow-2xl relative">
                        <div className="absolute top-3 right-4 flex gap-2">
                             <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                             <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                        <pre className="text-green-400 whitespace-pre-wrap leading-relaxed">
                            {JSON.stringify(selectedRecord, null, 2)}
                        </pre>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                        <p className="text-[10px] text-blue-700 font-black uppercase tracking-widest flex items-center gap-2">
                            <Shield size={12}/> Security Assertion
                        </p>
                        <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                            Raw entity representation from the immutable platform state. All modifications are logged in the global audit trail.
                        </p>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};
