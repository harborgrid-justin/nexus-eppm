
import React from 'react';
import { useProcurementData } from '../../hooks';
import { Filter, ShieldCheck, AlertCircle, Plus, Lock, XCircle } from 'lucide-react';
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

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'Preferred': return <Badge variant="success" icon={ShieldCheck}>Preferred</Badge>;
          case 'Blacklisted': return <Badge variant="danger" icon={XCircle}>Blacklisted</Badge>;
          case 'Probationary': return <Badge variant="warning" icon={AlertCircle}>Probation</Badge>;
          default: return <Badge variant="neutral">{status}</Badge>;
      }
  };

  return (
    <div className="h-full flex flex-col">
        <div className={`p-4 ${theme.layout.headerBorder} ${theme.colors.background}/50 flex flex-col md:flex-row justify-between items-center gap-3`}>
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <Input isSearch placeholder="Search vendors..." className="w-full md:w-64" />
                <Button variant="secondary" size="md" icon={Filter} className="w-full md:w-auto">Status</Button>
            </div>
            {canEditProcurement ? (
                <Button variant="primary" size="md" icon={Plus} className="w-full md:w-auto">Add Vendor</Button>
            ) : (
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                    <Lock size={14}/> Read Only
                </div>
            )}
        </div>
        <div className="flex-1 overflow-auto">
            <div className="min-w-[800px]">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className={`${theme.colors.background} sticky top-0`}>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vendor Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Performance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Audit</th>
                        </tr>
                    </thead>
                    <tbody className={`${theme.colors.surface} divide-y divide-slate-100`}>
                        {vendors.map(v => (
                            <tr key={v.id} className="hover:bg-slate-50 cursor-pointer">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-slate-900">{v.name}</div>
                                    <div className="text-xs text-slate-500">{v.contact.email}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{v.category}</td>
                                <td className="px-6 py-4">{getStatusBadge(v.status)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div className={`h-full ${v.performanceScore > 80 ? 'bg-green-500' : v.performanceScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${v.performanceScore}%`}}></div>
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">{v.performanceScore}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{v.location || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{v.lastAudit || 'Never'}</td>
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