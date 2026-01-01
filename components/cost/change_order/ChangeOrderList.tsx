
import React, { useMemo } from 'react';
import { ChangeOrder } from '../../../types';
import DataTable, { Column } from '../../common/DataTable';
import { Badge } from '../../ui/Badge';
import { formatCurrency } from '../../../utils/formatters';
import { CheckCircle } from 'lucide-react';
import { usePermissions } from '../../../hooks/usePermissions';
import { useData } from '../../../context/DataContext';

interface ChangeOrderListProps {
    orders: ChangeOrder[];
    onSelect: (id: string) => void;
}

export const ChangeOrderList: React.FC<ChangeOrderListProps> = ({ orders, onSelect }) => {
    const { canApproveBudget } = usePermissions();
    const { dispatch } = useData();

    const columns = useMemo<Column<ChangeOrder>[]>(() => [
        { key: 'id', header: 'ID', render: (co) => <span className="font-mono text-xs">{co.id}</span>, sortable: true },
        { key: 'title', header: 'Title', render: (co) => <div><div className="font-medium">{co.title}</div><div className="text-xs">{co.category}</div></div>, sortable: true },
        { key: 'priority', header: 'Priority', render: (co) => <Badge variant={co.priority === 'Critical' ? 'danger' : 'neutral'}>{co.priority}</Badge>, sortable: true },
        { key: 'amount', header: 'Cost', align: 'right', render: (co) => <span className="font-mono font-bold">{formatCurrency(co.amount)}</span>, sortable: true },
        { key: 'scheduleImpactDays', header: 'Schedule', align: 'center', render: (co) => <span>{co.scheduleImpactDays > 0 ? `+${co.scheduleImpactDays}d` : '-'}</span> },
        { key: 'status', header: 'Status', render: (co) => <Badge variant={co.status === 'Approved' ? 'success' : 'warning'}>{co.status}</Badge>, sortable: true },
        { key: 'actions', header: '', render: (co) => (
            co.status === 'Pending Approval' && canApproveBudget() ? (
                <button onClick={(e) => { e.stopPropagation(); dispatch({type: 'APPROVE_CHANGE_ORDER', payload: {projectId: co.projectId, changeOrderId: co.id}}); }} className="p-1 text-slate-400 hover:text-green-600"><CheckCircle /></button>
            ) : null
        ) }
      ], [canApproveBudget, dispatch]);

    return (
        <DataTable 
            data={orders}
            columns={columns}
            keyField="id"
            onRowClick={(co) => onSelect(co.id)}
        />
    );
};
