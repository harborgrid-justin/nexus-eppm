
import React from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Truck, Award, DollarSign, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';
import StatCard from '../shared/StatCard';
import { EmptyGrid } from '../common/EmptyGrid';

interface ProgramVendorsProps {
  programId: string;
}

const ProgramVendors: React.FC<ProgramVendorsProps> = ({ programId }) => {
  const { programVendors } = useProgramData(programId);
  const theme = useTheme();

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Truck className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Strategic Partner & Contract Management</h2>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
            <StatCard title="Active Strategic Vendors" value={programVendors.length} icon={Truck} />
            <StatCard title="Total Contract Value" value={formatCompactCurrency(programVendors.reduce((s, v) => s + v.totalContractValue, 0))} icon={DollarSign} />
            <StatCard title="Critical Vendor Issues" value={programVendors.reduce((s, v) => s + v.criticalIssuesCount, 0)} icon={AlertTriangle} trend={programVendors.some(v => v.criticalIssuesCount > 0) ? 'down' : undefined} />
        </div>

        <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col min-h-[400px]`}>
            <div className="p-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Award size={18} className="text-nexus-500"/> Vendor Performance Scorecard</h3>
            </div>
            <div className="flex-1 overflow-x-auto">
                {programVendors.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Vendor Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Strategic Alignment</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total Value</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Active Contracts</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Performance Score</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Issues</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {programVendors.map(vendor => (
                                <tr key={vendor.vendorId} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-sm text-slate-900">{vendor.name}</div>
                                        <div className="text-xs text-slate-500 font-mono">{vendor.vendorId}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full font-bold ${
                                            vendor.strategicAlignment === 'High' ? 'bg-purple-100 text-purple-700' : 
                                            vendor.strategicAlignment === 'Medium' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                        }`}>{vendor.strategicAlignment}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-sm text-slate-700">
                                        {formatCompactCurrency(vendor.totalContractValue)}
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm font-bold text-slate-600">
                                        {vendor.activeContractsCount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${vendor.avgPerformanceScore > 80 ? 'bg-green-500' : vendor.avgPerformanceScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                                    style={{width: `${vendor.avgPerformanceScore}%`}}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-bold">{vendor.avgPerformanceScore}/100</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {vendor.criticalIssuesCount > 0 ? (
                                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                                                {vendor.criticalIssuesCount}
                                            </span>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="h-full">
                         <EmptyGrid 
                            title="Vendor Registry Isolated"
                            description="No cross-project vendors identified for this program scope. Authorize a contract to aggregate supplier data."
                            icon={Truck}
                        />
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ProgramVendors;
