
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { evaluateFormula } from '../../utils/logic/businessProcessEngine';
import { formatCurrency } from '../../utils/formatters';
import { RefreshCw, Calculator, FileSpreadsheet, LayoutTemplate } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmptyGrid } from '../common/EmptyGrid';

interface CostSheetProps {
  projectId: string;
}

export const CostSheet: React.FC<CostSheetProps> = ({ projectId }) => {
  const { state } = useData();
  const theme = useTheme();
  
  if (!projectId || projectId === 'UNSET' || !state.projects.some(p => p.id === projectId)) {
      return (
        <div className={`flex flex-col h-full ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
             <div className="h-full flex flex-col justify-center p-8">
                <EmptyGrid title="Financial Context Required" description="Select an active project initiative to initialize the cost breakdown structure." icon={LayoutTemplate} />
             </div>
        </div>
      );
  }

  const { columns, rows } = state.unifier.costSheet;

  const computedRows = useMemo(() => {
    // Logic: Filter rows belonging to specific project if partition logic exists, otherwise show global
    const projectRows = rows.filter(r => !r.projectId || r.projectId === projectId);
    
    return projectRows.map(row => {
      const newRow = { ...row };
      columns.filter(c => c.type === 'Formula').forEach(col => {
        if(col.formula) {
            newRow[col.id] = evaluateFormula(col.formula, newRow);
        }
      });
      return newRow;
    });
  }, [rows, columns, projectId]);

  return (
    <div className={`flex flex-col h-full ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
        <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50`}>
            <div className="flex items-center gap-2">
                <div className={`p-2 ${theme.colors.semantic.success.bg} ${theme.colors.semantic.success.text} rounded-lg border ${theme.colors.semantic.success.border}`}>
                    <FileSpreadsheet size={20} />
                </div>
                <div>
                    <h3 className={`font-bold ${theme.colors.text.primary}`}>Master Cost Sheet</h3>
                    <p className={`text-xs ${theme.colors.text.secondary}`}>CBS & Variance Controls</p>
                </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="sm" icon={Calculator}>Recalculate Totals</Button>
                <Button variant="primary" size="sm" icon={RefreshCw}>Synchronize ERP</Button>
            </div>
        </div>
        
        <div className="flex-1 overflow-auto bg-white relative text-slate-800">
            {computedRows.length === 0 ? (
                 <div className="h-full flex flex-col justify-center p-8">
                    <EmptyGrid title="Cost Breakdown Structure Empty" description="Initialize the CBS for this project to start tracking actuals against budget." icon={FileSpreadsheet} />
                 </div>
            ) : (
                <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                    <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm`}>
                        <tr>
                            <th className={`px-4 py-3 text-left text-xs font-bold ${theme.colors.text.secondary} border-r ${theme.colors.border} sticky left-0 ${theme.colors.background} z-20`}>Cost Code</th>
                            <th className={`px-4 py-3 text-left text-xs font-bold ${theme.colors.text.secondary} border-r ${theme.colors.border}`}>Description</th>
                            {columns.map(col => (
                                <th key={col.id} className={`px-4 py-3 text-right text-xs font-bold ${theme.colors.text.secondary} border-r ${theme.colors.border} ${col.type === 'Formula' ? 'bg-blue-50/30' : ''}`}>
                                    {col.name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {computedRows.map((row, idx) => (
                            <tr key={idx} className={`hover:${theme.colors.background} transition-colors group`}>
                                <td className={`px-4 py-3 text-sm font-mono ${theme.colors.text.secondary} border-r ${theme.colors.border} sticky left-0 bg-white group-hover:${theme.colors.background} z-10 font-bold`}>
                                    {row.costCode}
                                </td>
                                <td className={`px-4 py-3 text-sm ${theme.colors.text.primary} border-r ${theme.colors.border}`}>
                                    {row.description}
                                </td>
                                {columns.map(col => (
                                    <td key={col.id} className={`px-4 py-3 text-sm text-right font-mono border-r ${theme.colors.border} ${col.type === 'Formula' ? `font-bold ${theme.colors.text.primary} bg-blue-50/10` : theme.colors.text.secondary}`}>
                                        {formatCurrency(row[col.id] || 0)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
};
