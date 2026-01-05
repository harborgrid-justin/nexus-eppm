
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Skeleton } from '../ui/Skeleton';
import { Column, SortConfig } from '../../types/ui';

export type { Column };

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  keyField: keyof T;
  emptyMessage?: string;
  isLoading?: boolean;
  rowsPerPage?: number; // Used for skeleton count
}

function DataTable<T>({ 
  data, 
  columns, 
  onRowClick, 
  keyField, 
  emptyMessage = "No records found.",
  isLoading = false,
  rowsPerPage = 5
}: DataTableProps<T>) {
  const theme = useTheme();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;

    return [...data].sort((a: any, b: any) => {
      const aVal = (a as any)[sortConfig.key];
      const bVal = (b as any)[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  if (isLoading) {
    return (
      <div className={`${theme.components.card} flex flex-col h-full w-full min-w-0 overflow-hidden`}>
         <div className="overflow-x-auto flex-1 scrollbar-thin">
            <table className="min-w-full divide-y divide-slate-100 table-fixed">
              <thead className={`${theme.colors.background}/80 backdrop-blur-sm sticky top-0 z-10`}>
                 <tr>
                    {columns.map((col, idx) => (
                        <th key={idx} className={theme.components.table.header}>
                            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                        </th>
                    ))}
                 </tr>
              </thead>
              <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                  {[...Array(rowsPerPage)].map((_, i) => (
                      <tr key={i} className={theme.components.table.row}>
                          {columns.map((_, cIdx) => (
                              <td key={cIdx} className={theme.components.table.cell}>
                                  <Skeleton height={16} width="80%" className="rounded" />
                              </td>
                          ))}
                      </tr>
                  ))}
              </tbody>
            </table>
         </div>
      </div>
    );
  }

  return (
    <div className={`${theme.components.card} flex flex-col h-full w-full min-w-0 overflow-hidden`}>
      <div className="overflow-x-auto flex-1 scrollbar-thin">
        <table className={`min-w-full divide-y ${theme.colors.border.replace('border-', 'divide-')} table-fixed`}>
          <thead className={`${theme.colors.background}/95 backdrop-blur-sm sticky top-0 z-10`}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`
                    ${theme.components.table.header}
                    ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                    ${col.sortable ? `cursor-pointer hover:${theme.colors.background} transition-colors group` : ''}
                    ${col.width || ''}
                    ${col.className || ''}
                  `}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className={`flex items-center gap-2 overflow-hidden ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                    <span className="truncate">{col.header}</span>
                    {col.sortable && (
                      <span className={`text-slate-400 group-hover:text-nexus-500 flex-shrink-0 transition-colors`}>
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : (
                          <ArrowUpDown size={10} className="opacity-0 group-hover:opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`${theme.colors.surface} divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <tr
                  key={String(item[keyField])}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`
                    ${theme.components.table.row}
                    ${onRowClick ? `cursor-pointer hover:${theme.colors.background} hover:border-l-nexus-500 focus:${theme.colors.background} outline-none border-l-2 border-l-transparent` : ''}
                  `}
                  tabIndex={onRowClick ? 0 : -1}
                >
                  {columns.map((col) => (
                    <td
                      key={`${String(item[keyField])}-${col.key}`}
                      className={`
                        ${theme.components.table.cell}
                        ${col.align === 'right' ? 'text-right font-mono' : col.align === 'center' ? 'text-center' : 'text-left'}
                        ${col.className || ''}
                      `}
                    >
                      {col.render ? col.render(item) : <span className="truncate block">{(item as any)[col.key]}</span>}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className={`px-6 py-20 text-center ${theme.colors.text.tertiary}`}>
                  <div className="flex flex-col items-center gap-3">
                    <div className={`p-4 ${theme.colors.background} rounded-full`}>
                      <AlertCircle size={32} className="opacity-20" />
                    </div>
                    <div className="max-w-xs">
                      <p className={`font-bold ${theme.colors.text.primary} text-sm mb-1`}>No data matching filters</p>
                      <p className="text-xs leading-relaxed">{emptyMessage}</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
