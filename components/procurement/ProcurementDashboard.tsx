
import React, { useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import StatCard from '../shared/StatCard';
import { DollarSign, Briefcase, AlertTriangle, CheckCircle, BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';
import { CustomBarChart } from '../charts/CustomBarChart';
import { useData } from '../../context/DataContext';

const ProcurementDashboard: React.FC = () => {
  const { purchaseOrders } = useProjectWorkspace();
  const { state } = useData(); // For contracts, claims which are not in workspace context yet
  const theme = useTheme();

  const metrics = useMemo(() => {
    const totalContractValue = state.contracts.reduce((sum, c) => sum + c.contractValue, 0);
    const totalPOSpend = purchaseOrders.reduce((sum, po) => sum + po.amount, 0);
    const activeContracts = state.contracts.filter(c => c.status === 'Active').length;
    const openClaims = state.claims.filter(c => c.status === 'Open' || c.status === 'Under Review').length;

    const spendData = state.contracts.map(c => ({
        name: c.vendorId, // Simplified for mock
        val: c.contractValue
    }));

    return { totalContractValue, totalPOSpend, activeContracts, openClaims, spendData };
  }, [state.contracts, purchaseOrders, state.claims]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard title="Committed Spend" value={formatCompactCurrency(metrics.totalContractValue)} subtext="Total Contract Value" icon={DollarSign} />
            <StatCard title="Active Contracts" value={metrics.activeContracts} subtext="Currently in execution" icon={Briefcase} />
            <StatCard title="PO Spend" value={formatCompactCurrency(metrics.totalPOSpend)} subtext="Issued against contracts" icon={CheckCircle} />
            <StatCard title="Open Claims" value={metrics.openClaims} subtext="Disputes requiring attention" icon={AlertTriangle} trend={metrics.openClaims > 0 ? 'down' : undefined} />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className={`${theme.typography.h3} mb-4`}>Contract Value Distribution</h3>
                <CustomBarChart 
                    data={metrics.spendData}
                    xAxisKey="name"
                    dataKey="val"
                    height={250}
                    formatTooltip={(val) => formatCompactCurrency(val)}
                />
            </div>
             <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm flex flex-col items-center justify-center text-slate-400`}>
                <BarChart2 size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">Additional Analysis</p>
                <p className="text-xs mt-1 text-center max-w-xs">Spend by Category, Vendor Performance Trends, and Cycle Time analysis available in the Analytics module.</p>
            </div>
        </div>
    </div>
  );
};

export default ProcurementDashboard;
