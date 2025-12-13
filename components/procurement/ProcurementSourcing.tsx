
import React, { useState } from 'react';
import { ShoppingCart, Plus, Filter, FileText, CheckCircle } from 'lucide-react';
import { useProcurementData } from '../../hooks';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';

interface ProcurementSourcingProps {
    projectId: string;
}

const ProcurementSourcing: React.FC<ProcurementSourcingProps> = ({ projectId }) => {
    const { projectSolicitations } = useProcurementData(projectId);
    const theme = useTheme();
    const [filter, setFilter] = useState('All');

    return (
        <div className="h-full flex flex-col">
            <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center bg-slate-50/50`}>
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                        <ShoppingCart size={16} /> Sourcing Events (RFx)
                    </h3>
                    <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
                        {['All', 'Open', 'Closed'].map(f => (
                            <button 
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filter === f ? 'bg-slate-100 text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <button className={`flex items-center gap-2 px-3 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700 shadow-sm`}>
                    <Plus size={14}/> Create RFx
                </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
                <div className="grid grid-cols-1 gap-4">
                    {projectSolicitations.map(sol => (
                        <div key={sol.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="info">{sol.type}</Badge>
                                        <h4 className="font-bold text-slate-800">{sol.title}</h4>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 ml-1">ID: {sol.id} • Package: {sol.packageId}</p>
                                </div>
                                <Badge variant={sol.status === 'Open' ? 'success' : 'neutral'}>{sol.status}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 text-sm mt-4 pt-4 border-t border-slate-100">
                                <div>
                                    <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Issue Date</span>
                                    <span className="font-medium text-slate-700">{sol.issueDate}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Deadline</span>
                                    <span className="font-medium text-red-600">{sol.deadline}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Invited Vendors</span>
                                    <span className="font-medium text-slate-700">{sol.invitedVendorIds.length} Invited</span>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <button className="flex-1 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100">View Responses</button>
                                <button className="flex-1 py-1.5 text-xs font-bold text-nexus-600 bg-nexus-50 rounded border border-nexus-200 hover:bg-nexus-100">Compare Bids</button>
                            </div>
                        </div>
                    ))}
                    {projectSolicitations.length === 0 && (
                        <div className="text-center p-12 text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                            <FileText size={32} className="mx-auto mb-2 opacity-50"/>
                            <p>No sourcing events found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProcurementSourcing;
