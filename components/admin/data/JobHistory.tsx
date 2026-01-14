import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { CheckCircle, Loader2, XCircle, AlertCircle, ChevronDown, ChevronRight, FileText, Terminal, History } from 'lucide-react';
import { useJobHistoryLogic } from '../../../hooks/domain/useJobHistoryLogic';
import { EmptyGrid } from '../../common/EmptyGrid';

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
        <div className={`h-full flex flex-col bg-white overflow-hidden shadow-inner`}>
            <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 gap-4`}>
                <div className="flex items-center gap-3">
                    <History className="text-nexus-600" size={20}/>
                    <h2 className="text-base font-black text-slate-900 uppercase tracking-tighter">Transmission Registry & Audit</h2>
                </div>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                     <span className={`text-slate-400 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm`}>Total Threads: {totalJobs}</span>
                     {errorJobs > 0 && <span className="text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full shadow-sm">Faults: {errorJobs}</span>}
                </div>
            </div>
            <div className="flex-1 overflow-auto">
                {dataJobs.length > 0 ? (
                    <div className="min-w-[800px]">
                        <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                            <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm border-b`}>
                                <tr>
                                <th className="w-12 px-4 py-3 bg-slate-50"></th>
                                <th className={theme.components.table.header + " bg-slate-50"}>Job identifier</th>
                                <th className={theme.components.table.header + " bg-slate-50"}>Topology / Format</th>
                                <th className={theme.components.table.header + " bg-slate-50"}>Status</th>
                                <th className={theme.components.table.header + " bg-slate-50"}>Submitted By</th>
                                <th className={theme.components.table.header + " bg-slate-50"}>Post Date</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')} bg-white`}>
                                {dataJobs.map(job => (
                                    <React.Fragment key={job.id}>
                                        <tr className={`hover:bg-slate-50 transition-colors cursor-pointer group ${expandedJobId === job.id ? `bg-nexus-50/20` : ''}`} onClick={() => toggleExpand(job.id)}>
                                            <td className={`px-4 py-4 text-slate-400 group-hover:text-nexus-600 transition-colors text-center`}>
                                                {expandedJobId === job.id ? <ChevronDown size={16}/> : <ChevronRight size={16}/>}
                                            </td>
                                            <td className={`px-6 py-4 text-[11px] font-mono font-black text-slate-400 uppercase tracking-tighter`}>{job.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className={`font-black text-slate-800 text-sm uppercase tracking-tight`}>{job.type}</span>
                                                    <span className={`text-[9px] font-bold text-slate-400 uppercase tracking-widest`}>{job.format} Payload</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(job.status)}
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${job.status === 'Completed' ? 'text-green-700' : job.status === 'Failed' ? 'text-red-700' : 'text-slate-600'}`}>{job.status}</span>
                                                </div>
                                                {job.status === 'In Progress' && <div className="w-24 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden border border-slate-200"><div className="bg-nexus-500 h-full transition-all duration-300" style={{ width: `${job.progress || 0}%` }}></div></div>}
                                            </td>
                                            <td className={`px-6 py-4 text-xs font-bold text-slate-600`}>{job.submittedBy}</td>
                                            <td className={`px-6 py-4 text-[10px] font-mono font-bold text-slate-400`}>{job.timestamp}</td>
                                        </tr>
                                        {expandedJobId === job.id && (
                                            <tr className="animate-nexus-in">
                                                <td colSpan={6} className={`bg-slate-50/50 p-8 border-b border-slate-200 shadow-inner relative`}>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                        <div className="space-y-6">
                                                            <h4 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2`}>
                                                                <FileText size={14} className="text-nexus-500"/> Transmission Parameters
                                                            </h4>
                                                            <div className={`bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4`}>
                                                                <div className="grid grid-cols-2 gap-6">
                                                                    <div>
                                                                        <p className={`text-[9px] text-slate-400 uppercase font-black tracking-tighter`}>Artifact Source</p>
                                                                        <p className={`text-xs font-mono font-bold text-slate-800 truncate mt-0.5`}>{job.fileName || 'SYS_GENERATED_BUFFER'}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className={`text-[9px] text-slate-400 uppercase font-black tracking-tighter`}>Payload Size</p>
                                                                        <p className={`text-xs font-mono font-bold text-slate-800 mt-0.5`}>{job.fileSize || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                                <div className={`pt-4 border-t border-slate-100`}>
                                                                    <p className={`text-[9px] text-slate-400 uppercase font-black tracking-tighter mb-1`}>Execution Summary</p>
                                                                    <p className="text-xs font-medium text-slate-700 leading-relaxed">{job.details}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-6">
                                                            <h4 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2`}>
                                                                <Terminal size={14} className="text-green-600"/> Handshake Console
                                                            </h4>
                                                            <div className={`bg-slate-900 p-5 rounded-2xl border border-slate-800 text-[10px] font-mono text-green-400 overflow-y-auto max-h-48 shadow-2xl scrollbar-thin`}>
                                                                {generateLogs(job).map((log, i) => (
                                                                    <div key={i} className="mb-1.5 last:mb-0 pb-1 border-b border-white/5 last:border-0 last:pb-0 group/log">
                                                                        <span className="text-slate-600 mr-2 select-none">{'>'}</span>
                                                                        <span className="group-hover/log:text-white transition-colors">{log}</span>
                                                                    </div>
                                                                ))}
                                                                <div className="animate-pulse inline-block ml-4 text-green-300">_</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center p-20">
                         <EmptyGrid 
                            title="Audit Stream Silence"
                            description="The data transformation history is currently unpopulated. Process an export or sync job to activate the registry."
                            icon={History}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};