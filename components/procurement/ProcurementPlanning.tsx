
import React, { useState } from 'react';
import { FileText, Save, Book, Lock, Calendar } from 'lucide-react';
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
            <div className={`p-4 ${theme.layout.headerBorder} flex-shrink-0 flex items-center justify-between ${theme.colors.background}/50`}>
                <h3 className={`font-semibold ${theme.colors.text.secondary} text-sm flex items-center gap-2`}>
                    <FileText size={16} /> Procurement Management Plan
                </h3>
                <div className="flex gap-2">
                    <button className={`flex items-center gap-2 px-3 py-2 ${theme.colors.surface} border ${theme.colors.border} rounded-lg text-sm font-medium ${theme.colors.text.secondary} hover:${theme.colors.background}`}>
                        <Book size={14}/> Load Template
                    </button>
                    {canEditProject() ? (
                        <button className={`flex items-center gap-2 px-3 py-2 ${theme.colors.primary} text-white rounded-lg text-sm font-medium ${theme.colors.primaryHover}`}>
                            <Save size={14}/> Save Plan
                        </button>
                    ) : (
                        <div className={`flex items-center gap-2 px-3 py-2 ${theme.colors.background} border ${theme.colors.border} rounded-lg text-sm ${theme.colors.text.tertiary}`}>
                            <Lock size={14}/> Read Only
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <label className={`text-sm font-bold ${theme.colors.text.primary} block mb-2`}>Procurement Strategy</label>
                    <textarea 
                        disabled={!canEditProject()}
                        className={`w-full h-40 p-4 border ${theme.colors.border} rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:${theme.colors.background}`}
                        placeholder="Define contract types (Fixed Price, T&M), delivery methods, and strategic sourcing approach..."
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value)}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme.colors.background} p-4 rounded-lg border ${theme.colors.border}`}>
                        <h4 className={`font-bold ${theme.colors.text.primary} mb-3 flex items-center gap-2`}><Calendar size={16}/> Key Milestone Dates</h4>
                        <div className="space-y-2">
                            <div className={`flex justify-between items-center ${theme.colors.surface} p-2 rounded border ${theme.colors.border}`}>
                                <span className={`text-sm ${theme.colors.text.secondary}`}>RFP Issuance</span>
                                <input type="date" className={`text-xs border-${theme.colors.border} rounded p-1 ${theme.colors.surface}`} disabled={!canEditProject()} />
                            </div>
                            <div className={`flex justify-between items-center ${theme.colors.surface} p-2 rounded border ${theme.colors.border}`}>
                                <span className={`text-sm ${theme.colors.text.secondary}`}>Vendor Selection</span>
                                <input type="date" className={`text-xs border-${theme.colors.border} rounded p-1 ${theme.colors.surface}`} disabled={!canEditProject()} />
                            </div>
                            <div className={`flex justify-between items-center ${theme.colors.surface} p-2 rounded border ${theme.colors.border}`}>
                                <span className={`text-sm ${theme.colors.text.secondary}`}>Contract Award</span>
                                <input type="date" className={`text-xs border-${theme.colors.border} rounded p-1 ${theme.colors.surface}`} disabled={!canEditProject()} />
                            </div>
                        </div>
                    </div>
                    
                    <div className={`${theme.colors.background} p-4 rounded-lg border ${theme.colors.border}`}>
                        <h4 className={`font-bold ${theme.colors.text.primary} mb-3`}>Constraints & Assumptions</h4>
                        <textarea 
                            disabled={!canEditProject()}
                            className={`w-full h-24 p-2 border ${theme.colors.border} rounded text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:${theme.colors.background}`}
                            placeholder="List market conditions, lead times, or currency risks..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcurementPlanning;
