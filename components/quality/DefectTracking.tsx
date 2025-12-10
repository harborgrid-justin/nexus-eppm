import React, { useState } from 'react';
import { NonConformanceReport } from '../../types';
import { Bug, Plus, Filter } from 'lucide-react';

interface DefectTrackingProps {
    projectId: string;
}

const MOCK_DEFECTS: NonConformanceReport[] = [
    { id: 'NCR-001', projectId: 'P1001', date: '2024-06-10', description: 'Incorrect rebar spacing at grid C', severity: 'Major', status: 'Open', assignedTo: 'Mike Ross', linkedDeliverable: 'T5' },
    { id: 'NCR-002', projectId: 'P1001', date: '2024-06-12', description: 'UI button misaligned on login screen', severity: 'Minor', status: 'In Progress', assignedTo: 'Dev Team', linkedDeliverable: 'T-UI-101' },
    { id: 'NCR-003', projectId: 'P1001', date: '2024-06-15', description: 'API returns 500 error on invalid input', severity: 'Critical', status: 'Open', assignedTo: 'Backend Team', linkedDeliverable: 'T-API-5' },
    { id: 'NCR-004', projectId: 'P1001', date: '2024-06-05', description: 'Typo in user documentation section 4.1', severity: 'Minor', status: 'Closed', assignedTo: 'Tech Writer', linkedDeliverable: 'DOC-001' },
];

const DefectTracking: React.FC<DefectTrackingProps> = ({ projectId }) => {
    
    const getSeverityColor = (severity: NonConformanceReport['severity']) => {
        if (severity === 'Critical') return 'bg-red-100 text-red-800';
        if (severity === 'Major') return 'bg-yellow-100 text-yellow-800';
        return 'bg-blue-100 text-blue-800';
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    <Bug size={16} /> Defect / Non-Conformance Log
                </h3>
                <button className="px-3 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium">
                    <Plus size={16} /> Log Defect
                </button>
            </div>
            <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Severity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned To</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {MOCK_DEFECTS.map(d => (
                            <tr key={d.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-sm font-mono text-slate-500">{d.id}</td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-800">{d.description}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(d.severity)}`}>
                                        {d.severity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{d.status}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{d.assignedTo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DefectTracking;
