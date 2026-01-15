
import React from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Truck, Award, DollarSign, AlertTriangle, Layers } from 'lucide-react';
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

  const totalValue = programVendors.reduce((s, v) => s + (v.totalContractValue || 0), 0);
  const issueCount = programVendors.reduce((s, v) => s + (v.criticalIssuesCount || 0), 0);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300 scrollbar-thin`}>
        <div className="flex items-center gap-2 mb-2">
            <Truck className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Strategic Partner & Contract Oversight</h2>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
            <StatCard title="Active Vendors" value={programVendors.length} subtext="Direct Program Allotment" icon={Truck} />
            <StatCard title="Total Committed Value" value={formatCompactCurrency(totalValue)} icon={DollarSign} />
            <StatCard title="Partner Exceptions" value={issueCount} subtext="Critical Performance Alerts" icon={AlertTriangle} trend={issueCount > 0 ? 'down' : 'up'} />
        </div>

        <div className={`${theme.colors.surface} rounded-[2.5rem] border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col min-h-[450px]`}>
            <div className={`p-6 border-b ${theme.colors.border} bg-slate-50/50 flex justify-between items-center`}>
                <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Award size={18} className="text-nexus-500"/> Partner Performance Ledger
                </h3>
            </div>
            <div className="flex-1 overflow-x-auto scrollbar-thin">
                {programVendors.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                        <thead className="bg-white sticky top-0 z-10 shadow-sm border-b">
                            <tr>
                                <th className={theme.components.table.header + " pl-10"}>Partner Entity</th>
                                <th className={theme.components.table.header}>Strategic Posture</th>
                                <th className={theme.components.table.header + " text-right"}>Aggregated Value</th>
                                <th className={theme.components.table.header + " text-center"}>Commitments</th>
                                <th className={theme.components.table.header}>Quality Score</th>
                                <th className={theme.components.table.header + " pr-10 text-right"}>Alerts</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                            {programVendors.map(vendor => (
                                <tr key={vendor.vendorId} className="nexus-table-row transition-all group">
                                    <td className="px-6 py-5 pl-10">
                                        <div className={`font-black text-slate-800 text-sm uppercase tracking-tight`}>{vendor.name}</div>
                                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{vendor.vendorId}</div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-1 text-[9px] font-black uppercase rounded-lg border shadow-sm ${
                                            vendor.strategicAlignment === 'High' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                                            vendor.strategicAlignment === 'Medium' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'
                                        }`}>{vendor.strategicAlignment}</span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-mono font-black text-slate-700">
                                        {formatCompactCurrency(vendor.totalContractValue)}
                                    </td>
                                    <td className="px-6 py-5 text-center text-sm font-black text-slate-400">
                                        {vendor.activeContractsCount}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                                                <div 
                                                    className={`h-full transition-all duration-700 ${vendor.avgPerformanceScore > 80 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]' : vendor.avgPerformanceScore > 60 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                                    style={{width: `${vendor.avgPerformanceScore}%`}}
                                                ></div>
                                            </div>
                                            <span className={`text-[10px] font-black font-mono ${theme.colors.text.primary}`}>{vendor.avgPerformanceScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right pr-10">
                                        {vendor.criticalIssuesCount > 0 ? (
                                            <div className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-red-50 text-red-600 text-[10px] font-black border border-red-200 shadow-sm animate-pulse">
                                                {vendor.criticalIssuesCount}
                                            </div>
                                        ) : (
                                            <span className="text-slate-200 font-mono text-[10px]">0</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {/* Visual Pacing Rows */}
                            {[...Array(3)].map((_, i) => (
                                <tr key={`p-${i}`} className="nexus-empty-pattern opacity-10 h-12">
                                    <td colSpan={10}></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="h-full flex flex-col justify-center">
                         <EmptyGrid 
                            title="Vendor Stream Isolated"
                            description="No cross-project partners identified for this program context. Authorize a contract within a component project to aggregate supplier performance metrics."
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
