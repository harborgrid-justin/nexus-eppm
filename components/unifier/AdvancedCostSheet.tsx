
import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/formatters';
import { RefreshCw, Calculator, FileSpreadsheet, ChevronRight, ChevronDown, Filter, Download } from 'lucide-react';
import { evaluateFormula } from '../../utils/logic/businessProcessEngine';
import { CostSheetRow } from '../../types/unifier';

interface CostSheetProps {
  projectId: string;
}

// Helper to flatten tree for grid rendering while maintaining level info
const flattenRows = (rows: CostSheetRow[], parentId: string | null = null, level = 0, expanded: Set<string>): (CostSheetRow & { level: number, hasChildren: boolean })[] => {
    const result: (CostSheetRow & { level: number, hasChildren: boolean })[] = [];
    const children = rows.filter(r => r.parentId === parentId);
    
    children.forEach(child => {
        const grandChildren = rows.filter(r => r.parentId === child.costCode);
        result.push({ ...child, level, hasChildren: grandChildren.length > 0 });
        if (expanded.has(child.costCode)) {
            result.push(...flattenRows(rows, child.costCode, level + 1, expanded));
        }
    });
    return result;
};

export const AdvancedCostSheet: React.FC<CostSheetProps> = ({ projectId }) => {
  const { state } = useData();
  const theme = useTheme();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // In a real app, filtering by project ID happens here
  const { columns, rows } = state.unifier.costSheet;

  const toggleNode = (id: string) => {
      setExpandedNodes(prev => {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id); else next.add(id);
          return next;
      });
  };

  // 1. Calculate Values & Rollups
  const computedRows = useMemo(() => {
    // Deep clone to avoid mutation during calculation
    const processedRows = JSON.parse(JSON.stringify(rows));

    // A. Leaf Node Formula Calculation
    processedRows.forEach((row: any) => {
        columns.filter(c => c.type === 'Formula').forEach(col => {
            if(col.formula) {
                row[col.id] = evaluateFormula(col.formula, row);
            }
        });
    });

    // B. Hierarchy Rollup (Bottom-up)
    // Simple implementation: Iterate multiple times or build tree. 
    // For MVP, we assume rows are roughly ordered or we do a multi-pass.
    // Real implementation would use a proper Tree structure for aggregation.
    
    return processedRows;
  }, [rows, columns]);

  const flatList = useMemo(() => flattenRows(computedRows, null, 0, expandedNodes), [computedRows, expandedNodes]);

  const totals = useMemo(() => {
      const t: Record<string, number> = {};
      columns.forEach(c => {
          // Only sum root nodes to avoid double counting
          t[c.id] = computedRows.filter((r: any) => !r.parentId).reduce((sum: number, r: any) => sum + (Number(r[c.id]) || 0), 0);
      });
      return t;
  }, [computedRows, columns]);

  return (
    <div className={`flex flex-col h-full ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
        <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center bg-slate-50`}>
            <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-green-600" size={20} />
                <div>
                    <h3 className="font-bold text-slate-800">Master Cost Sheet</h3>
                    <p className="text-xs text-slate-500">Project: {projectId}</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded hover:bg-slate-50 flex items-center gap-2">
                    <Filter size={14}/> View
                </button>
                <button className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded hover:bg-slate-50 flex items-center gap-2">
                    <Download size={14}/> Export
                </button>
                <button className="px-3 py-1.5 text-xs font-bold bg-nexus-600 text-white rounded hover:bg-nexus-700 flex items-center gap-2">
                    <RefreshCw size={14}/> Refresh
                </button>
            </div>
        </div>
        
        <div className="flex-1 overflow-auto bg-white">
            <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                <thead className="bg-slate-100 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 sticky left-0 bg-slate-100 z-20 min-w-[250px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            Cost Code Hierarchy
                        </th>
                        {columns.map(col => (
                            <th key={col.id} className={`px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 min-w-[140px] ${col.type === 'Formula' ? 'bg-blue-50/50' : ''}`}>
                                {col.name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {flatList.map((row) => (
                        <tr key={row.costCode} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-4 py-2 text-sm text-slate-800 border-r border-slate-100 sticky left-0 bg-white group-hover:bg-slate-50 z-10 font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                <div className="flex items-center" style={{ paddingLeft: `${row.level * 20}px` }}>
                                    <button 
                                        onClick={() => toggleNode(row.costCode)}
                                        className={`p-0.5 mr-2 rounded hover:bg-slate-200 ${row.hasChildren ? 'text-slate-500' : 'text-transparent cursor-default'}`}
                                    >
                                        {expandedNodes.has(row.costCode) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                                    </button>
                                    <div className="flex flex-col">
                                        <span>{row.description}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">{row.costCode}</span>
                                    </div>
                                </div>
                            </td>
                            {columns.map(col => (
                                <td key={col.id} className={`px-4 py-2 text-sm text-right font-mono border-r border-slate-100 ${col.type === 'Formula' ? 'text-slate-900 bg-blue-50/10' : 'text-slate-600'}`}>
                                    {formatCurrency(row[col.id] || 0)}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {/* Totals Row */}
                    <tr className="bg-slate-100 font-black border-t-2 border-slate-300 sticky bottom-0 z-20">
                        <td className="px-4 py-3 text-xs uppercase text-slate-700 sticky left-0 bg-slate-100 z-30 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            Grand Total
                        </td>
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
