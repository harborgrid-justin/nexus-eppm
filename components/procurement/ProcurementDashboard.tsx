import React, { useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import StatCard from '../shared/StatCard';
import { DollarSign, Briefcase, AlertTriangle, CheckCircle, Activity, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';
import { CustomBarChart } from '../charts/CustomBarChart';
import { useData } from '../../context/DataContext';

const ProcurementDashboard: React.FC = () => {
  const { purchaseOrders, project } = useProjectWorkspace();
  const { state } = useData(); 
  const theme = useTheme();

  const metrics = useMemo(() => {
    if (!project) return null;
    
    const projectContracts = state.contracts.filter(c => c.projectId === project.id);
    const projectClaims = state.claims.filter(c => c.projectId === project.id);
    
    const totalContractValue = projectContracts.reduce((sum, c) => sum + c.contractValue, 0);
    const totalPOSpend = (purchaseOrders || []).reduce((sum, po) => sum + po.amount, 0);
    const activeContracts = projectContracts.filter(c => c.status === 'Active').length;
    const openClaims = projectClaims.filter(c => c.status === 'Open' || c.status === 'Under Review').length;

    // Aggregate spend by Vendor for this project
    const vendorSpendMap: Record<string, number> = {};
    projectContracts.forEach(c => {
        vendorSpendMap[c.vendorId] = (vendorSpendMap[c.vendorId] || 0) + c.contractValue;
    });

    const spendData = Object.entries(vendorSpendMap)
        .map(([id, val]) => {
            const vendor = state.vendors.find(v => v.id === id);
            return {
                name: vendor ? vendor.name : id,
                val
            };
        })
        .sort((a, b) => b.val - a.val)
        .slice(0, 10);

    return { totalContractValue, totalPOSpend, activeContracts, openClaims, spendData };
  }, [state.contracts, purchaseOrders, state.claims, state.vendors, project]);

  if (!metrics) return null;

  return (
    <div className={`h-full overflow-y-auto p-8 space-y-8 animate-in fade-in duration-500 scrollbar-thin`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                title="Committed Capital" 
                value={formatCompactCurrency(metrics.totalContractValue)} 
                subtext="Total Contract Value" 
                icon={DollarSign} 
            />
            <StatCard 
                title="Active Contracts" 
                value={metrics.activeContracts} 
                subtext="Execution phase" 
                icon={Briefcase} 
                trend="up"
            />
            <StatCard 
                title="PO Authorization" 
                value={formatCompactCurrency(metrics.totalPOSpend)} 
                subtext="Issued against baseline" 
                icon={CheckCircle} 
            />
            <StatCard 
                title="Commercial Risk" 
                value={metrics.openClaims} 
                subtext="Active disputes" 
                icon={AlertTriangle} 
                trend={metrics.openClaims > 0 ? 'down' : 'up'} 
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-200 p-8 flex flex-col h-[400px] shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2 border-b pb-4">
                    <Activity size={16} className="text-nexus-600"/> Strategic Partner Exposure
                </h3>
                <div className="flex-1 min-h-0">
                    {metrics.spendData.length > 0 ? (
                        <CustomBarChart 
                            data={metrics.spendData}
                            xAxisKey="name"
                            dataKey="val"
                            height={280}
                            barColor={theme.charts.palette[0]}
                            formatTooltip={(val) => formatCompactCurrency(val)}
                        />
                    ) : (
                        <div className="h-full nexus-empty-pattern rounded-2xl flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                            No procurement data available for analysis.
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex flex-col gap-6">
                <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] relative overflow-hidden flex-1 shadow-2xl border-0">
                    <div className="relative z-10">
                        <h4 className="font-black text-[10px] uppercase tracking-widest text-nexus-400 mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
                            <ShieldCheck size={16} /> Compliance Pulse
                        </h4>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 font-bold uppercase">Lien Waivers</span>
                                <span className="text-green-400 font-black">100% Valid</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 font-bold uppercase">Insurance Exp.</span>
                                <span className="text-yellow-400 font-black">2 Renewals</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 font-bold uppercase">Vendor Diversity</span>
                                <span className="text-blue-400 font-black">12% MBE/WBE</span>
                            </div>
                        </div>
                    </div>
                    <Briefcase size={200} className="absolute -right-16 -bottom-16 opacity-5 text-white pointer-events-none rotate-12" />
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProcurementDashboard;