import React from 'react';
import { useProjectState } from '../../hooks/useProjectState';
import { Plus } from 'lucide-react';

interface CostChangeOrdersProps {
  projectId: string;
}

const CostChangeOrders: React.FC<CostChangeOrdersProps> = ({ projectId }) => {
  const { changeOrders } = useProjectState(projectId);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 flex-shrink-0">
        <h3 className="font-semibold text-slate-700">Change Order Log</h3>
        <button className="px-3 py-2 bg-nexus-600 text-white rounded-lg text-sm font-medium hover:bg-nexus-700 flex items-center gap-2">
          <Plus size={16} /> Create CO
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted By</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {changeOrders.map(co => (
              <tr key={co.id} className="hover:bg-slate-50 cursor-pointer">
                <td className="px-6 py-4 text-sm font-mono text-slate-500">{co.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{co.title}</div>
                  <div className="text-xs text-slate-500 max-w-md truncate">{co.description}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    co.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    co.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {co.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-slate-900">${co.amount.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {co.submittedBy} on {co.dateSubmitted}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CostChangeOrders;
