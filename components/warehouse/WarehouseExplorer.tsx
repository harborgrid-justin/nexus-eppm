

import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Database, ChevronRight, Table, FileJson, X, Eye, Filter, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import DataTable, { Column } from '../common/DataTable';
import { Input } from '../ui/Input';
import { SidePanel } from '../ui/SidePanel';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '../ui/Badge';
import { useWarehouseExplorerLogic } from '../../hooks/domain/useWarehouseExplorerLogic';

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
            ...keys.filter(k => ['id', 'code'].includes(k.toLowerCase())),
            ...keys.filter(k => ['name', 'title', 'description'].includes(k.toLowerCase())),
            ...keys.filter(k => !['id', 'code', 'name', 'title', 'description'].includes(k.toLowerCase()))
        ].slice(0, 6);

        const gridCols = prioritizedKeys.map(key => ({
            key,
            header: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase()),
            sortable: true,
            render: (item: any) => {
                const val = item[key];
                
                if (typeof val === 'number') {
                    if (key.toLowerCase().includes('budget') || key.toLowerCase().includes('cost') || key.toLowerCase().includes('amount') || key.toLowerCase().includes('price')) {
                        return <span className="font-mono text-nexus-700">{formatCurrency(val)}</span>;
                    }
                    return <span className="font-mono">{val}</span>;
                }
                
                if (typeof val === 'string') {
                    if (val.match(/^\d{4}-\d{2}-\d{2}/)) {
                        return <span className="text-slate-500 text-xs">{val.split('T')[0]}</span>;
                    }
                    if (key.toLowerCase() === 'status' || key.toLowerCase() === 'health' || key.toLowerCase() === 'priority') {
                         let variant: any = 'neutral';
                         const v = val.toLowerCase();
                         if (['active', 'approved', 'open', 'good', 'completed'].includes(v)) variant = 'success';
                         else if (['warning', 'pending', 'draft', 'medium'].includes(v)) variant = 'warning';
                         else if (['critical', 'rejected', 'error', 'failed', 'high'].includes(v)) variant = 'danger';
                         
                         return <Badge variant={variant}>{val}</Badge>;
                    }
                }
                
                return <span className="truncate block max-w-xs" title={String(val)}>{String(val ?? '-')}</span>;
            }
        }));

        gridCols.push({
            key: '__actions__',
            header: '',
            sortable: false,
            render: (item: any) => (
                <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedRecord(item); }}
                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-nexus-600"
                    title="View Raw Data"
                >
                    <Eye size={14}/>
                </button>
            )
        });

        return gridCols;
    }, [currentData, theme]);

    return (
        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
            {/* Desktop Sidebar Navigation */}
            <div className={`hidden md:flex w-64 border-r ${theme.colors.border} bg-slate-50 flex-col`}>
                <div className="p-4 border-b border-slate-200">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Data Domains</h3>
                    <div className="space-y-1">
                        {(Object.keys(DOMAIN_MAP) as (keyof typeof DOMAIN_MAP)[]).map(domain => {
                            const Icon = DOMAIN_MAP[domain].icon;
                            return (
                                <button
                                    key={domain}
                                    onClick={() => handleDomainChange(domain)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                                        activeDomain === domain ? 'bg-white text-nexus-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="flex items-center gap-2"><Icon size={14}/>{domain}</span>
                                    {activeDomain === domain && <ChevronRight size={14} />}
                                </button>
                            );
                        })}
                    </div>
                </div>
                {activeDomain && (
                    <div className="flex-1 overflow-y-auto p-2">
                        <h4 className="px-2 text-[10px] font-bold text-slate-400 uppercase mb-2 mt-2">Tables</h4>
                        {DOMAIN_MAP[activeDomain].entities.map(entity => (
                            <button
                                key={entity}
                                onClick={() => setActiveEntity(entity)}
                                className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium mb-1 transition-colors flex items-center gap-2 ${
                                    activeEntity === entity ? 'bg-nexus-50 text-nexus-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <Table size={12}/>
                                <span className="truncate" title={entity}>{entity.split('.').pop()?.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase())}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Grid Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white h-full overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white shadow-sm z-10 gap-3">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                         <div className="p-2 bg-nexus-50 text-nexus-600 rounded-lg shrink-0">
                            <Database size={18}/>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-slate-800 text-sm capitalize truncate">{activeEntity.split('.').pop()?.replace(/([A-Z])/g, ' $1')}</h3>
                            <p className="text-xs text-slate-500 font-mono hidden sm:block">path: state.{activeEntity}</p>
                        </div>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold ml-2 shrink-0">{currentData?.length || 0}</span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Input isSearch placeholder="Search records..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-64" />
                        <Button variant="outline" size="sm" icon={Download} className="shrink-0">Export</Button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-hidden p-0 md:p-4 bg-slate-50/30">
                    {currentData && currentData.length > 0 ? (
                        <DataTable 
                            data={filteredData}
                            columns={columns}
                            keyField="id" 
                            rowsPerPage={15}
                            onRowClick={(item) => setSelectedRecord(item)}
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <Database size={48} className="mb-4 opacity-20"/>
                            <p className="text-sm font-medium">No records found in this table.</p>
                            <p className="text-xs mt-1 opacity-70">Initialize data or check configuration.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Record Inspector Panel */}
            <SidePanel
                isOpen={!!selectedRecord}
                onClose={() => setSelectedRecord(null)}
                title={<div className="flex items-center gap-2"><FileJson size={18} className="text-nexus-500"/> Record Inspector</div>}
                width="md:w-[600px]"
                footer={<Button onClick={() => setSelectedRecord(null)}>Close</Button>}
            >
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs overflow-auto max-h-[70vh]">
                        <pre className="text-slate-700 whitespace-pre-wrap">
                            {JSON.stringify(selectedRecord, null, 2)}
                        </pre>
                    </div>
                    <div className="text-xs text-slate-400 italic">
                        Raw JSON representation from application state.
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};