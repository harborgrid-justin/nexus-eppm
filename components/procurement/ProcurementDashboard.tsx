
import React from 'react';
import { useProcurementData } from '../../hooks/useProcurementData';
import StatCard from '../shared/StatCard';
import { DollarSign, Briefcase, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

interface ProcurementDashboardProps {
  projectId: string;
}

const ProcurementDashboard: React.FC<ProcurementDashboardProps> = ({ projectId }) => {
  const { projectContracts, projectPOs, projectClaims } = useProcurementData(projectId);

  const totalContractValue = projectContracts.reduce((sum, c) => sum + c.contractValue, 0);
  const totalPOSpend = projectPOs.reduce((sum, po) => sum + po.amount, 0);
  const activeContracts = projectContracts.filter(c => c.status === 'Active').length;
  const openClaims = projectClaims.filter(c => c.status === 'Open' || c.status === 'Under Review').length;

  const spendData = projectContracts.map(c => ({
      name: c.vendorId, // Simplified for mock
      val: c.contractValue
  }));

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Committed Spend" value={`$${(totalContractValue/1000000).toFixed(2)}M`} subtext="Total Contract Value" icon={DollarSign} />
            <StatCard title="Active Contracts" value={activeContracts} subtext="Currently in execution" icon={Briefcase} />
            <StatCard title="PO Spend" value={`$${(totalPOSpend/1000000).toFixed(2)}M`} subtext="Issued against contracts" icon={CheckCircle} />
            <StatCard title="Open Claims" value={openClaims} subtext="Disputes requiring attention" icon={AlertTriangle} trend={openClaims > 0 ? 'down' : undefined} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Contract Value Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={spendData}>
                            <XAxis dataKey="name" />
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Bar dataKey="val" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
                <p>Additional charts: Spend by Category, Vendor Performance Trends...</p>
            </div>
        </div>
    </div>
  );
};

export default ProcurementDashboard;
