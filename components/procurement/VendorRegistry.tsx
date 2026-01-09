
import React, { useState, useDeferredValue, useMemo } from 'react';
import { useProcurementData } from '../../hooks/index';
import { useData } from '../../context/DataContext';
import { Filter, ShieldCheck, AlertCircle, Ban, Plus, Lock, Search, Briefcase, Store } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { usePermissions } from '../../hooks/usePermissions';
import { EmptyGrid } from '../common/EmptyGrid';
import DataTable, { Column } from '../common/DataTable';
import { Vendor } from '../../types';

interface VendorRegistryProps {
  projectId: string;
}

// Vendor type needs to be extended with activeContracts for display purposes in the useMemo below
interface EnrichedVendor extends Vendor {
    activeContracts: number;
}

const VendorRegistry: React.FC<VendorRegistryProps> = ({ projectId }) => {
  const { vendors } = useProcurementData(projectId);
  const { state } = useData();
  const theme = useTheme();
  const { hasPermission } = usePermissions();
  const canEditProcurement = hasPermission('financials:write');
  
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [statusFilter, setStatusFilter] = useState('All');

  const handleRowClick = (vendor: EnrichedVendor) => {
      console.log('Selected vendor:', vendor.id);
  };

  const filteredVendors = useMemo(() => {
    let list = vendors;
    
    // Apply Search
    if (deferredSearchTerm) {
        const term = deferredSearchTerm.toLowerCase();
        list = list.filter(v => 
            v.name.toLowerCase().includes(term) ||
            v.category.toLowerCase().includes(term)
        );
    }
    
    // Apply Status Filter
    if (statusFilter !== 'All') {
        list = list.filter(v => v.status === statusFilter);
    }
    
    // Enrich Data
    return list.map(v => ({
        ...v,
        activeContracts: state.contracts.filter(c => c.vendorId === v.id && c.status === 'Active').length
    })) as EnrichedVendor[];
  }, [vendors, deferredSearchTerm, state.contracts, statusFilter]);

  const handleAddVendor = () => {
      // In a real app, open modal
      console.log("Add vendor clicked");
  };

  const columns = useMemo<Column<EnrichedVendor>[]>(() => [
    {
        key: 'name',
        header: 'Vendor Name',
        sortable: true,
        render: (v) => (
            <div>
                <div className={`text-sm font-medium ${theme.colors.text.primary}`}>{v.name}</div>
                <div className={`text-xs ${theme.colors.text.secondary}`}>{v.contact.email}</div>
            </div>
        )
    },
    { key: 'category', header: 'Category', sortable: true },
    {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (v) => {
            switch(v.status) {
                case 'Preferred': return <Badge variant="success" icon={ShieldCheck}>Preferred</Badge>;
                case 'Blacklisted': return <Badge variant="danger" icon={Ban}>Blacklisted</Badge>;
                case 'Probationary': return <Badge variant="warning" icon={AlertCircle}>Probation</Badge>;
                default: return <Badge variant="neutral">{v.status}</Badge>;
            }
        }
    },
    {
        key: 'activeContracts',
        header: 'Active Contracts',
        align: 'center',
        sortable: true,
        render: (v) => v.activeContracts > 0 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                <Briefcase size={10} /> {v.activeContracts}
            </span>
        ) : <span className="text-slate-400 text-xs">-</span>
    },
    {
        key: 'performanceScore',
        header: 'Performance',
        sortable: true,
        render: (v) => (
            <div className="flex items-center gap-2">
                <div className={`w-16 h-2 ${theme.colors.background} rounded-full overflow-hidden border ${theme.colors.border}`}>
                    <div className={`h-full ${v.performanceScore > 80 ? 'bg-green-500' : v.performanceScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${v.performanceScore}%`}}></div>
                </div>
                <span className={`text-xs font-bold ${theme.colors.text.primary}`}>{v.performanceScore}</span>
            </div>
        )
    },
    { key: 'lastAudit', header: 'Last Audit', sortable: true, render: (v) => <span className="text-xs font-mono">{v.lastAudit || 'Never'}</span> }
  ], [theme]);

  return (
    <div className={`h-full flex flex-col ${theme.colors.background}`}>
        <div className={`p-4 ${theme.layout.headerBorder} ${theme.colors.surface} flex flex-col md:flex-row justify-between items-center gap-3 shadow-sm z-10`}>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input 
                        isSearch 
                        placeholder="Search vendors..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9" 
                    />
                </div>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    {['All', 'Preferred', 'Approved'].map(status => (
                        <button 
                            key={status} 
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${statusFilter === status ? 'bg-white shadow-sm text-nexus-700' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>
            {canEditProcurement ? (
                <Button variant="primary" size="md" icon={Plus} className="w-full md:w-auto" onClick={handleAddVendor}>Add Vendor</Button>
            ) : (
                <div className={`flex items-center gap-2 text-xs ${theme.colors.text.tertiary} ${theme.colors.background} px-3 py-2 rounded-lg border ${theme.colors.border}`}>
                    <Lock size={14}/> Read Only
                </div>
            )}
        </div>
        
        <div className="flex-1 overflow-hidden p-4">
            {filteredVendors.length > 0 ? (
                <DataTable
                    data={filteredVendors}
                    columns={columns}
                    keyField="id"
                    onRowClick={handleRowClick}
                    enableToolbar={true}
                    fileName={`project_${projectId}_vendors`}
                />
            ) : (
                 <div className="h-full flex items-center justify-center p-8">
                     <EmptyGrid 
                        title="Vendor Registry Empty" 
                        description={deferredSearchTerm ? `No vendors found matching "${deferredSearchTerm}".` : "No suppliers are currently registered in this project scope."}
                        onAdd={canEditProcurement ? handleAddVendor : undefined}
                        actionLabel="Register Vendor"
                        icon={Store}
                     />
                 </div>
            )}
        </div>
    </div>
  );
};
export default VendorRegistry;
