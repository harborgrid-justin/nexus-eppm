
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ChevronDown, ChevronUp, ArrowUpDown, AlertCircle, 
  ChevronLeft, ChevronRight, Settings, Download, Columns, 
  Maximize2, Minimize2 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Skeleton } from '../ui/Skeleton';
import { Column, SortConfig } from '../../types/ui';
import { ExportService } from '../../services/ExportService';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  keyField: keyof T;
  emptyMessage?: string;
  isLoading?: boolean;
  rowsPerPage?: number;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  enableToolbar?: boolean;
  fileName?: string;
}

function DataTable<T>({ 
  data, columns, onRowClick, keyField, emptyMessage = "No records found.",
  isLoading = false, selectable = false, selectedIds = [],
  onSelectionChange, enableToolbar = true, fileName = 'export_data'
}: DataTableProps<T>) {
  const theme = useTheme();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(500);
  const ITEM_HEIGHT = 56;

  useEffect(() => {
    if (containerRef.current) setContainerHeight(containerRef.current.clientHeight);
    const obs = new ResizeObserver(entries => {
      if (entries[0]) setContainerHeight(entries[0].contentRect.height);
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;
    return [...data].sort((a: any, b: any) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal === bVal) return 0;
      return aVal < bVal ? (sortConfig.direction === 'asc' ? -1 : 1) : (sortConfig.direction === 'asc' ? 1 : -1);
    });
  }, [data, sortConfig]);

  const { virtualItems, totalHeight, onScroll } = useVirtualScroll(0, {
    totalItems: sortedData.length,
    itemHeight: ITEM_HEIGHT,
    containerHeight: containerHeight - 48 // Subtract header
  });

  if (isLoading) return <div className="p-8"><Skeleton height={400} /></div>;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden border border-slate-200 rounded-xl bg-white shadow-sm">
      <div className="overflow-x-auto flex-1 flex flex-col" ref={containerRef}>
        <table className="min-w-full divide-y divide-slate-100 table-fixed border-separate border-spacing-0">
          <thead className="bg-slate-50 sticky top-0 z-20 shadow-sm">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-b bg-slate-50">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="relative" onScroll={(e) => onScroll(e.currentTarget.scrollTop)} style={{ height: `${totalHeight}px` }}>
            {virtualItems.map(({ index, offsetTop }) => {
              const item = sortedData[index];
              return (
                <tr 
                  key={String((item as any)[keyField])}
                  onClick={() => onRowClick?.(item)}
                  className="absolute left-0 w-full hover:bg-slate-50 cursor-pointer transition-colors"
                  style={{ height: `${ITEM_HEIGHT}px`, transform: `translateY(${offsetTop}px)` }}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {col.render ? col.render(item) : String((item as any)[col.key])}
                    </td>
                  ))}
                </tr>
              );
            })}
            {sortedData.length === 0 && (
              <div className="absolute inset-0 nexus-empty-pattern flex flex-col items-center justify-center p-12 text-slate-400">
                <AlertCircle size={40} className="opacity-20 mb-3" />
                <p className="font-bold uppercase tracking-widest text-xs">{emptyMessage}</p>
              </div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
