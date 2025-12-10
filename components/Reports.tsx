import React, { useState, useMemo } from 'react';
import { Project, Task, Risk } from '../types';
import { useData } from '../context/DataContext';
import { FileText, Eye, Download, Play, ListFilter, Columns } from 'lucide-react';

interface ReportsProps {
  projects: Project[];
}

type SubjectArea = 'Projects' | 'Tasks' | 'Risks';

const ALL_FIELDS: Record<SubjectArea, {id: string, label: string}[]> = {
    'Projects': [
        { id: 'code', label: 'Project Code' },
        { id: 'name', label: 'Project Name' },
        { id: 'manager', label: 'Project Manager' },
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
        { id: 'owner', label: 'Owner' },
    ],
}

const Reports: React.FC<ReportsProps> = ({ projects }) => {
  const { state } = useData();
  const [subjectArea, setSubjectArea] = useState<SubjectArea>('Projects');
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(new Set(['code', 'name', 'manager', 'health']));
  const [reportData, setReportData] = useState<any[] | null>(null);

  const availableColumns = ALL_FIELDS[subjectArea];

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
    // Mock data generation
    let data: any[] = [];
    if (subjectArea === 'Projects') {
      data = projects;
    } else if (subjectArea === 'Tasks') {
        data = state.projects.flatMap(p => p.tasks);
    } else if (subjectArea === 'Risks') {
        // @ts-ignore
        data = state.risks;
    }
    setReportData(data);
  };

  return (
    <div className="animate-in fade-in duration-500 h-full overflow-hidden flex flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText size={24}/> Report Builder
          </h1>
          <p className="text-slate-500">Create, run, and save custom tabular reports.</p>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-[350px_1fr] gap-6 overflow-hidden">
        {/* Config Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200">
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
                           <label key={col.id} className="flex items-center gap-2 p-1 rounded hover:bg-slate-100 text-sm">
                               <input type="checkbox" checked={selectedColumns.has(col.id)} onChange={() => handleColumnToggle(col.id)} />
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
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
                <button 
                  onClick={handleGeneratePreview}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-nexus-600 text-white rounded-lg text-sm font-medium hover:bg-nexus-700"
                >
                    <Play size={14}/> Run Preview
                </button>
                <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                    Save
                </button>
            </div>
        </div>
        
        {/* Preview Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
             <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h2 className="font-bold text-slate-800 flex items-center gap-2"><Eye size={16}/> Report Preview</h2>
                {reportData && <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm text-slate-600 hover:bg-slate-50"><Download size={14}/> Export</button>}
            </div>
            <div className="flex-1 overflow-auto">
                {reportData ? (
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50 sticky top-0">
                            <tr>
                                {Array.from(selectedColumns).map(colId => (
                                    <th key={colId} className="px-4 py-2 text-left font-semibold text-slate-600">{availableColumns.find(c => c.id === colId)?.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {/* FIX: Explicitly type 'row' to avoid it being treated as 'unknown' in strict mode, which prevents property access. */}
                           {reportData.slice(0, 50).map((row: Record<string, any>, idx) => ( // limit to 50 for preview
                               <tr key={idx} className="hover:bg-slate-50">
                                   {Array.from(selectedColumns).map(colId => (
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
  );
};

export default Reports;