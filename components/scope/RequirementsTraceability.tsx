
import React, { useState } from 'react';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { ListChecks, Filter, Plus, Link, CheckCircle, Search, Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Badge } from '../ui/Badge';

const RequirementsTraceability: React.FC = () => {
    const { project } = useProjectWorkspace();
    const theme = useTheme();
    const { canEditProject } = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredReqs = project?.requirements?.filter(r => 
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'Verified': return 'success';
            case 'Active': return 'info';
            case 'Draft': return 'neutral';
            default: return 'warning';
        }
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center bg-slate-50/50`}>
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                        <ListChecks size={18} className="text-nexus-600"/> Requirements Traceability Matrix (RTM)
                    </h3>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input 
                            type="text" 
                            placeholder="Search requirements..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-nexus-500 outline-none w-64"
                        />
                    </div>
                </div>
                {canEditProject() ? (
                    <button className={`flex items-center gap-2 px-3 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700 shadow-sm`}>
                        <Plus size={14}/> Add Requirement
                    </button>
                ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-400">
                        <Lock size={14}/> Read Only
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-1/3">Requirement Description</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">WBS Link</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Verification</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {filteredReqs.map(req => (
                            <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-600">{req.id}</td>
                                <td className="px-6 py-4 text-sm text-slate-800 font-medium">{req.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{req.source}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-sm text-nexus-600 bg-nexus-50 px-2 py-1 rounded w-fit border border-nexus-200 cursor-pointer hover:bg-nexus-100">
                                        <Link size={12}/> WBS-1.2
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{req.verificationMethod}</td>
                                <td className="px-6 py-4 text-center">
                                    <Badge variant={getStatusColor(req.status) as any}>{req.status}</Badge>
                                </td>
                            </tr>
                        ))}
                        {filteredReqs.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    No requirements found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RequirementsTraceability;
