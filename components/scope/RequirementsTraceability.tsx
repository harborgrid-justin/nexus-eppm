
import React, { useState } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { ListChecks, Plus, Link, CheckCircle, Search, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Badge } from '../ui/Badge';
import { EmptyGrid } from '../common/EmptyGrid';

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

    const handleAddRequirement = () => {
        // In a real implementation, this would open a modal
        console.log("Add requirement clicked");
    };

    return (
        <div className={`h-full flex flex-col ${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center ${theme.colors.background}/50 flex-shrink-0`}>
                <div className="flex items-center gap-4">
                    <h3 className={`font-semibold ${theme.colors.text.primary} text-sm flex items-center gap-2`}>
                        <ListChecks size={18} className="text-nexus-600"/> Requirements Traceability Matrix (RTM)
                    </h3>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input 
                            type="text" 
                            placeholder="Search requirements..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`pl-9 pr-4 py-1.5 text-sm border ${theme.colors.border} rounded-md focus:ring-1 focus:ring-nexus-500 outline-none w-64 ${theme.colors.background} ${theme.colors.text.primary}`}
                        />
                    </div>
                </div>
                {canEditProject() ? (
                    <button onClick={handleAddRequirement} className={`flex items-center gap-2 px-3 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700 shadow-sm`}>
                        <Plus size={14}/> Add Requirement
                    </button>
                ) : (
                    <div className={`flex items-center gap-2 px-3 py-2 ${theme.colors.background} border ${theme.colors.border} rounded-lg text-sm ${theme.colors.text.tertiary}`}>
                        <Lock size={14}/> Read Only
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-auto">
                {filteredReqs.length > 0 ? (
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm`}>
                            <tr>
                                <th className={theme.components.table.header}>ID</th>
                                <th className={theme.components.table.header}>Requirement Description</th>
                                <th className={theme.components.table.header}>Source</th>
                                <th className={theme.components.table.header}>WBS Link</th>
                                <th className={theme.components.table.header}>Verification</th>
                                <th className={`${theme.components.table.header} text-center`}>Status</th>
                            </tr>
                        </thead>
                        <tbody className={`${theme.colors.surface} divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                            {filteredReqs.map(req => (
                                <tr key={req.id} className={`hover:${theme.colors.background} transition-colors`}>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${theme.colors.text.tertiary}`}>{req.id}</td>
                                    <td className={`px-6 py-4 text-sm ${theme.colors.text.primary} font-medium`}>{req.description}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme.colors.text.secondary}`}>{req.source}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-nexus-600 bg-nexus-50 px-2 py-1 rounded w-fit border border-nexus-200 cursor-pointer hover:bg-nexus-100">
                                            <Link size={12}/> WBS-1.2
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-sm ${theme.colors.text.secondary}`}>{req.verificationMethod}</td>
                                    <td className="px-6 py-4 text-center">
                                        <Badge variant={getStatusColor(req.status) as any}>{req.status}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <EmptyGrid 
                        title="No Requirements Defined"
                        description="Traceability matrix is empty. Define technical or functional requirements to track validation."
                        icon={ListChecks}
                        actionLabel="Add Requirement"
                        onAdd={canEditProject() ? handleAddRequirement : undefined}
                    />
                )}
            </div>
        </div>
    );
};

export default RequirementsTraceability;
