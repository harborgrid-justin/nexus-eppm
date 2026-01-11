import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { evaluateFormula } from '../../utils/logic/businessProcessEngine';
import { formatCurrency } from '../../utils/formatters';
import { RefreshCw, Calculator, FileSpreadsheet, LayoutTemplate, Plus, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmptyGrid } from '../common/EmptyGrid';

interface CostSheetProps {
  projectId: string;
}

export const CostSheet: React.FC<CostSheetProps> = ({ projectId }) => {
  const { state } = useData();
  const theme = useTheme();
  
  if (!projectId || projectId === 'UNSET') {
      return (
        <div className={`flex flex-col h-full ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
             <div className="h-full flex flex-col justify-center p-8">
                <EmptyGrid 
                    title="Portfolio Context Required"
                    description="Please select or create a project to view the Master Cost Sheet."
                    icon={LayoutTemplate}
                />
             </div>
        </div>
      );
  }

  const { columns, rows } = state.unifier.costSheet;

  const computedRows = useMemo(() => {
    return rows.map(row => {
      const newRow = { ...row };
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
        <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50`}>
            <div className="flex items-center gap-2">
                <div className={`p-2 bg-green-50 text-green-600 rounded-lg border border-green-200`}>
                    <FileSpreadsheet size={20} />
                </div>
                <div>
                    <h3 className={`font-bold ${theme.colors.text.primary}`}>Master Cost Sheet</h3>
                    <p className={`text-xs ${theme.colors.text.secondary}`}>Consolidated CBS & Variance</p>
                </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" icon={Calculator}>Recalculate</Button>
                <Button variant="primary" size="sm" icon={RefreshCw}>Refresh</Button>
            </div>
        </div>
        
        <div className="flex-1 overflow-auto bg-white relative">
            {computedRows.length === 0 ? (
                 <div className="h-full flex flex-col justify-center p-8">
                    <EmptyGrid 
                        title="Cost Sheet Empty"
                        description="No cost codes or budget lines found for this project. Initialize the Cost Breakdown Structure (CBS) to begin."
                        icon={FileSpreadsheet}
                        actionLabel="Initialize CBS"
                        onAdd={() => {}} 
                    />
                 </div>
            ) : (
                <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                    <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm`}>
                        <tr>
                            <th className={`px-4 py-3 text-left text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-wider border-r ${theme.colors.border} sticky left-0 ${theme.colors.background} z-20 min-w-[150px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]`}>Cost Code</th>
                            <th className={`px-4 py-3 text-left text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-wider border-r ${theme.colors.border} min-w-[200px]`}>Description</th>
                            {columns.map(col => (
                                <th key={col.id} className={`px-4 py-3 text-right text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-wider border-r ${theme.colors.border} min-w-[140px] ${col.type === 'Formula' ? 'bg-blue-50/30' : ''}`}>
                                    {col.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={`divide-y divide-slate-100 bg-white`}>
                        {computedRows.map((row, idx) => (
                            <tr key={idx} className={`hover:${theme.colors.background} transition-colors group`}>
                                <td className={`px-4 py-3 text-sm font-mono ${theme.colors.text.secondary} border-r ${theme.colors.border} sticky left-0 bg-white group-hover:${theme.colors.background} z-10 font-bold shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]`}>
                                    {row.costCode}
                                </td>
                                <td className={`px-4 py-3 text-sm ${theme.colors.text.primary} border-r ${theme.colors.border}`}>
                                    {row.description || (
                                        <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-nexus-600 transition-colors font-bold uppercase tracking-tighter">
                                            <Plus size={12}/> Map Description
                                        </button>
                                    )}
                                </td>
                                {columns.map(col => (
                                    <td key={col.id} className={`px-4 py-3 text-sm text-right font-mono border-r ${theme.colors.border} ${col.type === 'Formula' ? 'font-bold text-slate-900 bg-blue-50/10' : 'text-slate-600'}`}>
                                        {row[col.id] !== undefined ? formatCurrency(row[col.id]) : (
                                            <div className="w-full h-4 bg-slate-50 rounded animate-pulse opacity-50"></div>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {/* Empty Rows Pattern */}
                        {[...Array(5)].map((_, i) => (
                            <tr key={`empty-${i}`} className="nexus-empty-pattern h-10 border-b border-slate-50">
                                <td className="border-r border-slate-100 sticky left-0 bg-white opacity-40"></td>
                                <td colSpan={columns.length + 1} className="opacity-10"></td>
                            </tr>
                        ))}
                        <tr className={`${theme.colors.background} font-black border-t-2 ${theme.colors.border} sticky bottom-0 z-20 shadow-[0_-2px_5px_-2px_rgba(0,0,0,0.05)]`}>
                            <td className={`px-4 py-3 text-xs uppercase ${theme.colors.text.secondary} sticky left-0 ${theme.colors.background} z-30 border-r ${theme.colors.border} shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]`}>
                                Grand Total
                            </td>
                            <td className={`px-4 py-3 border-r ${theme.colors.border}`}></td>
                            {columns.map(col => (
                                <td key={col.id} className={`px-4 py-3 text-right text-sm border-r ${theme.colors.border}`}>
                                    {formatCurrency(totals[col.id])}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
};