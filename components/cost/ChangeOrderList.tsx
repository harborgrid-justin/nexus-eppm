
import React from 'react';
import { ChangeOrder } from '../../types';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useTheme } from '../../context/ThemeContext';

const ChangeOrderList: React.FC = () => {
    const { changeOrders } = useProjectWorkspace();
    const theme = useTheme();
    // In a real app, you'd have handlers for selection, etc.
    return (
      <div className="h-full overflow-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {(changeOrders || []).map(co => (
              <tr key={co.id}>
                <td className="px-6 py-4 whitespace-nowrap">{co.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{co.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">{co.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
};
export default ChangeOrderList;