
import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ArrowUpDown, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  keyField: keyof T;
  emptyMessage?: string;
  isLoading?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: string;
  direction: SortDirection;
}

function DataTable<T>({ 
  data, 
  columns, 
  onRowClick, 
  keyField, 
  emptyMessage = "No records found.",
  isLoading = false
}: DataTableProps<T>) {
  const theme = useTheme();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });

  const handleSort = (key: string) => {
    let direction: SortDirection = 'asc';
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
      <div className={`flex items-center justify-center h-64 ${theme.components.card}`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-nexus-200 border-t-nexus-600 rounded-full animate-spin"></div>
          <p className={theme.typography.small}>Loading records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${theme.components.card} flex flex-col h-full w-full min-w-0 overflow-hidden`}>
      <div className="overflow-x-auto flex-1 scrollbar-thin">
        <table className="min-w-full divide-y divide-slate-100 table-fixed">
          <thead className={`${theme.colors.background}/80 backdrop-blur-sm sticky top-0 z-10`}>
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
                      <span className="text-slate-400 group-hover:text-nexus-500 flex-shrink-0 transition-colors">
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
          <tbody className={`${theme.colors.surface} divide-y divide-slate-50`}>
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
                <td colSpan={columns.length} className="px-6 py-20 text-center text-slate-400">
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