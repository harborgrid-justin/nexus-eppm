import React, { useMemo } from 'react';
import { ChangeOrder } from '../../../types';
import DataTable, { Column } from '../../common/DataTable';
import { Badge } from '../../ui/Badge';
import { formatCurrency } from '../../../utils/formatters';
import { CheckCircle, FileDiff } from 'lucide-react';
import { usePermissions } from '../../../hooks/usePermissions';
import { useData } from '../../../context/DataContext';
import { EmptyGrid } from '../../common/EmptyGrid';

interface ChangeOrderListProps {
    orders: ChangeOrder[];
    onSelect: (id: string) => void;
    onAdd: () => void;
}

export const ChangeOrderList: React.FC<ChangeOrderListProps> = ({ orders, onSelect, onAdd }) => {
    const { canApproveBudget, canEditProject } = usePermissions();
    const { dispatch } = useData();

    const columns = useMemo<Column<ChangeOrder>[]>(() => [
        { key: 'id', header: 'ID', render: (co) => <span className="font-mono text-xs font-bold text-slate-400">{co.id}</span>, sortable: true },
        { key: 'title', header: 'Subject Area', render: (co) => <div><div className="font-bold text-slate-800">{co.title}</div><div className="text-[10px] uppercase font-black text-slate-400">{co.category}</div></div>, sortable: true },
        { key: 'priority', header: 'Severity', render: (co) => <Badge variant={co.priority === 'Critical' ? 'danger' : 'neutral'}>{co.priority}</Badge>, sortable: true },
        { key: 'amount', header: 'Fiscal Impact', align: 'right', render: (co) => <span className="font-mono font-black text-nexus-700">{formatCurrency(co.amount)}</span>, sortable: true },
        { key: 'scheduleImpactDays', header: 'Schedule delta', align: 'center', render: (co) => <span className={`font-mono font-bold ${co.scheduleImpactDays > 0 ? 'text-red-500' : 'text-slate-400'}`}>{co.scheduleImpactDays > 0 ? `+${co.scheduleImpactDays}d` : '0d'}</span> },
        { key: 'status', header: 'Workflow Node', render: (co) => <Badge variant={co.status === 'Approved' ? 'success' : co.status === 'Rejected' ? 'danger' : 'warning'}>{co.status}</Badge>, sortable: true },
        { key: 'actions', header: '', align: 'right', render: (co) => (
            <div className="flex justify-end gap-2">
                {co.status === 'Pending Approval' && canApproveBudget() && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); dispatch({type: 'APPROVE_CHANGE_ORDER', payload: {projectId: co.projectId, changeOrderId: co.id}}); }} 
                        className="p-1.5 bg-green-50 text-green-600 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                        title="Approve Change"
                    >
                        <CheckCircle size={14}/>
                    </button>
                )}
            </div>
        ) }
      ], [canApproveBudget, dispatch]);

    if (orders.length === 0) {
        return (
             <div className="h-full flex items-center justify-center p-8">
                 <EmptyGrid 
                    title="Change Log Null"
                    description="No formal change requests (PCRs) have been registered for this project. Scope modifications must be baselined to ensure EVM accuracy."
                    icon={FileDiff}
                    actionLabel="Initialize Change Request"
                    onAdd={canEditProject() ? onAdd : undefined}
                 />
             </div>
        );
    }

    return (
        <DataTable 
            data={orders}
            columns={columns}
            keyField="id"
            onRowClick={(co) => onSelect(co.id)}
        />
    );
};