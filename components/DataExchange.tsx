
import React, { useState, useRef } from 'react';
import { useData } from '../context/DataContext';
import { Database, UploadCloud, Download, CheckCircle, XCircle, FileText, FileCode, FileSpreadsheet, AlertCircle, Loader2, Lock } from 'lucide-react';
import { DataJob, Project } from '../types';
import { useTheme } from '../context/ThemeContext';
import { formatBytes } from '../utils/dataExchangeUtils';
import { usePermissions } from '../hooks/usePermissions';
import { ExportService, ExportFormat } from '../services/ExportService';
import { PageHeader } from './common/PageHeader';

const DataExchange: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const { hasPermission } = usePermissions();
    
    const canExchange = hasPermission('system:configure');

    // Export State
    const [selectedExportProjects, setSelectedExportProjects] = useState<string[]>([]);
    const [exportFormat, setExportFormat] = useState<ExportFormat>('P6 XML');
    const [isExporting, setIsExporting] = useState(false);

    // Import State
    const [dragActive, setDragActive] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Helpers ---
    const getStatusIcon = (status: DataJob['status']) => {
        switch(status) {
            case 'Completed': return <CheckCircle size={14} className="text-green-500"/>
            case 'In Progress': return <Loader2 size={14} className="text-nexus-500 animate-spin"/>
            case 'Failed': return <XCircle size={14} className="text-red-500"/>
        }
    };

    // --- Export Logic ---
    const handleExport = async () => {
        if (!canExchange) return;
        if (selectedExportProjects.length === 0) {
            alert("Please select at least one project to export.");
            return;
        }

        setIsExporting(true);
        const jobId = `EXP-${Date.now()}`;
        
        // 1. Create Job Entry
        dispatch({
            type: 'QUEUE_DATA_JOB',
            payload: {
                id: jobId,
                type: 'Export',
                format: exportFormat,
                status: 'In Progress',
                submittedBy: 'Current User', 
                timestamp: new Date().toLocaleString(),
                details: `Exporting ${selectedExportProjects.length} projects...`,
                progress: 0
            }
        });

        const projectsToExport = state.projects.filter(p => selectedExportProjects.includes(p.name));
        
        try {
            // Use Service
            await ExportService.exportProjects(projectsToExport, exportFormat);

            // 3. Complete Job
            dispatch({
                type: 'UPDATE_DATA_JOB',
                payload: {
                    jobId,
                    status: 'Completed',
                    progress: 100,
                    details: `Successfully exported ${selectedExportProjects.length} projects as ${exportFormat}`
                }
            });
        } catch (e) {
            dispatch({
                type: 'UPDATE_DATA_JOB',
                payload: {
                    jobId,
                    status: 'Failed',
                    details: 'Failed to generate export file.'
                }
            });
        } finally {
            setIsExporting(false);
        }
    };

    // --- Import Logic ---
    const handleFiles = (files: FileList | null) => {
        if (!canExchange) return;
        if (files && files[0]) {
            setImportFile(files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        if (!canExchange) return;
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        if (!canExchange) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleImport = async () => {
        if (!importFile || !canExchange) return;

        setIsImporting(true);
        setImportProgress(0);
        const jobId = `IMP-${Date.now()}`;

        // 1. Queue Job
        dispatch({
            type: 'QUEUE_DATA_JOB',
            payload: {
                id: jobId,
                type: 'Import',
                format: importFile.name.endsWith('.xml') ? 'P6 XML' : importFile.name.endsWith('.csv') ? 'CSV' : 'JSON',
                status: 'In Progress',
                submittedBy: 'Current User',
                timestamp: new Date().toLocaleString(),
                details: `Uploading ${importFile.name}...`,
                fileName: importFile.name,
                fileSize: formatBytes(importFile.size),
                progress: 0
            }
        });

        // 2. Simulate Upload & Parse Steps
        const totalSteps = 5;
        for (let i = 1; i <= totalSteps; i++) {
            await new Promise(resolve => setTimeout(resolve, 600)); // Simulate chunk processing
            const progress = (i / totalSteps) * 100;
            setImportProgress(progress);
            dispatch({
                type: 'UPDATE_DATA_JOB',
                payload: { jobId, status: 'In Progress', progress }
            });
        }

        // 3. Mock Data Parsing Result (In a real app, this would use a FileReader and parser)
        try {
            if (importFile.name.endsWith('.json')) {
                const mockImportedProject: Project = {
                    id: `IMP-PROJ-${Date.now()}`,
                    name: `Imported: ${importFile.name.split('.')[0]}`,
                    code: 'IMP-001',
                    manager: 'System Import',
                    budget: 1000000,
                    spent: 0,
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
                    health: 'Good',
                    tasks: [],
                    originalBudget: 1000000,
                    strategicImportance: 5,
                    financialValue: 5,
                    riskScore: 5,
                    resourceFeasibility: 5,
                    calculatedPriorityScore: 50,
                    category: 'Operational Efficiency',
                    businessCase: 'Imported from external file.',
                    epsId: 'EPS-ROOT',
                    obsId: 'OBS-PMO',
                    calendarId: 'CAL-STD'
                };
                
                dispatch({ type: 'IMPORT_PROJECTS', payload: [mockImportedProject] });
            }

            dispatch({
                type: 'UPDATE_DATA_JOB',
                payload: {
                    jobId,
                    status: 'Completed',
                    progress: 100,
                    details: `Successfully processed ${importFile.name}`
                }
            });
        } catch (e) {
            dispatch({
                type: 'UPDATE_DATA_JOB',
                payload: { jobId, status: 'Failed', details: 'Parsing error or malformed file.' }
            });
        } finally {
            setIsImporting(false);
            setImportFile(null);
        }
    };

    return (
        <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
            <PageHeader 
                title="Data Exchange Center"
                subtitle="Enterprise-grade ETL for Primavera P6, MSP, and ERP integration."
                icon={Database}
            />

            <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
                {/* Import Section */}
                <div className={`${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} p-6 flex flex-col relative`}>
                    {!canExchange && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-slate-500">
                            <Lock size={32} className="mb-2 text-slate-400"/>
                            <p className="font-semibold">Access Restricted</p>
                            <p className="text-xs">You do not have permission to import data.</p>
                        </div>
                    )}
                    <h2 className={`${theme.typography.h2} mb-4 flex items-center gap-2`}>
                        <UploadCloud size={20} className="text-nexus-500" /> Import Data
                    </h2>
                    
                    <div 
                        className={`flex-1 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
                            dragActive ? 'border-nexus-500 bg-nexus-50' : 'border-slate-300 hover:border-nexus-400 hover:bg-slate-50'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            accept=".xml,.csv,.json,.xer" 
                            onChange={(e) => handleFiles(e.target.files)} 
                        />
                        
                        {importFile ? (
                            <div className="text-center w-full">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText size={32} className="text-nexus-600" />
                                </div>
                                <p className="font-bold text-slate-800">{importFile.name}</p>
                                <p className="text-sm text-slate-500 mb-6">{formatBytes(importFile.size)}</p>
                                
                                {isImporting ? (
                                    <div className="w-full max-w-xs mx-auto">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-600">Processing...</span>
                                            <span className="font-bold text-nexus-600">{importProgress.toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                            <div className="bg-nexus-500 h-full transition-all duration-300" style={{ width: `${importProgress}%` }}></div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-3 justify-center">
                                        <button 
                                            onClick={() => setImportFile(null)}
                                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleImport}
                                            className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700 shadow-sm`}
                                        >
                                            Start Import
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center">
                                <UploadCloud size={48} className="mx-auto text-slate-300 mb-4" />
                                <p className="text-lg font-semibold text-slate-700">Drag & drop files here</p>
                                <p className="text-sm text-slate-500 mb-6">Supported: P6 XML, XER, CSV, JSON</p>
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm"
                                >
                                    Browse Files
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Export Section */}
                <div className={`${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} p-6 flex flex-col relative`}>
                    {!canExchange && (
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-slate-500">
                            <Lock size={32} className="mb-2 text-slate-400"/>
                            <p className="font-semibold">Access Restricted</p>
                            <p className="text-xs">You do not have permission to export data.</p>
                        </div>
                    )}
                    <h2 className={`${theme.typography.h2} mb-4 flex items-center gap-2`}>
                        <Download size={20} className="text-nexus-500" /> Export Data
                    </h2>
                    
                    <div className="space-y-6 flex-1">
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 block">1. Select Format</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'P6 XML', icon: FileCode, label: 'Primavera P6' },
                                    { id: 'CSV', icon: FileSpreadsheet, label: 'Excel / CSV' },
                                    { id: 'JSON', icon: Database, label: 'Native JSON' }
                                ].map((fmt) => (
                                    <button
                                        key={fmt.id}
                                        onClick={() => setExportFormat(fmt.id as any)}
                                        className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-2 text-center transition-all ${
                                            exportFormat === fmt.id 
                                            ? 'border-nexus-500 bg-nexus-50 text-nexus-700 ring-1 ring-nexus-500' 
                                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                        }`}
                                    >
                                        <fmt.icon size={24} />
                                        <span className="text-xs font-medium">{fmt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 block">2. Select Projects</label>
                            <div className="border border-slate-200 rounded-lg max-h-48 overflow-y-auto bg-slate-50 p-2 space-y-1">
                                {state.projects.map(p => (
                                    <label key={p.id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer group transition-colors">
                                        <input 
                                            type="checkbox" 
                                            className="rounded text-nexus-600 focus:ring-nexus-500 border-slate-300"
                                            checked={selectedExportProjects.includes(p.name)}
                                            onChange={(e) => {
                                                if (e.target.checked) setSelectedExportProjects(prev => [...prev, p.name]);
                                                else setSelectedExportProjects(prev => prev.filter(n => n !== p.name));
                                            }}
                                        />
                                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{p.name}</span>
                                        <span className="text-xs text-slate-400 ml-auto">{p.code}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                                <span>{selectedExportProjects.length} selected</span>
                                <button 
                                    onClick={() => setSelectedExportProjects(state.projects.map(p => p.name))}
                                    className="text-nexus-600 hover:underline font-medium"
                                >
                                    Select All
                                </button>
                            </div>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100">
                            <button 
                                onClick={handleExport}
                                disabled={isExporting || selectedExportProjects.length === 0}
                                className={`w-full py-3 ${theme.colors.accentBg} text-white font-semibold rounded-lg hover:bg-nexus-700 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                            >
                                {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                                {isExporting ? 'Generating Export...' : 'Download Export Package'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={theme.layout.panelContainer}>
                <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center bg-slate-50`}>
                    <h2 className={theme.typography.h2}>Job History Log</h2>
                    <div className="flex gap-2">
                        <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">Total Jobs: {state.dataJobs.length}</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto max-h-[400px]">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                               <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Job ID</th>
                               <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                               <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Format</th>
                               <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                               <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
                               <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">File Info</th>
                               <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {state.dataJobs.length > 0 ? state.dataJobs.map(job => (
                                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{job.id}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                            job.type === 'Import' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                        }`}>
                                            {job.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{job.format}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(job.status)}
                                            <span className={`text-sm ${
                                                job.status === 'Completed' ? 'text-green-700' : 
                                                job.status === 'Failed' ? 'text-red-700' : 'text-slate-600'
                                            }`}>{job.status}</span>
                                        </div>
                                        {job.status === 'In Progress' && (
                                            <div className="w-20 h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                                <div className="bg-nexus-500 h-full transition-all duration-300" style={{ width: `${job.progress || 0}%` }}></div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-xs" title={job.details}>{job.details}</td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {job.fileName && (
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-700">{job.fileName}</span>
                                                <span>{job.fileSize}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">{job.timestamp}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center">
                                            <AlertCircle size={24} className="mb-2 opacity-50"/>
                                            <p>No job history available.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataExchange;
