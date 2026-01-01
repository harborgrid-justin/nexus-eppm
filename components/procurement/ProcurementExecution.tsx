
import React from 'react';
import { DollarSign, Truck, AlertCircle } from 'lucide-react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

const ProcurementExecution: React.FC = () => {
    const { purchaseOrders } = useProjectWorkspace();
    const { state } = useData();
    const theme = useTheme();

    return (
        <div className="h-full flex flex-col">
            <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center bg-slate-50/50`}>
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    <DollarSign size={16} /> Purchase Orders & Execution
                </h3>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">PO Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Vendor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Delivery Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {purchaseOrders.map(po => {
                            const vendor = state.vendors.find(v => v.id === po.vendorId);
                            return (
                                <tr key={po.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-mono text-sm font-bold text-slate-700">{po.number}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{vendor?.name || po.vendorId}</td>
                                    <td className="px-6 py-4 text-sm text-slate-800">{po.description}</td>
                                    <td className="px-6 py-4 text-sm text-right font-mono font-bold text-slate-900">{formatCurrency(po.amount)}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                                        <Truck size={14} className="text-slate-400"/> {po.expectedDeliveryDate ? formatDate(po.expectedDeliveryDate) : 'TBD'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={po.status === 'Issued' ? 'success' : po.status === 'Draft' ? 'neutral' : 'warning'}>
                                            {po.status}
                                        </Badge>
                                    </td>
                                </tr>
                            );
                        })}
                        {purchaseOrders.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    <AlertCircle size={24} className="mx-auto mb-2 opacity-50"/>
                                    No Purchase Orders issued.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProcurementExecution;
