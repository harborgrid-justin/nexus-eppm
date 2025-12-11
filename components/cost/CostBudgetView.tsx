import React from 'react';
import { useProjectState } from '../../hooks';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { formatCompactCurrency, formatCurrency, formatPercentage } from '../../utils/formatters';
import { calculateCommittedCost } from '../../utils/integrationUtils';

interface CostBudgetViewProps {
  projectId: string;
}

const CostBudgetView: React.FC<CostBudgetViewProps> = ({ projectId }) => {
  const { budgetItems, purchaseOrders } = useProjectState(projectId);

  // Transform data to include Committed Cost from Procurement Module
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

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="h-72 mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Budget Consumption</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={extendedBudgetItems}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="category" tick={{fontSize: 12}} />
            <YAxis tick={{fontSize: 12}} tickFormatter={(val) => formatCompactCurrency(val)} />
            <Tooltip formatter={(val: number) => formatCompactCurrency(val)} cursor={{fill: 'transparent'}} />
            <Legend />
            {/* Stacked Bar for consumption */}
            <Bar dataKey="actual" name="Invoiced (Actual)" stackId="a" fill="#0ea5e9" />
            <Bar dataKey="committed" name="Committed (PO)" stackId="a" fill="#38bdf8" />
            
            {/* Separate bar for Planned for comparison */}
            <Bar dataKey="planned" name="Budget (Baseline)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
            <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category (CBS)</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Planned Budget</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider text-blue-600">Committed (POs)</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider text-nexus-700">Invoiced (Actual)</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Total Exposure</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">% Consumed</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
            {extendedBudgetItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.category}</td>
                <td className="px-6 py-4 text-right text-sm text-slate-900">{formatCurrency(item.planned)}</td>
                <td className="px-6 py-4 text-right text-sm font-medium text-blue-600 bg-blue-50/30">{formatCurrency(item.committed)}</td>
                <td className="px-6 py-4 text-right text-sm font-medium text-nexus-700 bg-nexus-50/30">{formatCurrency(item.actual)}</td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800">{formatCurrency(item.totalExposure)}</td>
                <td className={`px-6 py-4 text-right text-sm font-bold ${item.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(item.remaining)}
                </td>
                <td className="px-6 py-4 text-right text-sm">
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
  );
};

export default CostBudgetView;
