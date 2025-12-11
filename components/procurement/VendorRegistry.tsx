import React from 'react';
import { useProcurementData } from '../../hooks';
import { Search, Filter, ShieldCheck, AlertCircle, Ban, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface VendorRegistryProps {
  projectId: string;
}

const VendorRegistry: React.FC<VendorRegistryProps> = ({ projectId }) => {
  const { vendors } = useProcurementData(projectId);
  const theme = useTheme();

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'Preferred': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><ShieldCheck size={12}/> Preferred</span>;
          case 'Blacklisted': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><Ban size={12}/> Blacklisted</span>;
          case 'Probationary': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><AlertCircle size={12}/> Probation</span>;
          default: return <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold">{status}</span>;
      }
  };

  return (
    <div className="h-full flex flex-col">
        <div className={`p-4 ${theme.layout.headerBorder} ${theme.colors.background}/50 flex justify-between items-center`}>
            <div className="flex gap-2">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Search vendors..." className="pl-9 pr-4 py-1.5 border border-slate-300 rounded-md text-sm w-64 focus:outline-none focus:ring-1 focus:ring-nexus-500" />
                </div>
                <button className="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm flex items-center gap-2 hover:bg-slate-50 text-slate-700"><Filter size={14}/> Status</button>
            </div>
            <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-nexus-700 shadow-sm`}>
                <Plus size={16} /> Add Vendor
            </button>
        </div>
        <div className="flex-1 overflow-auto">
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
  );
};

export default VendorRegistry;
