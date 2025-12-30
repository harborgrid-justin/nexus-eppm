
import React, { useState } from 'react';
import { FileText, Save, BookOpen, Lock, Calendar } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';

interface ProcurementPlanningProps {
    projectId: string;
}

const ProcurementPlanning: React.FC<ProcurementPlanningProps> = ({ projectId }) => {
    const theme = useTheme();
    const { canEditProject } = usePermissions();
    const [strategy, setStrategy] = useState('');

    return (
        <div className="h-full flex flex-col">
            <div className={`p-4 ${theme.layout.headerBorder} flex-shrink-0 flex items-center justify-between bg-slate-50/50`}>
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    <FileText size={16} /> Procurement Management Plan
                </h3>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <BookOpen size={14}/> Load Template
                    </button>
                    {canEditProject() ? (
                        <button className={`flex items-center gap-2 px-3 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700`}>
                            <Save size={14}/> Save Plan
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-400">
                            <Lock size={14}/> Read Only
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <label className="text-sm font-bold text-slate-900 block mb-2">Procurement Strategy</label>
                    <textarea 
                        disabled={!canEditProject()}
                        className="w-full h-40 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                        placeholder="Define contract types (Fixed Price, T&M), delivery methods, and strategic sourcing approach..."
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value)}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Calendar size={16}/> Key Milestone Dates</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                                <span className="text-sm text-slate-600">RFP Issuance</span>
                                <input type="date" className="text-xs border-slate-200 rounded p-1" disabled={!canEditProject()} />
                            </div>
                            <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                                <span className="text-sm text-slate-600">Vendor Selection</span>
                                <input type="date" className="text-xs border-slate-200 rounded p-1" disabled={!canEditProject()} />
                            </div>
                            <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-100">
                                <span className="text-sm text-slate-600">Contract Award</span>
                                <input type="date" className="text-xs border-slate-200 rounded p-1" disabled={!canEditProject()} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <h4 className="font-bold text-slate-800 mb-3">Constraints & Assumptions</h4>
                        <textarea 
                            disabled={!canEditProject()}
                            className="w-full h-24 p-2 border border-slate-300 rounded text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                            placeholder="List market conditions, lead times, or currency risks..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcurementPlanning;
