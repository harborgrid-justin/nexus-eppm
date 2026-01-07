
import React from 'react';
import { FileText, Eye, Download, Play, ListFilter, Columns, FileSearch } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { useReportBuilderLogic } from '../hooks/domain/useReportBuilderLogic';
import { useTheme } from '../context/ThemeContext';
import { EmptyGrid } from './common/EmptyGrid';
import { Button } from './ui/Button';

const Reports: React.FC = () => {
  const theme = useTheme();
  const {
      subjectArea,
      selectedColumns,
      reportData,
      availableColumns,
      previewData,
      handleSubjectChange,
      handleColumnToggle,
      handleGeneratePreview
  } = useReportBuilderLogic();

  return (
    <div className={`p-[var(--spacing-gutter)] space-y-4 flex flex-col h-full w-full max-w-[var(--spacing-container)] mx-auto ${theme.colors.background}`}>
      <PageHeader 
        title="Analytical Report Builder" 
        subtitle="Compile cross-module data into executive summaries and exportable ledgers."
        icon={FileText}
      />
      
      <div className={`flex flex-col h-full ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
          <div className={`flex-1 grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-4 overflow-hidden ${theme.colors.background}/30 p-4`}>
            
            {/* Config Panel */}
            <div className={`${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} flex flex-col overflow-hidden`}>
                <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.background}/50`}>
                    <h2 className={`font-bold ${theme.colors.text.primary} text-sm uppercase tracking-wider`}>Reporting Logic</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
                    <div>
                        <label className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest block mb-2`}>1. Data Domain</label>
                        <select
                            value={subjectArea}
                            onChange={e => handleSubjectChange(e.target.value as any)}
                            className={`w-full p-2.5 ${theme.colors.background} border ${theme.colors.border} rounded-lg text-sm font-bold ${theme.colors.text.primary} outline-none focus:ring-2 focus:ring-nexus-500`}
                        >
                            <option value="Projects">Projects Portfolio</option>
                            <option value="Tasks">Task Execution</option>
                            <option value="Risks">Enterprise Risks</option>
                        </select>
                    </div>
                    <div>
                        <label className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest block mb-2 flex items-center gap-2`}>
                            <Columns size={12}/> 2. Field Selection
                        </label>
                        <div className={`space-y-1 max-h-60 overflow-y-auto border ${theme.colors.border} rounded-lg p-2 ${theme.colors.background}/50`}>
                            {availableColumns.map(col => (
                            <label key={col.id} className={`flex items-center gap-3 p-2 rounded-md hover:${theme.colors.background} text-sm font-medium ${theme.colors.text.secondary} cursor-pointer transition-colors`}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedColumns.has(col.id)} 
                                    onChange={() => handleColumnToggle(col.id)} 
                                    className="rounded text-nexus-600 focus:ring-nexus-500 border-slate-300 w-4 h-4"
                                />
                                {String(col.label)}
                            </label>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest block mb-2 flex items-center gap-2`}>
                            <ListFilter size={12}/> 3. Predicate Filters
                        </label>
                        <button className={`w-full p-3 text-xs font-bold border-2 border-dashed ${theme.colors.border} rounded-xl ${theme.colors.text.tertiary} hover:border-nexus-300 hover:text-nexus-600 transition-all`}>
                            + Define Filter Criteria
                        </button>
                    </div>
                </div>
                <div className={`p-4 border-t ${theme.colors.border} ${theme.colors.background}/50 flex gap-2`}>
                    <Button 
                        onClick={handleGeneratePreview}
                        className="flex-1 shadow-lg shadow-nexus-500/20"
                        icon={Play}
                        size="md"
                    >
                        Compile Preview
                    </Button>
                </div>
            </div>
            
            {/* Preview Panel */}
            <div className={`${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} flex flex-col overflow-hidden`}>
                <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center bg-white`}>
                    <h2 className={`font-bold ${theme.colors.text.primary} flex items-center gap-2 text-sm uppercase tracking-widest`}>
                        <Eye size={16} className="text-nexus-600"/> Result Set Preview
                    </h2>
                    {reportData && (
                        <div className="flex gap-2">
                             <Button variant="outline" size="sm" icon={Download}>Export</Button>
                        </div>
                    )}
                </div>
                <div className={`flex-1 overflow-auto ${theme.colors.background}/20`}>
                    {previewData && previewData.length > 0 ? (
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm`}>
                                <tr>
                                    {Array.from(selectedColumns).map(colId => (
                                        <th key={colId} className={`px-6 py-3 text-left text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest border-b ${theme.colors.border}`}>
                                            {String(availableColumns.find(c => c.id === colId)?.label)}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-slate-50 bg-white`}>
                            {previewData.map((row: Record<string, any>, idx) => ( 
                                <tr key={idx} className={`hover:${theme.colors.background} transition-colors group`}>
                                    {Array.from(selectedColumns).map((colId: string) => (
                                        <td key={colId} className={`px-6 py-3 text-sm font-medium ${theme.colors.text.secondary} group-hover:${theme.colors.text.primary} whitespace-nowrap font-mono`}>
                                            {String(row[colId] ?? '')}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="h-full flex items-center justify-center p-8">
                            <EmptyGrid 
                                title="Report Buffer Empty"
                                description="Adjust your configuration on the left and run the compiler to generate a live preview of the target subject area."
                                icon={FileSearch}
                                actionLabel="Run Standard Report"
                                onAdd={handleGeneratePreview}
                            />
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
