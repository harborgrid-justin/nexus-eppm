
import React from 'react';
import { usePhysicalResources } from '../../../hooks/usePhysicalResources';
import DataTable from '../../common/DataTable';
// Corrected import path for Column and Resource from types
import { Resource, Column } from '../../../types';
import { Badge } from '../../ui/Badge';

export const InventoryList: React.FC = () => {
    const { materials } = usePhysicalResources();

    const columns: Column<Resource>[] = [
        { key: 'name', header: 'Item Name', render: (m) => <div className="font-bold text-slate-700">{m.name}</div>, sortable: true },
        { key: 'role', header: 'Category', sortable: true },
        { key: 'availableQuantity', header: 'Available', align: 'right', render: (m) => <span className="font-mono font-bold">{m.availableQuantity}</span>, sortable: true },
        { key: 'unitOfMeasure', header: 'UOM', width: 'w-20', align: 'center', sortable: true },
        { key: 'location', header: 'Location', sortable: true },
        { key: 'status', header: 'Stock Status', render: (m) => {
            const low = (m.availableQuantity || 0) <= (m.minQuantity || 0);
            return <Badge variant={low ? 'danger' : 'success'}>{low ? 'Low Stock' : 'Adequate'}</Badge>;
        }}
    ];

    return (
        <DataTable data={materials} columns={columns} keyField="id" emptyMessage="No material inventory tracked." />
    );
};
