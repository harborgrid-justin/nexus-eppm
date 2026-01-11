
import React, { useState, useDeferredValue, useMemo } from 'react';
import { useProcurementData } from '../../hooks/index';
import { useData } from '../../context/DataContext';
import { Filter, ShieldCheck, AlertCircle, Ban, Plus, Lock, Search, Briefcase, Store, Edit2, Trash2, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SidePanel } from '../ui/SidePanel';
import { usePermissions } from '../../hooks/usePermissions';
import { EmptyGrid } from '../common/EmptyGrid';
import DataTable from '../common/DataTable';
// Corrected import path for Column and Vendor from types
import { Vendor, Column } from '../../types/index';
import { generateId } from '../../utils/formatters';

interface VendorRegistryProps {
  projectId: string;
}

interface EnrichedVendor extends Vendor {
    activeContracts: number;
}

const VendorRegistry: React.FC<VendorRegistryProps> = ({ projectId }) => {
  const { vendors } = useProcurementData(projectId);
  const { state, dispatch } = useData();
  const theme = useTheme();
  const { hasPermission } = usePermissions();
  const canEditProcurement = hasPermission('financials:write');
  
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [statusFilter, setStatusFilter] = useState('All');

  // Form State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Partial<Vendor>>({});

  const handleRowClick = (vendor: EnrichedVendor) => {
      // Future: Navigate to vendor detail
  };

  const filteredVendors = useMemo(() => {
    let list = vendors;
    
    if (deferredSearchTerm) {
        const term = deferredSearchTerm.toLowerCase();
        list = list.filter(v => 
            v.name.toLowerCase().includes(term) ||
            v.category.toLowerCase().includes(term)
        );
    }
    
    if (statusFilter !== 'All') {
        list = list.filter(v => v.status === statusFilter);
    }
    
    return list.map(v => ({
        ...v,
        activeContracts: state.contracts.filter(c => c.vendorId === v.id && c.status === 'Active').length
    })) as EnrichedVendor[];
  }, [vendors, deferredSearchTerm, state.contracts, statusFilter]);

  const handleOpenPanel = (vendor?: Vendor) => {
      setEditingVendor(vendor ? { ...vendor } : { name: '', category: 'Materials', status: 'Approved', riskLevel: 'Low', performanceScore: 80, contact: { name: '', email: '', phone: '' }, location: '' });
      setIsPanelOpen(true);
  };

  const handleSave = () => {
      if (!editingVendor.name) return;
      const vendorToSave: Vendor = {
          id: editingVendor.id || generateId('V'),
          ...editingVendor
      } as Vendor;
      
      dispatch({ 
          type: 'UPDATE_VENDOR', 
          payload: vendorToSave 
      });
      setIsPanelOpen(false);
  };

  const handleDelete = (id: string) => {
      if (confirm("Delete this vendor? This will affect linked contracts.")) {
          dispatch({ type: 'DELETE_VENDOR', payload: id });
      }
  };

  const columns = useMemo<Column<EnrichedVendor>[]>(() => [
    {
        key: 'name', header: 'Vendor Name', sortable: true,
        render: (v) => (
            <div>
                <div className={`text-sm font-medium ${theme.colors.text.primary}`}>{v.name}</div>
                <div className={`text-xs ${theme.colors.text.secondary}`}>{v.contact.email}</div>
            </div>
        )
    },
    { key: 'category', header: 'Category', sortable: true },
    {
        key: 'status', header: 'Status', sortable: true,
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
        key: 'activeContracts', header: 'Active Contracts', align: 'center', sortable: true,
        render: (v) => v.activeContracts > 0 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                <Briefcase size={10} /> {v.activeContracts}
            </span>
        ) : <span className="text-slate-400 text-xs">-</span>
    },
    {
        key: 'performanceScore', header: 'Performance', sortable: true,
        render: (v) => (
            <div className="flex items-center gap-2">
                <div className={`w-16 h-2 ${theme.colors.background} rounded-full overflow-hidden border ${theme.colors.border}`}>
                    <div className={`h-full ${v.performanceScore > 80 ? 'bg-green-500' : v.performanceScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${v.performanceScore}%`}}></div>
                </div>
                <span className={`text-xs font-bold ${theme.colors.text.primary}`}>{v.performanceScore}</span>
            </div>
        )
    },
    {
        key: 'id', header: 'Actions', align: 'right',
        render: (v) => canEditProcurement ? (
            <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); handleOpenPanel(v); }} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Edit2 size={14}/></button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(v.id); }} className="p-1 hover:bg-red-50 rounded text-red-500"><Trash2 size={14}/></button>
            </div>
        ) : null
    }
  ], [theme, canEditProcurement]);

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
                <Button variant="primary" size="md" icon={Plus} className="w-full md:w-auto" onClick={() => handleOpenPanel()}>Add Vendor</Button>
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
                        onAdd={canEditProcurement ? () => handleOpenPanel() : undefined}
                        actionLabel="Register Vendor"
                        icon={Store}
                     />
                 </div>
            )}
        </div>

        <SidePanel
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            title={editingVendor.id ? "Edit Vendor Profile" : "Register Vendor"}
            width="md:w-[500px]"
            footer={<><Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button><Button onClick={handleSave} icon={Save}>Save Vendor</Button></>}
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
                    <Input value={editingVendor.name} onChange={e => setEditingVendor({...editingVendor, name: e.target.value})} placeholder="e.g. Acme Corp" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                        <select className="w-full p-2.5 border rounded-lg text-sm bg-white" value={editingVendor.category} onChange={e => setEditingVendor({...editingVendor, category: e.target.value})}>
                            <option>Materials</option><option>Equipment</option><option>Subcontractor</option><option>Services</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                        <select className="w-full p-2.5 border rounded-lg text-sm bg-white" value={editingVendor.status} onChange={e => setEditingVendor({...editingVendor, status: e.target.value})}>
                            <option>Approved</option><option>Preferred</option><option>Probationary</option><option>Blacklisted</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact Information</label>
                    <div className="space-y-2">
                        <Input placeholder="Contact Name" value={editingVendor.contact?.name} onChange={e => setEditingVendor({...editingVendor, contact: { ...editingVendor.contact!, name: e.target.value }})} />
                        <Input placeholder="Email" value={editingVendor.contact?.email} onChange={e => setEditingVendor({...editingVendor, contact: { ...editingVendor.contact!, email: e.target.value }})} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Risk Level</label>
                        <select className="w-full p-2.5 border rounded-lg text-sm bg-white" value={editingVendor.riskLevel} onChange={e => setEditingVendor({...editingVendor, riskLevel: e.target.value})}>
                            <option>Low</option><option>Medium</option><option>High</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Performance (0-100)</label>
                        <Input type="number" value={editingVendor.performanceScore} onChange={e => setEditingVendor({...editingVendor, performanceScore: parseInt(e.target.value)})} />
                    </div>
                </div>
            </div>
        </SidePanel>
    </div>
  );
};
export default VendorRegistry;
