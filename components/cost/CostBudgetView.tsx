
import React, { useState } from 'react';
import { useProjectState } from '../../hooks';
import { formatCompactCurrency, formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateCommittedCost } from '../../utils/integrationUtils';
import { CustomBarChart } from '../charts/CustomBarChart';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { BudgetLineItem } from '../../types';
import { Search } from 'lucide-react';

interface CostBudgetViewProps {
  projectId: string;
}

const CostBudgetView: React.FC<CostBudgetViewProps> = ({ projectId }) => {
  const { budgetItems, purchaseOrders } = useProjectState(projectId);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Transform data to include Committed Cost
  const extendedBudgetItems = budgetItems.map(item => {
      const committed = calculateCommittedCost(purchaseOrders, item.id);
      const totalExposure = item.actual + committed;
      const remaining = item.planned - totalExposure;
      return {
          ...item,
          committed,
          totalExposure,
          remaining
      };
  });

  const selectedItem = extendedBudgetItems.find(i => i.id === selectedItemId);
  const linkedPos = selectedItem ? purchaseOrders.filter(po => po.linkedBudgetLineItemId === selectedItem.id) : [];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="h-72 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Budget Consumption (Actuals + Commitments)</h3>
        <CustomBarChart
            data={extendedBudgetItems}
            xAxisKey="category"
            dataKey="totalExposure"
            barColor="#0ea5e9"
            height={250}
            formatTooltip={(val) => formatCompactCurrency(val)}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category (CBS)</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Planned Budget</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider text-blue-600">Committed (POs)</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider text-nexus-700">Invoiced (Actual)</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total Exposure</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining</th>
                    <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[140px]">% Consumed</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                {extendedBudgetItems.map(item => (
                    <tr 
                        key={item.id} 
                        onClick={() => setSelectedItemId(item.id)}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">{item.category}</td>
                        <td className="px-6 py-4 text-right text-sm text-slate-900 whitespace-nowrap">{formatCurrency(item.planned)}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-blue-600 bg-blue-50/30 whitespace-nowrap">{formatCurrency(item.committed)}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-nexus-700 bg-nexus-50/30 whitespace-nowrap">{formatCurrency(item.actual)}</td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800 whitespace-nowrap">{formatCurrency(item.totalExposure)}</td>
                        <td className={`px-6 py-4 text-right text-sm font-bold whitespace-nowrap ${item.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(item.remaining)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${item.totalExposure > item.planned ? 'bg-red-500' : 'bg-green-500'}`} 
                                        style={{ width: `${Math.min((item.totalExposure / item.planned) * 100, 100)}%` }}
                                    />
                                </div>
                                <span className="text-xs text-slate-500">{formatPercentage((item.totalExposure/item.planned) * 100, 0)}</span>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
                <tfoot className="bg-slate-100 font-bold">
                    <tr>
                        <td className="px-6 py-3 text-sm text-slate-800">Total</td>
                        <td className="px-6 py-3 text-right text-sm text-slate-800">{formatCurrency(extendedBudgetItems.reduce((a, c) => a + c.planned, 0))}</td>
                        <td className="px-6 py-3 text-right text-sm text-blue-700">{formatCurrency(extendedBudgetItems.reduce((a, c) => a + c.committed, 0))}</td>
                        <td className="px-6 py-3 text-right text-sm text-nexus-700">{formatCurrency(extendedBudgetItems.reduce((a, c) => a + c.actual, 0))}</td>
                        <td className="px-6 py-3 text-right text-sm text-slate-800">{formatCurrency(extendedBudgetItems.reduce((a, c) => a + c.totalExposure, 0))}</td>
                        <td className="px-6 py-3 text-right text-sm text-slate-800">{formatCurrency(extendedBudgetItems.reduce((a, c) => a + c.remaining, 0))}</td>
                        <td className="px-6 py-3"></td>
                    </tr>
                </tfoot>
            </table>
        </div>
      </div>

      {selectedItemId && selectedItem && (
          <SidePanel
            isOpen={!!selectedItemId}
            onClose={() => setSelectedItemId(null)}
            title={`CBS Detail: ${selectedItem.category}`}
            width="md:w-[600px]"
            footer={<Button variant="secondary" onClick={() => setSelectedItemId(null)}>Close</Button>}
          >
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-4 rounded-lg">
                         <span className="text-xs text-slate-500 uppercase font-bold">Total Budget</span>
                         <div className="text-xl font-bold text-slate-900">{formatCurrency(selectedItem.planned)}</div>
                     </div>
                     <div className="bg-slate-50 p-4 rounded-lg">
                         <span className="text-xs text-slate-500 uppercase font-bold">Available</span>
                         <div className={`text-xl font-bold ${selectedItem.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                             {formatCurrency(selectedItem.remaining)}
                         </div>
                     </div>
                 </div>

                 <div>
                     <h4 className="font-bold text-slate-800 mb-3 text-sm">Committed Costs (Purchase Orders)</h4>
                     {linkedPos.length > 0 ? (
                         <div className="border border-slate-200 rounded-lg overflow-hidden">
                             <table className="min-w-full divide-y divide-slate-100">
                                 <thead className="bg-slate-50">
                                     <tr>
                                         <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">PO Number</th>
                                         <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Vendor</th>
                                         <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Amount</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50 bg-white">
                                     {linkedPos.map(po => (
                                         <tr key={po.id}>
                                             <td className="px-4 py-2 text-sm text-slate-700 font-mono">{po.number}</td>
                                             <td className="px-4 py-2 text-sm text-slate-600">{po.vendorId}</td>
                                             <td className="px-4 py-2 text-sm text-right font-medium">{formatCurrency(po.amount)}</td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                     ) : (
                         <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded border border-slate-200">
                             No active Purchase Orders linked to this line item.
                         </div>
                     )}
                 </div>
                 
                 {/* Placeholder for Actuals (Invoices) Drilldown */}
                 <div>
                     <h4 className="font-bold text-slate-800 mb-3 text-sm">Actuals (Invoices / Journals)</h4>
                     <div className="text-sm text-slate-500 italic p-4 bg-slate-50 rounded border border-slate-200 text-center">
                        <Search size={24} className="mx-auto mb-2 opacity-50"/>
                        Connect to ERP for transactional invoice data.
                     </div>
                 </div>
              </div>
          </SidePanel>
      )}
    </div>
  );
};

export default CostBudgetView;
