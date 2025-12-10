import React from 'react';
import { useData } from '../context/DataContext';
import { Database, UploadCloud, Download, Clock, CheckCircle, XCircle } from 'lucide-react';
import { DataJob } from '../types';

const DataExchange: React.FC = () => {
    const { state } = useData();

    const getStatusIcon = (status: DataJob['status']) => {
        switch(status) {
            case 'Completed': return <CheckCircle size={14} className="text-green-500"/>
            case 'In Progress': return <Clock size={14} className="text-yellow-500"/>
            case 'Failed': return <XCircle size={14} className="text-red-500"/>
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Database className="text-nexus-600" /> Data Exchange Center
                    </h1>
                    <p className="text-slate-500">Import and export data from external systems like P6 and Microsoft Project.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Import */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <UploadCloud size={20} className="text-nexus-500" /> Import Data
                    </h2>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-10 text-center cursor-pointer hover:border-nexus-400 hover:bg-slate-50/50">
                        <UploadCloud size={32} className="mx-auto text-slate-400 mb-2" />
                        <p className="font-semibold text-slate-700">Drag & drop files here</p>
                        <p className="text-xs text-slate-500">Supported formats: P6 XML, XER, MPP, CSV</p>
                    </div>
                </div>
                {/* Export */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                        <Download size={20} className="text-nexus-500" /> Export Data
                    </h2>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-slate-600">Select Projects</label>
                            <select multiple className="w-full mt-1 border border-slate-300 rounded-md p-2 h-24 text-sm">
                                {state.projects.map(p => <option key={p.id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-600">Format</label>
                             <select className="w-full mt-1 border border-slate-300 rounded-md p-2 text-sm bg-white">
                                <option>Primavera P6 XML</option>
                                <option>CSV (Tasks)</option>
                                <option>Microsoft Project MPP</option>
                            </select>
                        </div>
                        <button className="w-full py-2 bg-nexus-600 text-white font-semibold rounded-lg hover:bg-nexus-700">
                            Export
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="font-bold text-slate-800">Job History</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                               <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                               <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Format</th>
                               <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                               <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Details</th>
                               <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                               <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {state.dataJobs.map(job => (
                                <tr key={job.id}>
                                    <td className="px-4 py-3 text-sm font-medium">{job.type}</td>
                                    <td className="px-4 py-3 text-sm">{job.format}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <span className="flex items-center gap-2">{getStatusIcon(job.status)} {job.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-500">{job.details}</td>
                                    <td className="px-4 py-3 text-sm text-slate-500">{job.submittedBy}</td>
                                    <td className="px-4 py-3 text-sm text-slate-500">{job.timestamp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataExchange;