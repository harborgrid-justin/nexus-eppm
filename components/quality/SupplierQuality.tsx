
import React from 'react';
import { Truck, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

const SupplierQuality: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const vendors = state.vendors;
    const allNCRs = state.nonConformanceReports;

    return (
        <div className="h-full flex flex-col">
            <div className={`p-4 ${theme.layout.headerBorder} flex-shrink-0 flex items-center justify-between`}>
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    <Truck size={16} /> Supplier & Material Quality
                </h3>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search suppliers..." className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-nexus-500" />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className={`${theme.colors.background} sticky top-0`}>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Supplier Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Performance Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Open NCRs</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Audit</th>
                        </tr>
                    </thead>
                    <tbody className={`${theme.colors.surface} divide-y divide-slate-100`}>
                        {vendors.map(vendor => {
                            const ncrCount = allNCRs.filter(ncr => ncr.vendorId === vendor.id && ncr.status !== 'Closed').length;
                            return (
                                <tr key={vendor.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{vendor.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{vendor.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div className={`h-full ${vendor.performanceScore > 80 ? 'bg-green-500' : vendor.performanceScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${vendor.performanceScore}%`}}></div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-700">{vendor.performanceScore}</span>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${ncrCount > 0 ? 'text-red-600' : 'text-slate-600'}`}>{ncrCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{vendor.lastAudit || 'Never'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SupplierQuality;
