import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Skeleton } from '../ui/Skeleton';
import { Column } from '../../types/ui';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  keyField: keyof T;
  emptyMessage?: string;
  isLoading?: boolean;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  enableToolbar?: boolean;
  fileName?: string;
  rowsPerPage?: number;
}

function DataTable<T>({ 
  data, columns, onRowClick, keyField, emptyMessage = "No records found.", isLoading = false
}: DataTableProps<T>) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const ROW_HEIGHT = 56;

  useEffect(() => {
    if (containerRef.current) setContainerHeight(containerRef.current.clientHeight);
    const obs = new ResizeObserver(entries => {
      if (entries[0]) setContainerHeight(entries[0].contentRect.height);
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const { virtualItems, totalHeight, onScroll } = useVirtualScroll(0, {
    totalItems: data.length,
    itemHeight: ROW_HEIGHT,
    containerHeight: containerHeight - 48
  });

  if (isLoading) return <div className="p-8"><Skeleton height={400} /></div>;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto scrollbar-thin relative" 
        onScroll={(e) => onScroll(e.currentTarget.scrollTop)}
        style={{ 
          contain: 'strict',
          willChange: 'scroll-position'
        }}
      >
        <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
          <thead className="bg-slate-50 sticky top-0 z-20 shadow-sm">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b bg-slate-50">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="relative" style={{ height: `${totalHeight}px`, contain: 'layout' }}>
            {virtualItems.map(({ index, offsetTop }) => {
              const item = data[index];
              if (!item) return null;
              return (
                <tr 
                  key={String((item as any)[keyField])}
                  onClick={() => onRowClick?.(item)}
                  className="absolute left-0 w-full hover:bg-slate-50/50 cursor-pointer transition-colors border-b border-slate-50 will-change-transform"
                  style={{ height: `${ROW_HEIGHT}px`, transform: `translateY(${offsetTop}px)` }}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      {col.render ? col.render(item) : String((item as any)[col.key])}
                    </td>
                  ))}
                </tr>
              );
            })}
            {data.length === 0 && !isLoading && (
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

export default React.memo(DataTable) as typeof DataTable;