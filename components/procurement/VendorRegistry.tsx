
import React, { useState, useDeferredValue, useMemo } from 'react';
import { useProcurementData } from '../../hooks';
import { Filter, ShieldCheck, AlertCircle, Ban, Plus, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { usePermissions } from '../../hooks/usePermissions';

interface VendorRegistryProps {
  projectId: string;
}

const VendorRegistry: React.FC<VendorRegistryProps> = ({ projectId }) => {
  const { vendors } = useProcurementData(projectId);
  const theme = useTheme();
  const { hasPermission } = usePermissions();
  const canEditProcurement = hasPermission('financials:write');
  
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'Preferred': return <Badge variant="success" icon={ShieldCheck}>Preferred</Badge>;
          case 'Blacklisted': return <Badge variant="danger" icon={Ban}>Blacklisted</Badge>;
          case 'Probationary': return <Badge variant="warning" icon={AlertCircle}>Probation</Badge>;
          default: return <Badge variant="neutral">{status}</Badge>;
      }
  };

  const handleRowClick = (vendorId: string) => {
      console.log('Selected vendor:', vendorId);
  };

  const filteredVendors = useMemo(() => {
    if (!deferredSearchTerm) return vendors;
    const term = deferredSearchTerm.toLowerCase();
    return vendors.filter(v => 
        v.name.toLowerCase().includes(term) ||
        v.category.toLowerCase().includes(term)
    );
  }, [vendors, deferredSearchTerm]);

  return (
    <div className="h-full flex flex-col">
        <div className={`p-4 ${theme.layout.headerBorder} ${theme.colors.background}/50 flex flex-col md:flex-row justify-between items-center gap-3`}>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <Input 
                    isSearch 
                    placeholder="Search vendors..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-64" 
                />
                <Button variant="secondary" size="md" icon={Filter} className="w-full md:w-auto">Status</Button>
            </div>
            {canEditProcurement ? (
                <Button variant="primary" size="md" icon={Plus} className="w-full md:w-auto">Add Vendor</Button>
            ) : (
                <div className={`flex items-center gap-2 text-xs ${theme.colors.text.tertiary} ${theme.colors.background} px-3 py-2 rounded-lg border ${theme.colors.border}`}>
                    <Lock size={14}/> Read Only
                </div>
            )}
        </div>
        <div className="flex-1 overflow-auto">
            <div className="min-w-[800px]">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className={`${theme.colors.background} sticky top-0`}>
                        <tr>
                            <th className={theme.components.table.header}>Vendor Name</th>
                            <th className={theme.components.table.header}>Category</th>
                            <th className={theme.components.table.header}>Status</th>
                            <th className={theme.components.table.header}>Performance</th>
                            <th className={theme.components.table.header}>Location</th>
                            <th className={theme.components.table.header}>Last Audit</th>
                        </tr>
                    </thead>
                    <tbody className={`${theme.colors.surface} divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                        {filteredVendors.map(v => (
                            <tr 
                                key={v.id} 
                                className={`${theme.components.table.row} cursor-pointer focus:bg-slate-50 outline-none`}
                                onClick={() => handleRowClick(v.id)}
                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleRowClick(v.id)}
                                tabIndex={0}
                                role="button"
                                aria-label={`View details for ${v.name}`}
                            >
                                <td className={theme.components.table.cell}>
                                    <div className={`text-sm font-medium ${theme.colors.text.primary}`}>{v.name}</div>
                                    <div className={`text-xs ${theme.colors.text.secondary}`}>{v.contact.email}</div>
                                </td>
                                <td className={theme.components.table.cell}>{v.category}</td>
                                <td className={theme.components.table.cell}>{getStatusBadge(v.status)}</td>
                                <td className={theme.components.table.cell}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-16 h-2 ${theme.colors.background} rounded-full overflow-hidden`}>
                                            <div className={`h-full ${v.performanceScore > 80 ? 'bg-green-500' : v.performanceScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${v.performanceScore}%`}}></div>
                                        </div>
                                        <span className={`text-xs font-bold ${theme.colors.text.primary}`}>{v.performanceScore}</span>
                                    </div>
                                </td>
                                <td className={theme.components.table.cell}>{v.location || 'N/A'}</td>
                                <td className={theme.components.table.cell}>{v.lastAudit || 'Never'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};
export default VendorRegistry;
