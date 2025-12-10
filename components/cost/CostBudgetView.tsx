
import React from 'react';
import { useProjectState } from '../../hooks';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatCompactCurrency, formatCurrency, formatPercentage } from '../../utils/formatters';

interface CostBudgetViewProps {
  projectId: string;
}

const CostBudgetView: React.FC<CostBudgetViewProps> = ({ projectId }) => {
  const { budgetItems } = useProjectState(projectId);

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={budgetItems}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="category" tick={{fontSize: 12}} />
            <YAxis tick={{fontSize: 12}} tickFormatter={(val) => formatCompactCurrency(val)} />
            <Tooltip formatter={(val: number) => formatCompactCurrency(val)} />
            <Bar dataKey="planned" name="Planned" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="min-w-full divide-y divide-slate-200 border border-slate-200 rounded-lg">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category (CBS)</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Planned</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actual</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Variance</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">% Used</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {budgetItems.map(item => (
            <tr key={item.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.category}</td>
              <td className="px-6 py-4 text-right text-sm text-slate-500">{formatCurrency(item.planned)}</td>
              <td className="px-6 py-4 text-right text-sm text-slate-900">{formatCurrency(item.actual)}</td>
              <td className="px-6 py-4 text-right text-sm font-semibold text-green-600">{formatCurrency(item.variance)}</td>
              <td className="px-6 py-4 text-right text-sm text-slate-500">{formatPercentage((item.actual/item.planned) * 100, 1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CostBudgetView;
