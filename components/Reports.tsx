
import React, { useState, useMemo } from 'react';
import { Project, Task, Risk } from '../types/index';
import { useData } from '../context/DataContext';
import { FileText, Eye, Download, Play, ListFilter, Columns } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';

type SubjectArea = 'Projects' | 'Tasks' | 'Risks';

const ALL_FIELDS: Record<SubjectArea, {id: string, label: string}[]> = {
    'Projects': [
        { id: 'code', label: 'Project Code' },
        { id: 'name', label: 'Project Name' },
        { id: 'managerId', label: 'Project Manager' },
        { id: 'health', label: 'Health' },
        { id: 'budget', label: 'Budget' },
        { id: 'spent', label: 'Spent' },
    ],
    'Tasks': [
        { id: 'wbsCode', label: 'WBS Code' },
        { id: 'name', label: 'Task Name' },
        { id: 'status', label: 'Status' },
        { id: 'startDate', label: 'Start Date' },
        { id: 'endDate', label: 'End Date' },
        { id: 'critical', label: 'Critical' },
    ],
    'Risks': [
        { id: 'id', label: 'Risk ID' },
        { id: 'description', label: 'Description' },
        { id: 'category', label: 'Category' },
        { id: 'score', label: 'Score' },
        { id: 'status', label: 'Status' },
        { id: 'ownerId', label: 'Owner' },
    ],
}

const Reports: React.FC = () => {
  const { state } = useData();
  const { projects } = state;
  const [subjectArea, setSubjectArea] = useState<SubjectArea>('Projects');
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set(['code', 'name', 'managerId', 'health']));
  const [reportData, setReportData] = useState<Record<string, any>[] | null>(null);
  const theme = useTheme();

  const availableColumns = useMemo(() => ALL_FIELDS[subjectArea], [subjectArea]);

  const handleColumnToggle = (id: string) => {
    const newSelection = new Set(selectedColumns);
    if (newSelection.has(id)) {
        newSelection.delete(id);
    } else {
        newSelection.add(id);
    }
    setSelectedColumns(newSelection);
  };
  
  const handleGeneratePreview = () => {
    let data: any[] = [];
    if (subjectArea === 'Projects') {
      data = projects;
    } else if (subjectArea === 'Tasks') {
        data = state.projects.flatMap(p => p.tasks);
    } else if (subjectArea === 'Risks') {
        data = state.risks;
    }
    setReportData(data);
  };

  const previewData = useMemo(() => {
      if (!reportData) return null;
      return reportData.slice(0, 50); // Optimization: Limit preview to 50 rows
  }, [reportData]);

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="Report Builder" 
        subtitle="Create, run, and save custom tabular reports."
        icon={FileText}
      />
      
      <div className={theme.layout.panelContainer}>
          <div className={`flex-1 grid grid-cols-[350px_1fr] ${theme.layout.gridGap} overflow-hidden bg-slate-50/50 p-4`}>
            {/* Config Panel */}
            <div className={`${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} flex flex-col overflow-hidden`}>
                <div className={`p-4 ${theme.layout.headerBorder}`}>
                    <h2 className="font-bold text-slate-800">Report Configuration</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-2">1. Subject Area</label>
                        <select
                            value={subjectArea}
                            onChange={e => {
                                setSubjectArea(e.target.value as SubjectArea);
                                setSelectedColumns(new Set()); // Reset columns on change
                                setReportData(null);
                            }}
                            className="w-full p-2 border border-slate-300 rounded-md text-sm"
                        >
                            <option value="Projects">Projects</option>
                            <option value="Tasks">Tasks</option>
                            <option value="Risks">Risks</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-2 flex items-center gap-2"><Columns size={16}/> 2. Columns</label>
                        <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-md p-2 bg-slate-50/50">
                            {availableColumns.map(col => (
                            <label key={col.id} className="flex items-center gap-2 p-1 rounded hover:bg-slate-100 text-sm cursor-pointer">
                                <input type="checkbox" checked={selectedColumns.has(col.id)} onChange={() => handleColumnToggle(col.id)} className="rounded text-nexus-600 focus:ring-nexus-500"/>
                                {col.label}
                            </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-2 flex items-center gap-2"><ListFilter size={16}/> 3. Filters</label>
                        <button className="w-full p-2 text-sm border-2 border-dashed border-slate-200 rounded-lg text-slate-500 hover:border-nexus-400">
                            + Add Filter
                        </button>
                    </div>
                </div>
                <div className={`p-4 ${theme.layout.headerBorder} border-t bg-slate-50 flex gap-2`}>
                    <button 
                    onClick={handleGeneratePreview}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700`}
                    >
                        <Play size={14}/> Run Preview
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Save
                    </button>
                </div>
            </div>
            
            {/* Preview Panel */}
            <div className={`${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} flex flex-col overflow-hidden`}>
                <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center`}>
                    <h2 className="font-bold text-slate-800 flex items-center gap-2"><Eye size={16}/> Report Preview</h2>
                    {reportData && <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm text-slate-600 hover:bg-slate-50"><Download size={14}/> Export</button>}
                </div>
                <div className="flex-1 overflow-auto">
                    {previewData ? (
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 sticky top-0">
                                <tr>
                                    {Array.from(selectedColumns).map(colId => (
                                        <th key={colId} className="px-4 py-2 text-left font-semibold text-slate-600">{availableColumns.find(c => c.id === colId)?.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {previewData.map((row: Record<string, any>, idx) => ( 
                                <tr key={idx} className="hover:bg-slate-50">
                                    {Array.from(selectedColumns).map((colId: string) => (
                                        <td key={colId} className="px-4 py-2 text-slate-700 whitespace-nowrap">{String(row[colId] ?? '')}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
                            <p>Configure and run a report to see a preview.</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default Reports;
