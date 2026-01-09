
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

export type { Column };

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
  fileName?: string; // For export
}

function DataTable<T>({ 
  data, 
  columns, 
  onRowClick, 
  keyField, 
  emptyMessage = "No records found.",
  isLoading = false,
  rowsPerPage = 10,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  enableToolbar = true,
  fileName = 'export_data'
}: DataTableProps<T>) {
  const theme = useTheme();
  
  // -- State --
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(rowsPerPage);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columns.map(c => c.key)));
  const [density, setDensity] = useState<'compact' | 'normal'>('normal');
  const [isColMenuOpen, setIsColMenuOpen] = useState(false);
  
  const colMenuRef = useRef<HTMLDivElement>(null);

  // -- Effects --
  useEffect(() => {
    // Click outside to close col menu
    const handleClickOutside = (event: MouseEvent) => {
      if (colMenuRef.current && !colMenuRef.current.contains(event.target as Node)) {
        setIsColMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  // -- Handlers --
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          const allIds = data.map(item => String((item as any)[keyField]));
          onSelectionChange?.(allIds);
      } else {
          onSelectionChange?.([]);
      }
  };

  const handleSelectRow = (id: string) => {
      if (selectedIds.includes(id)) {
          onSelectionChange?.(selectedIds.filter(i => i !== id));
      } else {
          onSelectionChange?.([...selectedIds, id]);
      }
  };

  const toggleColumn = (key: string) => {
      const newSet = new Set(visibleColumns);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      setVisibleColumns(newSet);
  };

  const handleExport = () => {
     ExportService.exportData(sortedData, fileName, 'CSV');
  };

  // -- Derived Data --
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;

    return [...data].sort((a: any, b: any) => {
      const aVal = (a as any)[sortConfig.key];
      const bVal = (b as any)[sortConfig.key];

      // Handle nulls
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const paginatedData = useMemo(() => {
      const start = (currentPage - 1) * pageSize;
      return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const displayColumns = useMemo(() => columns.filter(c => visibleColumns.has(c.key)), [columns, visibleColumns]);

  const allSelected = paginatedData.length > 0 && paginatedData.every(item => selectedIds.includes(String((item as any)[keyField])));
  const someSelected = paginatedData.some(item => selectedIds.includes(String((item as any)[keyField]))) && !allSelected;

  const totalPages = Math.ceil(data.length / pageSize);

  // -- Styles --
  const rowHeightClass = density === 'compact' ? 'py-2 text-xs' : 'py-4 text-sm';
  const headerHeightClass = density === 'compact' ? 'py-2' : 'py-3';

  if (isLoading) {
    return (
      <div className={`${theme.components.card} flex flex-col h-full w-full min-w-0 overflow-hidden`}>
         <div className="overflow-x-auto flex-1 scrollbar-thin">
            <table className="min-w-full divide-y divide-slate-100 table-fixed">
              <thead className={`${theme.colors.background}/80 backdrop-blur-sm sticky top-0 z-10`}>
                 <tr>
                    {selectable && <th className="w-12 px-4 py-3"></th>}
                    {columns.map((col, idx) => (
                        <th key={idx} className={theme.components.table.header}>
                            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                        </th>
                    ))}
                 </tr>
              </thead>
              <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                  {[...Array(pageSize)].map((_, i) => (
                      <tr key={i} className={theme.components.table.row}>
                           {selectable && <td className="w-12 px-4 py-3"><Skeleton height={16} width={16} variant="rect"/></td>}
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
    <div className={`${theme.components.card} flex flex-col h-full w-full min-w-0 overflow-hidden border border-slate-200 shadow-sm`}>
      {/* Toolbar */}
      {enableToolbar && (
          <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-white flex-shrink-0">
              <div className="text-xs text-slate-500 font-medium">
                  {data.length} Records
              </div>
              <div className="flex items-center gap-1">
                  <div className="relative" ref={colMenuRef}>
                      <button 
                        onClick={() => setIsColMenuOpen(!isColMenuOpen)}
                        className={`p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors ${isColMenuOpen ? 'bg-slate-100 text-nexus-600' : ''}`}
                        title="Columns"
                      >
                          <Columns size={16}/>
                      </button>
                      {isColMenuOpen && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-100">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-2">Toggle Columns</div>
                              <div className="max-h-60 overflow-y-auto space-y-1">
                                  {columns.map(col => (
                                      <label key={col.key} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer text-xs text-slate-700">
                                          <input 
                                            type="checkbox" 
                                            checked={visibleColumns.has(col.key)} 
                                            onChange={() => toggleColumn(col.key)}
                                            className="rounded text-nexus-600 focus:ring-nexus-500"
                                          />
                                          {col.header}
                                      </label>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>

                  <button 
                    onClick={() => setDensity(d => d === 'normal' ? 'compact' : 'normal')}
                    className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
                    title="Toggle Density"
                  >
                      {density === 'normal' ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                  </button>

                  <div className="w-px h-4 bg-slate-200 mx-1"></div>

                  <button 
                    onClick={handleExport}
                    className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
                    title="Export CSV"
                  >
                      <Download size={16}/>
                  </button>
              </div>
          </div>
      )}

      {/* Table Area */}
      <div className="overflow-auto flex-1 scrollbar-thin">
        <table className={`min-w-full divide-y ${theme.colors.border.replace('border-', 'divide-')} table-fixed`}>
          <thead className={`${theme.colors.background}/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm`}>
            <tr>
              {selectable && (
                  <th scope="col" className={`w-12 px-4 ${headerHeightClass} border-b border-border`}>
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-nexus-600 focus:ring-nexus-500 cursor-pointer"
                        checked={allSelected}
                        ref={input => { if (input) input.indeterminate = someSelected; }}
                        onChange={handleSelectAll}
                      />
                  </th>
              )}
              {displayColumns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`
                    ${theme.components.table.header}
                    ${headerHeightClass}
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
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => {
                const id = String((item as any)[keyField]);
                const isRowSelected = selectedIds.includes(id);
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`
                      ${theme.components.table.row}
                      ${isRowSelected ? 'bg-nexus-50/30' : ''}
                      ${onRowClick ? `cursor-pointer hover:${theme.colors.background} hover:border-l-nexus-500 focus:${theme.colors.background} outline-none border-l-2 border-l-transparent` : ''}
                    `}
                    tabIndex={onRowClick ? 0 : -1}
                  >
                    {selectable && (
                        <td className={`w-12 px-4 ${rowHeightClass}`}>
                            <input 
                                type="checkbox" 
                                className="rounded border-gray-300 text-nexus-600 focus:ring-nexus-500 cursor-pointer"
                                checked={isRowSelected}
                                onClick={(e) => e.stopPropagation()}
                                onChange={() => handleSelectRow(id)}
                            />
                        </td>
                    )}
                    {displayColumns.map((col) => (
                      <td
                        key={`${id}-${col.key}`}
                        className={`
                          ${theme.components.table.cell}
                          ${rowHeightClass}
                          ${col.align === 'right' ? 'text-right font-mono' : col.align === 'center' ? 'text-center' : 'text-left'}
                          ${col.className || ''}
                        `}
                      >
                        {col.render ? col.render(item) : <span className="truncate block">{(item as any)[col.key]}</span>}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={displayColumns.length + (selectable ? 1 : 0)} className={`px-6 py-20 text-center ${theme.colors.text.tertiary}`}>
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
      
      {/* Pagination Footer */}
      {data.length > 0 && (
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center justify-between flex-shrink-0 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select 
                    value={pageSize} 
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded p-1 focus:outline-none focus:ring-1 focus:ring-nexus-500"
                  >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                  </select>
                  <span>per page</span>
              </div>
              
              <div className="flex items-center gap-4">
                  <span>{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, data.length)} of {data.length}</span>
                  <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                          <ChevronLeft size={16}/>
                      </button>
                      <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                          <ChevronRight size={16}/>
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

export default DataTable;
