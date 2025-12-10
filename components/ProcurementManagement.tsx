import React from 'react';
import { useProjectState } from '../hooks';
import { useData } from '../context/DataContext';
import { ShoppingCart, Plus, CheckCircle, Clock } from 'lucide-react';
import { ProcurementPackage } from '../types';

interface ProcurementManagementProps {
  projectId: string;
}

const ProcurementManagement: React.FC<ProcurementManagementProps> = ({ projectId }) => {
  const { procurement } = useProjectState(projectId);
  const { state } = useData();
  
  const getStatusChip = (status: ProcurementPackage['status']) => {
    switch (status) {
      case 'Awarded':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Awarded</span>;
      case 'Sourcing':
      case 'In Progress':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">{status}</span>;
      case 'Complete':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">Complete</span>;
      case 'Planned':
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col p-6">
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <ShoppingCart className="text-nexus-600" /> Procurement Management
            </h1>
            <p className="text-slate-500">Track all project procurement packages from bidding to completion.</p>
          </div>
          <button className="px-4 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium">
             <Plus size={16} /> New Package
          </button>
       </div>

       <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
          <div className="flex-1 overflow-auto">
             <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 sticky top-0">
                   <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Package ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Vendor</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Est. Delivery</th>
                   </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                   {procurement.map(pkg => {
                      const contract = state.contracts.find(c => c.id === pkg.contractId);
                      const vendor = contract ? state.vendors.find(v => v.id === contract.vendorId) : null;
                      const deliveryDate = contract ? contract.endDate : 'TBD';
                      const value = contract ? contract.contractValue : pkg.budget;

                      return (
                         <tr key={pkg.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{pkg.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{pkg.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{vendor ? vendor.name : <span className="italic text-slate-400">Not Awarded</span>}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-semibold text-right">${value.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">{getStatusChip(pkg.status)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{deliveryDate}</td>
                         </tr>
                      );
                   })}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
};

export default ProcurementManagement;