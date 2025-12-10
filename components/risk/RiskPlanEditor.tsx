import React, { useState, useEffect } from 'react';
import { useProjectState } from '../../hooks/useProjectState';
import { useData } from '../../context/DataContext';
import { FileText, Save, Book } from 'lucide-react';

interface RiskPlanEditorProps {
    projectId: string;
}

const RiskPlanEditor: React.FC<RiskPlanEditorProps> = ({ projectId }) => {
    const { riskPlan } = useProjectState(projectId);
    const { dispatch } = useData();
    const [planData, setPlanData] = useState(riskPlan);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setPlanData(riskPlan);
    }, [riskPlan]);

    const handleSave = () => {
        if (planData) {
            dispatch({ type: 'UPDATE_RISK_PLAN', payload: { projectId, plan: planData } });
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        }
    };
    
    if (!planData) return <div className="p-4">Loading plan...</div>;

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    <FileText size={16} /> Risk Management Plan
                </h3>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Book size={14}/> Apply Template
                    </button>
                    <button onClick={handleSave} className="flex items-center justify-center gap-2 px-3 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700 w-28">
                        {isSaved ? "Saved!" : <><Save size={14}/> Save Plan</>}
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-4xl mx-auto">
                <div>
                    <label className="text-sm font-bold text-slate-900 block mb-2">Objectives</label>
                    <textarea 
                        className="w-full h-24 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500"
                        value={planData.objectives}
                        onChange={(e) => setPlanData({...planData, objectives: e.target.value})}
                    />
                </div>
                 <div>
                    <label className="text-sm font-bold text-slate-900 block mb-2">Scope</label>
                    <textarea 
                        className="w-full h-24 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500"
                        value={planData.scope}
                        onChange={(e) => setPlanData({...planData, scope: e.target.value})}
                    />
                </div>
                <div>
                    <label className="text-sm font-bold text-slate-900 block mb-2">Methodology / Approach</label>
                    <textarea 
                        className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500"
                        value={planData.approach}
                        onChange={(e) => setPlanData({...planData, approach: e.target.value})}
                    />
                </div>
                 <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="text-sm font-bold text-slate-900 block mb-2">Risk Categories</h4>
                    <div className="flex flex-wrap gap-2">
                        {planData.riskCategories.map(cat => (
                           <span key={cat.id} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">{cat.name}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskPlanEditor;
