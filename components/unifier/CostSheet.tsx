
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { evaluateFormula } from '../../utils/logic/businessProcessEngine';
import { formatCurrency } from '../../utils/formatters';
import { RefreshCw, Calculator, FileSpreadsheet } from 'lucide-react';

interface CostSheetProps {
  projectId: string;
}

export const CostSheet: React.FC<CostSheetProps> = ({ projectId }) => {
  const { state } = useData();
  const theme = useTheme();
  
  // In a real app, we filter by projectId. 
  // For mock, we use the static cost sheet data but re-calculate formulas dynamically.
  const { columns, rows } = state.unifier.costSheet;

  const computedRows = useMemo(() => {
    return rows.map(row => {
      const newRow = { ...row };
      // 1. Calculate Formulas
      columns.filter(c => c.type === 'Formula').forEach(col => {
        if(col.formula) {
            newRow[col.id] = evaluateFormula(col.formula, newRow);
        }
      });
      return newRow;
    });
  }, [rows, columns]);

  const totals = useMemo(() => {
      const t: Record<string, number> = {};
      columns.forEach(c => {
          t[c.id] = computedRows.reduce((sum, r) => sum + (Number(r[c.id]) || 0), 0);
      });
      return t;
  }, [computedRows, columns]);

  return (
    <div className={`flex flex-col h-full ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
        <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center bg-slate-50`}>
            <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-green-600" size={20} />
                <h3 className="font-bold text-slate-800">Master Cost Sheet</h3>
            </div>
            <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded hover:bg-slate-50 flex items-center gap-2">
                    <Calculator size={14}/> Recalculate
                </button>
                <button className="px-3 py-1.5 text-xs font-bold bg-nexus-600 text-white rounded hover:bg-nexus-700 flex items-center gap-2">
                    <RefreshCw size={14}/> Refresh
                </button>
            </div>
        </div>
        
        <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                <thead className="bg-slate-100 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 sticky left-0 bg-slate-100 z-20 min-w-[150px]">WBS / Cost Code</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 min-w-[200px]">Description</th>
                        {columns.map(col => (
                            <th key={col.id} className={`px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 min-w-[140px] ${col.type === 'Formula' ? 'bg-blue-50/50' : ''}`}>
                                {col.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {computedRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-2 text-sm font-mono text-slate-600 border-r border-slate-100 sticky left-0 bg-white font-bold">
                                {row.wbsCode} <span className="text-slate-300">|</span> {row.costCode}
                            </td>
                            <td className="px-4 py-2 text-sm text-slate-800 border-r border-slate-100">
                                {row.description}
                            </td>
                            {columns.map(col => (
                                <td key={col.id} className={`px-4 py-2 text-sm text-right font-mono border-r border-slate-100 ${col.type === 'Formula' ? 'font-bold text-slate-900 bg-blue-50/10' : 'text-slate-600'}`}>
                                    {formatCurrency(row[col.id])}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {/* Totals Row */}
                    <tr className="bg-slate-50 font-black border-t-2 border-slate-300">
                        <td className="px-4 py-3 text-xs uppercase text-slate-500 sticky left-0 bg-slate-50 z-20 border-r border-slate-200">Total</td>
                        <td className="px-4 py-3 border-r border-slate-200"></td>
                        {columns.map(col => (
                            <td key={col.id} className="px-4 py-3 text-right text-sm border-r border-slate-200">
                                {formatCurrency(totals[col.id])}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  );
};
