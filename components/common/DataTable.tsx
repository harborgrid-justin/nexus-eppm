
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
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white border border-slate-200 rounded-xl">
        <div className="animate-pulse text-slate-400 font-medium">Loading data...</div>
      </div>
    );
  }

  return (
    <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm overflow-hidden flex flex-col h-full`}>
      <div className="overflow-auto flex-1">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`
                    px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider select-none
                    ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                    ${col.sortable ? 'cursor-pointer hover:bg-slate-100 transition-colors group' : ''}
                    ${col.width || ''}
                    ${col.className || ''}
                  `}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                    {col.header}
                    {col.sortable && (
                      <span className="text-slate-400 group-hover:text-nexus-500">
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        ) : (
                          <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-50" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <tr
                  key={String(item[keyField])}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`
                    transition-colors
                    ${onRowClick ? 'cursor-pointer hover:bg-slate-50 focus:bg-slate-50' : ''}
                  `}
                  tabIndex={onRowClick ? 0 : -1}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                      onRowClick(item);
                    }
                  }}
                >
                  {columns.map((col) => (
                    <td
                      key={`${String(item[keyField])}-${col.key}`}
                      className={`
                        px-6 py-4 whitespace-nowrap text-sm
                        ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                      `}
                    >
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle size={24} className="opacity-50" />
                    <p>{emptyMessage}</p>
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
