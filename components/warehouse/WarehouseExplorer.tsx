
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Search, Download, Database, ChevronRight, Table, FileJson, X, Eye, Filter } from 'lucide-react';
import { Button } from '../ui/Button';
import DataTable from '../common/DataTable';
import { Input } from '../ui/Input';
import { SidePanel } from '../ui/SidePanel';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

type Domain = 'Strategy & Portfolio' | 'Program Mgmt' | 'Project Controls' | 'Financials' | 'Resources & Supply' | 'Field Ops' | 'Configuration' | 'Unifier / BP';

const DOMAIN_MAP: Record<Domain, string[]> = {
    'Strategy & Portfolio': [
        'projects', 'programs', 'strategicGoals', 'strategicDrivers', 'portfolioScenarios', 
        'governanceDecisions', 'esgMetrics', 'portfolioRisks', 'roadmapLanes', 'roadmapItems', 'benefits'
    ],
    'Program Mgmt': [
        'programObjectives', 'programOutcomes', 'programDependencies', 'programChangeRequests', 
        'programRisks', 'programIssues', 'programStakeholders', 'programCommunicationPlan', 
        'programAllocations', 'programFundingGates', 'programStageGates', 'programTransitionItems', 
        'integratedChanges', 'governanceRoles', 'governanceEvents', 'tradeoffScenarios',
        'programQualityStandards', 'programAssuranceReviews', 'programArchitectureStandards', 'programArchitectureReviews'
    ],
    'Project Controls': [
        'risks', 'issues', 'communicationLogs', 'documents', 'kanbanTasks', 'qualityReports', 'nonConformanceReports'
    ],
    'Financials': [
        'budgetItems', 'expenses', 'changeOrders', 'purchaseOrders', 'invoices', 
        'contracts', 'solicitations', 'procurementPlans', 'procurementPackages', 
        'supplierReviews', 'claims', 'makeOrBuyAnalysis', 'fundingSources', 
        'costBook', 'expenseCategories'
    ],
    'Resources & Supply': [
        'resources', 'resourceRequests', 'users', 'roles', 'skills', 'timesheets', 'vendors'
    ],
    'Field Ops': [
        'dailyLogs', 'safetyIncidents', 'punchList'
    ],
    'Configuration': [
        'eps', 'obs', 'locations', 'calendars', 'activityCodes', 'userDefinedFields', 
        'standardTemplates', 'workflows', 'dataJobs', 'integrations', 'extensions', 
        'etlMappings', 'globalChangeRules', 'issueCodes', 'rbs',
        'governance.alerts', 'governance.auditLog', 'staging.records'
    ],
    'Unifier / BP': [
        'unifier.records', 'unifier.definitions', 'unifier.costSheet.rows'
    ]
};

// Helper to access nested state like 'unifier.records'
const resolvePath = (object: any, path: string) => {
    return path.split('.').reduce((o, p) => (o ? o[p] : []), object);
};

export const WarehouseExplorer: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    
    const [activeDomain, setActiveDomain] = useState<Domain>('Strategy & Portfolio');
    const [activeEntity, setActiveEntity] = useState<string>('projects');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

    // Dynamic Data Resolution
    const rawData = useMemo(() => resolvePath(state, activeEntity), [state, activeEntity]);
    const currentData = Array.isArray(rawData) ? rawData : [];

    // Dynamic Column Generation
    const columns = useMemo(() => {
        if (!currentData || currentData.length === 0) return [];
        
        // Take first item to sniff schema
        const sample = currentData[0];
        // Filter out complex objects/arrays for the grid view to keep it clean
        const keys = Object.keys(sample).filter(k => 
            typeof sample[k] !== 'object' || sample[k] === null || (Array.isArray(sample[k]) && sample[k].length === 0)
        ).slice(0, 6); 

        // Always ensure ID and Name/Title are first if they exist
        const prioritizedKeys = [
            ...keys.filter(k => ['id', 'code'].includes(k.toLowerCase())),
            ...keys.filter(k => ['name', 'title', 'description'].includes(k.toLowerCase())),
            ...keys.filter(k => !['id', 'code', 'name', 'title', 'description'].includes(k.toLowerCase()))
        ].slice(0, 6);

        // Add an "Inspect" column
        const gridCols = prioritizedKeys.map(key => ({
            key,
            header: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            sortable: true,
            render: (item: any) => {
                const val = item[key];
                
                // Smart Rendering based on key/value characteristics
                if (typeof val === 'number') {
                    if (key.toLowerCase().includes('budget') || key.toLowerCase().includes('cost') || key.toLowerCase().includes('amount') || key.toLowerCase().includes('price')) {
                        return <span className="font-mono text-nexus-700">{formatCurrency(val)}</span>;
                    }
                    return <span className="font-mono">{val}</span>;
                }
                
                if (typeof val === 'string') {
                    // Date detection
                    if (val.match(/^\d{4}-\d{2}-\d{2}/)) {
                        return <span className="text-slate-500 text-xs">{val.split('T')[0]}</span>;
                    }
                    // Status detection
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
    }, [currentData]);

    const filteredData = useMemo(() => {
        if (!currentData) return [];
        if (!searchTerm) return currentData;
        const lowerTerm = searchTerm.toLowerCase();
        return currentData.filter(item => 
            Object.values(item).some(val => 
                String(val).toLowerCase().includes(lowerTerm)
            )
        );
    }, [currentData, searchTerm]);

    return (
        <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
            {/* Mobile Navigation Controls */}
            <div className="md:hidden p-3 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-3 shrink-0">
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Domain</label>
                    <div className="relative">
                         <select 
                            className="w-full p-2 pl-3 pr-6 text-sm border border-slate-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-nexus-500 outline-none text-slate-700 font-medium"
                            value={activeDomain}
                            onChange={(e) => {
                                const newDomain = e.target.value as Domain;
                                setActiveDomain(newDomain);
                                setActiveEntity(DOMAIN_MAP[newDomain][0]);
                            }}
                         >
                            {Object.keys(DOMAIN_MAP).map(d => <option key={d} value={d}>{d}</option>)}
                         </select>
                         <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" size={14} />
                    </div>
                </div>
                <div className="flex flex-col">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Table</label>
                     <div className="relative">
                         <select
                            className="w-full p-2 pl-3 pr-8 text-sm border border-slate-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-nexus-500 outline-none text-slate-700 font-medium"
                            value={activeEntity}
                            onChange={(e) => setActiveEntity(e.target.value)}
                         >
                            {DOMAIN_MAP[activeDomain].map(e => (
                                <option key={e} value={e}>{e.split('.').pop()?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</option>
                            ))}
                         </select>
                         <Table className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                     </div>
                </div>
            </div>

            {/* Desktop Sidebar Navigation */}
            <div className={`hidden md:flex w-64 border-r ${theme.colors.border} bg-slate-50 flex-col`}>
                <div className="p-4 border-b border-slate-200">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Data Domains</h3>
                    <div className="space-y-1">
                        {(Object.keys(DOMAIN_MAP) as Domain[]).map(domain => (
                            <button
                                key={domain}
                                onClick={() => { setActiveDomain(domain); setActiveEntity(DOMAIN_MAP[domain][0]); }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                                    activeDomain === domain ? 'bg-white text-nexus-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'
                                }`}
                            >
                                {domain}
                                {activeDomain === domain && <ChevronRight size={14} />}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                    <h4 className="px-2 text-[10px] font-bold text-slate-400 uppercase mb-2 mt-2">Tables</h4>
                    {DOMAIN_MAP[activeDomain].map(entity => (
                        <button
                            key={entity}
                            onClick={() => setActiveEntity(entity)}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium mb-1 transition-colors flex items-center gap-2 ${
                                activeEntity === entity ? 'bg-nexus-50 text-nexus-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <Table size={12}/>
                            <span className="truncate" title={entity}>{entity.split('.').pop()?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                        </button>
                    ))}
                </div>
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
