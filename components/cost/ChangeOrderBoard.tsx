
import React from 'react';
import { ChangeOrder } from '../../types';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useTheme } from '../../context/ThemeContext';

const ChangeOrderBoard: React.FC = () => {
    const { changeOrders } = useProjectWorkspace();
    const theme = useTheme();
    const stages = ['Draft', 'Pending Approval', 'Approved', 'Rejected'];

    return (
        <div className="h-full flex gap-4 overflow-x-auto p-4">
            {stages.map(stage => (
                <div key={stage} className="w-72 flex-shrink-0 bg-slate-100 rounded-lg">
                    <h3 className="p-3 font-bold text-slate-700 text-sm border-b">{stage}</h3>
                    <div className="p-2 space-y-2">
                        {(changeOrders || []).filter(co => co.status === stage).map(co => (
                            <div key={co.id} className="bg-white p-3 rounded shadow-sm border">
                                <h4 className="font-bold text-sm">{co.title}</h4>
                                <p className="text-xs text-slate-500">{co.amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
export default ChangeOrderBoard;