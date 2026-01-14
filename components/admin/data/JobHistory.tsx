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
            case 'Completed': return <CheckCircle size={16} className="text-green-500"/>
            case 'In Progress': return <Loader2 size={16} className="text-nexus-500 animate-spin"/>
            case 'Failed': return <XCircle size={16} className="text-red-500"/>
            default: return <AlertCircle size={16} className="text-slate-400"/>
        }
    };

    return (
        <div className={`h-full flex flex-col bg-white overflow-hidden shadow-inner`}>
            <div className={`p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 gap-4`}>
                <div className="flex items-center gap-4">
                    <History className="text-nexus-600" size={24}/>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Transmission Registry & Audit</h2>
                        <p className="text-xs text-slate-500 font-medium">Historical audit of all cross-tenant ETL and synchronization threads.</p>
                    </div>
                </div>
                <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                     <span className={`text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm`}>Threads: {totalJobs}</span>
                     {errorJobs > 0 && <span className="text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-xl shadow-sm">Faults: {errorJobs}</span>}
                </div>
            </div>
            <div className="flex-1 overflow-auto scrollbar-thin">
                {dataJobs.length > 0 ? (
                    <div className="min-w-[1000px]">
                        <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                            <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm border-b`}>
                                <tr>
                                <th className="w-16 px-4 py-4 bg-slate-50"></th>
                                <th className={theme.components.table.header + " bg-slate-50"}>Transmission Token</th>
                                <th className={theme.components.table.header + " bg-slate-50"}>Logic / Payload</th>
                                <th className={theme.components.table.header + " bg-slate-50"}>Integrity</th>
                                <th className={theme.components.table.header + " bg-slate-50"}>Principal</th>
                                <th className={theme.components.table.header + " bg-slate-50 text-right pr-12"}>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y divide-slate-100 bg-white`}>
                                {dataJobs.map(job => (
                                    <React.Fragment key={job.id}>
                                        <tr className={`hover:bg-slate-50 transition-all cursor-pointer group ${expandedJobId === job.id ? `bg-nexus-50/30` : ''}`} onClick={() => toggleExpand(job.id)}>
                                            <td className={`px-4 py-5 text-slate-400 group-hover:text-nexus-600 transition-colors text-center`}>
                                                {expandedJobId === job.id ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                                            </td>
                                            <td className={`px-6 py-5 text-[11px] font-mono font-black text-slate-400 uppercase tracking-tighter`}>{job.id}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className={`font-black text-slate-800 text-sm uppercase tracking-tight`}>{job.type} Transaction</span>
                                                    <span className={`text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5`}>{job.format} Payload</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    {getStatusIcon(job.status)}
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${job.status === 'Completed' ? 'text-green-700' : job.status === 'Failed' ? 'text-red-700' : 'text-slate-600'}`}>{job.status}</span>
                                                </div>
                                                {job.status === 'In Progress' && <div className="w-28 h-1.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden border border-slate-200"><div className="bg-nexus-500 h-full transition-all duration-300" style={{ width: `${job.progress || 0}%` }}></div></div>}
                                            </td>
                                            <td className={`px-6 py-5 text-xs font-black text-slate-600 uppercase tracking-tight`}>{job.submittedBy}</td>
                                            <td className={`px-6 py-5 text-[10px] font-mono font-bold text-slate-400 text-right pr-12`}>{job.timestamp}</td>
                                        </tr>
                                        {expandedJobId === job.id && (
                                            <tr className="animate-nexus-in">
                                                <td colSpan={6} className={`bg-slate-50 p-10 border-b border-slate-200 shadow-inner relative`}>
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                        <div className="space-y-8">
                                                            <h4 className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2`}>
                                                                <FileText size={16} className="text-nexus-600"/> Transmission Parameters
                                                            </h4>
                                                            <div className={`bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-6`}>
                                                                <div className="grid grid-cols-2 gap-8">
                                                                    <div>
                                                                        <p className={`text-[10px] text-slate-400 uppercase font-black tracking-widest`}>Origin Artifact</p>
                                                                        <p className={`text-xs font-mono font-black text-slate-800 truncate mt-1.5`}>{job.fileName || 'MEMORY_BUFFER_GEN'}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className={`text-[10px] text-slate-400 uppercase font-black tracking-widest`}>Payload Weight</p>
                                                                        <p className={`text-xs font-mono font-black text-slate-800 mt-1.5`}>{job.fileSize || '---'}</p>
                                                                    </div>
                                                                </div>
                                                                <div className={`pt-6 border-t border-slate-50`}>
                                                                    <p className={`text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2`}>Operational Summary</p>
                                                                    <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{job.details}"</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-8">
                                                            <h4 className={`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2`}>
                                                                <Terminal size={16} className="text-green-600"/> Thread Console Log
                                                            </h4>
                                                            <div className={`bg-slate-900 p-6 rounded-[2rem] border border-slate-800 text-[11px] font-mono text-green-400 overflow-y-auto max-h-64 shadow-2xl scrollbar-thin`}>
                                                                {generateLogs(job).map((log, i) => (
                                                                    <div key={i} className="mb-2 last:mb-0 pb-1.5 border-b border-white/5 last:border-0 last:pb-0 group/log flex gap-3">
                                                                        <span className="text-slate-700 select-none font-bold">[{i+1}]</span>
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
                    <div className="h-full flex items-center justify-center p-24">
                         <EmptyGrid 
                            title="Audit Stream Silence"
                            description="The global data transformation history is clear. All ETL jobs and synchronization threads are recorded here for regulatory compliance."
                            icon={History}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};