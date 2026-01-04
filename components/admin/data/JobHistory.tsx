
import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { useTheme } from '../../../context/ThemeContext';
import { CheckCircle, Loader2, XCircle, AlertCircle, ChevronDown, ChevronRight, FileText, AlertTriangle, Terminal } from 'lucide-react';
import { DataJob } from '../../../types';

export const JobHistory: React.FC = () => {
    const { state } = useData();
    const theme = useTheme();
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'Completed': return <CheckCircle size={14} className="text-green-500"/>
            case 'In Progress': return <Loader2 size={14} className="text-nexus-500 animate-spin"/>
            case 'Failed': return <XCircle size={14} className="text-red-500"/>
            default: return <AlertCircle size={14} className="text-slate-400"/>
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedJobId(expandedJobId === id ? null : id);
    };

    // Generate deterministic logs based on job data
    const generateLogs = (job: DataJob) => {
        const logs = [];
        const ts = new Date(job.timestamp);
        const fmt = (offsetSeconds: number) => new Date(ts.getTime() + offsetSeconds * 1000).toLocaleTimeString();

        logs.push(`[${fmt(0)}] INFO: Job ${job.id} initialized by ${job.submittedBy}`);
        logs.push(`[${fmt(1)}] INFO: Handshake established. Protocol: ${job.format}`);
        
        if (job.type === 'Import') {
             logs.push(`[${fmt(2)}] INFO: Uploading payload (${job.fileSize || 'Unknown Size'})...`);
             logs.push(`[${fmt(4)}] INFO: Validating schema integrity...`);
             if (job.status === 'Failed') {
                 logs.push(`[${fmt(6)}] ERROR: Schema validation failed. Unexpected token at line 42.`);
                 logs.push(`[${fmt(7)}] ERROR: Transaction rolled back.`);
             } else {
                 logs.push(`[${fmt(5)}] SUCCESS: Validation passed. Schema v2.4.`);
                 logs.push(`[${fmt(8)}] INFO: Committing records to warehouse...`);
                 logs.push(`[${fmt(12)}] SUCCESS: ${job.details}`);
             }
        } else {
             logs.push(`[${fmt(2)}] INFO: Querying Data Warehouse...`);
             logs.push(`[${fmt(5)}] INFO: Serializing to ${job.format}...`);
             if (job.status === 'Completed') {
                 logs.push(`[${fmt(8)}] SUCCESS: File generated. Available for download.`);
             }
        }
        return logs;
    };

    const dataJobs = state.dataJobs || [];

    return (
        <div className={theme.layout.panelContainer}>
            <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center bg-slate-50`}>
                <h2 className={theme.typography.h2}>Job History & Audit Log</h2>
                <div className="flex gap-2 text-xs">
                     <span className="font-medium text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">Total Jobs: {dataJobs.length}</span>
                     <span className="font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded">Errors: {dataJobs.filter(j => j.status === 'Failed').length}</span>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <div className="min-w-[800px]">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                            <th className="w-10 px-4 py-3"></th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Job ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type / Format</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted By</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {dataJobs.length > 0 ? dataJobs.map(job => (
                                <React.Fragment key={job.id}>
                                    <tr className={`hover:bg-slate-50 transition-colors cursor-pointer ${expandedJobId === job.id ? 'bg-slate-50' : ''}`} onClick={() => toggleExpand(job.id)}>
                                        <td className="px-4 py-4 text-slate-400">
                                            {expandedJobId === job.id ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-slate-500">{job.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-700 text-sm">{job.type}</span>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">{job.format}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(job.status)}
                                                <span className={`text-sm ${job.status === 'Completed' ? 'text-green-700' : job.status === 'Failed' ? 'text-red-700' : 'text-slate-600'}`}>{job.status}</span>
                                            </div>
                                            {job.status === 'In Progress' && <div className="w-20 h-1 bg-slate-200 rounded-full mt-1 overflow-hidden"><div className="bg-nexus-500 h-full transition-all duration-300" style={{ width: `${job.progress || 0}%` }}></div></div>}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{job.submittedBy}</td>
                                        <td className="px-6 py-4 text-xs text-slate-500">{job.timestamp}</td>
                                    </tr>
                                    {expandedJobId === job.id && (
                                        <tr>
                                            <td colSpan={6} className="bg-slate-50/50 p-6 border-b border-slate-200 shadow-inner">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                            <FileText size={14}/> Execution Details
                                                        </h4>
                                                        <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2 text-sm text-slate-600">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-xs text-slate-400 uppercase font-bold">File Name</p>
                                                                    <p className="text-slate-800 font-mono truncate">{job.fileName || 'system_generated.dat'}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-slate-400 uppercase font-bold">Size</p>
                                                                    <p className="text-slate-800 font-mono">{job.fileSize || '42 KB'}</p>
                                                                </div>
                                                            </div>
                                                            <div className="pt-2 border-t border-slate-100 mt-2">
                                                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Result Message</p>
                                                                <p className="text-slate-800">{job.details}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                            <Terminal size={14}/> Engine Log
                                                        </h4>
                                                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-xs font-mono text-green-400 overflow-y-auto max-h-40">
                                                            {generateLogs(job).map((log, i) => (
                                                                <div key={i} className="mb-1 last:mb-0 border-b border-slate-800/50 pb-0.5 last:border-0 last:pb-0">
                                                                    <span className="opacity-70 mr-2">{'>'}</span>
                                                                    {log}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            )) : (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400"><div className="flex flex-col items-center"><AlertCircle size={24} className="mb-2 opacity-50"/><p>No job history available.</p></div></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
