
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { CheckCircle, Loader2, XCircle, AlertCircle, ChevronDown, ChevronRight, FileText, Terminal } from 'lucide-react';
import { useJobHistoryLogic } from '../../../hooks/domain/useJobHistoryLogic';

export const JobHistory: React.FC = () => {
    const theme = useTheme();
    const {
        dataJobs,
        expandedJobId,
        toggleExpand,
        generateLogs,
        totalJobs,
        errorJobs
    } = useJobHistoryLogic();

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'Completed': return <CheckCircle size={14} className="text-green-500"/>
            case 'In Progress': return <Loader2 size={14} className="text-nexus-500 animate-spin"/>
            case 'Failed': return <XCircle size={14} className="text-red-500"/>
            default: return <AlertCircle size={14} className="text-slate-400"/>
        }
    };

    return (
        <div className={theme.layout.panelContainer}>
            <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center ${theme.colors.background}`}>
                <h2 className={theme.typography.h2}>Job History & Audit Log</h2>
                <div className="flex gap-2 text-xs">
                     <span className={`font-medium ${theme.colors.text.secondary} ${theme.colors.surface} border ${theme.colors.border} px-2 py-1 rounded`}>Total Jobs: {totalJobs}</span>
                     <span className="font-medium text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded">Errors: {errorJobs}</span>
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                <div className="min-w-[800px]">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm`}>
                            <tr>
                            <th className="w-10 px-4 py-3"></th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Job ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type / Format</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Submitted By</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className={`${theme.colors.surface} divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                            {dataJobs.length > 0 ? dataJobs.map(job => (
                                <React.Fragment key={job.id}>
                                    <tr className={`hover:${theme.colors.background} transition-colors cursor-pointer ${expandedJobId === job.id ? `${theme.colors.background}` : ''}`} onClick={() => toggleExpand(job.id)}>
                                        <td className="px-4 py-4 text-slate-400">
                                            {expandedJobId === job.id ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-slate-500">{job.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className={`font-bold ${theme.colors.text.primary} text-sm`}>{job.type}</span>
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
                                            <td colSpan={6} className={`${theme.colors.background}/50 p-6 border-b border-slate-200 shadow-inner`}>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                            <FileText size={14}/> Execution Details
                                                        </h4>
                                                        <div className={`${theme.colors.surface} p-4 rounded-lg border ${theme.colors.border} space-y-2 text-sm ${theme.colors.text.secondary}`}>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-xs text-slate-400 uppercase font-bold">File Name</p>
                                                                    <p className={`${theme.colors.text.primary} font-mono truncate`}>{job.fileName || 'system_generated.dat'}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-slate-400 uppercase font-bold">Size</p>
                                                                    <p className={`${theme.colors.text.primary} font-mono`}>{job.fileSize || '42 KB'}</p>
                                                                </div>
                                                            </div>
                                                            <div className="pt-2 border-t border-slate-100 mt-2">
                                                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Result Message</p>
                                                                <p className={theme.colors.text.primary}>{job.details}</p>
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
                                <tr><td colSpan={6} className={`px-6 py-12 text-center ${theme.colors.text.tertiary}`}><div className="flex flex-col items-center"><AlertCircle size={24} className="mb-2 opacity-50"/><p>No job history available.</p></div></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
