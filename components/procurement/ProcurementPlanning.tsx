
import React, { useState, useEffect } from 'react';
import { FileText, Save, Book, Lock, Calendar, Plus } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { ProcurementPlan } from '../../types';
import { generateId } from '../../utils/formatters';

interface ProcurementPlanningProps {
    projectId: string;
}

const ProcurementPlanning: React.FC<ProcurementPlanningProps> = ({ projectId }) => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const { canEditProject } = usePermissions();
    
    // Load existing plan or initialize default
    const existingPlan = state.procurementPlans.find(p => p.projectId === projectId);
    
    const [planData, setPlanData] = useState<Partial<ProcurementPlan>>({
        objectives: '',
        scope: '',
        approach: '',
        procurementMethods: [],
        status: 'Draft',
        version: 1
    });

    useEffect(() => {
        if (existingPlan) {
            setPlanData(existingPlan);
        } else {
            // Default template if new
            setPlanData({
                objectives: 'Ensure timely and cost-effective acquisition of goods and services.',
                scope: '',
                approach: 'Competitive Bidding',
                procurementMethods: ['RFP', 'RFQ'],
                status: 'Draft',
                version: 1
            });
        }
    }, [existingPlan, projectId]);

    const handleSave = () => {
        const planToSave: ProcurementPlan = {
            id: existingPlan?.id || generateId('PP'),
            projectId,
            objectives: planData.objectives || '',
            scope: planData.scope || '',
            approach: planData.approach || '',
            procurementMethods: planData.procurementMethods || [],
            status: planData.status || 'Draft',
            version: (planData.version || 0) + 1
        };
        
        if (existingPlan) {
             dispatch({ type: 'UPDATE_PROCUREMENT_PLAN', payload: planToSave });
        } else {
             dispatch({ type: 'ADD_PROCUREMENT_PLAN', payload: planToSave });
        }
        
        alert("Procurement Plan Saved.");
    };

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
                        <button onClick={handleSave} className={`flex items-center gap-2 px-3 py-2 ${theme.colors.primary} text-white rounded-lg text-sm font-medium ${theme.colors.primaryHover}`}>
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
                    <label className={`text-sm font-bold ${theme.colors.text.primary} block mb-2`}>Procurement Strategy & Objectives</label>
                    <textarea 
                        disabled={!canEditProject()}
                        className={`w-full h-40 p-4 border ${theme.colors.border} rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:${theme.colors.background} resize-none`}
                        placeholder="Define contract types (Fixed Price, T&M), delivery methods, and strategic sourcing approach..."
                        value={planData.objectives}
                        onChange={(e) => setPlanData({...planData, objectives: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${theme.colors.background} p-4 rounded-lg border ${theme.colors.border}`}>
                        <h4 className={`font-bold ${theme.colors.text.primary} mb-3 flex items-center gap-2`}><Calendar size={16}/> Methodology</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Contract Strategy</label>
                                <select 
                                    className={`w-full p-2 border ${theme.colors.border} rounded text-sm ${theme.colors.surface}`}
                                    value={planData.approach}
                                    onChange={e => setPlanData({...planData, approach: e.target.value})}
                                    disabled={!canEditProject()}
                                >
                                    <option>Competitive Bidding</option>
                                    <option>Sole Source</option>
                                    <option>Framework Agreement</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Allowed Methods</label>
                                <div className="flex flex-wrap gap-2">
                                    {['RFP', 'RFQ', 'RFI', 'Tender'].map(m => (
                                        <label key={m} className="flex items-center gap-2 text-sm bg-white px-2 py-1 rounded border border-slate-200">
                                            <input 
                                                type="checkbox" 
                                                checked={planData.procurementMethods?.includes(m)}
                                                onChange={e => {
                                                    const current = planData.procurementMethods || [];
                                                    if (e.target.checked) setPlanData({...planData, procurementMethods: [...current, m]});
                                                    else setPlanData({...planData, procurementMethods: current.filter(i => i !== m)});
                                                }}
                                                disabled={!canEditProject()}
                                                className="rounded text-nexus-600"
                                            /> 
                                            {m}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`${theme.colors.background} p-4 rounded-lg border ${theme.colors.border}`}>
                        <h4 className={`font-bold ${theme.colors.text.primary} mb-3`}>Scope of Procurement</h4>
                        <textarea 
                            disabled={!canEditProject()}
                            className={`w-full h-32 p-2 border ${theme.colors.border} rounded text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:${theme.colors.background} resize-none`}
                            placeholder="List major items or services to be procured..."
                            value={planData.scope}
                            onChange={e => setPlanData({...planData, scope: e.target.value})}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcurementPlanning;
