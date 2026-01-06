
import React from 'react';
import { ChangeOrder } from '../../types';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useTheme } from '../../context/ThemeContext';

const ChangeOrderAnalytics: React.FC = () => {
    const { changeOrders } = useProjectWorkspace();
    const theme = useTheme();
    return (
      <div className="h-full p-4">
        <h3 className="font-bold mb-4">Analytics</h3>
        <div className="p-4 bg-white rounded shadow-sm border h-64 flex items-center justify-center text-slate-400">
          Chart placeholder for {changeOrders.length} change orders.
        </div>
      </div>
    );
};
export default ChangeOrderAnalytics;