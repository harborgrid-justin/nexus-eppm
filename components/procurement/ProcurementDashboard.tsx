import React from 'react';
import { useProcurementData } from '../../hooks';
import StatCard from '../shared/StatCard';
import { DollarSign, Briefcase, AlertTriangle, CheckCircle, BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';
import { CustomBarChart } from '../charts/CustomBarChart';

interface ProcurementDashboardProps {
  projectId: string;
}

const ProcurementDashboard: React.FC<ProcurementDashboardProps> = ({ projectId }) => {
  const { projectContracts, projectPOs, projectClaims } = useProcurementData(projectId);
  const theme = useTheme();

  const totalContractValue = projectContracts.reduce((sum, c) => sum + c.contractValue, 0);
  const totalPOSpend = projectPOs.reduce((sum, po) => sum + po.amount, 0);
  const activeContracts = projectContracts.filter(c => c.status === 'Active').length;
  const openClaims = projectClaims.filter(c => c.status === 'Open' || c.status === 'Under Review').length;

  const spendData = projectContracts.map(c => ({
      name: c.vendorId, // Simplified for mock
      val: c.contractValue
  }));

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard title="Committed Spend" value={formatCompactCurrency(totalContractValue)} subtext="Total Contract Value" icon={DollarSign} />
            <StatCard title="Active Contracts" value={activeContracts} subtext="Currently in execution" icon={Briefcase} />
            <StatCard title="PO Spend" value={formatCompactCurrency(totalPOSpend)} subtext="Issued against contracts" icon={CheckCircle} />
            <StatCard title="Open Claims" value={openClaims} subtext="Disputes requiring attention" icon={AlertTriangle} trend={openClaims > 0 ? 'down' : undefined} />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className={`${theme.typography.h3} mb-4`}>Contract Value Distribution</h3>
                <CustomBarChart 
                    data={spendData}
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