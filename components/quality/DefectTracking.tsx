
import React from 'react';
import { NonConformanceReport } from '../../types';
import { Bug, Plus, Lock } from 'lucide-react';
import { useProjectState } from '../../hooks/useProjectState';
import { usePermissions } from '../../hooks/usePermissions';

interface DefectTrackingProps {
    projectId: string;
}

const DefectTracking: React.FC<DefectTrackingProps> = ({ projectId }) => {
    const { nonConformanceReports } = useProjectState(projectId);
    const { canEditProject } = usePermissions();
    
    const getSeverityColor = (severity: NonConformanceReport['severity']) => {
        if (severity === 'Critical') return 'bg-red-100 text-red-800';
        if (severity === 'Major') return 'bg-yellow-100 text-yellow-800';
        return 'bg-blue-100 text-blue-800';
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between bg-slate-50">
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    <Bug size={16} /> Defect Log
                </h3>
                {canEditProject() ? (
                    <button className="px-3 py-2 bg-nexus-600 text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium">
                        <Plus size={16} /> <span className="hidden sm:inline">Log Defect</span>
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                        <Lock size={14}/> Read Only
                    </div>
                )}
            </div>
            <div className="flex-1 overflow-auto">
                <div className="min-w-[700px]">
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
                            {nonConformanceReports && nonConformanceReports.length > 0 ? nonConformanceReports.map(d => (
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
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">No defects logged for this project.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DefectTracking;
